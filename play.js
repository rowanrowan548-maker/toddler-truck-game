/* ===== Play modes, life layer, multitouch ===== */
(()=>{
const A=n=>'assets/'+n+'.webp',vw=()=>innerWidth/100,vh=()=>innerHeight/100,vm=()=>Math.min(innerWidth,innerHeight)/100;
const rnd=(a,b)=>a+R()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1));
const mk=(tag,cls,html,par)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html)e.innerHTML=html;if(par)par.appendChild(e);return e};
/* ---- sounds ---- */
let nb=null;function noise(d=.2,f=800,v=.2,q=1,w=0,f2){const a=ac();if(!nb){nb=a.createBuffer(1,a.sampleRate,a.sampleRate);const c=nb.getChannelData(0);for(let i=0;i<c.length;i++)c[i]=R()*2-1}const s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain(),t=a.currentTime+w;s.buffer=nb;fl.type='bandpass';fl.Q.value=q;fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(fl).connect(g).connect(master);s.start(t,R()*.5);s.stop(t+d+.05)}
const S={bonk:()=>{tone(700,.12,'square',.12,0,250);tone(1200,.2,'triangle',.12,.08,1800)},splash:()=>{noise(.45,1500,.3,.6,0,400)},chomp:()=>{[0,.18,.36].forEach(w=>noise(.1,600,.35,2,w))},scrub:()=>noise(.12,3000,.12,3),whoosh:()=>noise(.6,300,.25,.7,0,2500),dig:()=>noise(.14,250,.3,1),
 note:f=>{tone(f,.9,'triangle',.22);tone(f*2,.5,'sine',.06)},pp:()=>tone(rnd(500,900),.12,'sine',.3,0,rnd(1300,1800)),buzz:()=>tone(180,.5,'sawtooth',.05,0,220),jet:()=>noise(1.2,600,.2,.5,0,2000),chop:()=>{for(let i=0;i<6;i++)noise(.06,400,.25,1,i*.09)},
 twinkle:()=>[1568,2093,2637].forEach((f,i)=>tone(f,.25,'sine',.08,i*.08)),bark:()=>{tone(500,.09,'sawtooth',.12,0,300);tone(520,.09,'sawtooth',.12,.15,300)},meow:()=>tone(700,.45,'sine',.12,0,950),moo:()=>tone(140,.8,'sawtooth',.06,0,110),cheep:()=>{tone(3000,.06,'sine',.12,0,3800);tone(3000,.06,'sine',.12,.1,3800)},
 rumble:v=>tone(55+v*.08,.22,'sawtooth',.03)};
let lastSay=0;const sayT=(t,ms=800)=>{const n=Date.now();if(n-lastSay<ms)return;lastSay=n;say(t)};
/* ---- particles (pooled) ---- */
const PX=mk('div','',null,document.body);PX.id='px';const pool=[];for(let i=0;i<110;i++)pool.push(mk('i','',null,PX));let pi=0;
function burst(x,y,o={}){const n=Math.min(o.n||10,30);for(let k=0;k<n;k++){const e=pool[pi=(pi+1)%pool.length];if(e._a)e._a.cancel();const ch=o.ch?pick(o.ch):'';e.textContent=ch;const s=(o.sz||3)*vm()*(.7+R()*.6);e.style.cssText=`display:block;font-size:${s}px;width:${ch?'auto':s+'px'};height:${ch?'auto':s+'px'};background:${ch?'none':pick(o.col||CS)}`;
 const a=o.ang!=null?o.ang+(R()-.5)*(o.spr||1):R()*6.283,sp=(o.sp||18)*vm()*(.4+R()*.8),dx=Math.cos(a)*sp,dy=Math.sin(a)*sp+(o.g||0)*vm(),d=(o.dur||800)*(.7+R()*.6);
 e._a=e.animate([{transform:`translate(${x}px,${y}px) translate(-50%,-50%) scale(${o.s0||1})`,opacity:1},{transform:`translate(${x+dx}px,${y+dy}px) translate(-50%,-50%) scale(${o.s1??.4}) rotate(${o.rot||0}deg)`,opacity:o.o1??0}],{duration:d,easing:o.ease||'cubic-bezier(.2,.7,.4,1)',delay:(o.dl||0)*R()});e._a.onfinish=()=>{e.style.display='none';e._a=null}}}
const confetti=()=>{for(let i=0;i<4;i++)setTimeout(()=>burst(rnd(15,85)*vw(),rnd(15,45)*vh(),{n:18,sp:22,g:8,col:CS,sz:2.4}),i*250)};
const party=()=>{praise();confetti();window.FUN&&FUN.win()};
const ctr=el=>{const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2,r]};
/* ---- svgs ---- */
const SV={cloud:'<svg viewBox="0 0 120 70"><path d="M25 60a20 20 0 0 1 2-38 26 26 0 0 1 48-8 22 22 0 0 1 30 20 14 14 0 0 1-4 26z" fill="#fff" stroke="#d6eaf8" stroke-width="3"/><circle cx="48" cy="40" r="3.5" fill="#555"/><circle cx="72" cy="40" r="3.5" fill="#555"/><path d="M53 50q7 6 14 0" stroke="#555" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="40" cy="48" r="5" fill="#ffb3c1" opacity=".7"/><circle cx="80" cy="48" r="5" fill="#ffb3c1" opacity=".7"/></svg>',
 sun:'<svg viewBox="-60 -60 120 120"><g fill="#ffb300">'+[...Array(12)].map((_,i)=>`<path d="M-6 -44L0 -58 6 -44z" transform="rotate(${i*30})"/>`).join('')+'</g><circle r="36" fill="#ffd54f" stroke="#ffb300" stroke-width="4"/><circle cx="-12" cy="-6" r="4" fill="#5d4037"/><circle cx="12" cy="-6" r="4" fill="#5d4037"/><path d="M-12 10q12 12 24 0" stroke="#5d4037" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
 moon:'<svg viewBox="0 0 100 100"><path d="M60 8a42 42 0 1 0 32 66A36 36 0 0 1 60 8z" fill="#fff59d" stroke="#fbc02d" stroke-width="3"/><circle cx="42" cy="48" r="3" fill="#795548"/><path d="M36 62q8 6 16 0" stroke="#795548" stroke-width="3" fill="none"/></svg>',
 star:'<svg viewBox="-50 -50 100 100"><path d="M0-45 13-14 46-12 20 9 28 42 0 24-28 42-20 9-46-12-13-14z" fill="#ffeb3b" stroke="#fbc02d" stroke-width="4" stroke-linejoin="round"/></svg>',
 light:'<svg viewBox="0 0 40 110"><rect x="17" y="60" width="6" height="50" fill="#555"/><rect x="4" y="2" width="32" height="64" rx="8" fill="#333"/><circle class="r" cx="20" cy="15" r="9" fill="#e53935"/><circle class="y" cx="20" cy="34" r="9" fill="#5d4c10"/><circle class="g" cx="20" cy="53" r="9" fill="#1b4d1e"/></svg>',
 cone:'<svg viewBox="0 0 60 70"><path d="M24 4h12l18 56H6z" fill="#ff6d00"/><path d="M19 22h22l4 13H15zM12 45h36l3 9H9z" fill="#fff"/><rect x="2" y="58" width="56" height="9" rx="3" fill="#e65100"/></svg>',
 barrier:'<svg viewBox="0 0 120 70"><rect x="8" y="30" width="8" height="40" fill="#666"/><rect x="104" y="30" width="8" height="40" fill="#666"/><g class="arm" style="transform-origin:12px 34px;transition:transform .6s"><rect x="4" y="26" width="112" height="14" rx="4" fill="#fff" stroke="#c62828" stroke-width="2"/>'+[0,1,2,3,4].map(i=>`<path d="M${14+i*22} 26l12 0-8 14h-12z" fill="#e53935"/>`).join('')+'</g><circle cx="12" cy="33" r="6" fill="#ffca28"/></svg>',
 rock:'<svg viewBox="0 0 100 70"><path d="M8 62Q2 40 20 26 30 6 55 10 80 8 90 30 100 52 88 64z" fill="#9e9e9e" stroke="#616161" stroke-width="3"/><path d="M30 28q12-10 26-6" stroke="#e0e0e0" stroke-width="5" fill="none" stroke-linecap="round"/></svg>',
 puddle:'<svg viewBox="0 0 120 40"><ellipse cx="60" cy="22" rx="56" ry="16" fill="#64b5f6" stroke="#1e88e5" stroke-width="3"/><ellipse cx="42" cy="17" rx="16" ry="4" fill="#e3f2fd"/></svg>',
 sand:'<svg viewBox="0 0 120 60"><path d="M4 58Q30 6 60 8 92 8 116 58z" fill="#e0b25c" stroke="#b8863b" stroke-width="3"/><circle cx="40" cy="40" r="3" fill="#b8863b"/><circle cx="70" cy="30" r="3" fill="#b8863b"/><circle cx="85" cy="45" r="3" fill="#b8863b"/></svg>'};
const RAIN=mk('div','',`<svg viewBox="0 0 200 100" style="width:100%;height:100%">${['#e53935','#fb8c00','#fdd835','#43a047','#1e88e5','#5e35b1'].map((c,i)=>`<path d="M${10+i*5} 100A${90-i*5} ${90-i*5} 0 0 1 ${190-i*5} 100" stroke="${c}" stroke-width="5.5" fill="none"/>`).join('')}</svg>`,document.body);RAIN.id='rainbow';
let rbT;const rainbow=()=>{RAIN.style.opacity=.85;clearTimeout(rbT);rbT=setTimeout(()=>RAIN.style.opacity=0,6000);burst(50*vw(),20*vh(),{n:20,ch:['✨','⭐'],sp:35,sz:4})};
/* ---- names ---- */
const VEH=['bulldozer','crane','dump','excavator','fire','forklift','loader','mixer','roller','tow','water','drill'];
const NM={a_cat:'小猫',a_chick:'小鸡',a_cow:'奶牛',a_dog:'小狗',a_elephant:'大象',a_mole:'小地鼠',a_monkey:'小猴子',a_rabbit:'小兔子',f_bone:'骨头',f_carrot:'胡萝卜',f_corn:'玉米',f_fish:'小鱼',f_grass:'青草',
 it_apple:'苹果',it_ball:'皮球',it_banana:'香蕉',it_bear:'小熊',it_chest:'宝箱',it_dino:'恐龙',it_melon:'西瓜',it_orange:'橘子',p_balloon:'气球',p_bee:'小蜜蜂',p_bird:'小鸟',p_butterfly:'蝴蝶',p_flower:'小花',p_heli:'直升机',p_plane:'飞机',p_rocket:'火箭',p_train:'火车',p_tree:'大树',p_worker:'工人叔叔',b_house:'房子',b_school:'学校',b_tower:'高楼'};
