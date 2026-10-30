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
/* ===== Phaser-powered modes (see game.js) ===== */
['p_site','p_sand','p_wash','p_draw','p_feed','p_music','p_bub'].forEach(id=>{P[id]={bg:'#8fdcff',life:null,build(r){r.style.background='#8fdcff'},start(){window.GAME.start(id,root)},stop(){window.GAME.stop()}}});
/* ===== menu / learn / routing ===== */
const MENU=[['p_site','工地乐园','crane','#ffb74d,#ef6c00'],['p_wash','泥巴洗车','water','#4dd0e1,#00838f'],['p_draw','魔法画画','🎨','#fff176,#fbc02d'],['p_sand','沙子泥巴','excavator','#ffe082,#c49a3c'],
 ['p_feed','喂小动物','a_elephant','#f48fb1,#c2185b'],['p_music','音乐弹珠','🎵','#9fa8da,#3949ab'],['p_bub','吹泡泡','🫧','#81d4fa,#0288d1']];
const menu=$('#menu'),pb=mk('div','','',menu);pb.id='pbtns';
MENU.forEach(([id,n,ic,g])=>{const b=mk('div','pm',`${ic.length<3?`<span class="em">${ic}</span>`:`<img src="${A(ic)}">`}<b>${n}</b>`,pb);b.style.background=`linear-gradient(${g})`;b.addEventListener('pointerdown',e=>{e.stopPropagation();ac();pop();say(n);show(id)})});

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
window.PJ={party,burst,confetti,S,nm,A,mk,ja,J,snd,VEH,NM,rnd,ri,ctr,get cur(){return curP},get root(){return root}};
})();
