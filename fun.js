/* ===== FUN layer: mascot, juice, rewards, garage, surprises ===== */
(()=>{const PJ=window.PJ;if(!PJ)return;const {burst,S,nm,A,mk,ja,J,snd,rnd,ctr}=PJ;
const vw=()=>innerWidth/100,vh=()=>innerHeight/100,vm=()=>Math.min(innerWidth,innerHeight)/100;
const isP=()=>typeof cur=='string'&&cur.startsWith('p_');
const sfx={fan:()=>[523,659,784,1047,1319].forEach((f,i)=>{tone(f,.35,'triangle',.16,i*.09);tone(f*2,.2,'sine',.04,i*.09)}),
 fw:()=>{tone(300,.5,'sine',.05,0,1600);setTimeout(()=>{try{bang()}catch(e){}},420)},
 yip:()=>{tone(900,.08,'sine',.15,0,1400);tone(1100,.1,'sine',.15,.1,1700)},
 pop2:()=>tone(rnd(600,1000),.08,'sine',.12,0,rnd(1400,2000)),
 choo:()=>{tone(600,.5,'square',.05,0,560);tone(750,.5,'square',.05,0,700);tone(600,.5,'square',.05,.6,560);tone(750,.5,'square',.05,.6,700)}};
/* ---- stickers ---- */
const POOL=[...PJ.VEH,'a_cat','a_chick','a_cow','a_dog','a_elephant','a_monkey','a_rabbit','a_mole','p_plane','p_heli','p_rocket','p_train','p_balloon','p_bee','p_bird','p_butterfly','p_flower','p_tree','it_ball','it_bear','it_dino','it_chest','it_apple','it_banana','it_melon','it_orange','b_house','b_school','b_tower'];
let got=[];try{got=JSON.parse(localStorage.getItem('ttg_st')||'[]')}catch(e){}
if(!got.length)got=['excavator','dump','a_dog'];const save=()=>{try{localStorage.setItem('ttg_st',JSON.stringify(got))}catch(e){}};save();
const nmx=k=>nm(k)||k;
/* ---- mascot ---- */
const M=mk('div','',`<img class="mw" src="${A('m_wave')}"><img class="mc" src="${A('m_cheer')}"><div class="bub"></div>`,document.body);M.id='mascot';
const LINES={tap:['汪汪！我是小黄狗','一起玩吧！','嘿嘿，好痒','汪！加油！','我是工程师小黄'],cheer:['太棒啦！','哇，你真厉害！','耶！成功啦！','好开心呀！','汪汪，太棒了！','宝宝真能干！'],tiny:['哇！','好棒！','嘿嘿','汪！','真好玩！']};
const pickL=k=>LINES[k][Math.floor(Math.random()*LINES[k].length)];
const bub=t=>{const b=M.querySelector('.bub');b.textContent=t;b.classList.remove('on');void b.offsetWidth;b.classList.add('on')};
const hop=(big)=>{M.animate(big?[{transform:'translateY(0) scale(1,1)'},{transform:'translateY(4%) scale(1.15,.85)'},{transform:'translateY(-45%) scale(.9,1.12) rotate(-8deg)'},{transform:'translateY(0) scale(1.12,.9)'},{transform:'translateY(-25%) rotate(8deg)'},{transform:'none'}]:[{transform:'none'},{transform:'scale(1.12,.88)'},{transform:'translateY(-18%) scale(.95,1.06)'},{transform:'none'}],{duration:big?1100:450,easing:'ease-out'})};
const cheerMode=ms=>{M.classList.add('ch');clearTimeout(M._t);M._t=setTimeout(()=>M.classList.remove('ch'),ms)};
M.addEventListener('pointerdown',e=>{e.stopPropagation();ac();hop(1);sfx.yip();say(pickL('tap'));cheerMode(1200);const[x,y]=ctr(M);burst(x,y-6*vm(),{n:10,ch:['❤️','⭐','🐾'],sp:22})});
let taps=0;
document.addEventListener('pointerdown',e=>{if(!isP())return;const t=e.target;
 /* ripple + squash on whatever got touched */
 const rp=mk('i','rip',null,document.body);rp.style.left=e.clientX+'px';rp.style.top=e.clientY+'px';setTimeout(()=>rp.remove(),500);
 const el=t.closest&&t.closest('.li,.ld-f,.sb-o,.fd-a,.mh,.pn-k,.bb,.wh-car,.dv-o,.pz-p,.pm');if(el&&!el._sq){el._sq=1;el.animate([{scale:'1'},{scale:'.86 1.12'},{scale:'1.1 .92'},{scale:'1'}],{duration:320,easing:'ease-out'}).onfinish=()=>el._sq=0}
 if(++taps%9==0&&Math.random()<.6){hop(0);bub(pickL('tiny'))}},true);
/* ---- shake ---- */
const shake=(k=1)=>{const r=PJ.root||document.body;r.animate([{translate:'0 0'},{translate:`${-1.2*k}vmin ${.6*k}vmin`},{translate:`${1.2*k}vmin ${-.6*k}vmin`},{translate:`${-.8*k}vmin 0`},{translate:'0 0'}],{duration:380})};
/* ---- win / celebration / reward ---- */
let lastWin=0,wins=0;
const fireworks=()=>{for(let i=0;i<5;i++)setTimeout(()=>{const x=rnd(15,85)*vw(),y=rnd(12,40)*vh();sfx.fw();burst(x,y,{n:30,sp:34,g:6,sz:2.6,col:['#ff5252','#ffeb3b','#69f0ae','#40c4ff','#e040fb','#ffab40'],dur:1100});burst(x,y,{n:6,ch:['✨','⭐'],sp:18})},i*330)};
function win(){const n=Date.now();if(n-lastWin<3500)return;lastWin=n;wins++;cheerMode(3200);hop(1);setTimeout(()=>hop(1),1150);bub(pickL('cheer'));sfx.fan();shake(1.4);fireworks();
 setTimeout(reward,2300)}
function reward(){if(!isP()&&cur!=='garage')return;const left=POOL.filter(k=>!got.includes(k));const k=left.length?left[Math.floor(Math.random()*left.length)]:POOL[Math.floor(Math.random()*POOL.length)];const isNew=!got.includes(k);if(isNew){got.push(k);save()}
 const c=mk('div','rwd',`<div class="rays"></div><div class="card"><img src="${A(k)}"><b>${isNew?'NEW':'⭐'}</b></div>`,document.body);
 c.querySelector('.card').animate([{transform:'scale(0) rotate(-30deg)'},{transform:'scale(1.25) rotate(8deg)'},{transform:'scale(1) rotate(0)'}],{duration:650,easing:'ease-out'});
 sfx.fan();say((isNew?'得到新贴纸：':'又一张：')+nmx(k)+'！');try{snd(k)}catch(e){}
 const done=()=>{if(c._d)return;c._d=1;const card=c.querySelector('.card'),r=card.getBoundingClientRect();card.animate([{transform:'none',opacity:1},{transform:`translate(${innerWidth-r.left-r.width/2-8*vm()}px,${innerHeight-r.top-r.height/2-6*vm()}px) scale(.15)`,opacity:.6}],{duration:700,easing:'ease-in',fill:'forwards'});c.querySelector('.rays').style.opacity=0;setTimeout(()=>c.remove(),720);badge()};
 c.addEventListener('pointerdown',e=>{e.stopPropagation();done()});setTimeout(done,2600)}
/* little sticker-count badge on screen corner */
const BG=mk('div','',`🏆<span></span>`,document.body);BG.id='stbadge';const badge=()=>{BG.querySelector('span').textContent=got.length;BG.animate([{transform:'scale(1)'},{transform:'scale(1.5)'},{transform:'scale(1)'}],500)};badge();
/* ---- garage / sticker book ---- */
function garage(){const g=$('#garage');g.innerHTML='';mk('div','lbl','我的车库',g);
 const bar=mk('div','gprog',`<i style="width:${got.length/POOL.length*100}%"></i><span>${got.length} / ${POOL.length}</span>`,g);
 const grid=mk('div','ggrid','',g);POOL.forEach(k=>{const has=got.includes(k);const c=mk('div','gs'+(has?' on':''),`<img src="${A(k)}">`,grid);
  c.addEventListener('pointerdown',e=>{e.stopPropagation();ac();if(has){try{snd(k)}catch(_){}say(nmx(k));c.animate([{transform:'scale(1)'},{transform:'scale(1.3) rotate(-6deg)'},{transform:'scale(1)'}],450);const[x,y]=ctr(c);burst(x,y,{n:12,ch:['✨','⭐','❤️'],sp:20})}else{say('玩游戏就能得到哦');c.animate([{transform:'translateX(0)'},{transform:'translateX(-6%)'},{transform:'translateX(6%)'},{transform:'none'}],350)}})});
 say('这是宝宝的车库，有'+got.length+'张贴纸啦');}
/* ---- random surprises ---- */
let sT=null;const SUR=[
 ()=>{const e=sur('rainbow','<div class="arc"></div>',{left:rnd(20,60)+'vw',top:'8vh'});e.animate([{opacity:0,transform:'scale(.6)'},{opacity:1,transform:'none'}],800);return[e,'彩虹',()=>{chime();[0,1,2].forEach(i=>setTimeout(()=>{const[x,y]=ctr(e);burst(x+rnd(-15,15)*vm(),y,{n:12,ch:['🌈','✨','⭐'],sp:24})},i*200))},9000]},
 ()=>{const e=sur('runner',`<img src="${A('a_cat')}">`,{left:'-20vmin',bottom:'2vh'});e.animate([{left:'-20vmin'},{left:'105vw'}],{duration:7000,easing:'linear',fill:'forwards'});return[e,'小猫',()=>{try{S.meow()}catch(_){}e.querySelector('img').animate(J.jump,500)},7000]},
 ()=>{const e=sur('runner',`<img src="${A('p_train')}">`,{left:'105vw',bottom:'1vh'});e.style.width='40vmin';e.animate([{left:'105vw'},{left:'-45vmin'}],{duration:8000,easing:'linear',fill:'forwards'});sfx.choo();return[e,'火车，呜呜',()=>{sfx.choo();const[x,y]=ctr(e);burst(x,y-8*vm(),{n:10,col:['#eee','#ccc'],sp:15,g:-10})},8000]},
 ()=>{const e=sur('flyer',`<img src="${A('p_balloon')}"><span class="gift">🎁</span>`,{left:'-15vmin',top:'14vh'});e.animate([{left:'-15vmin'},{left:'105vw'}],{duration:12000,easing:'linear',fill:'forwards'});return[e,'热气球送礼物啦',()=>{const g=e.querySelector('.gift');if(!g)return;const[x,y]=ctr(g);g.remove();sfx.fan();burst(x,y,{n:20,ch:['⭐','🎉','✨','🍬'],sp:28,g:12});shake(.6)},12000]},
 ()=>{const e=sur('flyer',`<img src="${A('p_rocket')}">`,{left:rnd(15,80)+'vw',bottom:'-20vmin'});e.animate([{bottom:'-20vmin'},{bottom:'110vh'}],{duration:5000,easing:'ease-in',fill:'forwards'});S.jet&&S.jet();return[e,'火箭飞上天',()=>{const[x,y]=ctr(e);burst(x,y,{n:18,ch:['🔥','✨','⭐'],sp:26});try{bang()}catch(_){}},5000]}];
function sur(cls,html,pos){const e=mk('div','surp '+cls,html,PJ.root||document.body);Object.assign(e.style,pos);return e}
function surprise(){if(!isP()||document.hidden||document.querySelector('.surp'))return;const[e,name,fx,life]=SUR[Math.floor(Math.random()*SUR.length)]();
 e.addEventListener('pointerdown',ev=>{ev.stopPropagation();ac();fx();say(name);hop(0);bub('哇！')});setTimeout(()=>e.remove(),life+200)}
const sched=()=>{clearTimeout(sT);sT=setTimeout(()=>{surprise();sched()},rnd(22000,38000))};sched();
/* ---- route hook ---- */
const o=show;show=function(id){o(id);setTimeout(()=>{document.body.dataset.p=cur;const on=isP()||cur==='garage';M.classList.toggle('on',on);BG.classList.toggle('on',isP());if(on){M.classList.remove('ch');hop(0);if(isP()&&Math.random()<.5)setTimeout(()=>bub('一起玩吧！'),400)}},60)};window.show=show;
window.FUN={win,shake,garage,surprise,reward,get got(){return got}};
})();