const nm=k=>NM[k]||(V[k]&&V[k].n)||'';
const ASND={a_cat:S.meow,a_chick:S.cheep,a_cow:S.moo,a_dog:S.bark,a_elephant:()=>tone(300,.7,'sawtooth',.1,0,600),a_mole:boing,a_monkey:()=>{tone(900,.1,'square',.08,0,1400);tone(900,.1,'square',.08,.15,1500)},a_rabbit:boing,p_bird:tweet,p_bee:S.buzz,p_heli:S.chop,p_plane:S.jet,p_rocket:S.whoosh,p_train:()=>{tone(600,.4,'square',.07);tone(750,.4,'square',.07,.05)}};
const snd=k=>(ASND[k]||(V[k]&&V[k].s)||pop)();
/* ---- life layer ---- */
const LIFE=mk('div','',null,document.body);LIFE.id='life';
const ja=(el,kf,d=500)=>el.animate(kf,{duration:d,easing:'ease-out'});
const J={jump:[{transform:'translateY(0)'},{transform:'translateY(-35%) scale(1.1)'},{transform:'translateY(0)'}],spin:[{transform:'rotate(0)'},{transform:'rotate(360deg)'}],squash:[{transform:'scale(1)'},{transform:'scale(1.3,.7)'},{transform:'scale(.9,1.15)'},{transform:'scale(1)'}],shake:[{transform:'rotate(0)'},{transform:'rotate(10deg)'},{transform:'rotate(-10deg)'},{transform:'rotate(6deg)'},{transform:'rotate(0)'}],flip:[{transform:'scaleX(1)'},{transform:'scaleX(-1)'},{transform:'scaleX(1)'}]};
// item defs: [visual, idle, tap fx, sound, big reaction]
const runAway=(el,d)=>{const dx=(R()<.5?-1:1)*rnd(20,40)*vw();el.querySelector('.lw').animate([{transform:'translateX(0)'},{transform:`translateX(${dx}px) translateY(-20%)`,offset:.5},{transform:'translateX(0)'}],{duration:d||1600,easing:'ease-in-out'})};
const LD={
 cloud:{v:SV.cloud,i:'idle-float',fx:'squash',s:()=>noise(.3,2500,.08,1),n:'白云',t:(el,x,y)=>burst(x,y+20,{n:8,ch:['💧'],ang:1.57,spr:.6,sp:25,g:20,sz:3}),big:(el,x,y)=>{burst(x,y,{n:20,ch:['💧'],ang:1.57,spr:.9,sp:40,g:30,sz:3});rainbow();say('下雨啦！彩虹出来啦')}},
 sun:{v:SV.sun,i:'idle-spin',fx:'squash',s:boing,n:'太阳公公',t:(el,x,y)=>burst(x,y,{n:8,ch:['✨'],sp:20}),big:()=>{rainbow();say('太阳公公笑了！彩虹！')}},
 moon:{v:SV.moon,i:'idle-float',fx:'shake',s:S.twinkle,n:'月亮',t:(el,x,y)=>burst(x,y,{n:8,ch:['⭐'],sp:25,sz:2.5}),big:(el,x,y)=>{burst(x,y,{n:25,ch:['⭐','✨'],sp:45,sz:3});say('满天星星！')}},
 star:{v:SV.star,i:'idle-float',fx:'spin',s:S.twinkle,n:'星星',t:(el,x,y)=>burst(x,y,{n:6,ch:['✨'],sp:15}),big:(el,x,y)=>{el.querySelector('.lw').animate([{transform:'translate(0,0)'},{transform:`translate(${-30*vw()}px,${30*vh()}px) scale(.3)`,opacity:0},{transform:'translate(0,0)',opacity:0,offset:.95},{opacity:1}],2200);say('流星！许个愿吧')}},
 tree:{img:'p_tree',i:'idle-sway',fx:'shake',s:()=>noise(.4,1800,.15,1),n:'大树',t:(el,x,y)=>burst(x,y,{n:5,ch:['🍃'],g:15,sz:3}),big:(el,x,y)=>{burst(x,y,{n:6,ch:['🍎'],ang:1.57,spr:1.2,sp:20,g:25,sz:5,o1:1,dur:1200});say('苹果掉下来啦！')}},
 flower:{img:'p_flower',i:'idle-sway',fx:'squash',s:()=>tone(1200,.2,'sine',.1,0,1800),n:'小花',t:(el,x,y)=>burst(x,y,{n:6,ch:['🌸'],sp:18}),big:(el,x,y)=>{burst(x,y,{n:16,ch:['🌸','🌼','💮'],sp:35});say('花开啦！')}},
 bee:{img:'p_bee',i:'idle-bob',fx:'jump',s:S.buzz,n:'小蜜蜂',t:(el,x,y)=>{},big:el=>{runAway(el);say('小蜜蜂嗡嗡嗡')}},
 bird:{img:'p_bird',i:'idle-bob',fx:'jump',s:tweet,n:'小鸟',t:(el,x,y)=>burst(x,y,{n:3,ch:['🎵'],ang:-1.57,sp:15}),big:el=>{el.querySelector('.lw').animate([{transform:'none'},{transform:`translate(${20*vw()}px,${-20*vh()}px) rotate(-15deg)`,offset:.4},{transform:`translate(${-10*vw()}px,${-10*vh()}px)`,offset:.7},{transform:'none'}],2400);say('小鸟飞走又回来啦')}},
 butterfly:{img:'p_butterfly',i:'idle-float',fx:'flip',s:()=>tone(1500,.3,'sine',.08,0,2200),n:'蝴蝶',t:(el,x,y)=>burst(x,y,{n:5,ch:['✨'],sp:15}),big:el=>{runAway(el,2200);say('蝴蝶飞呀飞')}},
 balloon:{img:'p_balloon',i:'idle-float',fx:'squash',s:()=>tone(400,.2,'sine',.1,0,600),n:'气球',t:()=>{},big:(el,x,y)=>{S.pp();burst(x,y,{n:14,col:CS,sp:30});el.style.visibility='hidden';setTimeout(()=>{el.style.visibility='';ja(el,J.squash)},2500);say('啪！气球爆啦')}},
 dog:{img:'a_dog',i:'idle-bob',fx:'jump',s:S.bark,n:'小狗',t:(el,x,y)=>burst(x,y,{n:3,ch:['❤️'],ang:-1.57,sp:12}),big:el=>{runAway(el);S.bark();say('小狗跑来跑去，汪汪汪')}},
 cat:{img:'a_cat',i:'idle-bob',fx:'squash',s:S.meow,n:'小猫',t:(el,x,y)=>burst(x,y,{n:3,ch:['❤️'],ang:-1.57,sp:12}),big:el=>{ja(el.querySelector('.lw'),J.spin,800);say('小猫打个滚，喵～')}},
 cow:{img:'a_cow',i:'idle-bob',fx:'shake',s:S.moo,n:'奶牛',t:(el,x,y)=>burst(x,y,{n:4,ch:['🌿'],sp:12}),big:(el,x,y)=>{burst(x,y,{n:10,ch:['🥛'],sp:25,g:10});say('奶牛哞哞，喝牛奶')}},
 chick:{img:'a_chick',i:'idle-bob',fx:'jump',s:S.cheep,n:'小鸡',t:(el,x,y)=>burst(x,y,{n:3,ch:['🌾'],sp:10}),big:(el,x,y)=>{burst(x,y,{n:6,ch:['🥚'],ang:1.57,sp:12,g:10,o1:1});say('小鸡下蛋啦！')}},
 rabbit:{img:'a_rabbit',i:'idle-bob',fx:'jump',s:boing,n:'小兔子',t:()=>{},big:el=>{const w=el.querySelector('.lw');w.animate([{transform:'none'},{transform:'translateY(-60%)'},{transform:'none'},{transform:'translateY(-60%)'},{transform:'none'}],1000);say('小兔子蹦蹦跳')}},
 worker:{img:'p_worker',i:'idle-bob',fx:'jump',s:()=>tone(500,.2,'triangle',.1,0,700),n:'工人叔叔',t:(el,x,y)=>burst(x,y,{n:3,ch:['👋'],sp:12}),big:(el,x,y)=>{burst(x,y,{n:8,ch:['🔨','🔧'],sp:25});say('工人叔叔向你问好！')}},
 light:{v:SV.light,fx:'squash',s:()=>tone(880,.1,'sine',.1),n:'红绿灯',t:el=>{const st=el._ls=((el._ls||0)+1)%3;const s=el.querySelector('svg');s.querySelector('.r').setAttribute('fill',st==0?'#e53935':'#5b1a1a');s.querySelector('.y').setAttribute('fill',st==1?'#fdd835':'#5d4c10');s.querySelector('.g').setAttribute('fill',st==2?'#43a047':'#1b4d1e');sayT(['红灯停','黄灯等一等','绿灯行'][st],0);return 1},big:()=>{}},
 cone:{v:SV.cone,fx:'jump',s:bang,n:'路锥',t:()=>{},big:el=>{ja(el.querySelector('.lw'),J.spin,600);say('路锥翻跟头')}},
 barrier:{v:SV.barrier,fx:'squash',s:()=>tone(300,.4,'square',.05,0,500),n:'栏杆',t:el=>{const a=el.querySelector('.arm');a.style.transform='rotate(-70deg)';setTimeout(()=>a.style.transform='',1500);sayT('栏杆抬起来',0);return 1},big:()=>{}},
 rock:{v:SV.rock,fx:'shake',s:bang,n:'石头',t:(el,x,y)=>burst(x,y,{n:5,col:['#9e9e9e','#757575'],sp:15,sz:2}),big:(el,x,y)=>{burst(x,y,{n:4,ch:['💎'],sp:20,sz:4,o1:1});say('石头里有宝石！')}},
 puddle:{v:SV.puddle,fx:'squash',s:S.splash,n:'水坑',t:(el,x,y)=>burst(x,y,{n:10,col:['#64b5f6','#bbdefb'],ang:-1.57,spr:1.4,sp:20,g:20,sz:2}),big:(el,x,y)=>{burst(x,y,{n:12,ch:['🐸','💧'],ang:-1.57,sp:30});say('呱呱！小青蛙')}},
 sand:{v:SV.sand,fx:'squash',s:S.dig,n:'沙堆',t:(el,x,y)=>burst(x,y,{n:8,col:['#e0b25c','#c99a47'],ang:-1.57,sp:15,g:15,sz:2}),big:(el,x,y)=>{burst(x,y,{n:3,ch:['🐚','🦀'],sp:20,sz:4,o1:1});say('沙子里有小螃蟹！')}},
 house:{img:'b_house',fx:'squash',s:()=>[660,550].forEach((f,i)=>tone(f,.3,'sine',.12,i*.3)),n:'房子',t:(el,x,y)=>burst(x,y,{n:3,ch:['👋'],sp:10}),big:(el,x,y)=>{burst(x,y-40,{n:6,ch:['💨'],ang:-1.57,sp:20});say('叮咚！有人在家吗？')}},
 heli:{img:'p_heli',i:'idle-bob',fx:'shake',s:S.chop,n:'直升机',t:()=>{},big:el=>{runAway(el);say('直升机飞呀飞')}},
};
function makeLI(k,x,y,sz,par){const d=LD[k];const el=mk('div','li '+(d.i||''),`<div class="lw">${d.v||`<img src="${A(d.img)}" alt="">`}</div>`,par||LIFE);
 el.style.cssText=`left:${x}vw;top:${y}vh;width:${sz}vmin;height:${sz}vmin;transform:translate(-50%,-50%)`;if(R()<.5&&d.img&&k!='house')el.querySelector('.lw').style.scale='-1 1';
 el.addEventListener('pointerdown',e=>{e.stopPropagation();ac();const n=Date.now();if(n-(el._t||0)<220)return;el._t=n;const[cx,cy]=ctr(el);el._c=(el._c||0)+1;d.s();
  if(d.fx)ja(el,J[d.fx],500);const q=d.t(el,cx,cy);if(el._c>=3){el._c=0;d.big(el,cx,cy);praiseLite()}else if(!q)sayT(d.n,0)});return el}
