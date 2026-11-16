'use strict';
const { mkdirSync } = require('node:fs');
const { join } = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const { Client, GatewayIntentBits, Events, MessageFlags, PermissionFlagsBits, SlashCommandBuilder,
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder,
  TextInputStyle, AttachmentBuilder } = require('discord.js');
const calendar = require('./calendar');
const games = require('./games');
const quiet = {parse:[]};
const ephemeral = MessageFlags.Ephemeral;
const xpCap = 1000000;
const dayOption = (s, required = true) => s.addIntegerOption(o=>o.setName('day').setDescription('December day').setMinValue(1).setMaxValue(24).setRequired(required));
const commands = new SlashCommandBuilder().setName('advent').setDescription('Manage the TF8 Advent calendar')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addSubcommand(s=>dayOption(s.setName('publish').setDescription('Publish today’s activity')))
  .addSubcommand(s=>dayOption(s.setName('resource').setDescription('Set the chart or Trade Replay URL'))
    .addStringOption(o=>o.setName('url').setDescription('HTTPS URL').setRequired(true)))
  .addSubcommand(s=>dayOption(s.setName('rewards').setDescription('Set the XP for a day'))
    .addIntegerOption(o=>o.setName('xp').setDescription('Participation XP').setMinValue(0).setMaxValue(xpCap).setRequired(true))
    .addIntegerOption(o=>o.setName('bonus').setDescription('Quest voting bonus XP').setMinValue(0).setMaxValue(xpCap).setRequired(true)))
  .addSubcommand(s=>dayOption(s.setName('review').setDescription('Approve or reject a quest entry'))
    .addUserOption(o=>o.setName('member').setDescription('Participant').setRequired(true))
    .addBooleanOption(o=>o.setName('approve').setDescription('Approve this submission?').setRequired(true)))
  .addSubcommand(s=>dayOption(s.setName('export').setDescription('Export approved XP awards for a closed day')))
  .addSubcommand(s=>s.setName('preview').setDescription('Preview any activity privately')
    .addIntegerOption(o=>o.setName('day').setDescription('December day').setMinValue(1).setMaxValue(24).setRequired(true)))
  .addSubcommand(s=>s.setName('status').setDescription('Check the schedule and reward settings'));

function localSlot(ms, zone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA',{
    timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'
  }).formatToParts(ms).map(p=>[p.type,p.value]));
  return {year:Number(parts.year),month:Number(parts.month),day:Number(parts.day),time:parts.hour+':'+parts.minute};
}

