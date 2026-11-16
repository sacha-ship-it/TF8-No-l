'use strict';
const { randomInt } = require('node:crypto');
function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
const directions = [[0,-1],[0,1],[-1,0],[1,0]];
function start(kind, day) {
  const s = {kind, day, version:0, phase:'play', score:0};
  const second = [9,13,15,17,21,23].includes(day);
  if (kind === 'memory') Object.assign(s, {cards:shuffle((second ? ['💵','📒','🖥️','🔔'] : ['🪙','📈','⏱️','🎯']).flatMap(x=>[x,x])), matched:[], selected:[], turns:0});
  if (kind === 'chart') Object.assign(s,{phase:'study',levels:second?[208,204,200]:[108,104,100],prices:second?[201,203,202,205,207,205,208,204,202]:[101,103,102,106,105,108,106,104,105],answers:[],choices:shuffle([0,1,2])});
  if (kind === 'desk') {
    const desk=second?['Chart: Gold','Clock: 10:30','Note: Review first','Risk limit: 2R']:['Chart: Nasdaq','Clock: 09:30','Note: Wait for retest','Risk limit: 1R'];
    const changed=[randomInt(4)]; changed.push((changed[0]+1+randomInt(3))%4);
    const alternatives=['Chart: EUR/USD','Clock: 11:00','Note: Check the calendar','Risk limit: 0.5R'];
    Object.assign(s,{phase:'study',desk,changed,nextDesk:desk.map((x,i)=>changed.includes(i)?alternatives[i]:x),answers:[]});
  }
  if (kind === 'vault') {
    const keys=second?['📉','🔔','💵','📒']:['📈','⏱️','🎯','🪙'];
    const code=shuffle(keys);
    Object.assign(s,{keys,code,answers:[],clues:[code[0]+' goes first.',code[2]+' goes immediately after '+code[1]+'.',code[3]+' goes last.']});
  }
  if (kind === 'maze') Object.assign(s,{x:0,y:0,left:second?11:10,walls:second?['0,1','2,0','2,1','2,2','1,3']:['1,0','1,1','1,2','3,2','2,4']});
  if (kind === 'sequence') Object.assign(s,{phase:'study',sequence:shuffle([0,1]).concat(Array.from({length:second?5:4},()=>randomInt(2))),length:2,index:0});
  return s;
}
function chart(s, masked) {
  const levels=s.levels.map((n,i)=>masked?'? '+(i+1):String(n));
  const top=s.levels[0], bottom=s.levels[2];
  return ' ```\n'+Array.from({length:9},(_,r)=>{
    const level=top-r;
    return (levels[s.levels.indexOf(level)] || ' ').padStart(4)+' '+s.prices.map(price=>price===level?'●':s.levels.includes(level)?'─':' ').join(' ');
  }).join('\n')+'\n     Time →\n```';
}
function view(s) {
  const v={text:'',buttons:[]};
  const choice=(label,id)=>({label,id});
  if (s.phase==='done') return {text:'Run complete. **Score: '+s.score+'**.'+(s.kind==='chart'?'\nFull simulated chart:'+chart(s,false):''),buttons:[]};
  if (s.kind==='memory') {
    v.text='Find all four pairs. Turns: **'+s.turns+'**.';
    v.buttons=s.phase==='mismatch'?[choice('Hide cards','next')]:s.cards.map((x,i)=>({label:s.matched.includes(i)||s.selected.includes(i)?x:String(i+1),id:String(i),disabled:s.matched.includes(i)||s.selected.includes(i)}));
    if(s.phase==='mismatch')v.text+='\n'+s.selected.map(i=>(i+1)+' '+s.cards[i]).join(' · ');
  }
  if(s.kind==='chart'){
    v.text=(s.phase==='study'?'Memorize the labeled levels.':'Which price was at level **'+(s.answers.length+1)+'**?')+chart(s,s.phase!=='study');
    v.buttons=s.phase==='study'?[choice('Hide levels','next')]:s.choices.map(i=>choice(String(s.levels[i]),String(i)));
  }
  if(s.kind==='desk'){
    v.text=(s.phase==='study'?'Memorize the desk.':'Select both items that changed.')+'\n'+(s.phase==='study'?s.desk:s.nextDesk).map((x,i)=>(i+1)+'. '+x).join('\n');
    v.buttons=s.phase==='study'?[choice('Show the new desk','next')]:s.desk.map((_,i)=>({label:String(i+1),id:String(i),disabled:s.answers.includes(i)}));
  }
  if(s.kind==='vault'){
    v.text=s.clues.join('\n')+'\nCode: '+s.answers.map(i=>s.keys[i]).join(' ');
    v.buttons=s.keys.map((x,i)=>({label:x,id:String(i),disabled:s.answers.includes(i)}));
  }
  if(s.kind==='maze'){
    const grid=Array.from({length:5},(_,y)=>Array.from({length:5},(_,x)=>s.x===x&&s.y===y?'🛷':x===4&&y===4?'🔔':s.walls.includes(x+','+y)?'⬛':'⬜').join('')).join('\n');
    v.text=grid+'\nMoves left: **'+s.left+'**.';
    v.buttons=['↑','↓','←','→'].map((x,i)=>choice(x,String(i)));
  }
  if(s.kind==='sequence'){
    v.text=s.phase==='study'?'Memorize this sequence: '+s.sequence.slice(0,s.length).map(x=>x?'🟩':'🟥').join(' '):'Repeat the sequence. **'+s.index+'/'+s.length+'**.';
    v.buttons=s.phase==='study'?[choice('Hide sequence','next')]:[choice('Red','0'),choice('Green','1')];
  }
  return v;
}
function move(s,id) {
  if(!view(s).buttons.some(b=>b.id===id&&!b.disabled))throw new Error('Use the buttons on the current screen.');
  const n=Number(id);
  s.version++;
  if(id==='next'){s.phase='play'; if(s.kind==='memory')s.selected=[];return s;}
  if(s.kind==='memory'){
    s.selected.push(n);
    if(s.selected.length===2){
      s.turns++;
      if(s.cards[s.selected[0]]===s.cards[n]){s.matched.push(...s.selected);s.selected=[];}
      else s.phase='mismatch';
      if(s.matched.length===s.cards.length){s.phase='done';s.score=Math.max(1,30-s.turns);}
    }
  }
  if(['chart','desk','vault'].includes(s.kind)){
    s.answers.push(n);
    if(s.kind==='chart'&&s.answers.length===3){s.score=s.answers.filter((a,i)=>a===i).length;s.phase='done';}
    if(s.kind==='desk'&&s.answers.length===2){s.score=s.answers.filter(x=>s.changed.includes(x)).length;s.phase='done';}
    if(s.kind==='vault'&&s.answers.length===4){s.score=s.answers.filter((x,i)=>s.keys[x]===s.code[i]).length;s.phase='done';}
  }
  if(s.kind==='maze'){
    const [dx,dy]=directions[n],x=s.x+dx,y=s.y+dy;
    if(x<0||y<0||x>4||y>4||s.walls.includes(x+','+y))return s;
    s.x=x;s.y=y;s.left--;
    if(x===4&&y===4){s.score=1+s.left;s.phase='done';}
    else if(!s.left)s.phase='done';
  }
  if(s.kind==='sequence'){
    if(s.sequence[s.index]!==n){s.phase='done';return s;}
    if(++s.index===s.length){s.score=s.length;if(s.length===s.sequence.length)s.phase='done';else{s.length++;s.index=0;s.phase='study';}}
  }
  return s;
}
module.exports={start,view,move};