let plT=0;const praiseLite=()=>{chime()};
let ambIV=null,ambN=0;
function ambient(list){clearInterval(ambIV);if(!list||!list.length)return;ambIV=setInterval(()=>{if(document.hidden||ambN>=3)return;spawnAmb(pick(list))},rnd(5000,8000))}
function spawnAmb(k){const isImg=k.startsWith('p_');ambN++;const ltr=R()<.5,y=rnd(5,22),sz=k=='p_train'?16:12;const el=mk('div','li',`<div class="lw"><img src="${A(k)}" alt=""></div>`,LIFE);
 el.style.cssText=`left:0;top:${y}vh;width:${sz*(k=='p_plane'||k=='p_train'?1.6:1)}vmin;height:${sz}vmin`;if(!ltr)el.querySelector('.lw').style.scale='-1 1';
 const W0=ltr?-20*vw():110*vw(),W1=ltr?110*vw():-20*vw();const a=el.animate([{transform:`translateX(${W0}px)`},{transform:`translateX(${W1}px)`}],{duration:rnd(9000,14000)});a.onfinish=()=>{el.remove();ambN--};
 el.addEventListener('pointerdown',e=>{e.stopPropagation();ac();const[x,yy]=ctr(el);snd(k);sayT(nm(k),0);burst(x,yy,{n:10,ch:['✨','⭐'],sp:25});ja(el.querySelector('.lw'),J.jump,600);a.playbackRate=2.5})}
const SKY={day:['sun','cloud','cloud','bird','butterfly','balloon'],night:['moon','star','star','star','cloud','star']};
function lifeSetup(c){LIFE.innerHTML='';ambN=0;if(!c){clearInterval(ambIV);return}
 const sky=[...(c.sky||[])];if(sky.length)while(sky.length<(c.skyN||8))sky.push(pick(['bird','butterfly','cloud','balloon']));sky.forEach((k,i)=>makeLI(k,14+i*(70/Math.max(1,sky.length-1||1))+rnd(-2,2),(c.skyY||8)+rnd(-2,3),k=='sun'||k=='moon'?13:k=='cloud'?14:9));
 (c.mid||[]).forEach(([k,x,y])=>makeLI(k,x,y,10));(c.low||[]).forEach((k,i,a)=>makeLI(k,(c.lx0??4)+i*(((c.lx1??96)-(c.lx0??4))/Math.max(1,a.length-1))+rnd(-1,1),(c.lowY||90)+rnd(-2,1),k=='tree'?16:k=='house'?16:11));
 (c.sides||[]).forEach((k,i)=>makeLI(k,i%2?95:5,(c.sy0||34)+Math.floor(i/2)*(c.sdy||16),10));
 ambient(c.amb||['p_plane','p_heli','p_balloon','p_bird','p_butterfly','p_rocket'])}
/* ---- per-pointer drag helper ---- */
function draggable(el,h){el.addEventListener('pointerdown',e=>{if(el._pid!=null||el._lock)return;e.stopPropagation();ac();el._pid=e.pointerId;try{el.setPointerCapture(e.pointerId)}catch(_){}el._sx=e.clientX;el._sy=e.clientY;el._mv=0;h.down&&h.down(e)});
 el.addEventListener('pointermove',e=>{if(e.pointerId!==el._pid)return;if(Math.hypot(e.clientX-el._sx,e.clientY-el._sy)>8)el._mv=1;h.move&&h.move(e)});
 const end=c=>e=>{if(e.pointerId!==el._pid)return;el._pid=null;try{el.releasePointerCapture(e.pointerId)}catch(_){}h.up&&h.up(e,c||!el._mv?(c?'cancel':'tap'):'drop')};
 el.addEventListener('pointerup',end(0));el.addEventListener('pointercancel',end(1));el.addEventListener('lostpointercapture',end(1))}
/* ---- mode framework ---- */
const P={},TT=[],II=[];let raf=0,curP=null,root=null;
const T=(f,ms)=>{const t=setTimeout(()=>{if(curP)f()},ms);TT.push(t);return t},IV=(f,ms)=>{const t=setInterval(()=>{if(curP&&!document.hidden)f()},ms);II.push(t);return t};
function loop(f){let last=performance.now();const fr=n=>{const dt=Math.min(50,n-last)/16.67;last=n;f(dt,n);raf=requestAnimationFrame(fr)};raf=requestAnimationFrame(fr)}
function stopMode(){if(curP&&P[curP].stop)try{P[curP].stop()}catch(e){}TT.forEach(clearTimeout);II.forEach(clearInterval);TT.length=II.length=0;cancelAnimationFrame(raf);if(root)root.innerHTML='';curP=null;try{speechSynthesis.cancel()}catch(e){}}
const hand=(x,y,par)=>{const h=mk('div','hand','👆',par||root);h.style.left=x+'vw';h.style.top=y+'vh';return h};
/* ===== 1 drive ===== */
const SCN=[{k:'city',n:'城市',v:'fire',sky:'day'},{k:'farm',n:'农场',v:'tow',sky:'day'},{k:'desert',n:'沙漠',v:'bulldozer',sky:'day'},{k:'night',n:'晚上',v:'dump',sky:'night'}];
P.p_drive={bg:'#7ec8f0',life:null,build(r){let si=0,sp=0,x=0,stars=0,objs=[],blocked=null,hold=0,nextO=60,vt;
 const w=mk('div','dv-world','',r),tl=mk('div','dv-tiles','',w),ob=mk('div','dv-objs','',w),nt=mk('div','dv-night','',r),fd=mk('div','dv-fade','',r),sb=mk('div','dv-stars','<i>⭐</i>'.repeat(5),r),vh_=mk('div','dv-veh','',r),skyL=mk('div','dv-objs','',r);skyL.style.pointerEvents='none';
 const tw=()=>innerHeight*2560/720;
 const scene=i=>{si=i%SCN.length;const s=SCN[si];tl.innerHTML=`<img src="${A('r_'+s.k)}"><img src="${A('r_'+s.k)}">`;nt.style.opacity=s.k=='night'?1:0;vt=s.v;vh_.innerHTML=`<img src="${A(vt)}">`;objs.forEach(o=>o.el.remove());objs=[];blocked=null;stars=0;[...sb.children].forEach(c=>c.classList.remove('on'));
  skyL.innerHTML='';const sk=SKY[s.sky];[...sk,'bird','cloud','butterfly','balloon','bird','cloud','star'].forEach((k,j,a)=>{makeLI(k,12+j*(76/(a.length-1)),15+R()*7,k=='cloud'?12:8,skyL)});say('开车去'+s.n+'！')};
 const O=[['star',SV.star,8,'星星'],['cone',SV.cone,9,'路锥'],['rock',SV.rock,12,'大石头'],['puddle',SV.puddle,14,'水坑'],['barrier',SV.barrier,14,'栏杆'],['star',SV.star,8,'星星'],['animal','',12,'']];
 const spawn=()=>{const d=pick(O);let html=d[1],n=d[3],a='';if(d[0]=='animal'){a=pick(['a_cow','a_chick','a_dog','a_rabbit','a_cat']);html=`<img src="${A(a)}" style="width:100%;height:100%;object-fit:contain">`;n=nm(a)}
  const el=mk('div','dv-o li',`<div class="in">${html}</div>`,ob),s=d[2];el.style.width=s*(d[0]=='puddle'||d[0]=='barrier'?1.6:1)+'vmin';el.style.height=s+'vmin';const sky=d[0]=='star'&&R()<.5;el.style.top=sky?rnd(35,55)+'vh':`calc(${d[0]=='puddle'?95:93}vh - ${s}vmin)`;
  const o={el,t:d[0],a,n,x:innerWidth+20,sky,done:0};objs.push(o);el.addEventListener('pointerdown',e=>{e.stopPropagation();ac();hitO(o,1)})};
 const hitO=(o,tap)=>{if(o.done)return;const[cx,cy]=ctr(o.el);
  if(o.t=='star'){o.done=1;S.twinkle();stars++;const st=sb.children[stars-1];st&&st.classList.add('on');sayT(NUM2[stars-1]+'颗星星',0);burst(cx,cy,{n:14,ch:['✨','⭐'],sp:25});o.el.animate([{transform:`translateX(${o.x}px) scale(1)`},{transform:`translate(${innerWidth/2}px,-60vh) scale(.3)`}],500).onfinish=()=>o.el.remove();objs=objs.filter(z=>z!=o);if(stars>=5){party();T(nextScene,2600)};return}
  if(o.t=='animal'){snd(o.a);sayT(o.n+'让一让',0);o.done=1;o.el.querySelector('.in').animate([{transform:'none'},{transform:'translateY(-30vh) rotate(20deg)'}],{duration:700,fill:'forwards'});burst(cx,cy,{n:5,ch:['❤️'],sp:15});if(blocked==o)blocked=null;return}
  if(o.t=='puddle'){S.splash();burst(cx,cy,{n:16,col:['#64b5f6','#bbdefb','#fff'],ang:-1.57,spr:1.5,sp:30,g:25,sz:2});if(tap)sayT('啪嗒，踩水坑',0);return}
  if(o.t=='barrier'){const a=o.el.querySelector('.arm');a.style.transform='rotate(-75deg)';tone(300,.4,'square',.05,0,500);sayT('栏杆抬起来',0);o.done=1;if(blocked==o)blocked=null;return}
  o.done=1;bang();sayT('推开'+o.n+'！',0);burst(cx,cy,{n:10,col:['#9e9e9e','#ff6d00','#fff59d'],sp:25});o.el.querySelector('.in').animate([{transform:'none'},{transform:`translate(${rnd(15,30)}vw,-40vh) rotate(${rnd(200,500)}deg)`,opacity:0}],{duration:900,fill:'forwards'});if(blocked==o)blocked=null};
 const NUM2=['一','两','三','四','五'];
 const nextScene=()=>{party();fd.style.opacity=1;T(()=>{scene(si+1);fd.style.opacity=0},700)};
 vh_.addEventListener('pointerdown',e=>{e.stopPropagation();ac();horn();ja(vh_,J.jump,500);sayT('嘀嘀！'+nm(vt),0);const[cx,cy]=ctr(vh_);burst(cx+15*vm(),cy-8*vm(),{n:6,ch:['🎵'],ang:-1.2,sp:20})});
 r.addEventListener('pointerdown',e=>{ac();hold++;burst(e.clientX,e.clientY,{n:5,ch:['💨'],sp:10})});const rel=()=>hold=Math.max(0,hold-1);['pointerup','pointercancel'].forEach(t=>r.addEventListener(t,rel));
 let rt=0;this._go=()=>{scene(0);this._h=hand(70,60);T(()=>this._h.remove(),4000);
  loop((dt,now)=>{const target=blocked?0:(hold?2.2:1);sp+=(target-sp)*.08*dt;const v=sp*.45*vw()*dt;x=(x+v)%tw();tl.style.transform=`translateX(${-x}px)`;
   vh_.classList.toggle('dv-run',sp>.1);if(sp>.1&&now-rt>260){rt=now;S.rumble(sp*100)}
   nextO-=v/vw();if(nextO<=0&&objs.length<6){spawn();nextO=rnd(35,60)}
   const vx=10*vw()+38*vm();for(const o of objs){if(!(o.done&&o.t!='puddle'&&o.t!='barrier'&&o.t!='animal'))o.x-=v;else if(o.t=='barrier'||o.t=='animal'||o.t=='puddle')o.x-=v;
    o.el.style.transform=`translateX(${o.x}px)`;if(!o.done&&!o.sky){if(o.t=='star'||o.t=='puddle'){if(o.x<vx-8*vm()&&o.x>vx-20*vm()){hitO(o);if(o.t=='puddle')o.done=1}}else if(o.x<vx+2*vm()&&!blocked){blocked=o;o.bt=now;sayT(o.t=='animal'?'哎呀，'+o.n+'挡路了，点一点':'前面有'+o.n+'，点一点推开它',0)}}
    if(blocked==o&&now-o.bt>4500)hitO(o)}
   objs=objs.filter(o=>{if(o.x<-30*vm()){o.el.remove();return false}return true});
   for(const o of objs)if(o.done&&o.t!='star'&&o.t!='puddle'&&o.t!='barrier'&&o.t!='animal'){}})}},
 start(){this._go()}};
