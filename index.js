"use strict";var ee=(e,n)=>()=>(n||e((n={exports:{}}).exports,n),n.exports);var ue=ee((En,Xe)=>{"use strict";Xe.exports={id:"tf8",name:"THE FLOOR 8",lang:"en",navy:"#070d0d",panel:"#132322",accent:"#00db7d",gold:"#e8cd87",white:"#f3faf7",muted:"#9eaca6",title:"\
TF8Title",body:"TF8Body"}});var se=ee((vn,ze)=>{"use strict";var{createHash:kt}=require("node:crypto"),Lt=ue(),ae=Lt.lang==="en",$t=ae?["Coin","Chart","Clock","Target","Dollar","Journal","Screen","Bell","Shie\
ld","Key","Snowflake","Headphones"]:["Manette","Casque","Clavier","Souris","Console","Écran","Micro","Joystick","Cloche","Étoile","Flocon","Bonnet"],qt=ae?["Gift","Star","Snowfla\
ke","Bell"]:["Cadeau","Étoile","Flocon","Cloche"],re=["up","right","down","left"],he={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]};function fe(e){let n=kt("sha256").update(String(
e)).digest().readUInt32LE(0)||1;return()=>(n^=n<<13,n^=n>>>17,n^=n<<5,(n>>>0)/4294967296)}function B(e,n){e=[...e];for(let s=e.length-1;s>0;s--){let t=Math.floor(n()*(s+1));[e[s],e[t]]=
[e[t],e[s]]}return e}function ce(e,n){let s=[];for(let t=-1;t<=1;t++)for(let r=-1;r<=1;r++){let a=e%n+r,o=Math.floor(e/n)+t;(r||t)&&a>=0&&a<n&&o>=0&&o<n&&s.push(o*n+a)}return s}function _e(e,n,s=n+
1,t=n*n-n-2){let r=new Set(e),a=[[s]],o=new Set([s]);for(let l=0;l<a.length;l++){let d=a[l],c=d.at(-1);if(c===t)return d;for(let[p,f]of Object.values(he)){let S=c%n+p,N=Math.floor(
c/n)+f,D=N*n+S;S>=0&&S<n&&N>=0&&N<n&&!r.has(D)&&!o.has(D)&&(o.add(D),a.push([...d,D]))}}return null}function Ut(e,n){let s=e===1?11:e===23?15:13,t=e===1?30:e===23?50:40,r=null;for(let a=0;a<
100;a++){let o=new Set([s+1]),l=[s+1];for(;l.length;){let p=l.at(-1),f=p%s,S=Math.floor(p/s),N=B(Object.values(he),n).map(([G,Y])=>[f+G*2,S+Y*2,G,Y]).filter(([G,Y])=>G>0&&G<s-1&&Y>
0&&Y<s-1&&!o.has(Y*s+G));if(!N.length){l.pop();continue}let[D,V,U,q]=N[0];o.add((S+q)*s+f+U),o.add(V*s+D),l.push(V*s+D)}let d=Array.from({length:s*s},(p,f)=>f).filter(p=>!o.has(p)),
c=_e(d,s);if((!r||c.length>r.path.length)&&(r={walls:d,path:c}),c.length-1>=t)break}return{size:s,walls:r.walls,position:s+1,goal:s*s-s-2,optimal:r.path.length-1,budget:r.path.length-
1+(e===23?6:e===15?8:e===1?12:10),trail:[s+1]}}function Ae(e){return e.length?e.flatMap((n,s)=>Ae(e.filter((t,r)=>r!==s)).map(t=>[n,...t])):[[]]}function Bt(e){let n=B([0,1,2,3],e),
s=Ae([0,1,2,3]),t=[],r=[];for(let a=0;a<4;a++)for(let o=a+1;o<4;o++)r.push({a:n[a],b:n[o],adj:o===a+1});for(let a of B(r,e)){let o=s.filter(l=>a.adj?l.indexOf(a.b)===l.indexOf(a.a)+
1:l.indexOf(a.a)<l.indexOf(a.b));if(o.length<s.length&&(t.push(a),s=o),s.length===1)break}return{answer:n,clues:t}}function Ft(e,n,s=Date.now(),t=!1){let r=fe(n),a={type:e,phase:"p\
laying",started:s,expires:s+720*1e3,version:0,moves:0,score:0,won:!1,hard:t};if(e==="memory")Object.assign(a,{cards:B([0,1,2,3,4,5,6,7,0,1,2,3,4,5,6,7],r),found:[],flipped:[],pairs:0,
turns:0});else if(e==="mines")Object.assign(a,{seed:n,bombs:[],revealed:[],flags:[],mode:"open",placed:!1});else if(e==="maze"){let o=Ut(t?23:1,r);Object.assign(a,{...o})}else if(e===
"inventory")Object.assign(a,{seed:n,round:1,total:5,correct:0,stage:"show",ready:s+6e3,history:[],...We(n,1,t)});else if(e==="delivery")Object.assign(a,{sequence:B(re,r).slice(0,3).
concat(Array.from({length:7},()=>re[Math.floor(r()*4)])),round:1,progress:0,stage:"show",ready:s+2300,completed:0,entered:[]});else if(e==="vault")Object.assign(a,{...Bt(r),guess:[],
tries:0,maxTries:5,history:[]});else if(e==="chart")Object.assign(a,Ht(r,s,t));else if(e==="desk")Object.assign(a,Vt(r,s,t));else if(e==="sequence")Object.assign(a,{sequence:Array.
from({length:10},()=>r()<.5?"red":"green"),round:1,progress:0,stage:"show",ready:s+3200,completed:0,entered:[]});else throw O(ae?"Unknown game.":"Jeu inconnu.");return a}function We(e,n,s=!1){
let t=fe(`${e}:${n}`),r=B(Array.from({length:12},(o,l)=>l),t).slice(0,5+(s||n>2?1:0)),a=r[Math.floor(t()*r.length)];return{shown:r,missing:a,remaining:r.filter(o=>o!==a),options:B(
[a,...B(Array.from({length:12},(o,l)=>l).filter(o=>!r.includes(o)),t).slice(0,3)],t)}}function k(e,n,s,t){return e.phase="done",e.won=n,e.score=Math.max(0,Math.min(1e3,Math.round(s))),
e.finished=t,e.version++,e}function Je(e,n=Date.now()){return e.phase!=="playing"?e:n>=e.expires?(e.phase="expired",e.finished=n,e.version++,e):(e.type==="memory"&&e.hideAt&&n>=e.hideAt&&
(e.flipped=[],delete e.hideAt,e.version++),["inventory","delivery","chart","desk","sequence"].includes(e.type)&&e.stage==="show"&&n>=e.ready&&(e.stage="answer",e.version++),e)}function jt(e,n,s=Date.
now()){let t=structuredClone(e);if(Je(t,s),t.phase!=="playing")return t;if(n==="giveup")return k(t,!1,Gt(t),s);if(t.type==="memory"){let r=Number(n);if(t.hideAt||!Number.isInteger(
r)||r<0||r>15||t.found.includes(r)||t.flipped.includes(r))throw O("Choisis une carte encore cachée.");if(t.flipped.push(r),t.flipped.length===2)if(t.turns++,t.cards[t.flipped[0]]===
t.cards[t.flipped[1]]){if(t.found.push(...t.flipped),t.flipped=[],t.pairs++,t.pairs===8)return k(t,!0,Math.max(500,1e3-20*(t.turns-8)),s)}else t.hideAt=s+1600}else if(t.type==="min\
es"){if(n==="mode")return t.mode=t.mode==="open"?"flag":"open",t.version++,t;let r=Number(n);if(!Number.isInteger(r)||r<0||r>15||t.revealed.includes(r))throw O("Choisis une case fe\
rmée.");if(t.mode==="flag")if(t.flags.includes(r))t.flags=t.flags.filter(a=>a!==r);else{if(t.flags.length>=3)throw O("Tu disposes de trois drapeaux.");t.flags.push(r)}else{if(t.flags.
includes(r))throw O("Retire le drapeau avant d’ouvrir cette case.");if(!t.placed){let o=new Set([r,...ce(r,4)]),l=Array.from({length:16},(d,c)=>c).filter(d=>!o.has(d));t.bombs=B(
l,fe(`${t.seed}:first:${r}`)).slice(0,3),t.placed=!0}if(t.moves++,t.bombs.includes(r))return k(t,!1,Math.min(700,t.revealed.length/13*700),s);let a=[r];for(;a.length;){let o=a.shift();
t.revealed.includes(o)||t.flags.includes(o)||t.bombs.includes(o)||(t.revealed.push(o),ce(o,4).some(l=>t.bombs.includes(l))||a.push(...ce(o,4).filter(l=>!t.revealed.includes(l))))}if(t.
revealed.length===13)return k(t,!0,1e3,s)}}else if(t.type==="maze"){if(!re.includes(n))throw O("Direction inconnue.");let[r,a]=he[n],o=t.position%t.size+r,l=Math.floor(t.position/t.
size)+a,d=l*t.size+o;if(o<0||o>=t.size||l<0||l>=t.size||t.walls.includes(d))throw O("Un obstacle bloque ce passage.");if(t.position=d,t.trail.push(d),t.moves++,d===t.goal)return k(
t,!0,Math.max(0,1e3-25*(t.moves-t.optimal)),s);if(t.moves>=t.budget)return k(t,!1,0,s)}else if(t.type==="inventory"){if(t.stage!=="answer")throw O("Observe les objets, la réponse s\
’ouvre dans quelques secondes.");let r=Number(n);if(!t.options.includes(r))throw O("Choix invalide.");if(t.history.push({answer:r,expected:t.missing,ok:r===t.missing,shown:[...t.
shown]}),r===t.missing&&t.correct++,t.round===t.total)return k(t,t.correct===t.total,t.correct/5*1e3,s);t.round++,Object.assign(t,We(t.seed,t.round,t.hard)),t.stage="show",t.ready=
s+6e3}else if(t.type==="delivery"){if(t.stage!=="answer")throw O("Mémorise les flèches avant de jouer.");if(!re.includes(n))throw O("Direction inconnue.");if(t.entered.push(n),n!==
t.sequence[t.progress])return k(t,!1,t.completed/8*1e3,s);if(t.progress++,t.progress===t.round+2){if(t.completed=t.round,t.round===8)return k(t,!0,1e3,s);t.round++,t.progress=0,t.entered=
[],t.stage="show",t.ready=s+(t.round+2)*650+500}}else if(t.type==="vault")if(n==="clear")t.guess=[];else if(n==="submit"){if(t.guess.length!==4)throw O("Place les quatre symboles a\
vant de confirmer.");if(t.tries++,t.history.push({guess:[...t.guess],correct:t.guess.filter((r,a)=>r===t.answer[a]).length}),t.guess.every((r,a)=>r===t.answer[a]))return k(t,!0,1e3-
100*(t.tries-1),s);if(t.feedback=t.guess.filter((r,a)=>r===t.answer[a]).length,t.guess=[],t.tries>=t.maxTries)return k(t,!1,0,s)}else{let r=Number(n);if(!Number.isInteger(r)||r<0||
r>3||t.guess.includes(r)||t.guess.length===4)throw O("Choisis un symbole encore disponible.");t.guess.push(r)}if(t.type==="chart"){if(t.stage!=="answer")throw O("Wait for the chart\
 to hide its levels.");let r=Number(n);if(!Number.isInteger(r)||r<0||r>=t.options[t.answers.length].length)throw O("Choose an available price.");if(t.answers.push(t.options[t.answers.
length][r]),t.answers.length===3)return k(t,t.answers.every((a,o)=>a===t.levels[o]),t.answers.filter((a,o)=>a===t.levels[o]).length/3*1e3,s)}if(t.type==="desk"){if(t.stage!=="answe\
r")throw O("Memorize the desk first.");let r=Number(n);if(!Number.isInteger(r)||r<0||r>5||t.answers.includes(r))throw O("Choose a different item.");if(t.answers.push(r),t.answers.length===
2)return k(t,t.answers.every(a=>t.changed.includes(a)),t.answers.filter(a=>t.changed.includes(a)).length*500,s)}if(t.type==="sequence"){if(t.stage!=="answer")throw O("Memorize the \
candles first.");if(!["red","green"].includes(n))throw O("Choose red or green.");if(t.entered.push(n),n!==t.sequence[t.progress])return k(t,!1,t.completed/8*1e3,s);if(t.progress++,
t.progress===t.round+2){if(t.completed=t.round,t.round===8)return k(t,!0,1e3,s);t.round++,t.progress=0,t.entered=[],t.stage="show",t.ready=s+1500+(t.round+2)*650}}return t.version++,
t}function Gt(e){return e.type==="memory"?e.pairs/8*400:e.type==="inventory"?e.correct/5*1e3:["delivery","sequence"].includes(e.type)?e.completed/8*1e3:e.type==="chart"?e.answers.filter(
(n,s)=>n===e.levels[s]).length/3*1e3:e.type==="desk"?e.answers.filter(n=>e.changed.includes(n)).length*500:e.type==="mines"?e.revealed.length/13*700:0}function Yt(e){return ae?{memory:"\
Find the eight matching pairs. Fewer turns earn more points.",maze:"Reach the closing bell through the maze. Your moves are limited.",vault:"Use the clues to order the four symbols\
. Five attempts maximum.",chart:"Study the simulated chart for ten seconds, then identify the three hidden price levels.",desk:"Study the desk for ten seconds, then select the two \
items that changed.",sequence:"Memorize and repeat the candles. The sequence grows from three to ten candles."}[e]:{memory:"Retourne deux cadeaux et retrouve les 8 paires. Moins de\
 tours = plus de points.",mines:"Ouvre les 13 cadeaux sûrs. Trois cachent un piège. Les chiffres indiquent les pièges voisins ; change de mode pour poser un drapeau. Le premier cli\
c est sûr.",maze:"Guide Terry jusqu’au cadeau avec les flèches. Les obstacles sont infranchissables. Le chemin le plus court rapporte le maximum de points.",inventory:"Observe \
les objets pendant 6 secondes. Retrouve ensuite l’objet disparu. Cinq manches, 200 points par bonne réponse.",delivery:"Observe la suite de flèches puis reproduis-la avec les bo\
utons. La tournée s’allonge de 3 à 10 directions. Une erreur termine la partie.",vault:"Retrouve l’ordre des quatre symboles grâce aux indices. Appuie sur les symboles dans l’o\
rdre, puis confirme. Cinq essais maximum."}[e]}ze.exports={create:Ft,shuffle:B,act:jt,advance:Je,instructions:Yt,OBJECTS:$t,SYMBOLS:qt,DIRS:re,VECTOR:he,neighbors:ce,shortest:_e,permutations:Ae,
finish:k,rng:fe};function Ht(e,n,s){let t=(Math.floor(e()*70)+80)*(s?10:1),r=s?5:1,a=[t+8*r,t+4*r,t],o=[],l=t+2*r;for(let c=0;c<18;c++){let p=l;l=Math.max(t-r,Math.min(t+9*r,p+(e()-
.46)*3*r)),o.push({open:p,close:l,high:Math.max(p,l)+e()*1.2*r,low:Math.min(p,l)-e()*1.2*r})}let d=a.map(c=>B([c,c-r,c+2*r,c+3*r],e));return{stage:"show",ready:n+1e4,levels:a,step:r,
candles:o,options:d,answers:[]}}function Vt(e,n,s){let t=[{label:"Market",value:s?"GOLD":"NASDAQ"},{label:"Clock",value:"09:30"},{label:"Note",value:"Wait for the retest"},{label:"\
Risk limit",value:"1R"},{label:"Session",value:"New York"},{label:"Timeframe",value:"15 MIN"}],r=["EUR/USD","11:00","Check the calendar","0.5R","London","5 MIN"],a=B([0,1,2,3,4,5],
e).slice(0,2);return{desk:t,nextDesk:t.map((o,l)=>({...o,value:a.includes(l)?r[l]:o.value})),changed:a,answers:[],stage:"show",ready:n+1e4}}function O(e){return Error(ae&&{"Choisis\
 une carte encore cachée.":"Choose a hidden card.","Direction inconnue.":"Unknown direction.","Un obstacle bloque ce passage.":"An obstacle blocks this move.","Place les quatre sy\
mboles avant de confirmer.":"Choose all four symbols before confirming.","Choisis un symbole encore disponible.":"Choose a symbol that is still available.","Choix invalide.":"Inval\
id choice."}[e]||e)}});var Oe=ee((Tn,et)=>{"use strict";var{createCanvas:Xt,loadImage:_t,GlobalFonts:Wt}=require("@napi-rs/canvas"),Ke=require("node:fs"),Ie=require("node:path"),u=ue(),W=se(),E=u.lang===
"en",pe=Ie.join(__dirname,"assets");if(!Ke.existsSync(pe))throw Error(E?"Upload the assets folder next to index.js.":"Ajoute le dossier assets à côté de index.js.");for(let e of Ke.
readdirSync(pe).filter(n=>/\.(otf|ttf)$/.test(n)))Wt.registerFromPath(Ie.join(pe,e),e.includes("Medium")||e.includes("Regular")?u.body:u.title);var te;async function Qe(){u.mascot&&
!te&&(te=await _t(Ie.join(pe,u.mascot)))}function y(e,n,s,t,r=24,a=u.white,o=1100,l=!1){for(e.font=`${r}px "${l?u.title:u.body}",sans-serif`,e.fillStyle=a,n=String(n);e.measureText(
n).width>o&&n.length>2;)n=n.slice(0,-2)+"…";e.fillText(n,s,t)}function C(e,n,s,t,r,a=u.panel,o=14){e.fillStyle=a,e.beginPath(),e.roundRect(n,s,t,r,o),e.fill(),e.strokeStyle=u.accent+
"30",e.lineWidth=1,e.stroke()}function w(e,n,s,t,r,a=u.accent,o=3){e.strokeStyle=a,e.lineWidth=o,e.lineCap="round",e.beginPath(),e.moveTo(n,s),e.lineTo(t,r),e.stroke()}function L(e,n,s,t,r){
e.fillStyle=r,e.beginPath(),e.arc(n,s,t,0,Math.PI*2),e.fill()}function Jt(e,n,s,t,r=35,a=u.navy){e.save(),e.translate(s,t),e.rotate({up:0,right:Math.PI/2,down:Math.PI,left:-Math.PI/
2}[n]),w(e,0,r/2,0,-r/2,a,5),w(e,-r/3,-r/6,0,-r/2,a,5),w(e,r/3,-r/6,0,-r/2,a,5),e.restore()}function Q(e,n,s,t,r=72,a=u.accent){e.save(),e.translate(s,t),e.scale(r/80,r/80),e.lineWidth=
4,e.strokeStyle=a,e.fillStyle=a,e.lineCap="round";let o=(d,c,p,f,S=6)=>{e.beginPath(),e.roundRect(d,c,p,f,S),e.stroke()},l=(n%12+12)%12;if(n>=100){if(n===100&&(C(e,-28,-22,56,48,a,
5),w(e,0,-22,0,26,u.navy,7),w(e,-28,0,28,0,u.navy,6)),n===101){e.beginPath();for(let d=0;d<10;d++){let c=-Math.PI/2+d*Math.PI/5,p=d%2?12:30;d?e.lineTo(Math.cos(c)*p,Math.sin(c)*p):
e.moveTo(Math.cos(c)*p,Math.sin(c)*p)}e.closePath(),e.fill()}if(n===102)for(let d=0;d<6;d++)w(e,0,0,Math.cos(d*Math.PI/3)*30,Math.sin(d*Math.PI/3)*30,a,3);n===103&&(e.beginPath(),e.
moveTo(-23,18),e.lineTo(-18,-8),e.quadraticCurveTo(0,-36,18,-8),e.lineTo(23,18),e.closePath(),e.stroke(),L(e,0,26,4,a)),e.restore();return}if(l===0&&(E?(L(e,0,0,27,a),L(e,0,0,21,u.
navy),y(e,"$",-10,13,35,a,40,!0)):(o(-32,-18,64,38,13),w(e,-20,0,-5,0,a,4),w(e,-12,-8,-12,8,a,4),L(e,14,-5,3,a),L(e,24,5,3,a))),l===1&&(E?(o(-30,-25,60,50),w(e,-20,15,-8,0,a,4),w(e,
-8,0,2,8,a,4),w(e,2,8,22,-13,a,4)):(e.beginPath(),e.arc(0,0,26,Math.PI,Math.PI*2),e.stroke(),o(-30,-4,12,28),o(18,-4,12,28))),l===2)if(E)e.beginPath(),e.arc(0,0,28,0,Math.PI*2),e.stroke(),
w(e,0,0,0,-16,a,4),w(e,0,0,14,5,a,4);else{o(-34,-20,68,40);for(let d=0;d<3;d++)for(let c=0;c<7;c++)C(e,-27+c*8,-13+d*9,5,5,a,1)}if(l===3)if(E){for(let d of[28,18,7])e.beginPath(),e.
arc(0,0,d,0,Math.PI*2),e.stroke();w(e,0,0,34,-32,a,4)}else o(-18,-28,36,56,17),w(e,0,-25,0,-5,a,3);if(l===4&&(E?(o(-34,-21,68,42),y(e,"$",-11,14,36,a,40,!0)):(o(-18,-32,36,64,8),L(
e,0,-12,5,a),w(e,-8,16,8,16,a,3))),l===5)if(E){o(-25,-30,50,60),w(e,-14,-28,-14,28,a,3);for(let d=0;d<3;d++)w(e,-5,-12+d*13,15,-12+d*13,a,3)}else o(-33,-25,66,44),w(e,0,20,0,32,a,4),
w(e,-17,32,17,32,a,4);if(l===6&&(E?(o(-33,-25,66,44),w(e,0,20,0,32,a,4),w(e,-17,32,17,32,a,4)):(o(-11,-30,22,40,11),e.beginPath(),e.arc(0,0,20,0,Math.PI),e.stroke(),w(e,0,20,0,32,a,
4),w(e,-12,32,12,32,a,4))),l===7&&(E?(e.beginPath(),e.moveTo(-22,17),e.lineTo(-18,-8),e.quadraticCurveTo(0,-38,18,-8),e.lineTo(22,17),e.closePath(),e.stroke(),L(e,0,26,4,a)):(o(-30,
13,60,16),w(e,0,13,0,-18,a,5),L(e,0,-24,10,a))),l===8&&(E?(e.beginPath(),e.moveTo(-25,-24),e.lineTo(25,-24),e.lineTo(22,10),e.quadraticCurveTo(0,40,-22,10),e.closePath(),e.stroke()):
(e.beginPath(),e.moveTo(-23,18),e.lineTo(-18,-8),e.quadraticCurveTo(0,-36,18,-8),e.lineTo(23,18),e.closePath(),e.stroke(),L(e,0,26,4,a))),l===9)if(E)L(e,-10,-8,13,a),L(e,-10,-8,6,u.
navy),w(e,1,2,27,28,a,7),w(e,17,17,24,10,a,5);else{e.beginPath();for(let d=0;d<10;d++){let c=-Math.PI/2+d*Math.PI/5,p=d%2?12:30;d?e.lineTo(Math.cos(c)*p,Math.sin(c)*p):e.moveTo(Math.
cos(c)*p,Math.sin(c)*p)}e.closePath(),e.fill()}if(l===10)for(let d=0;d<6;d++){let c=d*Math.PI/3;w(e,0,0,Math.cos(c)*30,Math.sin(c)*30,a,3)}l===11&&(E?(e.beginPath(),e.arc(0,0,25,Math.
PI,Math.PI*2),e.stroke(),o(-29,-3,12,26),o(17,-3,12,26)):(e.beginPath(),e.moveTo(-27,17),e.lineTo(8,-30),e.quadraticCurveTo(24,-15,26,17),e.closePath(),e.fill(),C(e,-31,14,65,13,u.
white,5),L(e,9,-29,8,u.white))),e.restore()}async function me(e,n,s=0){await Qe();let t=Xt(1200,850),r=t.getContext("2d"),a=r.createLinearGradient(0,0,1200,850);a.addColorStop(0,u.
navy),a.addColorStop(1,u.panel),r.fillStyle=a,r.fillRect(0,0,1200,850),r.strokeStyle=u.accent+"10",r.lineWidth=1;for(let o=0;o<1200;o+=50)r.beginPath(),r.moveTo(o,175),r.lineTo(o,850),
r.stroke();for(let o=175;o<850;o+=50)r.beginPath(),r.moveTo(0,o),r.lineTo(1200,o),r.stroke();for(let[o,l]of[[1110,60],[1120,770]]){r.save(),r.translate(o,l);for(let d=0;d<6;d++){let c=d*
Math.PI/3;w(r,0,0,Math.cos(c)*80,Math.sin(c)*80,u.accent+"19",2)}r.restore()}return C(r,32,26,7,47,u.accent,2),y(r,"THE FLOOR",56,60,33,u.white,750,!0),y(r,"8",230,60,38,u.accent,70,
!0),y(r,E?"ADVENT CALENDAR 2026":"CALENDRIER DE L’AVENT 2026",56,89,18,u.muted,900),s&&(C(r,1060,28,100,64,u.accent),y(r,String(s).padStart(2,"0"),1086,74,37,u.navy,70,!0)),y(r,e,
35,143,39,u.white,1115,!0),y(r,n,37,177,22,u.muted,1120),w(r,35,193,1165,193,u.accent+"55",1),y(r,E?"THE FLOOR 8 • ADVENT 2026":"SHORTCUT • AVENT 2026",35,827,17,u.muted,660),y(
r,E?"Game points are separate from season XP":"Points de jeu distincts des ShortCoins",760,827,17,u.muted,420),{canvas:t,ctx:r}}function Ze(e,n){if(C(e,860,218,305,552,u.navy+"dd"),
y(e,E?"YOUR RUN":"TA PARTIE",883,258,27,u.accent,260,!0),n&&(y(e,n.phase==="playing"?E?"IN PROGRESS":"EN COURS":n.phase==="expired"?E?"TIME EXPIRED":"TEMPS ÉCOULÉ":E?"COMPLETE":"\
TERMINÉE",884,300,22,u.white,260),y(e,`${n.score||0} / 1 000`,883,348,38,u.gold,260,!0)),te)e.save(),e.beginPath(),e.roundRect(885,390,255,330,20),e.clip(),e.fillStyle="#f8fcfd",e.
fillRect(885,390,255,330),e.drawImage(te,885,391,255,255*te.height/te.width),e.restore();else{for(let s=0;s<4;s++)Q(e,[1,2,3,8][s],935+s%2*115,450+Math.floor(s/2)*115,80,u.accent);
y(e,"THE FLOOR 8",895,698,26,u.white,250,!0)}}function zt(e,n,s,t=55,r=250,a=750,o=440,l=!1){C(e,t,r,a,o,"#071211");let d=n.levels[0]+n.step*2,c=n.levels[2]-n.step*2,p=S=>r+30+(d-S)/
(d-c)*(o-65);for(let S=0;S<3;S++){let N=p(n.levels[S]);w(e,t+18,N,t+a-95,N,u.accent+"66",1),y(e,s?"L"+(S+1):"L"+(S+1)+" "+n.levels[S].toFixed(n.step<1?2:0),t+a-83,N+7,l?13:19,u.gold,
80)}let f=(a-95)/n.candles.length;for(let S=0;S<n.candles.length;S++){let N=n.candles[S],D=t+30+S*f,V=N.close>=N.open?u.accent:"#ff606a";w(e,D,p(N.high),D,p(N.low),V,2),C(e,D-f*.28,
Math.min(p(N.open),p(N.close)),f*.56,Math.max(4,Math.abs(p(N.open)-p(N.close))),V,1)}y(e,"SIMULATED • EDUCATIONAL EXERCISE",t+15,r+o-13,l?11:16,u.muted,a-30)}async function Kt(e,n){
let{canvas:s,ctx:t}=await me(e.title,n.phase==="playing"?W.instructions(n.type):n.phase==="expired"?E?"Run expired. No ranked score.":"Partie expirée, sans score classé.":E?"Run \
complete • detailed results below":"Partie terminée • correction détaillée ci-dessous",e.day);Ze(t,n);let r=n.phase!=="playing";if(["memory","mines"].includes(n.type)){for(let a=0;a<
16;a++){let o=40+a%4*198,l=220+Math.floor(a/4)*137,d=n.type==="memory"?n.found.includes(a)||n.flipped.includes(a)||r:n.revealed.includes(a)||r;if(C(t,o,l,182,122,d?"#e7f5ef":u.panel),
n.type==="memory")d?(Q(t,n.cards[a],o+91,l+47,56,u.navy),y(t,W.OBJECTS[n.cards[a]],o+13,l+108,20,u.navy,156,!0)):(C(t,o+66,l+30,52,48,u.accent,6),w(t,o+92,l+31,o+92,l+78,u.navy,6),
w(t,o+67,l+53,o+117,l+53,u.navy,6),y(t,String(a+1).padStart(2,"0"),o+12,l+22,16,u.muted,40));else if(r&&n.bombs.includes(a))L(t,o+91,l+52,21,"#ff5b69"),w(t,o+80,l+39,o+101,l+65,u.navy,
4),y(t,"PIÈGE",o+48,l+105,20,u.navy,100,!0);else if(n.flags.includes(a)&&!d)y(t,"DRAPEAU",o+21,l+73,23,u.gold,150,!0);else if(d){let c=W.neighbors(a,4).filter(p=>n.bombs.includes(
p)).length;y(t,String(c),o+72,l+76,56,c?"#17476a":"#a1bcb4",90,!0)}else y(t,String(a+1).padStart(2,"0"),o+68,l+75,39,u.white,100,!0)}y(t,n.type==="memory"?`${n.pairs}/8 ${E?"pairs":
"paires"} • ${n.turns} ${E?"turns":"tours"}`:`${n.revealed.length}/13 cadeaux sûrs • ${n.flags.length}/3 drapeaux`,50,789,23,u.gold,750)}if(n.type==="maze"){let a=n.size,o=Math.
floor(550/a),l=120,d=222;for(let c=0;c<a*a;c++){let p=l+c%a*o,f=d+Math.floor(c/a)*o;t.fillStyle=n.walls.includes(c)?u.navy:"#caddd4",t.fillRect(p+1,f+1,o-2,o-2),n.trail.includes(c)&&
!n.walls.includes(c)&&L(t,p+o/2,f+o/2,2,u.accent),c===n.goal&&(C(t,p+o*.18,f+o*.2,o*.65,o*.6,u.accent,2),w(t,p+o*.5,f+o*.2,p+o*.5,f+o*.8,u.navy,3)),c===n.position&&(L(t,p+o/2,f+o/2,
o*.28,"#ffcf61"),L(t,p+o/2,f+o/2,o*.1,u.navy))}y(t,`${n.budget-n.moves} ${E?"moves left":"déplacements restants"} • ${n.moves} ${E?"used":"utilisés"}`,90,790,25,u.gold,720)}if(n.
type==="inventory"&&(y(t,`MANCHE ${n.round}/5`,50,246,27,u.gold,750,!0),y(t,n.stage==="show"&&!r?"MÉMORISE LES OBJETS":"QUEL OBJET A DISPARU ?",50,290,29,u.white,750,!0),(n.stage===
"show"||r?n.shown:n.remaining).forEach((a,o)=>{let l=50+o%3*255,d=330+Math.floor(o/3)*190;C(t,l,d,235,168,"#e7f5ef"),Q(t,a,l+117,d+65,85,u.navy),y(t,W.OBJECTS[a],l+15,d+148,26,u.navy,
205,!0)}),y(t,`${n.correct}/5 réponses justes`,50,790,24,u.gold,720)),["delivery","sequence"].includes(n.type)){let a=n.stage==="show"||r,o=n.sequence.slice(0,n.round+2);y(t,`${E?
"ROUND":"TOURNÉE"} ${n.round}/8`,50,255,31,u.gold,750,!0),y(t,a?E?"MEMORIZE THE CANDLES":"MÉMORISE LE TRAJET":E?"REPEAT THE SEQUENCE":"REPRODUIS LE TRAJET",50,310,34,u.white,750,
!0),o.forEach((l,d)=>{let c=55+d%5*151,p=365+Math.floor(d/5)*150;if(C(t,c,p,132,130,a?"#dcece3":u.panel),a)if(n.type==="delivery")Jt(t,l,c+66,p+62,42,u.navy);else{let f=l==="green"?
"#00a66b":"#e24d59";w(t,c+66,p+25,c+66,p+105,f,3),C(t,c+45,p+47,42,45,f,3)}else y(t,d<n.progress?"OK":"?",c+42,p+78,39,d<n.progress?u.accent:u.muted,90,!0)}),y(t,`${n.completed}/8 ${E?
"rounds completed":"tournées réussies"}`,50,755,25,u.gold,750)}if(n.type==="vault"){y(t,`${E?"ATTEMPT":"ESSAI"} ${Math.min(n.tries+1,5)}/5`,50,250,30,u.gold,750,!0),n.clues.forEach(
(o,l)=>y(t,`${W.SYMBOLS[o.a]} ${E?o.adj?"immediately before":"before":o.adj?"juste avant":"avant"} ${W.SYMBOLS[o.b]}`,50,305+l*48,25,u.white,750));let a=r?n.answer:n.guess;for(let o=0;o<
4;o++){let l=60+o*190;C(t,l,535,170,155,"#dcece3"),a[o]!==void 0?(Q(t,100+a[o],l+85,592,60,u.navy),y(t,W.SYMBOLS[a[o]],l+15,668,22,u.navy,140,!0)):y(t,"?",l+65,633,55,u.navy,100,!0)}
y(t,n.feedback!==void 0?`${n.feedback}/4 ${E?"symbols correctly placed on the last attempt":"symboles bien placés au dernier essai"}`:E?"Each symbol is used once.":"Chaque symbole\
 est utilisé une fois.",55,755,23,u.gold,750)}if(n.type==="chart"){let a=n.stage!=="show"&&!r;zt(t,n,a),y(t,r?`${n.answers.filter((o,l)=>o===n.levels[l]).length}/3 correct levels`:
a?`What was the price at level L${n.answers.length+1}?`:"Memorize L1, L2 and L3 • 10 seconds",55,750,27,u.gold,750,!0)}return n.type==="desk"&&((n.stage==="show"&&!r?n.desk:n.nextDesk).
forEach((o,l)=>{let d=45+l%3*263,c=230+Math.floor(l/3)*250,p=n.answers.includes(l);C(t,d,c,245,222,p?"#145b43":u.panel),y(t,`${l+1}. ${o.label}`,d+15,c+35,24,u.gold,215,!0),Q(t,[1,
2,5,8,3,6][l],d+122,c+98,65,u.accent),y(t,o.value,d+15,c+180,23,u.white,215,!0),r&&y(t,n.changed.includes(l)?"CHANGED":"UNCHANGED",d+15,c+210,16,n.changed.includes(l)?u.accent:u.muted,
215)}),y(t,n.stage==="show"&&!r?"Memorize the desk • 10 seconds":"Choose the TWO items that changed.",50,790,25,u.gold,750)),s.toBuffer("image/png")}async function Qt(e){let{canvas:n,
ctx:s}=await me(e.title,E?"A new day. A new challenge.":"Une nouvelle case à ouvrir.",e.day);Ze(s,null);for(let t=0;t<8;t++){let r=50+t%4*198,a=250+Math.floor(t/4)*200;C(s,r,a,175,
175,u.panel),Q(s,t,r+87,a+75,85,u.accent),y(s,W.OBJECTS[t],r+13,a+153,22,u.white,150,!0)}return y(s,E?"PLAY • SCORE • CLIMB THE LEADERBOARD":"JOUE • MARQUE DES POINTS • GRIMPE \
AU CLASSEMENT",50,760,26,u.gold,760,!0),n.toBuffer("image/png")}async function Zt(e,n,s=0){let{canvas:t,ctx:r}=await me(e,E?"Daily • Per game • Overall":"Par défi • Par jeu • G\
énéral");return n.slice(0,10).forEach((a,o)=>{C(r,40,220+o*54,1120,46,o===0?u.accent:u.panel,8),y(r,`${s+o+1}. ${a.name||a.uid}`,58,252+o*54,25,o===0?u.navy:u.white,900,!0),y(r,String(
a.score),1020,252+o*54,26,o===0?u.navy:u.gold,120,!0)}),t.toBuffer("image/png")}et.exports={board:Kt,banner:Qt,ranking:Zt,prepare:Qe,icon:Q,frame:me}});var rt=ee((bn,nt)=>{"use strict";var ge=se(),en=ue(),J=en.lang==="en",ye=e=>String(e).replace(/([\\`*_~|>])/g,"\\$1").replace(/@/g,"@​"),tt={up:"↑",right:"→",down:"↓",left:"\
←",red:"🟥",green:"🟩"};function tn(e){if(!(e.phase!=="playing"))return"";if(e.type==="memory")return J?`**${e.pairs}/8 pairs**, **${e.turns} turns**.
All cards are revealed in the image. A completed board starts at 1,000 points, minus 20 per turn beyond eight (minimum 500).`:`**${e.pairs}/8 paires**, en **${e.turns} tours**.
Toutes les cartes sont dévoilées. Grille terminée : 1 000 points, moins 20 par tour au-delà de huit, minimum 500.`;if(e.type==="mines")return`**${e.revealed.length}/13 cadeaux \
sûrs** ouverts.
Les trois pièges sont révélés sur le plateau. Les chiffres comptent les pièges des cases voisines, diagonales incluses.
${e.won?"Grille terminée : 1 000 points.":"La partie s’est arrêtée avant l’ouverture de toutes les cases sûres. Le score partiel dépend des cases ouvertes."}`;if(e.type===
"maze")return J?`Your route: **${e.moves} moves**. Shortest route: **${e.optimal} moves**.
${e.position===e.goal?"You reached the bell. Each extra move costs 25 points.":"The bell was not reached before the move limit."}`:`Ton trajet : **${e.moves} déplacements**. Chemin\
 optimal : **${e.optimal} déplacements**.
${e.position===e.goal?"Cadeau atteint. Chaque pas supplémentaire coûte 25 points.":"Le cadeau n’a pas été atteint avant la limite de déplacements."}`;if(e.type==="inventory")
return e.history.map((s,t)=>`${s.ok?"✅":"❌"} Manche ${t+1} : **${ye(ge.OBJECTS[s.answer])}**${s.ok?"":` → attendu : **${ye(ge.OBJECTS[s.expected])}**`}`).join(`
`)+`
**${e.correct}/5 bonnes réponses.**`;if(e.type==="vault")return(J?"Correct order: **":"Bonne combinaison : **")+e.answer.map(s=>ge.SYMBOLS[s]).join(" → ")+`**
`+e.history.map((s,t)=>`${J?"Attempt":"Essai"} ${t+1} : ${s.guess.map(r=>ge.SYMBOLS[r]).join(" → ")} • **${s.correct}/4**`).join(`
`)+(e.history.length?"":J?"No submitted combination.":"Aucune combinaison confirmée.");if(["delivery","sequence"].includes(e.type)){let s=e.sequence.slice(0,e.round+2).map(r=>tt[r]).
join(" "),t=e.entered.map(r=>tt[r]).join(" ")||"—";return J?`Completed rounds: **${e.completed}/8**.
Expected sequence: ${s}
Your input: ${t}${e.phase==="done"&&!e.won?`
The run stopped on input **${e.entered.length}**.`:""}`:`Tournées réussies : **${e.completed}/8**.
Trajet attendu : ${s}
Ta saisie : ${t}${e.phase==="done"&&!e.won?`
La partie s’est arrêtée à la direction **${e.entered.length}**.`:""}`}return e.type==="chart"?e.levels.map((s,t)=>`${e.answers[t]===s?"✅":"❌"} **L${t+1}** : ${e.answers[t]??
"No answer"} → **${s}**`).join(`
`)+`
The full simulated chart is now visible. This was a memory exercise, not live market data.`:e.type==="desk"?e.desk.map((s,t)=>{let r=e.changed.includes(t),a=e.answers.includes(t);return`${r===
a?"✅":"❌"} **${s.label}** : ${ye(s.value)}${r?" → **"+ye(e.nextDesk[t].value)+"**":" (unchanged)"}${a?" • selected":""}`}).join(`
`):""}function nn(e,n){if(!n)return;let s=[""];for(let t of n.split(`
`))(s.at(-1)+`
`+t).length>950&&s.push(""),s[s.length-1]+=(s.at(-1)?`
`:"")+t;s.forEach((t,r)=>e.addFields({name:r?J?"Results continued":"Suite des résultats":J?"Your answers and corrections":"Tes réponses et la correction",value:t}))}nt.exports={details:tn,
addFields:nn}});var ht=ee((Sn,ct)=>{"use strict";var{EmbedBuilder:st,ActionRowBuilder:ot,ButtonBuilder:rn,ButtonStyle:$,AttachmentBuilder:it}=require("discord.js"),Ce=se(),lt=Oe(),at=rt(),dt={parse:[]},
P=(e,n,s=$.Secondary,t=!1)=>new rn().setCustomId(e).setLabel(String(n).slice(0,80)).setStyle(s).setDisabled(t),H=e=>Array.from({length:Math.ceil(e.length/5)},(n,s)=>new ot().addComponents(
e.slice(s*5,s*5+5)));function ut(e,n,s=!1){let t=a=>`tf8a:${s?"testmove":"move"}:${e.day}:${n.version}:${a}`;if(n.phase!=="playing")return H([P("tf8a:rank:"+e.day+":0","Daily leade\
rboard"),P("tf8a:rank:0:0","Overall leaderboard")]);let r=[];if(n.type==="memory"){for(let a=0;a<4;a++)r.push(new ot().addComponents(...Array.from({length:4},(o,l)=>{let d=a*4+l,c=n.
found.includes(d)||n.flipped.includes(d);return P(t(d),c?Ce.OBJECTS[n.cards[d]]:String(d+1),n.found.includes(d)?$.Success:$.Secondary,c||!!n.hideAt)})));return r.push(...H([P(t("gi\
veup"),"Finish run",$.Danger)])),r}return["chart","desk","sequence"].includes(n.type)&&n.stage==="show"?H([P(t("wait"),"Memorize the screen…",$.Secondary,!0),P(t("giveup"),"Finis\
h run",$.Danger)]):(n.type==="maze"&&(r=H(["left","up","down","right"].map((a,o)=>P(t(a),["←","↑","↓","→"][o],$.Primary)))),n.type==="chart"&&(r=H(n.options[n.answers.length].
map((a,o)=>P(t(o),String(a),$.Primary)))),n.type==="desk"&&(r=H(n.nextDesk.map((a,o)=>P(t(o),`${o+1}. ${a.label}`,$.Primary,n.answers.includes(o))))),n.type==="sequence"&&(r=H([P(t(
"red"),"Red candle",$.Danger),P(t("green"),"Green candle",$.Success)])),n.type==="vault"&&(r=H(Ce.SYMBOLS.map((a,o)=>P(t(o),a,$.Primary,n.guess.includes(o)))),r.push(...H([P(t("sub\
mit"),"Confirm code",$.Success,n.guess.length!==4),P(t("clear"),"Clear")]))),r.push(...H([P(t("giveup"),"Finish run",$.Danger)])),r)}async function an(e,n,s=!1){let t=new st().setColor(
56189).setTitle(e.title).setDescription(n.phase==="playing"?Ce.instructions(n.type):n.phase==="done"?`**${n.score}/1,000 game points**
${s?"Practice run. No points added to the leaderboard.":"Your ranked result is saved."}`:"Run expired. No ranked score.").setImage("attachment://game.png").setFooter({text:"THE FLO\
OR 8 • Advent 2026 • Game points are separate from season XP"});return at.addFields(t,at.details(n)),{content:s?"**Practice • unranked**":"**Ranked daily challenge**",embeds:[
t],attachments:[],files:[new it(await lt.board(e,n),{name:"game.png"})],components:ut(e,n,s),allowedMentions:dt}}async function sn(e,{day:n=0,type:s=null,page:t=0}={}){let r=Math.max(
1,Math.ceil(e.length/10));t=Math.max(0,Math.min(t,r-1));let a=e.slice(t*10,t*10+10),o=n?"Day "+n+" leaderboard":s?s+" leaderboard":"Overall Advent leaderboard";return{embeds:[new st().
setColor(56189).setTitle(o).setDescription(a.length?a.map((l,d)=>`**${t*10+d+1}.** <@${l.uid}> • **${l.score} points** • ${l.days} challenge(s)`).join(`
`):"No completed ranked runs yet.").setImage("attachment://leaderboard.png").setFooter({text:`Page ${t+1}/${r} • Mini-games only • Separate from season XP`})],attachments:[],files:[
new it(await lt.ranking(o,a,t*10),{name:"leaderboard.png"})],components:H([P(`tf8a:rank:${n}:${t-1}:${s||"all"}`,"Previous",$.Secondary,t===0),P(`tf8a:rank:${n}:${t+1}:${s||"all"}`,
"Next",$.Secondary,t===r-1)]),allowedMentions:dt}}ct.exports={game:an,leaderboard:sn,controls:ut}});var pt=ee((Rn,ft)=>{"use strict";ft.exports=[["The Trading Gift Match #1","memory","Find the matching pairs of trading symbols."],["Your December Trading Rule","quest","Share one t\
rading rule you want to follow this December and explain why."],["The Frozen Chart #1","chart","Study the simulated chart, then identify the levels that disappear."],["Christmas Ch\
art Challenge #1","quest","Mark the key zones on the chart provided and explain two possible scenarios. Link your annotated screenshot."],["The Frozen Vault #1","vault","Read the c\
lues and enter the symbols in the right order."],["Your Trading Corner","quest","Share a photo of your setup with account details hidden."],["The Trader’s Desk #1","desk","Study \
the chart, clock and notes. Then find what changed."],["Before You Open the Platform","quest","Share a short checklist you use before a trading session."],["The Trading Gift Match \
#2","memory","Find the matching pairs on a new board."],["Replay and Explain #1","quest","Play the linked Trade Replay. Share a screenshot of your choice and explain it in one sent\
ence."],["The Route to the Bell #1","maze","Reach the closing bell before you run out of moves. Avoid the blocked tiles."],["A Journal Page to Share","quest","Share a simple journa\
l template or an anonymized page from your own journal."],["The Frozen Chart #2","chart","Study a new simulated chart, then identify the levels that disappear."],["One Lesson Worth\
 Sharing","quest","Share a mistake in your process and what you changed afterward."],["The Frozen Vault #2","vault","Use a new set of clues to unlock the vault."],["Christmas Chart\
 Challenge #2","quest","Mark the levels you would watch on the new chart provided and explain why. Link your annotated screenshot."],["The Trader’s Desk #2","desk","Study a new d\
esk and find what changed."],["Your Holiday Session Plan","quest","Share your trading windows, review time and days off over the holidays."],["Candle Copy #1","sequence","Memorize \
and repeat the red and green candles. Each round adds one candle."],["Replay and Explain #2","quest","Play the new linked Trade Replay. Share a screenshot and explain your reasonin\
g."],["The Route to the Bell #2","maze","Reach the closing bell on a new board with different obstacles."],["Help Another Trader","quest","Give constructive feedback on a Chart Cha\
llenge entry and link your reply."],["Candle Copy #2","sequence","Memorize and repeat a new sequence of red and green candles."],["Your Takeaway for Next Year","quest","Share your \
biggest lesson from this year and one habit you will keep."]].map(([e,n,s],t)=>({day:t+1,title:e,kind:n,description:s}))});var{mkdirSync:on}=require("node:fs"),{randomUUID:mt}=require("node:crypto"),Te=ht(),ln=Oe();function dn(){let e=new Map;return async(n,s)=>{let t=(e.get(n)||Promise.resolve()).catch(
()=>{}).then(s);e.set(n,t);try{return await t}finally{e.get(n)===t&&e.delete(n)}}}var{join:un}=require("node:path"),{DatabaseSync:cn}=require("node:sqlite"),{Client:hn,GatewayIntentBits:fn,
Events:gt,MessageFlags:pn,PermissionFlagsBits:we,SlashCommandBuilder:Ue,EmbedBuilder:mn,ActionRowBuilder:xe,ButtonBuilder:gn,ButtonStyle:ne,ModalBuilder:yn,TextInputBuilder:yt,TextInputStyle:wt,
AttachmentBuilder:Pe}=require("discord.js"),Ee=pt(),oe=se(),K={parse:[]},F=pn.Ephemeral,ke=1e6,z=(e,n=!0)=>e.addIntegerOption(s=>s.setName("day").setDescription("December day").setMinValue(
1).setMaxValue(24).setRequired(n)),vt=new Ue().setName("advent").setDescription("Manage the TF8 Advent calendar").setDefaultMemberPermissions(we.ManageGuild).addSubcommand(e=>z(e.setName(
"publish").setDescription("Publish today’s activity"))).addSubcommand(e=>z(e.setName("resource").setDescription("Set the chart or Trade Replay URL")).addStringOption(n=>n.setName(
"url").setDescription("HTTPS URL").setRequired(!0))).addSubcommand(e=>z(e.setName("rewards").setDescription("Set the XP for a day")).addIntegerOption(n=>n.setName("xp").setDescription(
"Participation XP").setMinValue(0).setMaxValue(ke).setRequired(!0)).addIntegerOption(n=>n.setName("bonus").setDescription("Quest voting bonus XP").setMinValue(0).setMaxValue(ke).setRequired(
!0))).addSubcommand(e=>z(e.setName("review").setDescription("Approve or reject a quest entry")).addUserOption(n=>n.setName("member").setDescription("Participant").setRequired(!0)).
addBooleanOption(n=>n.setName("approve").setDescription("Approve this submission?").setRequired(!0))).addSubcommand(e=>z(e.setName("export").setDescription("Export approved XP awar\
ds for a closed day"))).addSubcommand(e=>e.setName("preview").setDescription("Preview any activity privately").addIntegerOption(n=>n.setName("day").setDescription("December day").setMinValue(
1).setMaxValue(24).setRequired(!0))).addSubcommand(e=>z(e.setName("close").setDescription("Close a daily activity"))).addSubcommand(e=>z(e.setName("invalidate").setDescription("Exc\
lude a ranked game result")).addUserOption(n=>n.setName("member").setDescription("Member").setRequired(!0)).addStringOption(n=>n.setName("reason").setDescription("Reason saved in t\
he audit log").setRequired(!0))).addSubcommand(e=>z(e.setName("scores").setDescription("Export the game leaderboard"),!1)).addSubcommand(e=>e.setName("status").setDescription("Chec\
k the schedule and reward settings")),Tt=new Ue().setName("advent-leaderboard").setDescription("TF8 Advent daily, per-game and overall rankings").addIntegerOption(e=>e.setName("day").
setDescription("Daily leaderboard").setMinValue(1).setMaxValue(24)).addStringOption(e=>e.setName("game").setDescription("Game family").addChoices(...["memory","chart","vault","desk",
"maze","sequence"].map(n=>({name:n,value:n})))).addIntegerOption(e=>e.setName("page").setDescription("Page").setMinValue(1)),bt=new Ue().setName("advent-score").setDescription("You\
r TF8 Advent game score");function ie(e,{day:n=0,type:s=null}={}){let t=new Map;for(let r of e.prepare("SELECT * FROM runs WHERE invalid=0").all()){let a=JSON.parse(r.state);if(a.phase!==
"done"||n&&r.day!==n||s&&a.type!==s)continue;let o=t.get(r.uid)||{uid:r.uid,name:r.name||r.uid,score:0,days:0,duration:0,first:1/0};o.score+=a.score,o.days++,o.duration+=Math.max(0,
a.finished-a.started),o.first=Math.min(o.first,a.finished),t.set(r.uid,o)}return[...t.values()].sort((r,a)=>a.score-r.score||r.duration-a.duration||r.first-a.first||r.uid.localeCompare(
a.uid))}function St(e,n){e.exec("BEGIN IMMEDIATE");try{let s=e.prepare("SELECT * FROM lease WHERE id=1").get();if(s&&s.expires>Date.now())throw Error("Another TF8 Advent instance i\
s already using this volume.");e.prepare("INSERT OR REPLACE INTO lease VALUES(1,?,?)").run(n,Date.now()+45e3),e.exec("COMMIT")}catch(s){throw e.exec("ROLLBACK"),s}}function Rt(e){return"\
\uFEFF"+[["rank","discord_id","name","points","days"],...e.map((n,s)=>[s+1,n.uid,n.name,n.score,n.days])].map(n=>n.map(s=>{let t=String(s);return/^[=+\-@\t\r]/.test(t)&&(t="'"+t),'\
"'+t.replaceAll('"','""')+'"'}).join(";")).join(`\r
`)}function Le(e,n){let s=Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:n,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).
formatToParts(e).map(t=>[t.type,t.value]));return{year:Number(s.year),month:Number(s.month),day:Number(s.day),time:s.hour+":"+s.minute}}function Mt(e,n=2026){on(e,{recursive:!0});let s=new cn(
un(e,"tf8-advent-"+n+"-v2.sqlite"));return s.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS days(day INTEGER PRIMARY KEY, message TEXT, resource TEXT, xp INTEGER, bonus INTEGER, channel TEXT);
    CREATE TABLE IF NOT EXISTS runs(day INTEGER, uid TEXT, state TEXT NOT NULL, name TEXT DEFAULT '', invalid INTEGER DEFAULT 0, PRIMARY KEY(day,uid));
    CREATE TABLE IF NOT EXISTS lease(id INTEGER PRIMARY KEY CHECK(id=1),owner TEXT,expires INTEGER);
    CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY, ts INTEGER, actor TEXT, action TEXT, detail TEXT);
    CREATE TABLE IF NOT EXISTS entries(day INTEGER, uid TEXT, body TEXT NOT NULL, proof TEXT, status TEXT NOT NULL, PRIMARY KEY(day,uid));
    CREATE TABLE IF NOT EXISTS votes(day INTEGER, voter TEXT, target TEXT NOT NULL, PRIMARY KEY(day,voter));`),s.prepare("PRAGMA table_info(days)").all().some(t=>t.name==="channel")||
s.exec("ALTER TABLE days ADD COLUMN channel TEXT"),s}function Nt(e,n,s,t,r,a=2026){let o=[];if(s==="quest"){for(let{uid:d}of e.prepare("SELECT uid FROM entries WHERE day=? AND stat\
us='approved' ORDER BY uid").all(n))t&&o.push([d,t,"advent-"+a+"-day-"+n+"-quest"]);let l=e.prepare(`SELECT v.target, COUNT(*) AS n FROM votes v JOIN entries e
      ON e.day=v.day AND e.uid=v.target WHERE v.day=? AND e.status='approved'
      GROUP BY v.target ORDER BY n DESC,v.target`).all(n);r&&l.length&&l[0].n!==l[1]?.n&&o.push([l[0].target,r,"advent-"+a+"-day-"+n+"-vote"])}else for(let{uid:l,state:d}of e.prepare(
"SELECT uid,state FROM runs WHERE day=? AND invalid=0 ORDER BY uid").all(n))t&&JSON.parse(d).phase==="done"&&o.push([l,t,"advent-"+a+"-day-"+n+"-game"]);return o}function j(e,n,s=ne.
Secondary,t=!1){return new gn().setCustomId(e).setLabel(n).setStyle(s).setDisabled(t)}function ve(e){return Array.from({length:Math.ceil(e.length/5)},(n,s)=>new xe().addComponents(
e.slice(s*5,s*5+5)))}async function $e(e,n,s,t){let r=e.kind==="quest",a=s?s+" season XP after "+(r?"staff approval":"finishing the game")+".":"",o=r&&t?t+" bonus XP for the top vo\
ted entry with a clear lead.":"",l=new mn().setColor(6312919).setTitle("Day "+e.day+" · "+e.title).setDescription([e.description,n.resource?"[Open the activity resource]("+n.resource+
")":"",r?"":"One ranked run per daily game, up to 1,000 points. You can reopen an unfinished run. Practice runs are unranked.",a,o].filter(Boolean).join(`

`)).setImage("attachment://tf8-advent.png").setFooter({text:"TF8 Advent 2026 · "+e.day}),d=r?[j("tf8a:submit:"+e.day,"Submit entry",ne.Primary),j("tf8a:entries:"+e.day+":0","View \
entries & vote")]:[j("tf8a:play:"+e.day,"Play",ne.Primary)];return r||d.push(j("tf8a:rank:"+e.day+":0","Daily leaderboard"),j("tf8a:rank:0:0","Overall leaderboard"),j("tf8a:practic\
e:"+e.day,"Practice • unranked")),{embeds:[l],files:[new Pe(await ln.banner(e),{name:"tf8-advent.png"})],components:ve(d),allowedMentions:K}}async function qe(e,n,s=!1){return Te.
game(e,n,s)}function Et(e){if(!e)return null;try{let n=new URL(e.trim());if(n.protocol==="https:"&&!n.username&&!n.password&&n.href.length<=500&&!/[()<>]/.test(n.href))return n.href}catch{}
throw new Error("Enter a valid HTTPS link of up to 500 characters.")}function De(e,n){return e.length>n?e.slice(0,n-1)+"…":e}async function At(e=process.env,n={}){let{DISCORD_TOKEN:s,
DISCORD_GUILD_ID:t,ADVENT_CHANNEL_ID:r,ADVENT_STAFF_CHANNEL_ID:a}=e;if(!s||![t,r,a].every(i=>/^\d{17,20}$/.test(i||""))||r===a)throw new Error("Set the token, guild ID and two dist\
inct channel IDs.");if(e.RAILWAY_ENVIRONMENT_ID&&!e.RAILWAY_VOLUME_MOUNT_PATH)throw new Error("Mount a persistent Railway volume first.");let o=e.ADVENT_TIMEZONE||"Europe/Paris",l=e.
ADVENT_TIME||"12:00",d=Number(e.ADVENT_YEAR||2026),c=Number(e.ADVENT_XP||0),p=Number(e.ADVENT_BONUS_XP||0);if(!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(l)||!Number.isInteger(d)||![c,p].every(
i=>Number.isInteger(i)&&i>=0&&i<=ke))throw new Error("Invalid Advent schedule or XP configuration.");Le(Date.now(),o);let f=Mt(e.RAILWAY_VOLUME_MOUNT_PATH||e.DATA_DIR||"./data",d),
S=mt();St(f,S),f.exec("CREATE TABLE IF NOT EXISTS closed(day INTEGER PRIMARY KEY)");let N=dn(),D=new Map,V=!1,U=n.client||new hn({intents:[fn.Guilds]}),q=i=>f.prepare("SELECT * FRO\
M days WHERE day=?").get(i)||{},G=i=>f.prepare("INSERT OR IGNORE INTO days(day) VALUES (?)").run(i),Y=()=>Le(Date.now(),o),be=(i,h=Y())=>h.year===d&&h.month===12&&h.day===i,It=(i,h=Y())=>!!f.
prepare("SELECT day FROM closed WHERE day=?").get(i)||h.year>d||h.year===d&&(h.month>12||h.month===12&&h.day>i),Se=(i,h)=>[h.xp??c,h.bonus??p],Ot=new Set([4,10,16,20]);function Ct(i){
if(!be(i)||!q(i).message||f.prepare("SELECT day FROM closed WHERE day=?").get(i))throw new Error("This Advent activity is closed.")}let le=!1,Be;async function Fe(i){if(!be(i))throw new Error(
"Only today’s activity can be published. Use preview to test any day.");if(f.prepare("SELECT day FROM closed WHERE day=?").get(i))throw Error("This activity was manually closed.");
if(le)throw new Error("A publication is already in progress. Try again shortly.");le=!0;try{let h=Ee[i-1];G(i);let v=q(i);if(v.message)return"Already published: https://discord.com\
/channels/"+t+"/"+(v.channel||r)+"/"+v.message;if(Ot.has(i)&&!v.resource)throw new Error("Set the activity resource with /advent resource first.");let b=await U.channels.fetch(r);if(!b?.
isTextBased()||b.guildId!==t)throw new Error("Advent channel unavailable.");let I,T,A=Date.now()-1560*60*1e3;for(let g=0;g<100;g++){let m=await b.messages.fetch({limit:100,...I?{before:I}:
{}});if(T=m.find(M=>M.author.id===U.user.id&&M.embeds.some(x=>x.footer?.text==="TF8 Advent 2026 · "+i)),T||!m.size||m.last().createdTimestamp<A)break;if(g===99)throw new Error("Un\
able to verify previous publication in channel history.");I=m.last().id}let R=T||await b.send({...await $e(h,v,...Se(h,v)),nonce:"tf8a-"+d+"-"+i,enforceNonce:!0});return f.prepare(
"UPDATE days SET message=?, channel=? WHERE day=?").run(R.id,r,i),"Published: "+R.url}finally{le=!1}}let Re="";async function je(){let i=Y();if(!(e.AUTO_PUBLISH!=="true"||i.year!==
d||i.month!==12||i.day>24||i.time<l||le||q(i.day).message))try{await Fe(i.day),Re=""}catch(h){let v=i.day+": "+h.message;v!==Re&&console.error(v),Re=v}}function Dt(i,h,v=!0,b=""){let I=f.
prepare("SELECT uid,body,proof FROM entries WHERE day=? AND status='approved' ORDER BY rowid").all(i),T=Math.max(0,Math.ceil(I.length/3)-1);h=Math.max(0,Math.min(h,T));let A=[],R=I.
slice(h*3,h*3+3).map((g,m)=>{let M=h*3+m+1;return v&&b!==g.uid&&A.push(j("tf8a:vote:"+i+":"+g.uid,"Vote for entry "+M)),"**"+M+".** <@"+g.uid+`>
`+De(g.body,340)+(g.proof?`
[Open attachment](<`+g.proof+">)":"")}).join(`

`);return h>0&&A.push(j("tf8a:entries:"+i+":"+(h-1),"Previous")),h<T&&A.push(j("tf8a:entries:"+i+":"+(h+1),"Next")),{content:R||"No approved entries yet.",components:ve(A),allowedMentions:K}}
function xt(i,h,v){return{content:"Day **"+i+"** · <@"+h+`>
`+De(v.body,1e3)+(v.proof?`
[Open proof](<`+v.proof+">)":""),components:ve([j("tf8a:approve:"+i+":"+h,"Approve",ne.Success),j("tf8a:reject:"+i+":"+h,"Reject",ne.Danger)]),allowedMentions:K}}function Ge(i,h,v){
if(!f.prepare("UPDATE entries SET status=? WHERE day=? AND uid=?").run(v?"approved":"rejected",i,h).changes)throw new Error("No entry found for this member.")}function Me(i){return i.
memberPermissions?.has(we.ManageGuild)}U.on(gt.InteractionCreate,async i=>N(i.user.id,async()=>{if(i.guildId===t)try{if(i.isChatInputCommand()&&i.commandName==="advent-leaderboard"){
await i.deferReply({flags:F});let g={day:i.options.getInteger("day")||0,type:i.options.getString("game"),page:(i.options.getInteger("page")||1)-1};return i.editReply(await Te.leaderboard(
ie(f,g),g))}if(i.isChatInputCommand()&&i.commandName==="advent-score"){let g=ie(f),m=g.findIndex(M=>M.uid===i.user.id);return i.reply({content:m<0?"No ranked score yet.":`Your rank\
: **${m+1}/${g.length}** • **${g[m].score} game points** • ${g[m].days} completed challenge(s). Season XP is tracked separately.`,flags:F,allowedMentions:K})}if(i.isChatInputCommand()&&
i.commandName==="advent"){if(!Me(i))throw new Error("Staff only.");let g=i.options.getSubcommand(),m=i.options.getInteger("day"),M=Ee[m-1];if(await i.deferReply({flags:F}),g==="sta\
tus"){let x=Y(),_=f.prepare("SELECT day,uid FROM entries WHERE status='pending' ORDER BY day LIMIT 20").all();return await i.editReply({content:"Advent "+d+" · "+l+" ("+o+`)
Today: `+x.day+"/"+x.month+"/"+x.year+`
Default participation XP: `+c+" · voting bonus: "+p+(_.length?`
Pending reviews:
`+_.map(de=>"Day "+de.day+" · <@"+de.uid+">").join(`
`):""),allowedMentions:K})}if(g==="close")return G(m),f.prepare("INSERT OR IGNORE INTO closed VALUES(?)").run(m),i.editReply("Activity closed. Ranked moves, entries and votes are n\
ow disabled.");if(g==="invalidate"){let x=i.options.getUser("member").id;if(!f.prepare("UPDATE runs SET invalid=1 WHERE day=? AND uid=?").run(m,x).changes)throw Error("No ranked ru\
n found for this member.");return f.prepare("INSERT INTO audit(ts,actor,action,detail) VALUES(?,?,?,?)").run(Date.now(),i.user.id,"invalidate",JSON.stringify({day:m,uid:x,reason:i.
options.getString("reason")})),i.editReply("Result excluded. A new ranked attempt is blocked for this day.")}if(g==="scores"){let x=ie(f,{day:m||0});return i.editReply({content:"Ga\
me points only. This file does not credit season XP.",files:[new Pe(Buffer.from(Rt(x)),{name:"tf8-advent-scores.csv"})]})}if(g==="publish")return await i.editReply(await Fe(m));if(g===
"preview")return await i.editReply({...await $e(M,q(m),...Se(M,q(m))),components:[],content:M.kind==="quest"?"Staff preview.":"Staff preview. To test a private game run, use the bu\
tton below."}).then(async()=>{M.kind!=="quest"&&await i.followUp({content:"Private test for day "+m,flags:F,components:ve([j("tf8a:test:"+m,"Play test",ne.Primary)])})});if(g==="re\
view"){let x=i.options.getUser("member").id;return Ge(m,x,i.options.getBoolean("approve")),await i.editReply("Review saved.")}if(g==="resource"){if(q(m).message)throw new Error("Se\
t the resource before publishing this day.");let x=Et(i.options.getString("url"));return G(m),f.prepare("UPDATE days SET resource=? WHERE day=?").run(x,m),await i.editReply("Resour\
ce saved.")}if(g==="rewards"){if(q(m).message)throw new Error("Set the rewards before publishing this day.");return G(m),f.prepare("UPDATE days SET xp=?,bonus=? WHERE day=?").run(i.
options.getInteger("xp"),i.options.getInteger("bonus"),m),await i.editReply("Rewards saved.")}if(g==="export"){if(!It(m))throw new Error("Export is available once the day has close\
d.");if(!q(m).message)throw new Error("This day was never published.");if(f.prepare("SELECT COUNT(*) AS n FROM entries WHERE day=? AND status='pending'").get(m).n)throw new Error("\
Review all pending entries before exporting.");let _=Nt(f,m,M.kind,...Se(M,q(m)),d),de=["discord_id,xp,reason",..._.map(Pt=>Pt.join(","))].join(`
`);return await i.editReply({content:_.length+" XP awards. Use /points add on the season bot with the amount and exact reason in each row.",files:[new Pe(Buffer.from(de),{name:"tf8\
-advent-day-"+m+".csv"})]})}}if(!i.isButton()&&!i.isModalSubmit()||!i.customId.startsWith("tf8a:"))return;let[,h,v,b,I]=i.customId.split(":"),T=Number(v),A=Ee[T-1];if(h==="rank")return await i.
deferReply({flags:F}),i.editReply(await Te.leaderboard(ie(f,{day:T,type:I&&I!=="all"?I:null}),{day:T,type:I&&I!=="all"?I:null,page:Number(b)||0}));if(!A)throw new Error("Invalid Ad\
vent day.");let R=i.user.id;if(h==="approve"||h==="reject"){if(!Me(i)||i.channelId!==a)throw new Error("Staff only.");return Ge(T,b,h==="approve"),await i.update({content:i.message.
content+`
**`+(h==="approve"?"Approved":"Rejected")+"**",components:[],allowedMentions:K})}if(h==="entries"){if(A.kind!=="quest"||!q(T).message)throw new Error("No published quest for this d\
ay.");let g=Dt(T,Number(b)||0,be(T)&&!f.prepare("SELECT day FROM closed WHERE day=?").get(T),R);return i.message.flags.has(F)?await i.update(g):await i.reply({...g,flags:F})}if(h===
"test"||h==="testmove"||h==="practice"){if(A.kind==="quest")throw Error("This activity is a quest.");if(!Me(i)&&(h==="test"||!q(T).message))throw new Error("This practice game is n\
ot available yet.");let g=T+":"+R;if(h==="test"||h==="practice"){for(let[x,_]of X)_.expires<Date.now()&&X.delete(x);if(X.size>=500&&!X.has(g))throw Error("Many practice runs are ac\
tive. Please try again shortly.");let M=Ye(A.kind,T);return X.set(g,M),await i.deferReply({flags:F}),await Ne(i,A,M,!0)}let m=X.get(g);if(!m||m.version!==Number(b))throw new Error(
"Start a new test from /advent preview.");return He(m,I),m.phase==="done"&&X.delete(g),await i.deferUpdate(),await Ne(i,A,m,!0)}if(Ct(T),h==="play"||h==="move"){if(A.kind==="quest")
throw new Error("This activity is a quest.");let g=f.prepare("SELECT state,invalid FROM runs WHERE day=? AND uid=?").get(T,R);if(g?.invalid)throw Error("Your entry was excluded for\
 this day.");let m=g?JSON.parse(g.state):Ye(A.kind,T);if(oe.advance(m),h==="move"){if(!g||m.version!==Number(b))throw new Error("Open the latest game from the Advent post.");He(m,I)}
return f.prepare("INSERT INTO runs(day,uid,state,name) VALUES (?,?,?,?) ON CONFLICT(day,uid) DO UPDATE SET state=excluded.state,name=excluded.name").run(T,R,JSON.stringify(m),String(
i.member?.displayName||i.user.username).slice(0,60)),h==="move"?await i.deferUpdate():await i.deferReply({flags:F}),await Ne(i,A,m,!1)}if(h==="submit"){if(A.kind!=="quest")throw new Error(
"This activity is a game.");if(i.isButton()){let M=new yn().setCustomId("tf8a:submit:"+T).setTitle("Advent quest · Day "+T).addComponents(new xe().addComponents(new yt().setCustomId(
"body").setLabel("Your entry").setStyle(wt.Paragraph).setMaxLength(1e3)),new xe().addComponents(new yt().setCustomId("proof").setLabel("Screenshot or message link").setStyle(wt.Short).
setMaxLength(500).setRequired([4,6,10,16,20,22].includes(T))));return await i.showModal(M)}let g=i.fields.getTextInputValue("body").trim(),m=Et(i.fields.getTextInputValue("proof"));
if(!g)throw new Error("Write a short entry first.");if(!f.prepare("INSERT INTO entries VALUES (?,?,?,?,'pending') ON CONFLICT(day,uid) DO NOTHING").run(T,R,g,m).changes)throw new Error(
"You already submitted an entry for this day.");await i.reply({content:"Entry saved for staff review.",flags:F});try{let M=await U.channels.fetch(a);if(M?.guildId!==t||!M.isTextBased()||
M.permissionsFor(i.guild.roles.everyone)?.has(we.ViewChannel))throw new Error("Invalid private staff channel");await M.send(xt(T,R,{body:g,proof:m}))}catch{console.error("Review no\
tification failed for day "+T+". Pending entry remains in the database.")}return}if(h==="vote"){if(A.kind!=="quest"||b===R||!f.prepare("SELECT 1 FROM entries WHERE day=? AND uid=? \
AND status='approved'").get(T,b))throw new Error("Choose another member’s approved entry.");return f.prepare("INSERT INTO votes VALUES (?,?,?) ON CONFLICT(day,voter) DO UPDATE SE\
T target=excluded.target").run(T,R,b),await i.reply({content:"Vote saved. You can change it until the day closes.",flags:F})}}catch(h){let v=De(h.message||"Something went wrong.",300).
replaceAll(s,"[hidden]"),b={content:v,flags:F,allowedMentions:K};await(i.deferred?i.editReply({content:v,allowedMentions:K}):i.replied?i.followUp(b):i.reply(b)).catch(()=>{})}}).catch(
h=>console.error("Interaction:",h.message)));let X=new Map;function Ye(i,h){return oe.create(i,mt(),Date.now(),[9,13,15,17,21,23].includes(h))}function He(i,h){let v=oe.act(i,h);for(let b of Object.
keys(i))b in v||delete i[b];return Object.assign(i,v),i}async function Ne(i,h,v,b=!1){await i.editReply(await qe(h,v,b));let I=h.day+":"+i.user.id+":"+b;clearTimeout(D.get(I)),D.delete(
I);let T=v.hideAt||(v.stage==="show"?v.ready:null);if(v.phase==="playing"&&T){let A=setTimeout(()=>N(i.user.id,async()=>{let R;if(b)R=X.get(h.day+":"+i.user.id);else{let m=f.prepare(
"SELECT state FROM runs WHERE day=? AND uid=?").get(h.day,i.user.id);m&&(R=JSON.parse(m.state))}if(!R||R.phase!=="playing")return;let g=R.version;oe.advance(R),g!==R.version&&(b||f.
prepare("UPDATE runs SET state=? WHERE day=? AND uid=? AND json_extract(state,'$.version')=?").run(JSON.stringify(R),h.day,i.user.id,g),await i.editReply(await qe(h,R,b)).catch(()=>{})),
D.delete(I)}).catch(R=>console.error("Game timer:",R.message)),Math.max(50,T-Date.now()+30));A.unref(),D.set(I,A)}}U.once(gt.ClientReady,async()=>{try{let i=await U.guilds.fetch(t),
h=await U.channels.fetch(a);if(h?.guildId!==t||!h.isTextBased()||h.permissionsFor(i.roles.everyone)?.has(we.ViewChannel))throw new Error("Choose a private staff channel in the conf\
igured server.");await i.commands.create(vt.toJSON()),await i.commands.create(Tt.setDMPermission(!1).toJSON()),await i.commands.create(bt.setDMPermission(!1).toJSON()),await je(),Be=
setInterval(()=>je().catch(v=>console.error(v.message)),3e4),console.log("TF8 Advent ready.")}catch(i){console.error("TF8 Advent setup failed:",i.code||i.message),Z(),process.exitCode=
1}});let Ve=setInterval(()=>{try{f.prepare("UPDATE lease SET expires=? WHERE id=1 AND owner=?").run(Date.now()+45e3,S).changes||Z()}catch{Z()}},15e3);Ve.unref();function Z(){if(!V){
V=!0,clearInterval(Be),clearInterval(Ve);for(let i of D.values())clearTimeout(i);U.destroy();try{f.prepare("DELETE FROM lease WHERE owner=?").run(S),f.close()}catch{}}}for(let i of[
"SIGTERM","SIGINT"])process.once(i,Z);try{await U.login(s)}catch(i){throw Z(),i}return{client:U,db:f,shutdown:Z}}require.main===module&&At().catch(e=>{console.error("TF8 Advent sta\
rtup failed:",e.code||e.message),process.exitCode=1});module.exports={run:At,localSlot:Le,openDb:Mt,awardRows:Nt,commands:vt,board:$e,rankRows:ie,scoreCsv:Rt,gameBoard:qe,rankCommand:Tt,
scoreCommand:bt,acquireLease:St,_test:{games:oe,UI:Te,calendar:Ee}};