function openDb(directory) {
  mkdirSync(directory,{recursive:true});
  const db = new DatabaseSync(join(directory,'advent.sqlite'));
  db.exec(`PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS days(day INTEGER PRIMARY KEY, message TEXT, resource TEXT, xp INTEGER, bonus INTEGER, channel TEXT);
    CREATE TABLE IF NOT EXISTS runs(day INTEGER, uid TEXT, state TEXT NOT NULL, PRIMARY KEY(day,uid));
    CREATE TABLE IF NOT EXISTS entries(day INTEGER, uid TEXT, body TEXT NOT NULL, proof TEXT, status TEXT NOT NULL, PRIMARY KEY(day,uid));
    CREATE TABLE IF NOT EXISTS votes(day INTEGER, voter TEXT, target TEXT NOT NULL, PRIMARY KEY(day,voter));`);
  if(!db.prepare("PRAGMA table_info(days)").all().some(c=>c.name==='channel'))db.exec('ALTER TABLE days ADD COLUMN channel TEXT');
  return db;
}
function awardRows(db, day, kind, xp, bonus) {
  const out=[];
  if(kind==='quest'){
    for(const {uid} of db.prepare("SELECT uid FROM entries WHERE day=? AND status='approved' ORDER BY uid").all(day))
      if(xp)out.push([uid,xp,'advent-2026-day-'+day+'-quest']);
    const ranked=db.prepare(`SELECT v.target, COUNT(*) AS n FROM votes v JOIN entries e
      ON e.day=v.day AND e.uid=v.target WHERE v.day=? AND e.status='approved'
      GROUP BY v.target ORDER BY n DESC,v.target`).all(day);
    if(bonus&&ranked.length&&ranked[0].n!==ranked[1]?.n)
      out.push([ranked[0].target,bonus,'advent-2026-day-'+day+'-vote']);
  } else {
    for(const {uid,state} of db.prepare('SELECT uid,state FROM runs WHERE day=? ORDER BY uid').all(day))
      if(xp&&JSON.parse(state).phase==='done')out.push([uid,xp,'advent-2026-day-'+day+'-game']);
  }
  return out;
}
function button(id,label,style=ButtonStyle.Secondary,disabled=false) {
  return new ButtonBuilder().setCustomId(id).setLabel(label).setStyle(style).setDisabled(disabled);
}
function rows(buttons) {
  return Array.from({length:Math.ceil(buttons.length/5)},(_,i)=>new ActionRowBuilder().addComponents(buttons.slice(i*5,i*5+5)));
}
function board(d,settings,xp,bonus) {
  const quest=d.kind==='quest';
  const xpText=xp?xp+' season XP after '+(quest?'staff approval':'finishing the game')+'.':'';
  const bonusText=quest&&bonus?bonus+' bonus XP for the top voted entry with a clear lead.':'';
  const e=new EmbedBuilder().setColor(0x6053d7).setTitle('Day '+d.day+' · '+d.title)
    .setDescription([d.description,settings.resource?'[Open the activity resource]('+settings.resource+')':'',xpText,bonusText].filter(Boolean).join('\n\n'))
    .setFooter({text:'TF8 Advent 2026 · '+d.day});
  const controls=quest
    ? [button('tf8a:submit:'+d.day,'Submit entry',ButtonStyle.Primary),button('tf8a:entries:'+d.day+':0','View entries & vote')]
    : [button('tf8a:play:'+d.day,'Play',ButtonStyle.Primary)];
  return {embeds:[e],components:rows(controls),allowedMentions:quiet};
}
function gameBoard(d,s) {
  const v=games.view(s);
  const controls=rows(v.buttons.map(b=>button('tf8a:move:'+d.day+':'+s.version+':'+b.id,b.label,ButtonStyle.Secondary,!!b.disabled)));
  return {content:'**'+d.title+'**\n'+v.text,embeds:[],components:controls,allowedMentions:quiet};
}
function httpsUrl(value) {
  if(!value)return null;
  try{
    const url=new URL(value.trim());
    if(url.protocol==='https:'&&!url.username&&!url.password&&url.href.length<=500&&!/[()<>]/.test(url.href))return url.href;
  }catch{}
  throw new Error('Enter a valid HTTPS link of up to 500 characters.');
}
function clip(text,n) {return text.length>n?text.slice(0,n-1)+'…':text;}
async function run(env=process.env) {
  const {DISCORD_TOKEN:token,DISCORD_GUILD_ID:guildId,ADVENT_CHANNEL_ID:channelId,ADVENT_STAFF_CHANNEL_ID:staffId}=env;
  if(!token||![guildId,channelId,staffId].every(x=>/^\d{17,20}$/.test(x||''))||channelId===staffId)
    throw new Error('Set the token, guild ID and two distinct channel IDs.');
  if(env.RAILWAY_ENVIRONMENT_ID && !env.RAILWAY_VOLUME_MOUNT_PATH)throw new Error('Mount a persistent Railway volume first.');
  const zone=env.ADVENT_TIMEZONE||'Europe/Paris',time=env.ADVENT_TIME||'12:00';
  const year=Number(env.ADVENT_YEAR||2026);
  const xpDefault=Number(env.ADVENT_XP||0),bonusDefault=Number(env.ADVENT_BONUS_XP||0);
  if(!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)||!Number.isInteger(year)||
    ![xpDefault,bonusDefault].every(n=>Number.isInteger(n)&&n>=0&&n<=xpCap))throw new Error('Invalid Advent schedule or XP configuration.');
  localSlot(Date.now(),zone);
  const db=openDb(env.RAILWAY_VOLUME_MOUNT_PATH||env.DATA_DIR||'./data');
  const client=new Client({intents:[GatewayIntentBits.Guilds]});
  const config=day=>db.prepare('SELECT * FROM days WHERE day=?').get(day)||{};
  const ensure=day=>db.prepare('INSERT OR IGNORE INTO days(day) VALUES (?)').run(day);
  const slot=()=>localSlot(Date.now(),zone);
  const isToday=(day,s=slot())=>s.year===year&&s.month===12&&s.day===day;
  const isClosed=(day,s=slot())=>s.year>year||(s.year===year&&(s.month>12||(s.month===12&&s.day>day)));
  const xpFor=(d,c)=>[c.xp??xpDefault,c.bonus??bonusDefault];
  const resourceDays=new Set([4,10,16,20]);
  function checkOpen(day) {
    if(!isToday(day)||!config(day).message)throw new Error('This Advent activity is closed.');
  }
  let publishing=false,timer;
  async function publish(day) {
    if(!isToday(day))throw new Error('Only today’s activity can be published. Use preview to test any day.');
    if(publishing)throw new Error('A publication is already in progress. Try again shortly.');
    publishing=true;
    try{
      const d=calendar[day-1];
      ensure(day);
      const c=config(day);
      if(c.message)return 'Already published: https://discord.com/channels/'+guildId+'/'+(c.channel||channelId)+'/'+c.message;
      if(resourceDays.has(day)&&!c.resource)throw new Error('Set the activity resource with /advent resource first.');
      const ch=await client.channels.fetch(channelId);
      if(!ch?.isTextBased()||ch.guildId!==guildId)throw new Error('Advent channel unavailable.');
      let before;
      let prior;
      const since=Date.now()-26*60*60*1000;
      for(let page=0;page<100;page++){
        const messages=await ch.messages.fetch({limit:100,...(before?{before}:{})});
        prior=messages.find(m=>m.author.id===client.user.id&&m.embeds.some(e=>e.footer?.text==='TF8 Advent 2026 · '+day));
        if(prior||!messages.size||messages.last().createdTimestamp<since)break;
        if(page===99)throw new Error('Unable to verify previous publication in channel history.');
        before=messages.last().id;
      }
      const m=prior||await ch.send({...board(d,c,...xpFor(d,c)),nonce:'tf8a-'+year+'-'+day,enforceNonce:true});
      db.prepare('UPDATE days SET message=?, channel=? WHERE day=?').run(m.id,channelId,day);
      return 'Published: '+m.url;
    } finally{publishing=false;}
  }
  let lastScheduleWarning='';
  async function tick(){
    const s=slot();
    if(s.year!==year||s.month!==12||s.day>24||s.time<time||publishing||config(s.day).message)return;
    try{await publish(s.day);lastScheduleWarning='';}
    catch(e){const msg=s.day+': '+e.message;if(msg!==lastScheduleWarning)console.error(msg);lastScheduleWarning=msg;}
  }
  function listEntries(day,page,canVote=true,viewer='') {
    const entries=db.prepare("SELECT uid,body,proof FROM entries WHERE day=? AND status='approved' ORDER BY rowid").all(day);
    const max=Math.max(0,Math.ceil(entries.length/3)-1);
    page=Math.max(0,Math.min(page,max));
    const buttons=[];
    const text=entries.slice(page*3,page*3+3).map((e,i)=>{
      const n=page*3+i+1;
      if(canVote&&viewer!==e.uid)buttons.push(button('tf8a:vote:'+day+':'+e.uid,'Vote for entry '+n));
      return '**'+n+'.** <@'+e.uid+'>\n'+clip(e.body,340)+(e.proof?'\n[Open attachment](<'+e.proof+'>)':'');
    }).join('\n\n');
    if(page>0)buttons.push(button('tf8a:entries:'+day+':'+(page-1),'Previous'));
    if(page<max)buttons.push(button('tf8a:entries:'+day+':'+(page+1),'Next'));
    return {content:text||'No approved entries yet.',components:rows(buttons),allowedMentions:quiet};
  }
  function reviewCard(day, uid, entry) {
    return {
      content: 'Day **'+day+'** · <@'+uid+'>\n'+clip(entry.body,1000)+(entry.proof?'\n[Open proof](<'+entry.proof+'>)':''),
      components: rows([button('tf8a:approve:'+day+':'+uid,'Approve',ButtonStyle.Success),button('tf8a:reject:'+day+':'+uid,'Reject',ButtonStyle.Danger)]),
      allowedMentions:quiet
    };
  }
  function review(day,uid,approve) {
    const result=db.prepare('UPDATE entries SET status=? WHERE day=? AND uid=?').run(approve?'approved':'rejected',day,uid);
    if(!result.changes)throw new Error('No entry found for this member.');
  }
  function staff(i){return i.memberPermissions?.has(PermissionFlagsBits.ManageGuild);}
  client.on(Events.InteractionCreate,async i=>{
    if(i.guildId!==guildId)return;
    try{
      if(i.isChatInputCommand()&&i.commandName==='advent'){
        if(!staff(i))throw new Error('Staff only.');
        const sub=i.options.getSubcommand(),day=i.options.getInteger('day'),d=calendar[day-1];
        await i.deferReply({flags:ephemeral});
        if(sub==='status'){
          const s=slot();
          const pending=db.prepare("SELECT day,uid FROM entries WHERE status='pending' ORDER BY day LIMIT 20").all();
          return await i.editReply({content:'Advent '+year+' · '+time+' ('+zone+')\nToday: '+s.day+'/'+s.month+'/'+s.year+
            '\nDefault participation XP: '+xpDefault+' · voting bonus: '+bonusDefault+
            (pending.length?'\nPending reviews:\n'+pending.map(e=>'Day '+e.day+' · <@'+e.uid+'>').join('\n'):''),allowedMentions:quiet});
        }
        if(sub==='publish')return await i.editReply(await publish(day));
        if(sub==='preview')return await i.editReply({...board(d,config(day),...xpFor(d,config(day))),components:[],
          content:d.kind==='quest'?'Staff preview.':'Staff preview. To test a private game run, use the button below.'}).then(async()=>{
            if(d.kind!=='quest')await i.followUp({content:'Private test for day '+day,flags:ephemeral,
              components:rows([button('tf8a:test:'+day,'Play test',ButtonStyle.Primary)])});
          });
        if(sub==='review'){
          const uid=i.options.getUser('member').id;
          review(day,uid,i.options.getBoolean('approve'));
          return await i.editReply('Review saved.');
        }
        if(sub==='resource'){
          if(config(day).message)throw new Error('Set the resource before publishing this day.');
          const url=httpsUrl(i.options.getString('url')); ensure(day);
          db.prepare('UPDATE days SET resource=? WHERE day=?').run(url,day);
          return await i.editReply('Resource saved.');
        }
        if(sub==='rewards'){
          if(config(day).message)throw new Error('Set the rewards before publishing this day.');
          ensure(day);
          db.prepare('UPDATE days SET xp=?,bonus=? WHERE day=?').run(i.options.getInteger('xp'),i.options.getInteger('bonus'),day);
          return await i.editReply('Rewards saved.');
        }
        if(sub==='export'){
          if(!isClosed(day))throw new Error('Export is available once the day has closed.');
          if(!config(day).message)throw new Error('This day was never published.');
          const pending=db.prepare("SELECT COUNT(*) AS n FROM entries WHERE day=? AND status='pending'").get(day).n;
          if(pending)throw new Error('Review all pending entries before exporting.');
          const data=awardRows(db,day,d.kind,...xpFor(d,config(day)));
          const csv=['discord_id,xp,reason',...data.map(r=>r.join(','))].join('\n');
          return await i.editReply({content:data.length+' XP awards. Use /points add on the season bot with the amount and exact reason in each row.',
            files:[new AttachmentBuilder(Buffer.from(csv),{name:'tf8-advent-day-'+day+'.csv'})]});
        }
      }
      if((!i.isButton()&&!i.isModalSubmit())||!i.customId.startsWith('tf8a:'))return;
      const [,action,value,a,b]=i.customId.split(':');
      const day=Number(value),d=calendar[day-1];
      if(!d)throw new Error('Invalid Advent day.');
      const uid=i.user.id;
      if(action==='approve'||action==='reject'){
        if(!staff(i)||i.channelId!==staffId)throw new Error('Staff only.');
        review(day,a,action==='approve');
        return await i.update({content:i.message.content+'\n**'+(action==='approve'?'Approved':'Rejected')+'**',components:[],allowedMentions:quiet});
      }
      if(action==='entries'){
        if(d.kind!=='quest'||!config(day).message)throw new Error('No published quest for this day.');
        const payload=listEntries(day,Number(a)||0,isToday(day),uid);
        if(i.message.flags.has(ephemeral))return await i.update(payload);
        return await i.reply({...payload,flags:ephemeral});
      }
      if(action==='test'||action==='testmove'){
        if(!staff(i))throw new Error('Staff only.');
        const key=day+':'+uid;
        if(action==='test'){
          const state=games.start(d.kind,day);
          tests.set(key,state);
          return await i.reply({...testBoard(d,state),flags:ephemeral});
        }
        const state=tests.get(key);
        if(!state||state.version!==Number(a))throw new Error('Start a new test from /advent preview.');
        games.move(state,b);
        if(state.phase==='done')tests.delete(key);
        return await i.update(testBoard(d,state));
      }
      checkOpen(day);
      if(action==='play'||action==='move'){
        if(d.kind==='quest')throw new Error('This activity is a quest.');
        const prior=db.prepare('SELECT state FROM runs WHERE day=? AND uid=?').get(day,uid);
        const state=prior?JSON.parse(prior.state):games.start(d.kind,day);
        if(action==='move'){
          if(!prior||state.version!==Number(a))throw new Error('Open the latest game from the Advent post.');
          games.move(state,b);
        }
        db.prepare('INSERT INTO runs VALUES (?,?,?) ON CONFLICT(day,uid) DO UPDATE SET state=excluded.state').run(day,uid,JSON.stringify(state));
        if(action==='move')return await i.update(gameBoard(d,state));
        return await i.reply({...gameBoard(d,state),flags:ephemeral});
      }
      if(action==='submit'){
        if(d.kind!=='quest')throw new Error('This activity is a game.');
        if(i.isButton()){
          const modal=new ModalBuilder().setCustomId('tf8a:submit:'+day).setTitle('Advent quest · Day '+day)
            .addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('body').setLabel('Your entry').setStyle(TextInputStyle.Paragraph).setMaxLength(1000)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('proof').setLabel('Screenshot or message link').setStyle(TextInputStyle.Short).setMaxLength(500).setRequired([4,6,10,16,20,22].includes(day))));
          return await i.showModal(modal);
        }
        const body=i.fields.getTextInputValue('body').trim();
        const proof=httpsUrl(i.fields.getTextInputValue('proof'));
        if(!body)throw new Error('Write a short entry first.');
        if(!db.prepare("INSERT INTO entries VALUES (?,?,?,?,'pending') ON CONFLICT(day,uid) DO NOTHING").run(day,uid,body,proof).changes)
          throw new Error('You already submitted an entry for this day.');
        await i.reply({content:'Entry saved for staff review.',flags:ephemeral});
        try{
          const channel=await client.channels.fetch(staffId);
          if(channel?.guildId!==guildId||!channel.isTextBased()||channel.permissionsFor(i.guild.roles.everyone)?.has(PermissionFlagsBits.ViewChannel))
            throw new Error('Invalid private staff channel');
          await channel.send(reviewCard(day,uid,{body,proof}));
        }catch(e){console.error('Review notification failed for day '+day+'. Pending entry remains in the database.');}
        return;
      }
      if(action==='vote'){
        if(d.kind!=='quest'||a===uid||!db.prepare("SELECT 1 FROM entries WHERE day=? AND uid=? AND status='approved'").get(day,a))
          throw new Error('Choose another member’s approved entry.');
        db.prepare('INSERT INTO votes VALUES (?,?,?) ON CONFLICT(day,voter) DO UPDATE SET target=excluded.target').run(day,uid,a);
        return await i.reply({content:'Vote saved. You can change it until the day closes.',flags:ephemeral});
      }
    }catch(e){
      const content=clip(e.message||'Something went wrong.',300).replaceAll(token,'[hidden]');
      const payload={content,flags:ephemeral,allowedMentions:quiet};
      await (i.deferred ? i.editReply({content,allowedMentions:quiet}) : i.replied ? i.followUp(payload) : i.reply(payload)).catch(()=>{});
    }
  });
  const tests=new Map();
  function testBoard(d,s){
    const result=gameBoard(d,s);
    result.components.forEach(r=>r.components.forEach(b=>b.setCustomId(b.data.custom_id.replace(':move:',':testmove:'))));
    return result;
  }
  client.once(Events.ClientReady,async()=>{
    try{
      const guild=await client.guilds.fetch(guildId);
      const staffChannel=await client.channels.fetch(staffId);
      if(staffChannel?.guildId!==guildId||!staffChannel.isTextBased()||staffChannel.permissionsFor(guild.roles.everyone)?.has(PermissionFlagsBits.ViewChannel))
        throw new Error('Choose a private staff channel in the configured server.');
      await guild.commands.create(commands.toJSON());
      await tick();
      timer=setInterval(()=>void tick(),30000);
      console.log('TF8 Advent ready.');
    }catch(e){console.error('TF8 Advent setup failed:',e.code||e.message);client.destroy();db.close();process.exitCode=1;}
  });
  for(const signal of ['SIGTERM','SIGINT'])process.once(signal,()=>{clearInterval(timer);client.destroy();db.close();});
  await client.login(token);
}
if(require.main===module)run().catch(e=>{console.error('TF8 Advent startup failed:',e.code||e.message);process.exitCode=1;});
module.exports={localSlot,openDb,awardRows,commands,board};