/* ===== 2 dig ===== */
const ITEMS=['it_apple','it_ball','it_banana','it_bear','it_chest','it_dino','it_melon','it_orange'];
P.p_dig={bg:'linear-gradient(#8fd3ff 0 24%,#9ccc65 24%)',life:{sky:SKY.day,skyY:9,sides:['tree','dog','flower','worker','chick','tree','cone','rock'],sy0:30,sdy:17},build(r){
 const box=mk('div','','',r);box.id='dg-box';const ex=mk('div','','<img src="'+A('excavator')+'">',r);ex.id='dg-ex';ex.style.opacity=0;let its=[],cv,cx,W0,H0,lastS=0,lastC=0,found=0,round=0;
 const setup=()=>{box.innerHTML='';const b=box.getBoundingClientRect();W0=b.width;H0=b.height;found=0;its=[];const ks=shuffle([...ITEMS]).slice(0,3),sz=18*vm();
  ks.forEach((k,i)=>{const im=mk('img','dg-it','',box);im.src=A(k);const x=(i+.5)*W0/3-sz/2+rnd(-W0/12,W0/12),y=rnd(.12,.88)*H0-sz/2;im.style.left=x+'px';im.style.top=Math.max(4,Math.min(H0-sz-4,y))+'px';its.push({k,im,x,y:parseFloat(im.style.top),f:0})});
  cv=mk('canvas','','',box);cv.width=Math.round(W0/2);cv.height=Math.round(H0/2);cx=cv.getContext('2d');const g=cx.createLinearGradient(0,0,0,cv.height);g.addColorStop(0,'#a1784a');g.addColorStop(1,'#6d4c2b');cx.fillStyle=g;cx.fillRect(0,0,cv.width,cv.height);
  for(let i=0;i<260;i++){cx.fillStyle=pick(['#8d6640','#5d3f22','#b48a5a','#7a7a7a']);cx.beginPath();cx.arc(R()*cv.width,R()*cv.height,rnd(1,5),0,7);cx.fill()}
  cx.globalCompositeOperation='destination-out';cv.addEventListener('pointerdown',dn);cv.addEventListener('pointermove',mv);['pointerup','pointercancel','lostpointercapture'].forEach(t=>cv.addEventListener(t,upP));ask(round?'再挖一挖，还有宝贝':'用手指挖一挖，下面有宝贝哦')};
 const ptr={};const dn=e=>{ac();ptr[e.pointerId]=[e.clientX,e.clientY];try{cv.setPointerCapture(e.pointerId)}catch(_){}scr(e.clientX,e.clientY,e.clientX,e.clientY);ex.style.opacity=1};
 const mv=e=>{const p=ptr[e.pointerId];if(!p)return;scr(p[0],p[1],e.clientX,e.clientY);ptr[e.pointerId]=[e.clientX,e.clientY]};
 const upP=e=>{delete ptr[e.pointerId];if(!Object.keys(ptr).length)ex.style.opacity=0;check()};
 const scr=(x0,y0,x1,y1)=>{const b=cv.getBoundingClientRect(),k=cv.width/b.width;cx.lineCap='round';cx.lineWidth=11*vm()*k;cx.beginPath();cx.moveTo((x0-b.left)*k,(y0-b.top)*k);cx.lineTo((x1-b.left)*k+.1,(y1-b.top)*k);cx.stroke();
  ex.style.transform=`translate(${x1-6*vm()}px,${y1-20*vm()}px) rotate(${(x1-x0)*.3}deg)`;const n=performance.now();if(n-lastS>130){lastS=n;S.dig();burst(x1,y1,{n:4,col:['#8d6640','#5d3f22','#b48a5a'],ang:-1.57,spr:2,sp:14,g:15,sz:1.8})}if(n-lastC>350){lastC=n;check()}};
 const check=()=>{const k=cv.width/W0;its.forEach(it=>{if(it.f)return;const s=18*vm()*k,d=cx.getImageData(Math.max(0,it.x*k+s*.2),Math.max(0,it.y*k+s*.2),Math.max(1,s*.6),Math.max(1,s*.6)).data;let c=0,t=0;for(let i=3;i<d.length;i+=16){t++;if(d[i]<40)c++}
  if(c/t>.42){it.f=1;found++;it.im.classList.add('found');it.im.style.zIndex=3;const[x,y]=ctr(it.im);burst(x,y,{n:22,ch:['✨','⭐','💎'],sp:35,sz:3.5});S.twinkle();say('挖到'+nm(it.k)+'啦！');chime();
   if(found>=3)T(()=>{party();say('宝贝全挖出来啦！');T(()=>{round++;setup()},3000)},1300)}})};
 this._go=()=>{setup();T(()=>{if(!found)hand(48,58)},2500)}},start(){this._go()}};
/* ===== 3 build ===== */
const BLD=[{k:'b_house',n:'房子',w:56,h:56},{k:'b_school',n:'学校',w:60,h:60},{k:'b_tower',n:'高楼',w:46,h:62},{k:'bridge',n:'大桥',w:80,h:34}];
const bridgeSvg='<svg viewBox="0 0 200 85"><path d="M0 40h200v12H0z" fill="#e53935"/><path d="M10 52q90-60 180 0" stroke="#c62828" stroke-width="5" fill="none"/>'+[...Array(9)].map((_,i)=>`<line x1="${20+i*20}" y1="40" x2="${20+i*20}" y2="${20+Math.abs(i-4)*4}" stroke="#ef9a9a" stroke-width="3"/>`).join('')+'<rect x="20" y="52" width="14" height="33" fill="#9e9e9e"/><rect x="166" y="52" width="14" height="33" fill="#9e9e9e"/><rect x="92" y="52" width="16" height="33" fill="#9e9e9e"/><path d="M0 85q50-20 100 0t100 0v0H0z" fill="#4fc3f7"/></svg>';
const STG=[{v:'excavator',n:'挖掘机挖地基',e:'⛏️',taps:3},{v:'dump',n:'翻斗车运石头',e:'🪨',taps:2},{v:'mixer',n:'搅拌车倒水泥',e:'🧱',taps:2},{v:'crane',n:'吊车盖楼',e:'🏗️',taps:4},{v:'roller',n:'压路机压平',e:'✨',taps:2}];
P.p_build={bg:'linear-gradient(#90d5ff 0 70%,#8bc34a 70%)',life:{sky:SKY.day,skyY:20,sides:['tree','worker','cone','bird','light','dog','barrier','rock'],sy0:28,sdy:15,low:[]},build(r){let bi=0,st=0,tp=0,busy=0;
 const sp=mk('div','bd-steps','',r),gd=mk('div','bd-ground','',r),hole=mk('div','bd-hole','',r),rk=mk('div','bd-rocks','',r),sl=mk('div','bd-slab','',r),b=mk('div','bd-b','',r),pp=mk('div','bd-ppl','',r),ac_=mk('div','bd-actor','',r),cat=mk('div','bd-catch','',r);cat.style.zIndex=2;
 const steps=()=>{sp.innerHTML=STG.map((s,i)=>`<i class="${i<st?'on':i==st?'cur':''}">${s.e}</i>`).join('')+'<i class="'+(st>=STG.length?'cur':'')+'">🎉</i>'};
 const newB=()=>{const B=BLD[bi%BLD.length];st=0;tp=0;busy=0;b.innerHTML=B.k=='bridge'?bridgeSvg:`<img src="${A(B.k)}">`;b.style.width=B.w+'vmin';b.style.height=B.h+'vmin';b.style.clipPath='inset(100% 0 0 0)';b.style.filter='';hole.style.transform='translateX(-50%) scale(0)';rk.innerHTML='';sl.style.transform='translateX(-50%) scaleX(0)';pp.innerHTML='';steps();actor();ask('我们来盖'+B.n+'！'+STG[0].n+'，点一点')};
 const actor=()=>{const s=STG[st];if(!s){ac_.style.transition='transform 1s';ac_.style.transform='translateX(-50vmin)';return}ac_.innerHTML=`<img src="${A(s.v)}">`;ac_.style.transition='none';ac_.style.transform='translateX(-50vmin)';void ac_.offsetWidth;ac_.style.transition='transform 1.2s cubic-bezier(.3,1.2,.5,1)';ac_.style.transform=`translateX(${12*vw()}px)`;S.rumble(60)};
 const doTap=(x,y)=>{if(busy||st>=STG.length)return;busy=1;T(()=>busy=0,550);const s=STG[st];tp++;const im=ac_.querySelector('img');im&&im.animate([{transform:'none'},{transform:'rotate(-6deg) translateY(-1vmin)'},{transform:'none'}],500);V[s.v]&&V[s.v].s();pop(tp);
  const B=BLD[bi%BLD.length],f=tp/s.taps,[gx,gy]=ctr(hole);
  if(st==0){hole.style.transform=`translateX(-50%) scale(${f})`;burst(gx,gy,{n:14,col:['#8d6640','#5d3f22'],ang:-1.57,spr:1.4,sp:30,g:25,sz:2.5})}
  if(st==1){for(let i=0;i<5;i++){const e=mk('div','','',rk);e.innerHTML=SV.rock;e.style.cssText=`position:absolute;width:9vmin;height:7vmin;left:${rnd(0,85)}%;bottom:${rnd(0,30)}%`;e.animate([{transform:'translateY(-30vh)'},{transform:'none'}],{duration:500,easing:'ease-in'})}bang()}
  if(st==2){sl.style.transform=`translateX(-50%) scaleX(${f})`;burst(gx,gy,{n:12,col:['#bdbdbd','#9e9e9e'],sp:25,sz:2})}
  if(st==3){b.style.clipPath=`inset(${100-f*100}% 0 0 0)`;const[bx,by,rr]=ctr(b);burst(bx,rr.bottom-f*rr.height,{n:12,ch:['🧱','✨'],sp:25,sz:3})}
  if(st==4){b.style.filter='drop-shadow(0 0 3vmin #fff59d)';burst(gx,gy,{n:20,ch:['✨','⭐'],sp:40})}
  sayT(NUM[tp-1]||'',0);
  if(tp>=s.taps){st++;tp=0;steps();chime();T(()=>{if(st<STG.length){actor();say(STG[st].n+'，点一点')}else{actor();party();say(B.n+'盖好啦！');rk.innerHTML='';pp.innerHTML=[10,30,62,82].map(x=>`<img src="${A(pick(['p_worker','a_dog','a_cat','p_worker']))}" style="left:${x}%">`).join('');[...pp.children].forEach((e,i)=>e.animate([{transform:'translateY(0)'},{transform:'translateY(-3vmin)'},{transform:'translateY(0)'}],{duration:500,iterations:6,delay:i*120}));T(()=>{bi++;newB()},5500)}},900)}};
 cat.addEventListener('pointerdown',e=>{ac();doTap(e.clientX,e.clientY)});
 this._go=()=>{newB();T(()=>{if(st==0&&tp==0)hand(55,60)},3000)}},start(){this._go()}};
/* ===== 4 wash ===== */
const TOOLS=[{e:'🧽',n:'打泡泡，擦一擦'},{e:'🚿',n:'冲冲水'},{e:'💨',n:'吹干它'},{e:'✨',n:'点一点，亮晶晶'}];
P.p_wash={bg:'linear-gradient(#b3e5fc 0 75%,#90a4ae 75%)',life:{sky:['sun','cloud','bird','cloud'],skyY:6,sides:['puddle','dog','flower','cat','tree','chick','light','worker'],sy0:28,sdy:15},build(r){let ti=0,spots=[],dry=0,shine=0,busy=0,lastS=0;
 mk('div','ws-shed','',r);const car=mk('div','','',r);car.id='ws-car';const tool=mk('div','ws-tool','',r),cur_={};let vt;
 const newCar=()=>{vt=pick(VEH.filter(v=>v!='drill'));car.innerHTML=`<img src="${A(vt)}">`;car.className='';car.getAnimations().forEach(a=>a.cancel());ti=0;dry=0;shine=0;busy=0;spots=[];
  for(let i=0;i<9;i++){const m=mk('div','mud','',car),s=rnd(9,15);m.style.cssText=`left:${rnd(15,85)}%;top:${rnd(25,80)}%;width:${s}vmin;height:${s}vmin`;spots.push({el:m,h:0,st:0})}
  car.animate([{transform:'translateX(-80vw)'},{transform:'none'}],{duration:1100,easing:'cubic-bezier(.3,1.2,.5,1)'});S.rumble(60);setTool()};
 const setTool=()=>{const t=TOOLS[ti];tool.textContent=t.e;ask(ti==0?nm(vt)+'脏脏的，'+t.n:t.n)};
 tool.addEventListener('pointerdown',e=>{e.stopPropagation();ac();ja(tool,J.squash);say(TOOLS[ti].n)});
 const act_=(x,y)=>{if(busy)return;const n=performance.now(),cr=car.getBoundingClientRect();const inC=x>cr.left&&x<cr.right&&y>cr.top&&y<cr.bottom;
  if(ti==0||ti==1){if(n-lastS>140){lastS=n;ti==0?S.scrub():S.splash();burst(x,y,ti==0?{n:3,ch:['🫧'],sp:12,sz:3}:{n:5,col:['#4fc3f7','#b3e5fc'],ang:1.57,spr:.8,sp:18,g:15,sz:1.6})}
   spots.forEach(s=>{if(s.st!=ti)return;const[mx,my]=ctr(s.el);if(Math.hypot(mx-x,my-y)<9*vm()){s.h++;s.el.style.transform=`translate(-50%,-50%) scale(${1-s.h*.04})`;if(s.h>=8){s.h=0;s.st++;if(ti==0){s.el.classList.add('foam');s.el.style.transform='translate(-50%,-50%) scale(1.15)'}else{s.el.style.opacity=0}pop(spots.filter(z=>z.st>ti).length)}}});
   if(spots.every(s=>s.st>ti)){busy=1;chime();say(ti==0?'泡泡满满！':'冲干净啦！');if(ti==1)car.classList.add('wet');T(()=>{ti++;busy=0;setTool()},1200)}}
  else if(ti==2){if(n-lastS>160){lastS=n;noise(.25,1200,.12,.5);burst(x,y,{n:3,ch:['💨'],sp:20,sz:3})}if(inC){dry++;if(dry>60){busy=1;car.classList.remove('wet');chime();say('吹干啦！');T(()=>{ti++;busy=0;setTool()},1200)}}}};
 const tapShine=(x,y)=>{if(ti!=3||busy)return;S.twinkle();burst(x,y,{n:12,ch:['✨','⭐'],sp:25});shine++;if(shine>=4){busy=1;car.classList.add('shine');party();say(nm(vt)+'洗得亮晶晶！');T(()=>{car.animate([{transform:'none'},{transform:'translateX(90vw)'}],{duration:1000,easing:'ease-in',fill:'forwards'});horn()},2200);T(newCar,3400)}};
 r.addEventListener('pointerdown',e=>{ac();try{r.setPointerCapture(e.pointerId)}catch(_){}const c=mk('div','cur-tool',TOOLS[ti].e,r);c.style.left=e.clientX+'px';c.style.top=e.clientY+'px';cur_[e.pointerId]=c;tapShine(e.clientX,e.clientY);act_(e.clientX,e.clientY)});
 r.addEventListener('pointermove',e=>{const c=cur_[e.pointerId];if(!c)return;c.style.left=e.clientX+'px';c.style.top=e.clientY+'px';c.textContent=TOOLS[ti].e;if(ti<3)act_(e.clientX,e.clientY)});
 const end=e=>{const c=cur_[e.pointerId];if(c){c.remove();delete cur_[e.pointerId]}};['pointerup','pointercancel','lostpointercapture'].forEach(t=>r.addEventListener(t,end));
 this._go=()=>{newCar();T(()=>hand(50,50),2500);T(()=>{const h=r.querySelector('.hand');h&&h.remove()},6000)}},start(){this._go()}};
/* ===== 5 load ===== */
const FRUIT=['it_apple','it_banana','it_orange','it_melon','it_ball','it_bear'];
P.p_load={bg:'linear-gradient(#a5d8ff 0 62%,#c5e1a5 62%)',life:{sky:SKY.day,skyY:8,sides:['tree','cow','house','worker'],low:['flower','chick','rabbit','flower','dog'],lowY:93,lx0:16,lx1:44},build(r){let n=0,busy=0,cnt=0;const NEED=5;
 mk('div','ld-pile','',r);const dest=mk('div','ld-dest','🏔️',r),tr=mk('div','','',r);tr.id='ld-truck';tr.innerHTML=`<div class="tk"><img class="t" src="${A('dump')}"><div class="ld-bed"></div></div>`;const bed=tr.querySelector('.ld-bed'),tk=tr.querySelector('.tk');
 const spawnF=()=>{for(let i=r.querySelectorAll('.ld-f').length;i<NEED-n;i++){const k=pick(FRUIT),f=mk('div','ld-f',`<img src="${A(k)}">`,r);f._k=k;const hx=rnd(4,40),hy=rnd(55,80);f.style.left=hx+'vw';f.style.top=hy+'vh';f._hx=hx;f._hy=hy;f.animate([{transform:'scale(0)'},{transform:'scale(1.2)'},{transform:'scale(1)'}],400);
  draggable(f,{down:e=>{if(busy){return}f.classList.add('drag');f._ox=e.clientX-f.offsetLeft;f._oy=e.clientY-f.offsetTop;pop(1)},move:e=>{f.style.left=e.clientX-f._ox+'px';f.style.top=e.clientY-f._oy+'px'},
   up:(e,how)=>{f.classList.remove('drag');const tb=tr.getBoundingClientRect(),[fx,fy]=ctr(f);if(!busy&&(how=='tap'||(fx>tb.left-5*vm()&&fx<tb.right&&fy>tb.top-10*vm()&&fy<tb.bottom)))into(f);else{f.style.transition='left .4s,top .4s';f.style.left=f._hx+'vw';f.style.top=f._hy+'vh';T(()=>f.style.transition='',450)}}})}};
 const into=f=>{if(busy||n>=NEED){return}n++;const[fx,fy]=ctr(f);const bb=bed.getBoundingClientRect();f.remove();const im=mk('img','',null,bed);im.src=A(f._k);const PS=[[2,20],[34,20],[66,20],[18,-45],[50,-45],[34,-100]][n-1]||[34,-100];im.style.left=PS[0]+'%';im.style.top=PS[1]+'%';im.style.zIndex=n;
  im.animate([{transform:`translate(${fx-bb.left-6*vm()}px,${fy-bb.top-6*vm()}px)`},{transform:'translateY(-4vmin)',offset:.7},{transform:'none'}],{duration:500,easing:'ease-out'});pop(n);bang();say(NUM[n-1]+'，'+nm(f._k));ja(tk,J.squash,400);burst(bb.left+bb.width/2,bb.top,{n:8,ch:['✨'],sp:15});
  if(n>=NEED){busy=1;T(go,1300)}};
 const go=()=>{say('装满啦，出发！');horn();tr.animate([{transform:'none'},{transform:'translateX(60vw)'}],{duration:1200,easing:'ease-in',fill:'forwards'});S.rumble(80);
  T(()=>{tr.style.right='auto';tr.style.left='-60vmin';tr.getAnimations().forEach(a=>a.cancel());tr.animate([{transform:'none'},{transform:`translateX(${60*vmin_()+26*vw()}px)`}],{duration:1500,easing:'ease-out',fill:'forwards'})},1500);
  T(()=>{tk.style.transition='transform .8s';tk.style.transform='rotate(-25deg)';V.dump.s();dest.style.opacity=1;const bb=bed.getBoundingClientRect();[...bed.children].forEach((im,i)=>im.animate([{transform:'none'},{transform:`translate(${-20*vmin_()}px,${25*vh()}px) rotate(-90deg)`,opacity:0}],{duration:700,delay:i*80,fill:'forwards'}));burst(bb.left,bb.bottom,{n:16,col:['#c8a46e','#a1887f'],ang:2.4,sp:30,g:20})},3200);
  T(()=>{party();cnt++;say('倒好啦！一共'+NUM[NEED-1]+'个');tk.style.transform='';},4300);
  T(()=>{tr.getAnimations().forEach(a=>a.cancel());tr.style.left='';tr.style.right='5vw';dest.style.opacity=0;bed.innerHTML='';n=0;busy=0;tr.animate([{transform:'translateX(70vw)'},{transform:'none'}],{duration:1000,easing:'ease-out'});spawnF();ask('再装五个！')},6800)};
 const vmin_=()=>vm();
 this._go=()=>{spawnF();ask('把东西拖到翻斗车上，装五个');T(()=>hand(20,70),2500);T(()=>{const h=r.querySelector('.hand');h&&h.remove()},7000)}},start(){this._go()}};
/* ===== 6 sandbox ===== */
const SBK=[...VEH.filter(v=>v!='drill'),'a_cat','a_chick','a_cow','a_dog','a_elephant','a_monkey','a_rabbit','p_tree','p_flower','p_balloon','p_rocket','it_ball','it_bear','it_dino','b_house'];
P.p_sand={bg:'linear-gradient(#9be0ff 0 55%,#f2d38f 55%)',life:{sky:['sun','cloud','cloud','bird'],skyY:7,sides:['tree','tree','sand','puddle','cow','dog','chick','rock'],sy0:30},build(r){const ob=[];let sb_n=0,night=0,rain=0,rainIV=null;
 const cat=mk('div','sb-catch','',r),tg1=mk('div','sb-tg','🌙',r),tg2=mk('div','sb-tg','🌧️',r);tg1.style.left='30vw';tg2.style.left='60vw';tg1.style.top=tg2.style.top='83vh';
 const ov=mk('div','dv-night','',r);ov.style.background='rgba(10,20,70,.45)';
 tg1.addEventListener('pointerdown',e=>{e.stopPropagation();ac();night=!night;ov.style.opacity=night?1:0;tg1.textContent=night?'☀️':'🌙';say(night?'天黑啦，晚安':'天亮啦！');night?S.twinkle():chime();ja(tg1,J.spin)});
 tg2.addEventListener('pointerdown',e=>{e.stopPropagation();ac();rain=!rain;tg2.textContent=rain?'🌈':'🌧️';ja(tg2,J.spin);if(rain){say('下雨啦');rainIV=IV(()=>burst(rnd(0,100)*vw(),-10,{n:6,ch:['💧'],ang:1.57,spr:.2,sp:90,sz:2.5,dur:1200,o1:.8}),220)}else{clearInterval(rainIV);rainbow();say('雨停了，彩虹出来啦')}});
 const add=(x,y)=>{const k=pick(SBK),isV=VEH.includes(k),s=(isV?24:k=='b_house'?24:16)*vm(),el=mk('div','sb-o',`<img src="${A(k)}">`,r);el.style.width=s+'px';el.style.height=(isV?s*.75:s)+'px';el._x=x-s/2;el._y=y-s/2;el.style.transform=`translate(${el._x}px,${el._y}px)`;
  el.animate([{scale:'0'},{scale:'1.25'},{scale:'1'}],{duration:450,easing:'ease-out'});ob.push(el);snd(k);sayT(nm(k),0);burst(x,y,{n:12,col:CS,sp:22,sz:2});if(++sb_n%12==0)T(party,600);
  if(ob.length>14){const o=ob.shift();o.animate([{opacity:1},{opacity:0,scale:'.3'}],400).onfinish=()=>o.remove()}
  draggable(el,{down:e=>{el._ox=e.clientX-el._x;el._oy=e.clientY-el._y;el.style.zIndex=5},move:e=>{el._x=e.clientX-el._ox;el._y=e.clientY-el._oy;el.style.transform=`translate(${el._x}px,${el._y}px)${isV&&e.movementX<0?' scaleX(-1)':''}`;if(isV&&R()<.1)S.rumble(50)},
   up:(e,how)=>{el.style.zIndex='';if(how=='tap'){snd(k);sayT(nm(k),0);ja(el.querySelector('img'),pick([J.jump,J.squash,J.spin]),600);const[cx,cy]=ctr(el);burst(cx,cy,{n:8,ch:['✨','⭐','❤️'],sp:20})}}})};
 cat.addEventListener('pointerdown',e=>{ac();add(e.clientX,e.clientY)});
 this._go=()=>{ask('点一点，变出好多东西！');hand(50,55);T(()=>{const h=r.querySelector('.hand');h&&h.remove()},4000)}},start(){this._go()}};
/* ===== 7 mole ===== */
const MOLES=['a_mole','a_mole','a_rabbit','a_chick','a_cat','a_dog','a_monkey'];
P.p_mole={bg:'linear-gradient(#a7dcff 0 30%,#7cb342 30%)',life:{sky:SKY.day,skyY:8,skyN:11,sides:['tree','flower','butterfly','tree'],sy0:30},build(r){const H=[];let hits=0;
 [[25,52],[50,52],[75,52],[37,82],[63,82],[12,82],[88,82]].slice(0,innerWidth>innerHeight?7:5).forEach(([x,y])=>{const h=mk('div','ml-hole','<div class="back"></div><div class="clip"><div class="cr"><img></div></div><div class="front"></div>',r);h.style.left=x+'vw';h.style.top=y+'vh';H.push(h);
  h.querySelector('.cr').addEventListener('pointerdown',e=>{e.stopPropagation();ac();if(!h.classList.contains('up')||h._hit)return;h._hit=1;h.classList.add('hit');S.bonk();snd(h._k);const[x,y]=ctr(h);burst(x,y-10*vm(),{n:12,ch:['⭐','💫','✨'],sp:25,sz:3});hits++;sayT(hits%10==0?'':nm(h._k),0);if(hits%10==0)party();T(()=>{h.classList.remove('up','hit')},450)})});
 const popUp=()=>{const free=H.filter(h=>!h.classList.contains('up'));if(!free.length)return;const h=pick(free);h._k=pick(MOLES);h._hit=0;h.querySelector('img').src=A(h._k);h.classList.add('up');tone(500,.12,'sine',.08,0,900);T(()=>{if(!h._hit)h.classList.remove('up')},rnd(1600,2600))};
 this._go=()=>{ask('谁从洞里钻出来了？快点它！');T(()=>{popUp();IV(()=>{popUp();if(R()<.35)popUp()},1000)},1200)}},start(){this._go()}};
/* ===== 8 bubbles ===== */
P.p_bub={bg:'linear-gradient(#4fc3f7,#b3e5fc 60%,#fff9c4)',life:{sky:['sun','cloud','cloud'],skyY:7,sides:['flower','chick','rabbit','dog','cat','tree','flower','bird'],sy0:30},build(r){let B=[],cnt=0;
 const mkB=()=>{if(B.length>=14)return;const s=rnd(12,22)*vm(),el=mk('div','bb','',r),k=R()<.5?pick([...FRUIT,'a_chick','a_cat','a_dog','p_bird','p_butterfly']):'';if(k)el.innerHTML=`<img src="${A(k)}">`;el.style.width=el.style.height=s+'px';
  const b={el,k,s,x:rnd(0,innerWidth-s),y:innerHeight+s,vy:rnd(.6,1.4)*vh()*.25,ph:R()*6};B.push(b);el.addEventListener('pointerdown',e=>{e.stopPropagation();ac();popB(b)})};
 const popB=b=>{if(b.p)return;b.p=1;cnt++;const x=b.x+b.s/2,y=b.y+b.s/2;S.pp();burst(x,y,{n:14,col:['#e1f5fe','#b3e5fc','#f8bbd0','#fff'],sp:22,sz:1.6,dur:500});
  if(b.k){sayT(nm(b.k),0);snd(b.k);const im=b.el.querySelector('img');b.el.style.background='none';b.el.style.boxShadow='none';im.animate([{transform:'none'},{transform:`translateY(${innerHeight-y}px) rotate(360deg)`,opacity:.2}],{duration:1200,easing:'ease-in'}).onfinish=()=>rm(b)}else{b.el.style.display='none';rm(b)}
  if(cnt%15==0){party();say('哇，戳了好多泡泡！')}};
 const rm=b=>{b.el.remove();B=B.filter(z=>z!=b)};
 this._go=()=>{ask('戳泡泡！用好多手指一起戳');for(let i=0;i<6;i++)T(mkB,i*300);IV(mkB,650);loop((dt,n)=>{for(const b of B){if(b.p)continue;b.y-=b.vy*dt;b.ph+=.03*dt;b.el.style.transform=`translate(${b.x+Math.sin(b.ph)*3*vw()}px,${b.y}px)`;if(b.y<-b.s)rm(b)}})}},start(){this._go()}};
/* ===== 9 feed ===== */
const FEED=[['a_dog','f_bone'],['a_cow','f_grass'],['a_rabbit','f_carrot'],['a_cat','f_fish'],['a_chick','f_corn'],['a_monkey','it_banana'],['a_elephant','it_melon']];
P.p_feed={bg:'linear-gradient(#b3e5fc 0 40%,#aed581 40%)',life:{sky:SKY.day,skyY:8,sides:['tree','flower','bee','tree','house','cow','dog','chick'],sy0:30,sdy:14},build(r){let set=[],fed=0;
 mk('div','fd-tray','',r);
 const round=()=>{r.querySelectorAll('.fd-a,.fd-f').forEach(e=>e.remove());fed=0;set=shuffle([...FEED]).slice(0,3);
  set.forEach(([a,f],i)=>{const el=mk('div','fd-a',`<img src="${A(a)}"><span class="fed">😋</span>`,r);el.style.left=(22+i*28)+'vw';el.style.top='42vh';el._a=a;el._f=f;el.animate([{transform:'translate(-50%,40vh)'},{transform:'translate(-50%,-50%)'}],{duration:600+i*150,easing:'cubic-bezier(.3,1.3,.5,1)'});
   el.addEventListener('pointerdown',e=>{e.stopPropagation();ac();snd(a);sayT(el.classList.contains('done')?nm(a)+'吃饱啦':nm(a)+'饿了，想吃'+nm(f),0);ja(el.querySelector('img'),J.jump)})});
  shuffle(set.map(s=>s[1])).forEach((f,i)=>{const el=mk('div','fd-f',`<img src="${A(f)}">`,r),hx=32+i*14;el.style.left=hx+'vw';el.style.top='81vh';el._f=f;el._hx=hx;
   draggable(el,{down:e=>{el._ox=e.clientX-el.offsetLeft;el._oy=e.clientY-el.offsetTop;sayT(nm(f),0);pop(2)},move:e=>{el.style.left=e.clientX-el._ox+'px';el.style.top=e.clientY-el._oy+'px'},
    up:(e,how)=>{const[fx,fy]=ctr(el);let tgt=null;r.querySelectorAll('.fd-a').forEach(a=>{const[ax,ay]=ctr(a);if(Math.hypot(ax-fx,ay-fy)<15*vm())tgt=a});
     if(how=='tap'){const a=[...r.querySelectorAll('.fd-a')].find(a=>a._f==f);if(a){const[ax,ay]=ctr(a);el.style.transition='left .6s,top .6s';el.style.left=ax-7.5*vm()+'px';el.style.top=ay-7.5*vm()+'px';T(()=>eat(a,el),650)};return}
     if(tgt&&tgt._f==f)eat(tgt,el);else{if(tgt){ja(tgt.querySelector('img'),J.shake,600);say(nm(tgt._a)+'不吃'+nm(f)+'，再试试看～');tone(660,.2,'sine',.1);tone(880,.25,'sine',.1,.15)}el.style.transition='left .4s,top .4s';el.style.left=el._hx+'vw';el.style.top='81vh';T(()=>el.style.transition='',450)}}})});
  ask('小动物饿啦，把吃的拖给它们')};
 const eat=(a,f)=>{if(a.classList.contains('done'))return;f.remove();a.classList.add('done');S.chomp();snd(a._a);const[x,y]=ctr(a);burst(x,y,{n:12,ch:['❤️','💕','✨'],ang:-1.57,spr:1.5,sp:25});ja(a.querySelector('img'),J.squash,700);say(nm(a._a)+'吃'+nm(a._f)+'，真好吃！');fed++;
  if(fed>=3)T(()=>{party();say('都吃饱啦！');T(round,2600)},1400)};
 this._go=()=>{round();T(()=>{if(!fed)hand(38,85)},3000)}},start(){this._go()}};
/* ===== 10 puzzle ===== */
P.p_puz={bg:'linear-gradient(#ffe0b2,#ffccbc)',life:{sky:['sun','cloud','bird','cloud','balloon'],skyY:7,sides:['tree','dog','cat','flower','rabbit','chick','tree','cow'],sy0:30},build(r){let lvl=0,done=0,pcs=[];
 const box=mk('div','pz-box','',r);
 const round=()=>{r.querySelectorAll('.pz-p').forEach(e=>e.remove());done=0;const k=pick(VEH.filter(v=>v!='drill')),n=lvl%3==0?2:3;const W_=60*vm(),H_=45*vm();
  box.style.cssText=`left:${50*vw()-W_/2}px;top:${17*vh()}px;width:${W_}px;height:${H_}px`;box.innerHTML=`<img src="${A(k)}">`+[...Array(n-1)].map((_,i)=>`<div class="ln" style="left:${(i+1)*100/n}%"></div>`).join('');
  const bx=50*vw()-W_/2,by=17*vh(),pw=W_/n;pcs=[];
  for(let i=0;i<n;i++){const p=mk('div','pz-p','',r);p.style.cssText=`width:${pw}px;height:${H_}px;background-image:url(${A(k)});background-size:${W_}px ${H_}px;background-position:${-i*pw}px 0`;
   const tx=bx+i*pw,ty=by,hx=(i+.5)*innerWidth/n-pw/2+rnd(-3,3)*vw(),hy=innerHeight-H_*.62-3*vh();const o={p,tx,ty,hx,hy,ok:0};pcs.push(o);put(o,hx,hy);p.style.scale='.62';
   draggable(p,{down:e=>{if(o.ok)return;p._ox=e.clientX-o.x;p._oy=e.clientY-o.y;p.style.scale='1';p.style.zIndex=8;pop(i)},move:e=>{if(o.ok)return;put(o,e.clientX-p._ox,e.clientY-p._oy)},
    up:(e,how)=>{if(o.ok)return;p.style.zIndex='';if(how=='tap'||Math.hypot(o.x-tx,o.y-ty)<14*vm()){p.style.transition='transform .35s';put(o,tx,ty);T(()=>p.style.transition='',380);o.ok=1;p.classList.add('ok');bang();chime();burst(tx+pw/2,ty+H_/2,{n:10,ch:['✨'],sp:20});done++;sayT(NUM[done-1]+'块',0);
      if(done>=n)T(()=>{V[k].s();box.animate([{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],600);party();say('拼好啦！是'+nm(k)+'！');T(()=>{lvl++;round()},3200)},400)}
     else{p.style.transition='transform .4s';p.style.scale='.62';put(o,hx,hy);T(()=>p.style.transition='',420)}}})}
  ask('拼一拼，把小块放回去')};
 const put=(o,x,y)=>{o.x=x;o.y=y;o.p.style.transform=`translate(${x}px,${y}px)`};
 this._go=()=>{round();T(()=>{if(!done)hand(28,80)},3000)}},start(){this._go()}};
/* ===== 11 draw ===== */
const PAL=[['#e53935','红色'],['#fb8c00','橙色'],['#fdd835','黄色'],['#43a047','绿色'],['#1e88e5','蓝色'],['#8e24aa','紫色'],['#ec407a','粉色'],['#6d4c41','棕色']];
P.p_draw={bg:'linear-gradient(#fff3e0,#ffe0b2)',life:{sky:['sun','cloud','cloud','bird','butterfly'],skyY:6,sides:[],low:[],mid:[['flower',4,92],['chick',11,92],['cat',89,92],['dog',96,92],['tree',3,40],['rabbit',97,40],['bee',3,62],['butterfly',97,62]]},build(r){let col=PAL[0],ink=0,pi_=0;const pics=[...VEH.filter(v=>v!='drill'),'a_dog','a_cat','p_tree','b_house'];
 const pic=mk('img','',null,r);pic.id='dw-pic';const cv=mk('canvas','',null,r);cv.id='dw-cv';const pal=mk('div','dw-pal','',r);let c2,k=1,ptr={};
 PAL.forEach((p,i)=>{const d=mk('i',i?'':'sel','',pal);d.style.background=p[0];d.addEventListener('pointerdown',e=>{e.stopPropagation();ac();col=p;pal.querySelectorAll('i').forEach(z=>z.classList.remove('sel'));d.classList.add('sel');say(p[1]);tone(500+i*80,.2,'triangle',.15)})});
 const done_=mk('i','','⭐',pal);done_.style.background='#fff';done_.addEventListener('pointerdown',e=>{e.stopPropagation();ac();if(ink<20){say('多画一点再点星星哦');return}party();say('画得真漂亮！');cv.animate([{transform:'rotate(0)'},{transform:'rotate(-2deg) scale(1.03)'},{transform:'rotate(0)'}],800);T(newPic,2600)});
 const newPic=()=>{const b=cv.getBoundingClientRect();k=Math.min(2,devicePixelRatio||1);cv.width=b.width*k;cv.height=b.height*k;c2=cv.getContext('2d');c2.lineCap=c2.lineJoin='round';ink=0;pic.src=A(pics[pi_++%pics.length]);ask('选个颜色，画一画'+nm(pics[(pi_-1)%pics.length]))};
 cv.addEventListener('pointerdown',e=>{ac();try{cv.setPointerCapture(e.pointerId)}catch(_){}ptr[e.pointerId]=[e.clientX,e.clientY];line(e.clientX,e.clientY,e.clientX+.1,e.clientY)});
 cv.addEventListener('pointermove',e=>{const p=ptr[e.pointerId];if(!p)return;line(p[0],p[1],e.clientX,e.clientY);ptr[e.pointerId]=[e.clientX,e.clientY]});
 ['pointerup','pointercancel','lostpointercapture'].forEach(t=>cv.addEventListener(t,e=>delete ptr[e.pointerId]));
 let ls=0;const line=(x0,y0,x1,y1)=>{const b=cv.getBoundingClientRect();c2.strokeStyle=col[0];c2.lineWidth=3.2*vm()*k;c2.beginPath();c2.moveTo((x0-b.left)*k,(y0-b.top)*k);c2.lineTo((x1-b.left)*k,(y1-b.top)*k);c2.stroke();ink+=Math.hypot(x1-x0,y1-y0)/50;
  const n=performance.now();if(n-ls>120){ls=n;tone(300+(1-y1/innerHeight)*900,.1,'sine',.05);if(R()<.3)burst(x1,y1,{n:2,ch:['✨'],sp:8,sz:2})}};
 this._go=()=>{newPic();T(()=>{if(ink<1)hand(50,50)},2500);T(()=>{const h=r.querySelector('.hand');h&&h.remove()},6000)}},start(){this._go()}};
/* ===== 12 piano ===== */
const KEYS=[[262,'#e53935','a_cow'],[294,'#fb8c00','a_dog'],[330,'#fdd835','a_chick'],[349,'#43a047','a_rabbit'],[392,'#00acc1','a_cat'],[440,'#1e88e5','a_monkey'],[494,'#8e24aa','a_elephant'],[523,'#ec407a','p_bird']];
const SONG=[0,0,4,4,5,5,4,-1,3,3,2,2,1,1,0];
P.p_piano={bg:'linear-gradient(#e1bee7,#f8bbd0)',life:{sky:['sun','cloud','star','cloud','balloon','bird'],skyY:9,sides:[],mid:[['chick',18,30],['dog',28,28],['rabbit',72,28],['cat',82,30],['tree',92,26],['bee',38,30],['butterfly',62,30]]},build(r){const kw=mk('div','pn-keys','',r),song=mk('div','pn-song','🎵',r);let ks=[],ptrK={},plays=0,playing=0;
 KEYS.forEach(([f,c,a],i)=>{const k=mk('div','pn-k',`<img src="${A(a)}">`,kw);k.style.background=`linear-gradient(${c},${c}cc)`;k._i=i;ks.push(k)});
 const hit=i=>{const k=ks[i];if(!k)return;const[f,,a]=KEYS[i];S.note(f);k.classList.add('dn');setTimeout(()=>k.classList.remove('dn'),180);const[x,y]=ctr(k);burst(x,y-12*vm(),{n:3,ch:['🎵','🎶','♪'],ang:-1.57,spr:.8,sp:22,sz:3.5,col:[KEYS[i][1]]});
  ja(k.querySelector('img'),J.jump,400);plays++;if(plays%30==0){party();say('宝宝是小音乐家！')}else if(R()<.15)sayT(nm(a),0)};
 const keyAt=(x,y)=>{const el=document.elementFromPoint(x,y);const k=el&&el.closest&&el.closest('.pn-k');return k?k._i:-1};
 kw.addEventListener('pointerdown',e=>{ac();try{kw.setPointerCapture(e.pointerId)}catch(_){}const i=keyAt(e.clientX,e.clientY);ptrK[e.pointerId]=i;if(i>=0)hit(i)});
 kw.addEventListener('pointermove',e=>{if(!(e.pointerId in ptrK))return;const i=keyAt(e.clientX,e.clientY);if(i>=0&&i!==ptrK[e.pointerId]){ptrK[e.pointerId]=i;hit(i)}});
 ['pointerup','pointercancel','lostpointercapture'].forEach(t=>kw.addEventListener(t,e=>delete ptrK[e.pointerId]));
 song.addEventListener('pointerdown',e=>{e.stopPropagation();ac();if(playing)return;playing=1;say('一闪一闪亮晶晶');ja(song,J.spin);SONG.forEach((n,j)=>T(()=>{if(n>=0)hit(n)},1200+j*420));T(()=>{playing=0;say('宝宝来弹一弹')},1400+SONG.length*420)});
 this._go=()=>{ask('弹钢琴啦！手指滑一滑');T(()=>{if(!plays)hand(30,70)},2500);T(()=>{const h=r.querySelector('.hand');h&&h.remove()},6000)}},start(){this._go()}};
/* ===== menu / learn / routing ===== */
const MENU=[['p_drive','开车跑跑','fire','#ef5350,#c62828'],['p_dig','挖宝藏','excavator','#ffb74d,#ef6c00'],['p_build','盖房子','crane','#4fc3f7,#0277bd'],['p_wash','洗车店','water','#4dd0e1,#00838f'],
 ['p_load','装货','dump','#ffd54f,#f9a825'],['p_sand','变变变','a_elephant','#aed581,#558b2f'],['p_mole','打地鼠','a_mole','#a1887f,#5d4037'],['p_bub','戳泡泡','🫧','#81d4fa,#4fc3f7'],
 ['p_feed','喂小动物','a_rabbit','#f48fb1,#c2185b'],['p_puz','拼图','bulldozer','#ce93d8,#7b1fa2'],['p_draw','画画','🎨','#fff176,#fbc02d'],['p_piano','钢琴','🎹','#90caf9,#3949ab']];
const menu=$('#menu'),pb=mk('div','','',menu);pb.id='pbtns';
MENU.forEach(([id,n,ic,g])=>{const b=mk('div','pm',`${ic.length<3?`<span class="em">${ic}</span>`:`<img src="${A(ic)}">`}<b>${n}</b>`,pb);b.style.background=`linear-gradient(${g})`;b.addEventListener('pointerdown',e=>{e.stopPropagation();ac();pop();say(n);show(id)})});
const lb=mk('div','pm learn','<span class="em">📚</span><b>学一学</b>',pb);lb.addEventListener('pointerdown',e=>{e.stopPropagation();ac();pop();show('learn')});
const gb=mk('div','pm learn','<span class="em">🏆</span><b>我的车库</b>',pb);gb.id='gbtn';gb.style.background='linear-gradient(#ffcc80,#ef6c00)';gb.addEventListener('pointerdown',e=>{e.stopPropagation();ac();pop();show('garage')});
const gar=mk('div','scr','',document.body);gar.id='garage';gar.style.zIndex=getComputedStyle(menu).zIndex;
const learn=mk('div','scr','',document.body);learn.id='learn';learn.style.zIndex=getComputedStyle(menu).zIndex;
['#btns','#road','#stickers'].forEach(s=>{const e=$(s);e&&learn.appendChild(e)});mk('div','lbl','学一学',learn).style.cssText='';
document.body.insertBefore(learn,menu.nextSibling);
MENU.forEach(([id])=>{const s=mk('div','scr pscr','',document.body);s.id=id;s.style.background=P[id].bg;document.body.insertBefore(s,$('#nm'))});
const oShow=show;let lastShow=0;
show=function(id){const n=Date.now();if(n-lastShow<450)return;lastShow=n;if(!$('#'+id))id='menu';stopMode();
 if(id=='garage'){document.querySelectorAll('.scr').forEach(s=>s.classList.remove('on'));$('#garage').classList.add('on');$('#home').style.display='flex';cur=id;lifeSetup(null);window.FUN&&FUN.garage();return}
 if(id.startsWith('p_')||id=='learn'){document.querySelectorAll('.scr').forEach(s=>s.classList.remove('on'));$('#'+id).classList.add('on');$('#home').style.display='flex';cur=id;
  if(id=='learn'){lifeSetup(null);drawSt();drawRoad();ask('学一学，选一个吧');return}
  root=$('#'+id);curP=id;lifeSetup(P[id].life);try{P[id].build(root);P[id].start()}catch(e){console.error(e);document.title='ERR '+e.message}return}
 lifeSetup(id=='menu'?{sky:[],sides:[],low:[]}:null);oShow(id);if(id=='menu')ambient(['p_plane','p_heli','p_balloon','p_rocket','p_bird'])};
window.show=show;
$('#home').onpointerdown=()=>{pop();lastShow=0;show(/^g\d/.test(cur)?'learn':'menu')};
/* ===== g2 / g8 single-pointer drag guard ===== */
['#ctruck','#drag8'].forEach(s=>{const t=$(s);if(!t)return;let pid=null,dx=0,dy=0;const guard=e=>{if(pid!=null&&e.pointerId!==pid){e.stopImmediatePropagation();return 1}};
 t.addEventListener('pointerdown',e=>{if(guard(e))return;pid=e.pointerId;dx=e.clientX;dy=e.clientY},true);
 t.addEventListener('pointermove',guard,true);
 t.addEventListener('pointerup',e=>{if(guard(e))return;pid=null},true);
 const cancel=e=>{if(e.pointerId!==pid)return;const id=pid;pid=null;if(e.type=='pointercancel'||e.type=='lostpointercapture'){try{t.dispatchEvent(new PointerEvent('pointerup',{pointerId:id,clientX:dx,clientY:dy,bubbles:true}))}catch(_){}}};
 t.addEventListener('pointercancel',cancel,true);t.addEventListener('lostpointercapture',cancel,true)});
addEventListener('pointerdown',()=>{},{passive:true});
window.PJ={burst,confetti,S,nm,A,mk,ja,J,snd,VEH,NM,rnd,ri,ctr,get cur(){return curP},get root(){return root}};
})();
