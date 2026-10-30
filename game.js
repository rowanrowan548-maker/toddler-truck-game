/* ===== Phaser 3 play engine: 7 open-ended toy modes =====
   Engine: Phaser 3.80 (MIT, bundled locally, includes Matter.js)
   SFX: Kenney.nl Impact/Interface/UI/Jingles packs (CC0) in assets/sfx */
(()=>{
const PJ=window.PJ;const A=n=>'assets/'+n+'.webp';
const R=Math.random,rnd=(a,b)=>a+R()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pk=a=>a[Math.floor(R()*a.length)];
const nm=k=>PJ.nm(k)||({sun:'太阳公公',cloud:'白云',cone:'路锥',blk:'积木',plank:'木板',wball:'大铁球'})[k]||'';
let lastSay=0,lastTxt='';const sayT=(t,ms=900)=>{const n=Date.now();if(!t||(n-lastSay<ms))return;lastSay=n;lastTxt=t;try{say(t)}catch(e){}};
const PRAISE=['哇！','好厉害！','真好玩！','太棒啦！','哈哈！','再来！','好神奇！'];
const isMuted=()=>{try{return !!muted}catch(e){return false}};
const IMG=['bg','bulldozer','crane','dump','excavator','fire','forklift','loader','mixer','roller','tow','water','drill',
 'a_cat','a_chick','a_cow','a_dog','a_elephant','a_monkey','a_rabbit','a_mole','f_bone','f_carrot','f_corn','f_fish','f_grass',
 'it_apple','it_ball','it_banana','it_bear','it_chest','it_dino','it_melon','it_orange','p_balloon','p_bee','p_bird','p_butterfly','p_flower','p_heli','p_plane','p_rocket','p_train','p_tree','p_worker','b_house'].concat(['excavator','bulldozer','crane','dump','fire','forklift','loader','mixer','roller','tow','water','drill','dog','cat','elephant','house','castle','trex','bronto'].map(k=>'cp_'+k));
const SFX={wood_h:'impactWood_heavy_001',wood_m:'impactWood_medium_004',wood_l:'impactWood_light_001',metal_h:'impactMetal_heavy_002',metal_l:'impactMetal_light_000',
 soft_h:'impactSoft_heavy_001',soft_m:'impactSoft_medium_002',plate:'impactPlate_heavy_000',glass:'impactGlass_light_001',mining:'impactMining_003',punch:'impactPunch_heavy_003',
 grass:'footstep_grass_000',snow:'footstep_snow_002',pluck1:'pluck_001',pluck2:'pluck_002',drop1:'drop_001',drop2:'drop_002',bong:'bong_001',glass1:'glass_001',
 confirm:'confirmation_002',max:'maximize_006',select:'select_001',click:'click_002',jin_p:'jingles_PIZZI00',jin_n:'jingles_NES00',jin_s:'jingles_STEEL00',jin_x:'jingles_SAX02',roll:'rollover2'};
const COL=[0xe53935,0xfb8c00,0xfdd835,0x43a047,0x1e88e5,0x8e24aa,0xec407a,0x00acc1];
const CNAME=['红色','橙色','黄色','绿色','蓝色','紫色','粉色','青色'];
const VEH=['bulldozer','crane','dump','excavator','fire','forklift','loader','mixer','roller','tow','water'];
const ANIM=['a_dog','a_cat','a_cow','a_rabbit','a_chick','a_monkey','a_elephant'];
/* ---------- synth helpers (pitched notes need continuous pitch) ---------- */
const bell=(f,v=.22)=>{try{tone(f,1.1,'sine',v);tone(f*4,.18,'sine',v*.25);tone(f*2,.5,'triangle',v*.3)}catch(e){}};
const noiseS=(d,f,v,f2)=>{try{const a=ac(),len=Math.floor(a.sampleRate*d),b=a.createBuffer(1,len,a.sampleRate),c=b.getChannelData(0);for(let i=0;i<len;i++)c[i]=R()*2-1;const s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain(),t=a.currentTime;s.buffer=b;fl.type='bandpass';fl.Q.value=.8;fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(fl).connect(g).connect(master);s.start()}catch(e){}};
/* ================= Base scene ================= */
/* performance: particle budget scales with device + live FPS */
const Q={q:((navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=3)?.55:1};window.Q=Q;
(()=>{const P=Phaser.GameObjects.Particles.ParticleEmitter.prototype,ex=P.explode;P.explode=function(n,x,y){return ex.call(this,Math.max(1,Math.round((n||1)*Q.q)),x,y)}})();
class Base extends Phaser.Scene{
 constructor(key,matter){super(matter?{key,physics:{default:'matter',matter:{gravity:{y:1.1},enableSleeping:false}}}:{key})}
 init(){this.W=this.scale.width;this.H=this.scale.height;this.U=Math.min(this.W,this.H)/100;this.sT={};this.wins=0;this.touched=0}
 thr(k,gap){const n=performance.now();if(n-(this.sT['_'+k]||0)<gap)return false;this.sT['_'+k]=n;return true}
 snd(k,o={}){const n=performance.now();if(n-(this.sT[k]||0)<(o.gap??45))return;this.sT[k]=n;try{this.sound.play(k,{volume:o.v??.7,rate:o.rate??1,detune:o.det??0})}catch(e){}}
 base(){
  this.cameras.main.setBackgroundColor('#8fdcff');
  const f=(key,cfg)=>this.add.particles(0,0,key,Object.assign({emitting:false},cfg)).setDepth(cfg.depth||50);
  this.fxConf=f('sq',{speed:{min:200,max:520},angle:{min:0,max:360},gravityY:700,lifespan:1400,scale:{start:1.1,end:.5},rotate:{min:0,max:720},tint:COL,depth:60});
  this.fxStar=f('star',{speed:{min:80,max:320},angle:{min:0,max:360},lifespan:800,scale:{start:.9,end:0},tint:[0xffeb3b,0xfff59d,0xffffff,0xffd54f],blendMode:'ADD',depth:61});
  this.fxMono=f('dot',{speed:{min:60,max:300},angle:{min:200,max:340},gravityY:900,lifespan:800,scale:{start:.8,end:.2},depth:55});
  this.fxDust=f('dot',{speed:{min:30,max:160},angle:{min:180,max:360},lifespan:700,scale:{start:1.2,end:2.6},alpha:{start:.55,end:0},tint:[0xd7ccc8,0xbcaaa4,0xefebe9],depth:40});
  this.fxHeart=f('heart',{speed:{min:60,max:200},angle:{min:240,max:300},gravityY:-60,lifespan:1100,scale:{start:.8,end:.3},alpha:{start:1,end:0},depth:62});
  this.input.addPointer(4);
  this.input.on('pointerdown',()=>{this.touched++;if(this.hand){this.hand.destroy();this.hand=null}});
  const onR=()=>{clearTimeout(this._rz);this._rz=setTimeout(()=>{if(this.scene.isActive()&&host.parentNode&&this.scale.width>50)this.scene.restart()},300)};this.scale.on('resize',onR);
  this.events.once('shutdown',()=>{this.scale.off('resize',onR);clearTimeout(this._rz)});
 }
 mono(x,y,c,n=10,o={}){this.fxMono.particleTint=c;if(o.up!=null){this.fxMono.ops.angle.start=o.up?200:0;}this.fxMono.explode(n,x,y)}
 burstStar(x,y,n=10){this.fxStar.explode(n,x,y)}
 party(t){this.wins++;this.fxConf.explode(60,this.W*.5,this.H*.35);this.time.delayedCall(250,()=>this.fxConf.explode(40,this.W*.25,this.H*.3));this.time.delayedCall(500,()=>this.fxConf.explode(40,this.W*.75,this.H*.3));
  this.cameras.main.shake(300,.006);this.snd(pk(['jin_s','jin_p','jin_n']),{v:.6});if(t)setTimeout(()=>sayT(t,0),900);try{PJ.party()}catch(e){}}
 pointHand(x,y){if(this.touched)return;this.hand=this.add.text(x,y,'👆',{fontSize:Math.round(12*this.U)+'px'}).setOrigin(.3,0).setDepth(90);this.tweens.add({targets:this.hand,y:y-3*this.U,duration:500,yoyo:true,repeat:-1});this.time.delayedCall(6000,()=>{if(this.hand){this.hand.destroy();this.hand=null}})}
 squash(o,k=1){const sx=o._sx??o.scaleX,sy=o._sy??o.scaleY;o._sx=sx;o._sy=sy;this.tweens.killTweensOf(o);o.setScale(sx,sy);this.tweens.add({targets:o,scaleX:sx*(1+.25*k),scaleY:sy*(1-.2*k),duration:90,yoyo:true,ease:'Quad.easeOut',onComplete:()=>o.setScale(sx,sy)})}
 /* tappable living decorations: [key,x(0-1),y(0-1),size(vmin)] */
 deco(list,depth=5){list.forEach(([k,fx,fy,sz])=>{const o=this.add.image(fx*this.W,fy*this.H,k).setDepth(depth);o.setScale(sz*this.U/Math.max(o.width,o.height));if(R()<.5&&k.startsWith('a_'))o.setFlipX(true);
  o._sx=o.scaleX;o._sy=o.scaleY;o.setInteractive({useHandCursor:false});o._c=0;const y0=o.y;
  if(k=='cloud')this.tweens.add({targets:o,x:o.x+rnd(4,9)*this.U,duration:rnd(3000,5000),yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
  else if(k=='sun')this.tweens.add({targets:o,angle:8,duration:2500,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
  else this.tweens.add({targets:o,y:y0-rnd(.5,1.5)*this.U,duration:rnd(900,1600),yoyo:true,repeat:-1,ease:'Sine.easeInOut',delay:rnd(0,800)});
  o.on('pointerdown',(p,lx,ly,ev)=>{ev&&ev.stopPropagation&&ev.stopPropagation();ac();o._c++;try{PJ.snd(k)}catch(e){}sayT(nm(k),0);
   const sx=o._sx,sy=o._sy;this.tweens.add({targets:o,scaleX:sx*1.3,scaleY:sy*.75,duration:100,yoyo:true,onComplete:()=>o.setScale(sx,sy)});this.burstStar(o.x,o.y,6);
   if(o._c%3==0){this.tweens.add({targets:o,y:o.y-8*this.U,angle:o.angle+360,duration:600,yoyo:false,ease:'Back.easeOut',onComplete:()=>{this.tweens.add({targets:o,y:y0,duration:350,ease:'Bounce.easeOut'});o.angle=0}});this.fxHeart.explode(5,o.x,o.y);try{chime()}catch(e){}}});
  });}
 /* round UI button */
 button(x,y,r,icon,name,cb,opt={}){const c=this.add.container(x,y).setDepth(opt.depth||80);const bg=this.add.image(0,0,'btn').setDisplaySize(r*2,r*2);if(opt.tint)bg.setTint(opt.tint);c.add(bg);
  let ic;if(this.textures.exists(icon)){ic=this.add.image(0,0,icon);ic.setScale(r*1.45/Math.max(ic.width,ic.height))}else ic=this.add.text(0,0,icon,{fontSize:Math.round(r*1.05)+'px'}).setOrigin(.5);c.add(ic);
  const ring=this.add.circle(0,0,r*1.08).setStrokeStyle(r*.16,0xff5722).setVisible(false);c.add(ring);c.ring=ring;c.bg=bg;
  c.setSize(r*2.2,r*2.2).setInteractive();c.on('pointerdown',(p,lx,ly,ev)=>{ev&&ev.stopPropagation&&ev.stopPropagation();ac();this.snd('click',{v:.8});this.squash(c,1);if(name)sayT(name,0);cb&&cb()});return c}
}
/* ================= Boot: load + generate textures ================= */
class Boot extends Phaser.Scene{
 constructor(){super({key:'Boot'})}
 preload(){
  const W=this.scale.width,H=this.scale.height;const bar=this.add.rectangle(W*.2,H*.5,1,H*.04,0xffb300).setOrigin(0,.5);this.add.text(W*.5,H*.42,'🚧',{fontSize:Math.round(H*.12)+'px'}).setOrigin(.5);
  this.load.on('progress',p=>bar.width=W*.6*p);
  IMG.forEach(k=>this.load.image(k,A(k)));Object.entries(SFX).forEach(([k,f])=>this.load.audio(k,'assets/sfx/'+f+'.ogg'));
 }
 create(){const g=this.make.graphics({add:false});
  const tex=(k,w,h,fn)=>{g.clear();fn(g);g.generateTexture(k,w,h)};
  tex('dot',24,24,g=>{g.fillStyle(0xffffff,1);g.fillCircle(12,12,11)});
  tex('sq',14,10,g=>{g.fillStyle(0xffffff,1);g.fillRect(0,0,14,10)});
  tex('star',32,32,g=>{g.fillStyle(0xffffff,1);const p=[];for(let i=0;i<10;i++){const r=i%2?6:15,a=-Math.PI/2+i*Math.PI/5;p.push({x:16+Math.cos(a)*r,y:16+Math.sin(a)*r})}g.fillPoints(p,true)});
  tex('heart',32,30,g=>{g.fillStyle(0xff4f8b,1);g.fillCircle(9,10,8);g.fillCircle(23,10,8);g.fillTriangle(2,13,30,13,16,29)});
  tex('btn',128,128,g=>{g.fillStyle(0x000000,.18);g.fillCircle(64,68,58);g.fillStyle(0xffffff,1);g.fillCircle(64,62,58);g.lineStyle(7,0xffca28,1);g.strokeCircle(64,62,54)});
  tex('sun',180,180,g=>{g.fillStyle(0xffd54f,1);for(let i=0;i<12;i++){const a=i*Math.PI/6;g.fillTriangle(90+Math.cos(a-.15)*55,90+Math.sin(a-.15)*55,90+Math.cos(a+.15)*55,90+Math.sin(a+.15)*55,90+Math.cos(a)*88,90+Math.sin(a)*88)}
   g.fillStyle(0xffb300,1);g.fillCircle(90,90,56);g.fillStyle(0xffe082,1);g.fillCircle(90,88,50);g.fillStyle(0x5d4037,1);g.fillCircle(72,82,6);g.fillCircle(108,82,6);g.lineStyle(5,0x5d4037,1);g.beginPath();g.arc(90,96,20,.3,Math.PI-.3);g.strokePath();g.fillStyle(0xff8a80,.7);g.fillCircle(62,104,9);g.fillCircle(118,104,9)});
  tex('cloud',240,130,g=>{g.fillStyle(0xdbe9f5,1);[[70,82,45],[120,62,58],[175,82,45],[120,92,50]].forEach(([x,y,r])=>g.fillCircle(x,y+6,r));g.fillStyle(0xffffff,1);[[70,78,45],[120,58,58],[175,78,45],[120,88,48]].forEach(([x,y,r])=>g.fillCircle(x,y,r))});
  COL.forEach((c,i)=>{const cc=Phaser.Display.Color.ValueToColor(c),dk=cc.clone().darken(22).color,lt=cc.clone().lighten(22).color;
   tex('blk'+i,84,84,g=>{g.fillStyle(dk,1);g.fillRoundedRect(0,0,84,84,10);g.fillStyle(c,1);g.fillRoundedRect(5,4,74,72,8);g.fillStyle(lt,1);g.fillRoundedRect(10,8,64,10,5);g.fillStyle(0xffffff,.85);
    if(i%3==0)g.fillCircle(42,46,14);else if(i%3==1){g.fillTriangle(42,28,26,60,58,60)}else g.fillRect(28,32,28,28)});
   tex('ball'+i,64,64,g=>{g.fillStyle(dk,1);g.fillCircle(32,32,31);g.fillStyle(c,1);g.fillCircle(31,30,28);g.fillStyle(0xffffff,.7);g.fillCircle(22,20,8);g.fillStyle(0x3e2723,1);g.fillCircle(25,33,3.5);g.fillCircle(39,33,3.5);g.lineStyle(3,0x3e2723,1);g.beginPath();g.arc(32,38,7,.4,Math.PI-.4);g.strokePath()});
   tex('bar'+i,300,60,g=>{g.fillStyle(dk,1);g.fillRoundedRect(0,6,300,54,14);g.fillStyle(c,1);g.fillRoundedRect(0,0,300,52,14);g.fillStyle(lt,1);g.fillRoundedRect(12,6,276,12,6);g.fillStyle(0xcfd8dc,1);g.fillCircle(26,28,8);g.fillCircle(274,28,8);g.fillStyle(0x90a4ae,1);g.fillCircle(26,28,4);g.fillCircle(274,28,4)});
  });
  tex('plank',220,40,g=>{g.fillStyle(0x8d5a2b,1);g.fillRoundedRect(0,0,220,40,6);g.fillStyle(0xc68642,1);g.fillRoundedRect(3,3,214,32,5);g.lineStyle(2,0x9c6b3a,.8);for(let y=12;y<34;y+=8){g.beginPath();g.moveTo(8,y);g.lineTo(212,y+R()*4-2);g.strokePath()}g.fillStyle(0x6d4c41,1);g.fillCircle(14,20,3);g.fillCircle(206,20,3)});
  tex('cone',70,90,g=>{g.fillStyle(0xe65100,1);g.fillRoundedRect(0,76,70,14,4);g.fillStyle(0xff6d00,1);g.fillTriangle(35,0,8,78,62,78);g.fillStyle(0xffffff,1);g.fillTriangle(35-12,32,35+12,32,35+17,46);g.fillRect(20,32,30,12);g.fillRect(14,56,42,10)});
  tex('wball',110,110,g=>{g.fillStyle(0x263238,1);g.fillCircle(55,55,54);g.fillStyle(0x455a64,1);g.fillCircle(50,50,46);g.fillStyle(0x90a4ae,.8);g.fillCircle(36,34,12);g.fillStyle(0x37474f,1);g.fillRect(48,0,14,12)});
  tex('bubble',128,128,g=>{g.fillStyle(0xbbdefb,.12);g.fillCircle(64,64,62);g.lineStyle(3,0xffffff,.85);g.strokeCircle(64,64,61);g.lineStyle(4,0xf48fb1,.35);g.beginPath();g.arc(64,64,56,.2,1.4);g.strokePath();g.lineStyle(4,0x80deea,.4);g.beginPath();g.arc(64,64,56,2.2,3.3);g.strokePath();g.fillStyle(0xffffff,.9);g.fillEllipse(42,36,22,12)});
  tex('foam',64,64,g=>{g.fillStyle(0xffffff,.95);[[22,24,16],[42,22,14],[32,40,18],[48,42,12],[16,44,11]].forEach(([x,y,r])=>g.fillCircle(x,y,r));g.fillStyle(0xe3f2fd,1);g.fillCircle(28,30,4);g.fillCircle(44,38,3)});
  tex('drop',20,28,g=>{g.fillStyle(0xffffff,1);g.fillTriangle(10,0,2,16,18,16);g.fillCircle(10,18,9)});
  tex('note',40,52,g=>{g.fillStyle(0xffffff,1);g.fillEllipse(12,42,22,16);g.fillRect(19,4,5,40);g.fillTriangle(24,4,38,14,24,20)});
  tex('wh_big',128,128,g=>{g.fillStyle(0x212121,1);g.fillCircle(64,64,63);g.fillStyle(0x424242,1);for(let i=0;i<16;i++){const a=i*Math.PI/8;g.fillCircle(64+Math.cos(a)*58,64+Math.sin(a)*58,7)}g.fillStyle(0xbdbdbd,1);g.fillCircle(64,64,32);g.fillStyle(0xeeeeee,1);g.fillCircle(64,64,24);g.fillStyle(0x9e9e9e,1);for(let i=0;i<5;i++){const a=i*Math.PI*.4;g.fillCircle(64+Math.cos(a)*14,64+Math.sin(a)*14,4)}g.fillStyle(0x616161,1);g.fillCircle(64,64,7)});
  tex('wh_mon',128,128,g=>{g.fillStyle(0x111111,1);for(let i=0;i<12;i++){const a=i*Math.PI/6;g.fillRect(64+Math.cos(a)*52-9,64+Math.sin(a)*52-9,18,18)}g.fillCircle(64,64,56);g.fillStyle(0x2b2b2b,1);g.fillCircle(64,64,48);g.fillStyle(0xff3d00,1);g.fillCircle(64,64,28);g.fillStyle(0xffab40,1);for(let i=0;i<6;i++){const a=i*Math.PI/3;g.fillTriangle(64,64,64+Math.cos(a-.25)*26,64+Math.sin(a-.25)*26,64+Math.cos(a+.25)*26,64+Math.sin(a+.25)*26)}g.fillStyle(0x212121,1);g.fillCircle(64,64,8)});
  tex('wh_flower',128,128,g=>{g.fillStyle(0x263238,1);g.fillCircle(64,64,63);g.fillStyle(0xfff59d,1);g.fillCircle(64,64,46);g.fillStyle(0xf06292,1);for(let i=0;i<6;i++){const a=i*Math.PI/3;g.fillCircle(64+Math.cos(a)*24,64+Math.sin(a)*24,15)}g.fillStyle(0xffeb3b,1);g.fillCircle(64,64,14);g.fillStyle(0xff9800,1);g.fillCircle(64,64,6)});
  g.destroy();this.time.delayedCall(30,()=>this.game.events.emit('booted'));
 }
}
/* shared: matter drag + throw (per pointer) */
function dragMatter(sc,o,onDown){o.setInteractive();sc.input.setDraggable(o);
 o.on('pointerdown',(p,lx,ly,ev)=>{ev&&ev.stopPropagation&&ev.stopPropagation();onDown&&onDown(o,p)});
 o.on('dragstart',p=>{o._dt={x:p.x,y:p.y};sc.drags.add(o)});o.on('drag',p=>{o._dt={x:p.x,y:p.y}});o.on('dragend',()=>{o._dt=null;sc.drags.delete(o)})}
function dragStep(sc){sc.drags.forEach(o=>{if(!o.body||!o._dt){sc.drags.delete(o);return}const k=o._dk||.28,cl=o._dc||34;let vx=(o._dt.x-o.x)*k,vy=(o._dt.y-o.y)*k;vx=Phaser.Math.Clamp(vx,-cl,cl);vy=Phaser.Math.Clamp(vy,-cl,cl);o.setVelocity(vx,vy);if(o._noRot)o.setAngularVelocity(0)})}
function bg(sc,key='bg',a=1){const b=sc.add.image(sc.W/2,sc.H/2,key).setDepth(0).setAlpha(a);b.setScale(Math.max(sc.W/b.width,sc.H/b.height));return b}
function ground(sc,G,col=0x8d6e63,top=0x7cb342){const g=sc.add.graphics().setDepth(4);g.fillStyle(col,1);g.fillRect(0,G,sc.W,sc.H-G);g.fillStyle(top,1);g.fillRect(0,G-sc.U*1.2,sc.W,sc.U*2.2);g.fillStyle(0x000000,.08);for(let i=0;i<40;i++)g.fillCircle(R()*sc.W,G+sc.U*2+R()*(sc.H-G),rnd(.4,1.4)*sc.U);return g}
/* ================= 工地乐园 Construction playground (Matter) ================= */
class Site extends Base{
 constructor(){super('Site',true)}
 create(){this.base();const W=this.W,H=this.H,U=this.U;this.drags=new Set();this.toys=[];this.crash=0;this.lastBig=0;
  bg(this);const G=this.G=H*.86;ground(this,G);
  this.matter.world.setBounds(-200,-H*3,W+400,G+H*3,200,true,true,false,true);this.matter.world.walls.bottom&&(this.matter.world.walls.bottom.label='ground');
  this.matter.add.rectangle(-30,G-H,60,H*4,{isStatic:true,label:'ground'});this.matter.add.rectangle(W+30,G-H,60,H*4,{isStatic:true,label:'ground'});
  this.deco([['sun',.22,.13,14],['cloud',.3,.1,18],['cloud',.7,.08,22],['p_bird',.5,.18,7],['p_plane',.88,.14,12],['p_tree',.96,.7,16],['p_worker',.03,.76,11],['a_dog',.12,.92,9],['p_flower',.3,.95,6],['p_flower',.9,.95,6],['p_butterfly',.6,.3,6]],3);
  // crane + wrecking ball
  const ax=W*.36,ay=H*.07;const gb=this.add.graphics().setDepth(6);gb.fillStyle(0xffb300,1);gb.fillRect(0,ay-U*1.6,ax+U*2,U*3.2);gb.lineStyle(U*.5,0xe65100,1);for(let x=0;x<ax;x+=U*3.2){gb.lineBetween(x,ay-U*1.6,x+U*1.6,ay+U*1.6);gb.lineBetween(x+U*1.6,ay+U*1.6,x+U*3.2,ay-U*1.6)}gb.fillStyle(0x424242,1);gb.fillCircle(ax,ay,U*1.6);
  this.chain=this.add.graphics().setDepth(7);
  const wb=this.wball=this.matter.add.image(ax+H*.25,ay+H*.3,'wball',null,{shape:{type:'circle',radius:52},density:.02,frictionAir:.004,restitution:.3,label:'wball'});wb.setScale(U*11/110).setDepth(8);
  this.matter.add.worldConstraint(wb.body,H*.46,1,{pointA:{x:ax,y:ay}});wb._dk=.18;dragMatter(this,wb,()=>sayT('大铁球'));this.anchor={x:ax,y:ay};
  // bulldozer
  const dz=this.dozer=this.matter.add.image(W*.14,G-U*12,'bulldozer',null,{shape:{type:'rectangle',width:560,height:330},density:.012,friction:.6,label:'dozer'});dz.setScale(U*30/640).setDepth(9).setFixedRotation();dz._noRot=1;dz._dk=.22;
  dragMatter(this,dz,()=>{sayT('推土机');try{horn()}catch(e){}});
  this.buildTowers(false);
  this.button(W-U*9,H-U*40,U*6.5,'crane','起重机 盖高楼',()=>this.rebuild());
  this.button(W-U*9,H-U*24,U*6.5,'dump','自卸车 倒下来',()=>this.rain());
  this.input.on('pointerdown',(p,over)=>{if(over.length)return;if(p.y>G)return;this.dropToy(p.x,-U*6);});
  this.matter.world.on('collisionstart',e=>this.hit(e));
  this.pointHand(W*.42,H*.45);sayT('推倒它！',300);
 }
 addToy(o){this.toys.push(o);if(this.toys.length>64){const d=this.toys.shift();if(d&&d.body){this.fxDust.explode(6,d.x,d.y);this.drags.delete(d);d.destroy()}}}
 block(x,y,i,plank){const U=this.U,s=U*8.4;let o;if(plank){o=this.matter.add.image(x,y,'plank',null,{density:.002,friction:.8,label:'blk'});o.setScale(s*2.4/220)}else{o=this.matter.add.image(x,y,'blk'+i,null,{density:.0016,friction:.9,frictionStatic:1,label:'blk',chamfer:{radius:8}});o.setScale(s/84)}o.setDepth(10);o._ci=i;
  dragMatter(this,o,()=>sayT(plank?'木板':CNAME[i]+'积木'));this.addToy(o);return o}
 buildTowers(anim){const W=this.W,U=this.U,s=U*8.4,G=this.G;const cols=[W*.56,W*.66,W*.82];let d=0;
  const put=(fn)=>{if(anim){this.time.delayedCall(d,fn);d+=110}else fn()};
  [[cols[0],5],[cols[1],7],[cols[2],6]].forEach(([x,n],ci)=>{for(let j=0;j<n;j++){const y=G-s*.5-j*s;put(()=>this.block(x,anim?-U*8:y,(ci*2+j)%8))}});
  put(()=>{const p=this.block((cols[1]+cols[2])/2,anim?-U*8:G-s*7.5,0,true)});put(()=>{const c=this.matter.add.image(cols[1],anim?-U*10:G-s*7.8,'cone',null,{density:.001,label:'cone'});c.setScale(U*8/90).setDepth(10);dragMatter(this,c,()=>sayT('路锥'));this.addToy(c)});
 }
 rebuild(){this.toys.forEach(o=>{if(o.body){this.fxDust.explode(4,o.x,o.y);o.destroy()}});this.toys=[];this.drags.clear();this.snd('max');sayT('盖高楼！',0);this.time.delayedCall(250,()=>this.buildTowers(true))}
 rain(){this.snd('roll');for(let i=0;i<12;i++)this.time.delayedCall(i*90,()=>this.dropToy(rnd(this.W*.3,this.W*.9),-this.U*8,true))}
 dropToy(x,y,ballOnly){const U=this.U;const r=R();let o;
  if(ballOnly||r<.45){const fr=pk(['it_ball','it_apple','it_orange','it_melon','ball'+ri(0,7)]);const big=fr=='it_melon'?11:7;o=this.matter.add.image(x,y,fr,null,{shape:{type:'circle',radius:(fr.startsWith('ball')?30:140)},restitution:.65,density:.001,label:fr.startsWith('it_')&&fr!='it_ball'?'fruit':'ball'});o.setScale(U*big/(fr.startsWith('ball')?64:320));o.setDepth(11);dragMatter(this,o,()=>sayT(fr.startsWith('ball')?'球球':nm(fr)));o.setAngularVelocity(rnd(-.2,.2));this.addToy(o)}
  else o=this.block(x,y,ri(0,7),r>.85);o.setVelocityY(4);if(!ballOnly)this.snd('whoosh'in this.sT?'roll':'roll',{v:.25,rate:1.4})}
 hit(e){const n=performance.now();for(const p of e.pairs){const a=p.bodyA,b=p.bodyB;const dv=Math.hypot(a.velocity.x-b.velocity.x,a.velocity.y-b.velocity.y);if(dv<3.2)continue;
   const L=[a.label,b.label],has=k=>L.includes(k);const v=Math.min(1,dv/14);
   let k=has('wball')?(dv>8?'punch':'metal_h'):has('dozer')?'metal_l':has('fruit')?'soft_m':has('ball')?'drop2':has('cone')?'plate':dv>9?'wood_h':dv>6?'wood_m':'wood_l';
   this.snd(k,{v:.25+v*.7,rate:rnd(.88,1.15),gap:55});const sp=p.collision.supports&&p.collision.supports[0]||a.position;
   if(dv>5)this.fxDust.explode(Math.round(2+v*6),sp.x,sp.y);if(has('fruit')&&dv>8)this.mono(sp.x,sp.y,0xffa726,8);
   if(dv>5&&!(has('ground')&&has('dozer')))this.crash+=dv>9?2:1;if(dv>11)this.cameras.main.shake(140,.004*v)}
  if(this.crash>16&&n-this.lastBig>2500){this.lastBig=n;this.crash=0;this.burstStar(this.W*.7,this.H*.55,16);const big=n-(this.lastParty||0)>25000;
   if(big){this.lastParty=n;this.party('哗啦啦！倒啦！')}else sayT(pk(['哗啦啦！','轰隆隆！','倒啦！','哈哈！']),0)}}
 update(){dragStep(this);this.crash*=.97;const c=this.chain,a=this.anchor,w=this.wball;c.clear();c.lineStyle(this.U*.7,0x37474f,1);c.lineBetween(a.x,a.y,w.x,w.y);c.fillStyle(0x263238,1);c.fillCircle(a.x,a.y,this.U*.9);
  this.toys.forEach(o=>{if(o.body&&o.y>this.H+200){o.setPosition(rnd(this.W*.3,this.W*.9),-this.U*8);o.setVelocity(0,0)}});if(this.dozer.y>this.H+50){this.dozer.setPosition(this.W*.15,this.G-this.U*14);this.dozer.setVelocity(0,0)}}
}
/* ================= 沙子泥巴乐园 Falling-sand sandbox ================= */
const EMPTY=0,SAND=1,WATER=2,MUD=3,ROCK=4,SEED=5,PLANT=6;
class Sand extends Base{
 constructor(){super('Sand')}
 create(){this.base();const W=this.W,H=this.H,U=this.U;bg(this);
  this.deco([['sun',.75,.12,14],['cloud',.55,.09,18],['cloud',.2,.12,14],['p_bird',.72,.2,6],['p_bee',.35,.22,6]],2);
  const cs=this.cs=Math.max(4,Math.ceil(W/190));const cw=this.cw=Math.ceil(W/cs),ch=this.ch=Math.ceil(H/cs);
  this.g=new Uint8Array(cw*ch);this.sh=new Uint8Array(cw*ch);this.mv=new Uint8Array(cw*ch);for(let i=0;i<cw*ch;i++)this.sh[i]=ri(0,3);
  if(this.textures.exists('sandtex'))this.textures.remove('sandtex');this.ct=this.textures.createCanvas('sandtex',cw,ch);this.ct.setFilter(Phaser.Textures.FilterMode.NEAREST);
  this.img=this.add.image(0,0,'sandtex').setOrigin(0).setScale(cs).setDepth(6);this.id=this.ct.context.createImageData(cw,ch);this.px=new Uint32Array(this.id.data.buffer);
  const c=(r,g,b)=>(255<<24)|(b<<16)|(g<<8)|r;this.PAL=[[0,0,0,0],[c(240,205,120),c(230,192,105),c(246,214,136),c(222,184,98)],[c(66,165,245),c(57,150,235),c(80,175,250),c(60,158,240)],[c(121,85,61),c(109,76,52),c(133,94,67),c(100,70,48)],[c(120,110,100),c(105,96,88),c(135,124,112),c(95,88,80)],[c(139,195,74),c(124,179,66),c(156,204,101),c(104,159,56)],[c(67,160,71),c(56,142,60),c(76,175,80),c(240,98,146)]];
  // initial landscape: rocky hills + sand pile + pond
  for(let x=0;x<cw;x++){const hr=Math.floor(ch*.1+Math.sin(x/cw*Math.PI*3)*ch*.04+R()*1.5);for(let y=ch-hr;y<ch;y++)this.g[y*cw+x]=ROCK;
   const hs=Math.floor(Math.max(0,ch*.22-Math.abs(x-cw*.3)*.5));for(let y=ch-hr-hs;y<ch-hr;y++)this.g[y*cw+x]=SAND;
   if(x>cw*.62&&x<cw*.85){for(let y=ch-hr-Math.floor(ch*.06);y<ch-hr;y++)if(!this.g[y*cw+x])this.g[y*cw+x]=WATER}}
  this.tool=SAND;this.pours=new Map();this.count=0;this.nextWin=2500;
  const tl=[[SAND,'🏖️','沙子',0xffe082],[WATER,'💧','水',0x81d4fa],[MUD,'🟤','泥巴',0xbcaaa4],[SEED,'🌱','种子',0xc5e1a5],[EMPTY,'excavator','挖掘机',0xffcc80]];
  this.btns=tl.map(([m,ic,n,t],i)=>{const b=this.button(U*8,U*22+i*U*12.5,U*5.4,ic,n,()=>{this.tool=m;this.btns.forEach(x=>x.ring.setVisible(x==b))},{tint:t});return b});this.btns[0].ring.setVisible(true);
  this.button(W-U*8,H-U*24,U*6,'🌀','摇一摇 清空',()=>this.shakeAll());
  this.dig=this.add.image(0,0,'excavator').setScale(U*16/640).setDepth(20).setVisible(false);
  this.input.on('pointerdown',(p,over)=>{if(over.length)return;this.pours.set(p.id,p);this.startSnd()});
  this.input.on('pointerup',p=>{this.pours.delete(p.id);if(!this.pours.size)this.dig.setVisible(false)});
  this.acc=0;this.pointHand(W*.5,H*.35);sayT('倒沙子吧！',300);
 }
 startSnd(){const t=this.tool;sayT(t==WATER?'哗啦啦':t==MUD?'吧唧吧唧':t==SEED?'种小花':t==EMPTY?'挖呀挖':'沙沙沙',600)}
 paint(px,py,m,r){const cw=this.cw,ch=this.ch,cx=Math.floor(px/this.cs),cy=Math.floor(py/this.cs);let n=0;
  for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(dx*dx+dy*dy>r*r)continue;const x=cx+dx,y=cy+dy;if(x<0||y<0||x>=cw||y>=ch)continue;const i=y*cw+x;
   if(m==EMPTY){if(this.g[i]&&this.g[i]!=ROCK){this.g[i]=0;n++}}else if(!this.g[i]&&R()<(m==SEED?.08:.45)){this.g[i]=m;n++}}return n}
 shakeAll(){this.cameras.main.shake(500,.012);this.snd('mining',{v:.8});const g=this.g;for(let i=0;i<g.length;i++)if(g[i]!=ROCK&&R()<.85)g[i]=0;this.fxDust.explode(30,this.W/2,this.H*.8)}
 step(){const g=this.g,mv=this.mv,cw=this.cw,ch=this.ch;mv.fill(0);const flip=(this.fr=(this.fr||0)+1)&1;
  for(let y=ch-2;y>=0;y--){for(let k=0;k<cw;k++){const x=flip?k:cw-1-k,i=y*cw+x,m=g[i];if(!m||m==ROCK||m==PLANT||mv[i])continue;const b=i+cw;
    if(m==SAND||m==MUD||m==SEED){if(m==MUD&&R()<.35)continue;const bm=g[b];
     if(bm==EMPTY||bm==WATER){g[i]=bm;g[b]=m==SAND&&bm==WATER&&R()<.04?MUD:m;mv[b]=1;continue}
     if(m==SEED&&(bm==SAND||bm==MUD)){let wet=0;for(let j=-2;j<=2;j++){const q=b+j;if(g[q]==WATER||g[q]==MUD)wet=1}if(wet&&R()<.04){g[i]=PLANT;this.grow(x,y)}continue}
     const d=R()<.5?-1:1;for(const s of [d,-d]){const xx=x+s;if(xx<0||xx>=cw)continue;const q=b+s;if(g[q]==EMPTY||g[q]==WATER){if(m==MUD&&R()<.6)break;g[i]=g[q];g[q]=m;mv[q]=1;break}}
     if(m==SAND){const l=x>0?g[i-1]:0,r=x<cw-1?g[i+1]:0;if((l==WATER||r==WATER)&&R()<.004)g[i]=MUD}}
    else if(m==WATER){if(g[b]==EMPTY){g[i]=0;g[b]=WATER;mv[b]=1;continue}const d=R()<.5?-1:1;let done=0;
     for(const s of [d,-d]){const xx=x+s;if(xx<0||xx>=cw)continue;if(g[b+s]==EMPTY){g[i]=0;g[b+s]=WATER;mv[b+s]=1;done=1;break}}if(done)continue;
     for(const s of [d,-d]){let xx=x,q=i;for(let st=0;st<3;st++){xx+=s;if(xx<0||xx>=cw||g[q+s]!=EMPTY)break;q+=s}if(q!=i){g[i]=0;g[q]=WATER;mv[q]=1;break}}}}}}
 grow(x,y){const cw=this.cw;const h=ri(5,12);for(let k=1;k<=h;k++){const yy=y-k;if(yy<1)break;const i=yy*cw+x;if(this.g[i]&&this.g[i]!=WATER)break;this.g[i]=PLANT}
  const top=Math.max(1,y-h);for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){if(Math.abs(dx)+Math.abs(dy)>2)continue;const xx=x+dx,yy=top+dy;if(xx<0||xx>=cw||yy<0)continue;const i=yy*cw+xx;if(!this.g[i]){this.g[i]=PLANT;this.sh[i]=3}}
  this.snd('pluck2',{v:.5,rate:rnd(.9,1.4),gap:300});this.burstStar(x*this.cs,top*this.cs,5);sayT(pk(['小花长出来啦！','开花啦！']),2500)}
 draw2(){const g=this.g,px=this.px,sh=this.sh,P=this.PAL;for(let i=0;i<g.length;i++){const m=g[i];px[i]=m?P[m][sh[i]]:0}this.ct.context.putImageData(this.id,0,0);this.ct.refresh()}
 update(t,dt){const U=this.U;let poured=0;
  this.pours.forEach(p=>{if(!p.isDown){this.pours.delete(p.id);return}const m=this.tool;const r=m==EMPTY?Math.ceil(5*U/this.cs):Math.ceil(2.6*U/this.cs);const n=this.paint(p.x,p.y,m,r);poured+=n;
   if(m==EMPTY){this.dig.setVisible(true).setPosition(p.x+U*3,p.y-U*5);if(n){this.fxDust.explode(2,p.x,p.y);this.snd('grass',{v:.6,rate:rnd(.8,1.1),gap:140})}}
   else{if(m==WATER){this.snd('drop1',{v:.35,rate:rnd(.8,1.3),gap:120})}else this.snd(m==MUD?'snow':'grass',{v:.45,rate:rnd(1.1,1.5),gap:110});if(R()<.3)this.mono(p.x,p.y,m==WATER?0x64b5f6:m==MUD?0x6d4c41:m==SEED?0x8bc34a:0xf0cd78,2)}});
  this.count+=poured;if(this.count>this.nextWin){this.nextWin+=6000;this.party(pk(['沙子城堡真漂亮！','好多沙子呀！','你真会玩！']))}
  this.acc+=dt;let s=0;while(this.acc>16&&s<2){this.step();this.acc-=16;s++}if(this.acc>50)this.acc=0;this.draw2()}
}
/* ================= 泥巴洗车 Car wash + pimp shop (canvas masking) ================= */
const VEH12=VEH.concat(['drill']);
const VMETA={bulldozer:{w:[[.17,.67,.12],[.5,.67,.12]],cab:.38},crane:{w:[[.24,.78,.1],[.35,.78,.1],[.71,.78,.1]],cab:.8},dump:{w:[[.16,.7,.11],[.30,.7,.11],[.81,.7,.11]],cab:.82},
 excavator:{w:[[.13,.78,.1],[.57,.78,.1]],cab:.5},fire:{w:[[.2,.67,.1],[.39,.67,.1],[.74,.67,.1]],cab:.83},forklift:{w:[[.15,.69,.12],[.5,.69,.12]],cab:.4},
 loader:{w:[[.19,.59,.17],[.5,.59,.17]],cab:.4},mixer:{w:[[.18,.69,.1],[.32,.69,.1],[.73,.69,.1]],cab:.86},roller:{w:[[.23,.6,.2]],cab:.42},tow:{w:[[.27,.63,.1],[.43,.63,.1],[.84,.63,.1]],cab:.66},
 water:{w:[[.3,.64,.09],[.44,.64,.09],[.81,.64,.09]],cab:.86},drill:{w:[[.2,.86,.08],[.65,.86,.08]],cab:.6}};
const WHEELS=[[null,'原来的轮子',1],['wh_big','大轮子',1.3],['wh_mon','怪兽大轮子',2],['wh_flower','小花轮子',1.4]];
const STK=[['⭐','星星'],['🔥','火焰'],['🐶','小狗'],['🐱','小猫'],['🦄','独角兽'],['🌸','小花'],['❤️','爱心'],['123','数字']];
const HATS=[['🎩','礼帽'],['👑','皇冠'],['🧢','棒球帽'],['🤠','牛仔帽'],['🎀','蝴蝶结']];
const hexS=c=>'#'+c.toString(16).padStart(6,'0');
function blob(c,x,y,r,col,n){n=n||ri(9,14);const P=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2+rnd(-.25,.25),rr=r*rnd(.6,1.25);P.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr])}
 const mid=i=>{const p=P[(i+n)%n],q=P[(i+1+n)%n];return[(p[0]+q[0])/2,(p[1]+q[1])/2]};c.fillStyle=col;c.beginPath();let s=mid(-1);c.moveTo(s[0],s[1]);for(let i=0;i<n;i++){const e=mid(i);c.quadraticCurveTo(P[i][0],P[i][1],e[0],e[1])}c.closePath();c.fill()}
function splatTo(c,x,y,r,cols,drips=true){const col=pk(cols);c.globalCompositeOperation='source-over';blob(c,x,y,r,col);
 for(let i=0;i<3;i++)blob(c,x+rnd(-r*.45,r*.45),y+rnd(-r*.45,r*.45),r*rnd(.2,.45),pk(cols));
 for(let i=0,n=ri(4,8);i<n;i++){const a=R()*6.28,d=r*rnd(1.15,2.1),rr=r*rnd(.08,.24);c.save();c.translate(x+Math.cos(a)*d,y+Math.sin(a)*d);c.rotate(a);c.scale(rnd(1,2.3),1);blob(c,0,0,rr,col,7);c.restore()}
 if(drips)for(let i=0,n=ri(1,3);i<n;i++){const dx=x+rnd(-r*.6,r*.6),w=r*rnd(.13,.24),l=r*rnd(.6,1.9);c.fillStyle=col;c.beginPath();c.moveTo(dx-w/2,y);c.lineTo(dx-w*.35,y+l);c.arc(dx,y+l,w*.62,Math.PI,0,true);c.lineTo(dx+w/2,y);c.fill()}
 c.globalAlpha=.22;blob(c,x-r*.3,y-r*.35,r*.25,'#ffffff',8);c.globalAlpha=1}
class Wash extends Base{
 constructor(){super('Wash')}
 create(){this.base();const W=this.W,H=this.H,U=this.U;bg(this);this.cameras.main.setBackgroundColor('#bfe9ff');const F=this.F=H*.88;
  const gg=this.add.graphics().setDepth(2);gg.fillStyle(0x90a4ae,1);gg.fillRect(0,F-U*3,W,H);gg.fillStyle(0xb0bec5,1);gg.fillRect(0,F-U*3,W,U*1.2);gg.fillStyle(0x78909c,1);for(let x=0;x<W;x+=U*12)gg.fillRect(x,F+U*2.5,U*6,U*.8);
  // wash bay: posts + brush roller deco
  gg.fillStyle(0x1e88e5,1);gg.fillRect(W*.2,H*.16,U*2.2,F-H*.16);gg.fillRect(W*.8-U*2.2,H*.16,U*2.2,F-H*.16);gg.fillRoundedRect(W*.2,H*.13,W*.6,U*4,U*1.5);gg.fillStyle(0xffeb3b,1);for(let i=0;i<7;i++)gg.fillCircle(W*.24+i*W*.087,H*.13+U*2,U*.9);
  this.add.text(W*.5,H*.13+U*2,'🫧 洗 车 店 🫧',{fontSize:Math.round(U*3.2)+'px',fontStyle:'bold',color:'#ffffff'}).setOrigin(.5).setDepth(3);
  this.deco([['sun',.9,.27,9],['cloud',.12,.27,13],['p_bird',.36,.24,6]],1);
  this.MW=400;this.MH=300;const mk=()=>{const c=document.createElement('canvas');c.width=this.MW;c.height=this.MH;return c};
  this.mud=mk();this.foam=mk();this.paint=mk();this.maskC=mk();this.mx=this.mud.getContext('2d');this.fx=this.foam.getContext('2d');this.px=this.paint.getContext('2d');this.small=document.createElement('canvas');this.small.width=80;this.small.height=60;
  if(this.textures.exists('washtex'))this.textures.remove('washtex');this.ct=this.textures.createCanvas('washtex',this.MW,this.MH);
  this.dw=Math.min(W*.54,H*.62*4/3);this.dh=this.dw*.75;this.vx=W*.5;this.vy=F-this.dh*.3;
  this.pud=this.add.graphics().setDepth(5);this.wet=0;this.muddy=0;this.wetT=0;this.drips=0;
  this.rig=this.add.container(this.vx,this.vy).setDepth(10);this.car=this.add.image(0,0,'water').setDisplaySize(this.dw,this.dh);this.layer=this.add.image(0,0,'washtex').setDisplaySize(this.dw,this.dh);this.rig.add([this.car,this.layer]);
  this.wheelO=[];this.wi=0;this.acc={};this.riders=[];this.tool='water';this.act=new Map();this.dirty=false;this.col=-1;this.hue=0;this.stk=0;this.react=0;this.scrub=0;this.wetHit=0;this.lastSneeze=this.time.now;this.busy=false;
  this.fxWater=this.add.particles(0,0,'drop',{emitting:false,speed:{min:120,max:380},angle:{min:200,max:340},gravityY:1300,lifespan:700,scale:{start:.9,end:.4},tint:[0x4fc3f7,0x81d4fa,0xe1f5fe],alpha:{start:.95,end:.3},depth:31});
  this.fxBub=this.add.particles(0,0,'bubble',{emitting:false,speed:{min:20,max:120},angle:{min:220,max:320},gravityY:-40,lifespan:1600,scale:{start:.08,end:.24},alpha:{start:.9,end:0},depth:32});
  this.stream=this.add.graphics().setDepth(30);this.can=this.add.container(0,0).setDepth(33).setVisible(false);{const g=this.add.graphics();g.fillStyle(0x546e7a,1);g.fillRect(-U*1,-U*5.5,U*2,U*2);this.canBody=this.add.rectangle(0,0,U*4,U*7,0xe53935).setStrokeStyle(U*.4,0x37474f);g.fillStyle(0xffffff,.6);this.can.add([this.canBody,g]);this.can.setAngle(-40)}
  // tools
  const L=[['mud','🟤','泥巴',0xbcaaa4],['soap','🧼','泡泡',0xf8bbd0],['water','🚿','水枪',0x81d4fa],['dry','💨','吹风机',0xfff59d]];
  const Rt=[['spray','🎨','喷漆枪',0xffcc80],['sticker','⭐','贴纸',0xfff59d]];
  this.tbtn=[];const pickT=(m,b)=>{this.tool=m;this.tbtn.forEach(x=>x.ring.setVisible(x==b));this.tray(m)};
  L.forEach(([m,ic,n,t],i)=>{const b=this.button(U*8,U*24+i*U*13.5,U*5.8,ic,n,()=>pickT(m,b),{tint:t});b._m=m;this.tbtn.push(b)});
  Rt.forEach(([m,ic,n,t],i)=>{const b=this.button(W-U*9,U*24+i*U*13.5,U*5.8,ic,n,()=>pickT(m,b),{tint:t});b._m=m;this.tbtn.push(b)});
  this.side=[...this.tbtn];
  this.side.push(this.button(W-U*9,U*24+2*U*13.5,U*5.8,'🛞','',()=>this.swapWheels(),{tint:0xb0bec5}));
  this.side.push(this.button(W-U*9,U*24+3*U*13.5,U*5.8,'🎩','',()=>{this.tbtn.forEach(x=>x.ring.setVisible(false));this.tool='acc';this.tray('acc');sayT('打扮一下',0)},{tint:0xce93d8}));
  this.side.push(this.button(W-U*9,U*24+4*U*13.5,U*5.8,'🔄','换一辆车',()=>{if(!this.busy)this.leave(false)},{tint:0xa5d6a7}));
  this.trayO=[];this.flag=null;
  this.input.on('pointerdown',(p,over)=>{if(over.length||this.busy)return;const a={p,lx:p.x,ly:p.y,t:0,ci:this.col>=0?(this.col+this.act.size*3)%8:-1,ho:this.act.size*120};this.act.set(p.id,a);this.toolStart(a)});
  this.input.on('pointerup',p=>this.act.delete(p.id));
  const st=pk(this.tbtn);pickT(st._m,st);
  this.arrive(true);this.time.addEvent({delay:450,loop:true,callback:()=>this.check()});this.pointHand(this.vx,this.vy);
 }
 /* ---------- tray (sub-options along the top) ---------- */
 tray(m){this.trayO.forEach(o=>o.destroy());this.trayO=[];const W=this.W,U=this.U;let items=[];
  if(m=='spray'){items=COL.map((c,i)=>[' ',CNAME[i]+'喷漆',()=>{this.col=i},c,i]);items.push(['🌈','彩虹喷漆',()=>{this.col=-1},0xffffff,-1])}
  else if(m=='sticker')items=STK.map(([e,n],i)=>[e=='123'?'🔢':e,n+'贴纸',()=>{this.stk=i},0xffffff,i]);
  else if(m=='acc')items=[['🚨','闪闪灯',()=>this.toggle('light')],['📯','小喇叭',()=>this.toggle('horn')],['🚩','小旗子',()=>this.toggle('flag')],['👀','大眼睛',()=>this.toggle('eyes')],['🎩','帽子',()=>this.toggle('hat')]];
  if(!items.length)return;const n=items.length,sp=Math.min(U*11,W*.62/n);
  items.forEach(([ic,nmS,cb,tint,idx],i)=>{const b=this.button(W/2+(i-(n-1)/2)*sp,U*7.5,Math.min(U*4.6,sp*.44),ic,nmS,()=>{cb();if(idx!=null)this.trayO.forEach(x=>x.ring.setVisible(x==b))},{tint:tint});if(tint&&ic==' ')b.bg.setTint(tint);b.setScale(.01);this.tweens.add({targets:b,scale:1,duration:220,delay:i*30,ease:'Back.easeOut'});b._i=idx;this.trayO.push(b)});
  const cur=m=='spray'?this.col:m=='sticker'?this.stk:null;this.trayO.forEach(b=>b.ring.setVisible(cur!=null&&b._i===cur))}
 toolStart(a){const t=this.tool;if(t=='sticker'){this.sticker(a.p);return}if(t=='acc')return;
  sayT(t=='mud'?pk(['泥巴来啦！','吧唧吧唧！']):t=='soap'?pk(['擦泡泡','泡泡多多']):t=='water'?pk(['冲冲冲！','哗啦啦！']):t=='dry'?'呼呼呼':pk(['喷喷喷！','变漂亮！']),1500)}
 toLocal(p){return{x:(p.x-(this.rig.x-this.dw/2))/this.dw*this.MW,y:(p.y-(this.rig.y-this.dh/2))/this.dh*this.MH}}
 inCar(l){const x=Math.round(l.x),y=Math.round(l.y);if(x<0||y<0||x>=this.MW||y>=this.MH)return false;return this.alpha[y*this.MW+x]>60}
 colOf(a){if(a.ci>=0)return hexS(COL[a.ci]);this.hue=(this.hue+2)%360;return `hsl(${(this.hue+a.ho)%360},95%,55%)`}
 /* ---------- vehicle arrival with a random condition ---------- */
 arrive(first){const k=this.curV=pk(VEH12.filter(v=>v!=this.curV));const MW=this.MW,MH=this.MH;this.car.setTexture(k).setDisplaySize(this.dw,this.dh);
  const src=this.textures.get(k).getSourceImage(),m=this.maskC.getContext('2d');m.clearRect(0,0,MW,MH);m.drawImage(src,0,0,MW,MH);const d=m.getImageData(0,0,MW,MH).data;this.alpha=new Uint8Array(MW*MH);for(let i=0;i<MW*MH;i++)this.alpha[i]=d[i*4+3];
  this.top=new Float32Array(MW);this.bot=new Float32Array(MW);for(let x=0;x<MW;x++){let t=MH,b=0;for(let y=0;y<MH;y++)if(this.alpha[y*MW+x]>100){if(y<t)t=y;b=y}this.top[x]=t;this.bot[x]=b}
  [this.mx,this.fx,this.px].forEach(c=>c.clearRect(0,0,MW,MH));this.clearAcc();this.setWheels(0,true);this.riders.forEach(r=>r.destroy());this.riders=[];
  const cond=this.cond=pk(['mud','mud','leaves','snow','paint','animals']);const MUD=['#6d4c41','#795548','#5d4037','#8d6e63','#4e342e'];const sp=(n,cols,a,b)=>{for(let i=0;i<n;i++)splatTo(this.mx,rnd(30,MW-30),rnd(40,MH-50),rnd(a,b),cols)};
  if(cond=='mud'||cond=='animals')sp(cond=='mud'?22:14,MUD,14,34);
  if(cond=='leaves'){sp(9,MUD,12,26);this.mx.textBaseline='middle';this.mx.textAlign='center';for(let i=0;i<30;i++){this.mx.save();this.mx.translate(rnd(20,MW-20),rnd(30,MH-40));this.mx.rotate(rnd(-1.5,1.5));this.mx.font=Math.round(rnd(24,40))+'px sans-serif';this.mx.fillText(pk(['🍂','🍁','🍃','🍂']),0,0);this.mx.restore()}}
  if(cond=='snow'){sp(16,['#ffffff','#f5fbff','#e3f2fd'],14,30);for(let x=0;x<MW;x+=7)if(this.top[x]<MH){blob(this.mx,x,this.top[x]+8,rnd(10,16),'#ffffff',8)}}
  if(cond=='paint')sp(20,COL.map(hexS),12,30);
  this.dirty=true;this.clean=false;this.cov0=0;this.rig.x=-this.dw;this.rig.y=this.vy;this.rig.angle=0;this.busy=true;
  if(cond=='animals'){const n=ri(2,3);const L=VEH12.indexOf(k);for(let i=0;i<n;i++){const ak=pk(['a_chick','a_cat','a_rabbit','a_dog','a_monkey']);const fx=.22+i*.24+rnd(-.04,.04),tx=Math.floor(fx*MW);const y=(this.top[tx]/MH-.5)*this.dh;
   const o=this.add.image((fx-.5)*this.dw,y,ak).setOrigin(.5,.92);o.setScale(this.U*11/Math.max(o.width,o.height));if(R()<.5)o.setFlipX(true);o._k=ak;o.setInteractive();o.on('pointerdown',(p,lx,ly,ev)=>{ev.stopPropagation();this.hopOff(o)});this.rig.add(o);this.riders.push(o);
   this.tweens.add({targets:o,y:y-this.U*1.2,duration:rnd(300,450),yoyo:true,repeat:-1,ease:'Sine.easeInOut'})}}
  this.comp();this.wheelSpin=true;this.snd('roll',{v:.5});try{PJ.snd(k)}catch(e){}
  this.tweens.add({targets:this.rig,x:this.vx,duration:1300,ease:'Back.easeOut',onUpdate:()=>{if(R()<.3)this.fxDust.explode(2,this.rig.x-this.dw*.35,this.F)},onComplete:()=>{this.wheelSpin=false;this.busy=false;this.snd('soft_h');
   const say={mud:'脏脏的'+nm(k)+'，洗一洗吧！',leaves:'哎呀，'+nm(k)+'掉进落叶堆啦！',snow:nm(k)+'身上全是雪，好冷呀！',paint:'哎呀，'+nm(k)+'掉进颜料桶啦！',animals:'小动物搭着'+nm(k)+'来洗澡啦！'}[cond];sayT(say,0);
   if(cond=='snow')this.time.delayedCall(1800,()=>this.shiver());this.cov0=0}})}
 hopOff(o){if(o._off)return;o._off=1;const k=o._k;try{PJ.snd(k)}catch(e){}sayT(nm(k)+'跳下来啦！',0);this.snd('pluck2',{v:.6});this.tweens.killTweensOf(o);const wx=this.rig.x+o.x,wy=this.rig.y+o.y;this.rig.remove(o);o.setPosition(wx,wy).setDepth(14);this.riders=this.riders.filter(r=>r!=o);
  const dir=wx<this.W/2?-1:1;this.tweens.add({targets:o,x:wx+dir*this.U*14,y:wy-this.U*12,duration:350,ease:'Quad.easeOut',onComplete:()=>{this.tweens.add({targets:o,y:this.F,duration:300,ease:'Quad.easeIn',onComplete:()=>{this.fxHeart.explode(4,o.x,o.y-this.U*4);this.tweens.add({targets:o,x:dir<0?-this.U*20:this.W+this.U*20,duration:1600,onComplete:()=>o.destroy()});this.tweens.add({targets:o,y:o.y-this.U*3,duration:160,yoyo:true,repeat:5})}})}})}
 /* ---------- wheels ---------- */
 setWheels(i,quiet){this.wheelO.forEach(w=>{if(quiet){w.destroy();return}const wx=this.rig.x+w.x,wy=this.rig.y+w.y;this.rig.remove(w);w.setPosition(wx,wy).setDepth(15);this.tweens.add({targets:w,x:wx+rnd(-1,1)*this.U*30,y:-this.U*20,angle:720,duration:700,ease:'Quad.easeIn',onComplete:()=>w.destroy()})});this.wheelO=[];this.wi=i;
  const [key,nmS,s0]=WHEELS[i];const meta=VMETA[this.curV];let lift=0;let gp=9;const xs=meta.w.map(w=>w[0]).sort((p,q)=>p-q);for(let k=1;k<xs.length;k++)gp=Math.min(gp,xs[k]-xs[k-1]);const fm=Math.max(...meta.w.map(w=>w[2]));const s=Math.max(Math.min(s0,1.12),Math.min(s0,gp*this.dw/(2.05*fm*this.dh)));
  if(key)meta.w.forEach(([fx,fy,fr],j)=>{const r=fr*this.dh*s;lift=Math.max(lift,fr*this.dh*(s-1));const w=this.add.image((fx-.5)*this.dw,(fy-.5)*this.dh,key).setDisplaySize(r*2,r*2);this.rig.add(w);this.wheelO.push(w);if(!quiet){w.y-=this.U*30;this.tweens.add({targets:w,y:(fy-.5)*this.dh,duration:500,delay:j*90,ease:'Bounce.easeOut'})}});
  if(quiet){this.rig.y=this.vy;return}this.tweens.add({targets:this.rig,y:this.vy-lift,duration:600,ease:'Back.easeOut'});this.snd('metal_l',{v:.7});this.time.delayedCall(450,()=>{this.snd('metal_h',{v:.4,rate:1.3});this.burstStar(this.rig.x,this.F,10)});sayT(nmS,0)}
 swapWheels(){if(this.busy)return;this.setWheels((this.wi+1)%WHEELS.length);if(this.wi==2)this.time.delayedCall(700,()=>{try{horn()}catch(e){}this.cameras.main.shake(200,.006);sayT('哇！好高的怪兽车！',0)})}
 /* ---------- accessories ---------- */
 clearAcc(){Object.values(this.acc).forEach(o=>o&&o.destroy());this.acc={};this.hatI=-1}
 cabTop(fx){const x0=Math.floor(fx*this.MW);let t=this.MH;for(let x=x0-12;x<=x0+12;x++)if(x>=0&&x<this.MW)t=Math.min(t,this.top[x]);return(t/this.MH-.5)*this.dh}
 toggle(n){if(this.busy)return;const U=this.U,dw=this.dw,dh=this.dh,meta=VMETA[this.curV],cx=(meta.cab-.5)*dw;
  if(this.acc[n]&&n!='hat'){this.acc[n].destroy();this.acc[n]=null;this.snd('pluck1',{v:.5});return}
  if(n=='hat'){if(this.acc.hat)this.acc.hat.destroy();this.hatI=(this.hatI+1)%HATS.length;const [e,hn]=HATS[this.hatI];const o=this.add.text(cx,this.cabTop(meta.cab)+U*1.5,e,{fontSize:Math.round(U*11)+'px'}).setOrigin(.5,.9);this.acc.hat=o;sayT(hn,0)}
  if(n=='flag'){const o=this.add.container(-.42*dw,this.cabTop(.1)+U);const g=this.add.graphics();g.fillStyle(0x795548,1);g.fillRect(-U*.4,-U*16,U*.8,U*16);o.add(g);const f=this.add.text(0,-U*16,'🚩',{fontSize:Math.round(U*9)+'px'}).setOrigin(.15,.2);o.add(f);this.tweens.add({targets:f,scaleX:.85,duration:300,yoyo:true,repeat:-1});this.acc.flag=o}
  if(n=='horn'){const o=this.add.text(.47*dw,-.02*dh,'📯',{fontSize:Math.round(U*9)+'px'}).setOrigin(.3,.5).setInteractive();o.on('pointerdown',(p,lx,ly,ev)=>{ev.stopPropagation();this.honk(o)});this.acc.horn=o;this.time.delayedCall(250,()=>this.honk(o))}
  if(n=='light'){const o=this.add.container(cx-U*6,this.cabTop(meta.cab)+U*1);const glow=this.add.circle(0,-U*2,U*5,0xff1744,.5).setBlendMode('ADD');const s=this.add.text(0,0,'🚨',{fontSize:Math.round(U*7)+'px'}).setOrigin(.5,.9);
   const beam=this.add.graphics().setBlendMode('ADD');beam.fillStyle(0xfff59d,.35);const bx=.5*dw-cx+U*6,by=.1*dh-this.cabTop(meta.cab)-U;beam.fillTriangle(bx,by,bx+U*28,by-U*9,bx+U*28,by+U*11);o.add([beam,glow,s]);
   let t=0;o._ev=this.time.addEvent({delay:260,loop:true,callback:()=>{t^=1;glow.setFillStyle(t?0x2979ff:0xff1744,.5);beam.setAlpha(t?.6:1)}});o.once('destroy',()=>o._ev.remove());this.acc.light=o;
   try{for(let i=0;i<4;i++)tone(i%2?650:900,.25,'square',.04,i*.28)}catch(e){}}
  if(n=='eyes'){const o=this.add.container(cx+U*1,this.cabTop(meta.cab)+dh*.13);const mkE=x=>{const w=this.add.circle(x,0,U*2.8,0xffffff).setStrokeStyle(U*.5,0x212121);const p=this.add.circle(x,0,U*1.3,0x111111);o.add([w,p]);return p};o._p=[mkE(-U*3.2),mkE(U*3.2)];this.acc.eyes=o;
   o._blink=this.time.addEvent({delay:2600,loop:true,callback:()=>this.tweens.add({targets:o,scaleY:.15,duration:80,yoyo:true})});o.once('destroy',()=>o._blink.remove());sayT('大眼睛！',0)}
  const o=this.acc[n];this.rig.add(o);const s=o.scale;o.setScale(.01);this.tweens.add({targets:o,scale:s,duration:400,ease:'Back.easeOut'});this.snd('pluck2',{v:.6,rate:1.2});this.burstStar(this.rig.x+o.x,this.rig.y+o.y,8)}
 honk(o){try{horn()}catch(e){}if(o)this.squash(o,1.4);this.tweens.add({targets:this.rig,scaleY:1.05,duration:90,yoyo:true});const n=this.add.image(this.rig.x+this.dw*.5,this.rig.y-this.U*4,'note').setTint(pk(COL)).setDepth(40).setScale(this.U*.1);this.tweens.add({targets:n,y:n.y-this.U*12,x:n.x+this.U*6,alpha:0,duration:800,onComplete:()=>n.destroy()});sayT('嘀嘀！',600)}
 /* ---------- reactions ---------- */
 eyesMood(sy,ms){const e=this.acc.eyes;if(!e)return;this.tweens.add({targets:e,scaleY:sy,duration:120,yoyo:true,hold:ms})}
 giggle(){this.react=this.time.now;sayT(pk(['嘻嘻嘻，好痒！','哈哈哈，好痒呀！','咯咯咯～','痒痒痒！']),0);this.eyesMood(.3,700);
  this.tweens.add({targets:this.rig,angle:{from:-3,to:3},duration:90,yoyo:true,repeat:4,onComplete:()=>this.rig.angle=0});try{for(let i=0;i<6;i++)tone(700+(i%2)*180+i*30,.07,'triangle',.07,i*.09)}catch(e){}}
 shiver(){this.react=this.time.now;sayT(pk(['哇，好凉！','冷冷冷～','哆哆嗦嗦！']),0);this.eyesMood(1.4,500);const x0=this.rig.x;this.tweens.add({targets:this.rig,x:{from:x0-this.U*.8,to:x0+this.U*.8},duration:40,yoyo:true,repeat:9,onComplete:()=>this.rig.x=x0});
  try{for(let i=0;i<6;i++)tone(170+(i%2)*20,.08,'sawtooth',.05,i*.07)}catch(e){}}
 sneeze(){this.lastSneeze=this.time.now;this.react=this.time.now;sayT('阿……阿……阿嚏！',0);const rg=this.rig,y0=rg.y;
  this.tweens.add({targets:rg,scaleY:1.07,scaleX:.97,duration:450,yoyo:true,repeat:1,ease:'Sine.easeInOut'});try{tone(300,.4,'sine',.06,0,500);tone(320,.4,'sine',.06,.9,560)}catch(e){}
  this.time.delayedCall(1500,()=>{noiseS(.45,1800,.55,500);this.cameras.main.shake(260,.012);this.tweens.add({targets:rg,y:y0-this.U*5,duration:120,yoyo:true,ease:'Quad.easeOut'});this.eyesMood(.1,300);
   const c=this.fx;c.globalCompositeOperation='destination-out';for(let i=0;i<70;i++){c.beginPath();c.arc(rnd(0,this.MW),rnd(0,this.MH),rnd(10,26),0,7);c.fill()}c.globalCompositeOperation='source-over';this.dirty=true;
   this.fxBub.explode(26,rg.x+this.dw*.35,rg.y);this.fxMono.particleTint=0xffffff;this.fxMono.ops.angle.start=0;this.fxMono.explode(20,rg.x+this.dw*.45,rg.y-this.U*3);this.fxMono.ops.angle.start=200;
   this.time.delayedCall(700,()=>sayT(pk(['哈哈，泡泡钻进鼻子啦！','好痒的泡泡！']),0))})}
 /* ---------- painting / foam / mud ---------- */
 foamAt(x,y){const c=this.fx;c.globalCompositeOperation='source-over';for(let i=0;i<7;i++){const bx=x+rnd(-17,17),by=y+rnd(-14,14),r=rnd(7,16);const g=c.createRadialGradient(bx-r*.35,by-r*.35,r*.1,bx,by,r);
  g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.65,'rgba(246,250,255,.98)');g.addColorStop(1,'rgba(185,212,235,.92)');c.fillStyle=g;c.beginPath();c.arc(bx,by,r,0,7);c.fill()}
  if(R()<.3){c.strokeStyle=pk(['rgba(244,143,177,.6)','rgba(128,222,234,.6)']);c.lineWidth=1.5;c.beginPath();c.arc(x+rnd(-10,10),y+rnd(-10,10),rnd(4,8),3.5,5);c.stroke()}}
 erase(c,x,y,r){c.globalCompositeOperation='destination-out';c.beginPath();c.arc(x,y,r,0,7);c.fill();c.globalCompositeOperation='source-over'}
 sprayAt(a,l0,l1){const c=this.px,col=this.colOf(a),d=Math.hypot(l1.x-l0.x,l1.y-l0.y),n=Math.max(1,Math.ceil(d/4));c.fillStyle=col;
  for(let s=0;s<=n;s++){const x=l0.x+(l1.x-l0.x)*s/n,y=l0.y+(l1.y-l0.y)*s/n;c.globalAlpha=.35;c.beginPath();c.arc(x,y,11,0,7);c.fill();c.globalAlpha=.8;for(let i=0;i<10;i++){const r=Math.abs(rnd(-1,1)+rnd(-1,1))*10,an=R()*7;c.fillRect(x+Math.cos(an)*r,y+Math.sin(an)*r,1.6,1.6)}}c.globalAlpha=1;
  return col}
 sticker(p){if(this.busy)return;const l=this.toLocal(p);if(!this.inCar(l)){this.burstStar(p.x,p.y,4);return}const [e,n]=STK[this.stk];const U=this.U;let lab=e,name=n;if(e=='123'){const d=ri(1,9);lab=String(d);name='数字'+'零一二三四五六七八九'[d]}
  const t=this.add.text(p.x,p.y,lab,{fontSize:Math.round(U*9)+'px',fontStyle:'bold',color:'#fff',backgroundColor:e=='123'?hexS(pk(COL)):null,padding:e=='123'?{x:U,y:0}:null}).setOrigin(.5).setDepth(40).setScale(2.2).setAngle(rnd(-20,20));
  this.tweens.add({targets:t,scale:1,duration:200,ease:'Back.easeIn',onComplete:()=>{const c=this.px,s=this.MW/this.dw;c.save();c.translate(l.x,l.y);c.rotate(t.angle*Math.PI/180);c.textAlign='center';c.textBaseline='middle';
    if(e=='123'){c.fillStyle=t.style.backgroundColor;c.beginPath();c.arc(0,0,U*5*s,0,7);c.fill();c.lineWidth=3;c.strokeStyle='#fff';c.stroke();c.fillStyle='#fff';c.font='bold '+Math.round(U*7*s)+'px sans-serif';c.fillText(lab,0,2)}else{c.font=Math.round(U*9*s)+'px sans-serif';c.fillText(lab,0,0)}c.restore();this.dirty=true;t.destroy();this.burstStar(p.x,p.y,6)}});
  this.snd('punch',{v:.45,rate:rnd(1.3,1.6),gap:60});sayT(name,0)}
 /* ---------- composite + checks ---------- */
 comp(){const c=this.ct.context,MW=this.MW,MH=this.MH;c.clearRect(0,0,MW,MH);c.globalCompositeOperation='source-over';c.drawImage(this.mud,0,0);c.drawImage(this.paint,0,0);c.drawImage(this.foam,0,0);c.globalCompositeOperation='destination-in';c.drawImage(this.maskC,0,0);c.globalCompositeOperation='source-over';this.ct.refresh();this.dirty=false}
 cov(cv){const s=this.small.getContext('2d');s.clearRect(0,0,80,60);s.drawImage(cv,0,0,80,60);const d=s.getImageData(0,0,80,60).data;let n=0,m=0;for(let y=0;y<60;y++)for(let x=0;x<80;x++){if(this.alpha[(y*5+2)*this.MW+x*5+2]<100)continue;m++;if(d[(y*80+x)*4+3]>50)n++}return m?n/m:0}
 check(){if(this.busy)return;const md=this.cov(this.mud),fm=this.cov(this.foam);const c=md+fm;if(c>this.cov0)this.cov0=c;
  if(fm>.3&&this.time.now-this.lastSneeze>9000&&this.time.now-this.react>1500)this.sneeze();
  if(this.cov0>.08&&c<.025&&!this.clean){this.clean=true;this.shine()}if(c>.1)this.clean=false}
 shine(){const U=this.U,rg=this.rig;this.snd('confirm');sayT(pk(['亮晶晶！','好干净呀！','闪闪发光！']),0);this.eyesMood(1.3,800);
  for(let i=0;i<10;i++)this.time.delayedCall(i*90,()=>this.burstStar(rg.x+rnd(-this.dw*.4,this.dw*.4),rg.y+rnd(-this.dh*.3,this.dh*.2),5));
  const bar=this.add.rectangle(rg.x-this.dw*.6,rg.y,U*5,this.dh*.9,0xffffff,.55).setDepth(12).setAngle(20).setBlendMode('ADD');this.tweens.add({targets:bar,x:rg.x+this.dw*.6,duration:700,onComplete:()=>bar.destroy()});
  this.time.delayedCall(700,()=>{try{horn();setTimeout(()=>horn(),350)}catch(e){}this.tweens.add({targets:rg,y:rg.y-U*4,duration:180,yoyo:true,repeat:1,ease:'Quad.easeOut'})});
  if(this.go)this.go.destroy();this.go=this.button(this.W/2,this.H*.27,U*7,'🏁','开走啦！去表演！',()=>this.runway(),{tint:0xfff176});this.tweens.add({targets:this.go,scale:1.15,duration:500,yoyo:true,repeat:-1});
  this.time.delayedCall(9000,()=>{if(this.go&&this.go.active&&!this.busy)this.runway()})}
 /* ---------- show-off runway ---------- */
 runway(){if(this.busy)return;this.busy=true;if(this.go){this.go.destroy();this.go=null}this.tray(null);this.act.clear();const W=this.W,H=this.H,U=this.U,F=this.F,rg=this.rig;
  this.side.forEach(b=>this.tweens.add({targets:b,alpha:0,duration:200}));const ob=[];
  const g=this.add.graphics().setDepth(6);g.fillStyle(0xd32f2f,1);g.fillRect(0,F-U*2,W,U*6);g.fillStyle(0xffd54f,1);for(let x=U*3;x<W;x+=U*8){g.fillCircle(x,F-U*2,U*.8);g.fillCircle(x+U*4,F+U*4,U*.8)}ob.push(g);
  const aud=['a_dog','a_cat','a_rabbit','a_chick','a_monkey','a_cow'];[.06,.18,.3,.7,.82,.94].forEach((fx,i)=>{const k=aud[i];const o=this.add.image(fx*W,H+U*12,k).setDepth(16).setOrigin(.5,1);o.setScale(U*12/Math.max(o.width,o.height));ob.push(o);
   this.tweens.add({targets:o,y:H+U*2,duration:400,delay:i*80,ease:'Back.easeOut',onComplete:()=>this.tweens.add({targets:o,y:H-U*1,duration:rnd(220,320),yoyo:true,repeat:-1})})});
  const flash=this.time.addEvent({delay:280,loop:true,callback:()=>{const x=rnd(W*.1,W*.9),y=rnd(H*.2,H*.5);const f=this.add.circle(x,y,U*4,0xffffff,.9).setDepth(45).setBlendMode('ADD');this.tweens.add({targets:f,scale:3,alpha:0,duration:250,onComplete:()=>f.destroy()});this.snd('click',{v:.3,rate:1.6,gap:100})}});
  sayT(pk(['看我多漂亮！','我是最漂亮的车！','表演开始啦！']),0);try{PJ.snd(this.curV)}catch(e){}
  const y0=rg.y;this.tweens.chain({targets:rg,tweens:[
   {x:W*.3,duration:900,ease:'Sine.easeInOut',onStart:()=>this.wheelSpin=true},
   {y:y0-U*10,duration:280,ease:'Quad.easeOut',onStart:()=>{this.wheelSpin=false;try{horn()}catch(e){}}},{y:y0,duration:420,ease:'Bounce.easeOut'},
   {angle:-10,duration:250,yoyo:true,hold:300,onStart:()=>{this.fxConf.explode(50,W*.3,H*.4);this.snd(pk(['jin_s','jin_p','jin_n']),{v:.6});this.burstStar(rg.x,rg.y,20)}},
   {x:W+this.dw,duration:1300,ease:'Quad.easeIn',onStart:()=>{this.wheelSpin=true;try{horn()}catch(e){}try{tone(110,1.2,'sawtooth',.06,0,260)}catch(e){}sayT('嘀嘀！拜拜！',0)},onUpdate:()=>{if(R()<.4)this.fxDust.explode(2,rg.x-this.dw*.4,F)}}],
   onComplete:()=>{flash.remove();this.party();try{PJ.party()}catch(e){};ob.forEach(o=>this.tweens.add({targets:o,alpha:0,duration:400,onComplete:()=>o.destroy()}));this.side.forEach(b=>this.tweens.add({targets:b,alpha:1,duration:300}));this.wet=0;this.muddy=0;
    this.time.delayedCall(600,()=>{this.busy=false;this.arrive()})}})}
 leave(){this.busy=true;if(this.go){this.go.destroy();this.go=null}this.snd('roll');try{horn()}catch(e){}this.wheelSpin=true;this.tweens.add({targets:this.rig,x:this.W+this.dw,duration:800,ease:'Back.easeIn',onComplete:()=>{this.busy=false;this.arrive()}})}
 puddle(){const g=this.pud;g.clear();if(this.wet<.02)return;const w=this.dw*(.35+.75*this.wet),h=this.U*(2.5+3*this.wet);const c=Phaser.Display.Color.Interpolate.ColorWithColor(Phaser.Display.Color.ValueToColor(0x4fc3f7),Phaser.Display.Color.ValueToColor(0x6d4c41),100,Math.round(this.muddy*80));
  g.fillStyle(Phaser.Display.Color.GetColor(c.r,c.g,c.b),.55);g.fillEllipse(this.rig.x,this.F+this.U*.5,w,h);g.fillStyle(0xffffff,.35);g.fillEllipse(this.rig.x-w*.2,this.F,w*.25,h*.25)}
 drip(){if(this.drips>14)return;this.drips++;const U=this.U,x=ri(20,this.MW-20);if(this.bot[x]<10){this.drips--;return}const wx=this.rig.x+(x/this.MW-.5)*this.dw,wy=this.rig.y+(this.bot[x]/this.MH-.5)*this.dh;
  const d=this.add.image(wx,wy,'drop').setDepth(12).setScale(U*.07).setTint(this.muddy>.4&&R()<.6?0x8d6e63:0x4fc3f7).setAlpha(.9);const ty=this.F+rnd(-U,U*1.5);
  this.tweens.add({targets:d,y:ty,duration:Math.max(120,Math.sqrt(Math.max(1,ty-wy))*28),ease:'Quad.easeIn',onComplete:()=>{d.destroy();this.drips--;const r=this.add.ellipse(wx,ty,U*1.5,U*.6).setStrokeStyle(U*.25,0xe1f5fe,.8).setDepth(6);this.tweens.add({targets:r,scaleX:3,scaleY:3,alpha:0,duration:450,onComplete:()=>r.destroy()});this.snd('drop1',{v:.12,rate:rnd(1.3,1.9),gap:160})}})}
 update(t,dt){const U=this.U;this.stream.clear();let spray=false;
  if(!this.busy)this.act.forEach((a,id)=>{const p=a.p;if(!p.isDown){this.act.delete(id);return}const l=this.toLocal(p),l0=this.toLocal({x:a.lx,y:a.ly}),mv=Math.hypot(p.x-a.lx,p.y-a.ly),T=this.tool,on=this.inCar(l);
   if(T=='mud'){if(mv>U*1.5||!a.t){a.t=1;splatTo(this.mx,l.x,l.y,rnd(9,18),['#6d4c41','#795548','#5d4037','#8d6e63'],R()<.4);this.dirty=true;this.snd(pk(['soft_m','snow']),{v:.5,rate:rnd(.8,1.2),gap:110});if(R()<.4)this.mono(p.x,p.y,0x6d4c41,3)}}
   else if(T=='soap'){this.foamAt(l.x,l.y);this.dirty=true;if(R()<.2)this.fxBub.explode(1,p.x,p.y);this.snd('drop2',{v:.2,rate:rnd(1.6,2.2),gap:130});if(on)this.scrub+=mv}
   else if(T=='water'){const s=this.stream,nz={x:this.W*.5+(p.x-this.W*.5)*.3,y:this.H+U*2};s.lineStyle(U*2.2,0x4fc3f7,.55);s.lineBetween(nz.x,nz.y,p.x,p.y);s.lineStyle(U*.9,0xe1f5fe,.9);s.lineBetween(nz.x,nz.y,p.x,p.y);
    const before=on?1:0;this.erase(this.mx,l.x,l.y,22);this.erase(this.fx,l.x,l.y,24);this.dirty=true;if(R()<.5)this.fxWater.explode(2,p.x,p.y);this.thr('w',150)&&noiseS(.16,2200,.06);
    if(on){this.wetT=2500;this.wetHit+=dt;this.wet=Math.min(1,this.wet+dt/9000);this.muddy=Phaser.Math.Clamp(this.muddy+(this.cov0>.05&&!this.clean?.002:-.001),0,1)}
    this.riders.forEach(r=>{if(Math.hypot(this.rig.x+r.x-p.x,this.rig.y+r.y-U*5-p.y)<U*8)this.hopOff(r)})}
   else if(T=='dry'){this.erase(this.fx,l.x,l.y,14);this.dirty=true;if(R()<.3)this.fxDust.explode(1,p.x,p.y);this.thr('d',150)&&noiseS(.16,700,.06);this.wetT=Math.max(0,this.wetT-dt*2);this.wet=Math.max(0,this.wet-dt/6000);if(on)this.scrub+=mv}
   else if(T=='spray'){spray=true;const col=this.sprayAt(a,l0,l);this.dirty=true;this.can.setVisible(true).setPosition(p.x+U*6,p.y+U*6);this.canBody.setFillStyle(Phaser.Display.Color.ValueToColor(col.startsWith('#')?col:'#ff4081').color);
    const s=this.stream;s.fillStyle(0xffffff,.35);s.fillTriangle(p.x+U*3.5,p.y+U*3.5,p.x-U*1.5,p.y+U*.5,p.x+U*.5,p.y-U*1.5);if(R()<.3){this.fxMono.particleTint=Phaser.Display.Color.ValueToColor(col.startsWith('#')?col:'#ff4081').color;this.fxMono.explode(1,p.x,p.y)}this.thr('s',140)&&noiseS(.16,4200,.05);
    if(on&&R()<.004)sayT(pk(['好漂亮的颜色！','变成新衣服啦！']),3000)}
   a.lx=p.x;a.ly=p.y});
  if(!spray)this.can.setVisible(false);
  const now=this.time.now;if(this.scrub>U*90&&now-this.react>2500){this.scrub=0;this.giggle()}if(this.wetHit>1600&&now-this.react>3500){this.wetHit=0;this.shiver()}
  if(this.wetT>0){this.wetT-=dt;if(R()<dt/90)this.drip()}else this.wet=Math.max(0,this.wet-dt/40000);
  if((this._pt=(this._pt||0)+dt)>120){this._pt=0;this.puddle()}
  if(this.dirty)this.comp();
  if(this.wheelSpin)this.wheelO.forEach(w=>w.angle+=dt*.6);
  const e=this.acc.eyes;if(e&&e._p){const p=this.input.activePointer;e._p.forEach((pp,i)=>{const ex=this.rig.x+e.x+(i?U*3.2:-U*3.2),ey=this.rig.y+e.y;const an=Math.atan2(p.y-ey,p.x-ex);pp.setPosition((i?U*3.2:-U*3.2)+Math.cos(an)*U*1.2,Math.sin(an)*U*1.2)})}}
}
/* ================= 魔法画画 Magic paint: free paint / coloring pages / scratch reveal / gallery ================= */
const CP=['excavator','bulldozer','crane','dump','fire','forklift','loader','mixer','roller','tow','water','drill','dog','cat','elephant','house','castle','trex','bronto'];
const CPK=k=>VEH12.includes(k)?'veh':['dog','cat','elephant'].includes(k)?'animal':['trex','bronto'].includes(k)?'dino':k=='free'?'free':'house';
const CPN=k=>VEH12.includes(k)?nm(k):({dog:'小狗',cat:'小猫',elephant:'大象',house:'小房子',castle:'城堡',trex:'霸王龙',bronto:'长脖子恐龙',free:'我的画'})[k]||'';
const GKEY='tt_gallery_v1';
const galLoad=()=>{try{return JSON.parse(localStorage.getItem(GKEY)||'[]')}catch(e){return[]}};
const galSave=it=>{const g=galLoad();g.push(it);while(g.length>12)g.shift();for(let i=0;i<8&&g.length;i++){try{localStorage.setItem(GKEY,JSON.stringify(g));return}catch(e){g.shift()}}};
const SCR=VEH12.concat(['a_dog','a_cat','a_cow','a_rabbit','a_chick','a_monkey','a_elephant','it_dino','p_rocket','p_train','p_heli','it_bear','p_balloon','p_butterfly']);
const DPR=['涂得真漂亮！','好多颜色呀！','小画家真棒！','哇，太好看啦！'];
class Draw extends Base{
 constructor(){super('Draw')}
 create(){this.base();const W=this.W,H=this.H,U=this.U;this.cameras.main.setBackgroundColor('#fff8e1');
  if(this.textures.exists('paper'))this.textures.remove('paper');this.ct=this.textures.createCanvas('paper',W,H);this.cx=this.ct.context;this.paperI=this.add.image(0,0,'paper').setOrigin(0).setDepth(1);
  this.ink=0;this.nextWin=900;this.col=ri(-1,7);this.hue=ri(0,359);this.act=new Map();this.dripL=[];this.pours=[];this.lock=false;
  const pw=this.pw=Math.min(W*.62,H*.7*4/3),ph=this.ph=pw*.75;this.pcx=W*.5;this.pcy=H*.5;this.px0=this.pcx-pw/2;this.py0=this.pcy-ph/2;
  this.card=this.add.graphics().setDepth(1.5);this.drawCard(0xffffff);
  if(this.textures.exists('cfill'))this.textures.remove('cfill');this.cf=this.textures.createCanvas('cfill',400,300);this.cfI=this.add.image(this.pcx,this.pcy,'cfill').setDisplaySize(pw,ph).setDepth(2);
  this.lineI=this.add.image(this.pcx,this.pcy,'cp_'+CP[0]).setDisplaySize(pw,ph).setDepth(3);
  this.scI=this.add.image(this.pcx,this.pcy,'bulldozer').setDepth(2.5);
  if(this.textures.exists('scov'))this.textures.remove('scov');this.sc=this.textures.createCanvas('scov',Math.round(pw),Math.round(ph));this.scC=this.add.image(this.pcx,this.pcy,'scov').setDepth(4);this.small=document.createElement('canvas');this.small.width=40;this.small.height=30;
  const pal=this.pal=COL.map((c,i)=>{const b=this.button(W/2+(i-4)*U*10,H-U*7,U*4.4,'',CNAME[i],()=>{this.col=i;this.sel(pal,b)},{tint:c});b.bg.setTint(c);b._i=i;return b});
  const rb=this.button(W/2+4*U*10,H-U*7,U*4.4,'🌈','彩虹',()=>{this.col=-1;this.sel(pal,rb)});rb._i=-1;pal.push(rb);this.sel(pal,pal.find(b=>b._i==this.col));
  const tl=[['brush','🖌️','画笔'],['truck','🚜','小车开过来'],['splat','💥','泼颜料'],['stamp','bulldozer','印章'],['star','✨','星星'],['wipe','🧽','擦干净']];
  this.tb=tl.map(([m,ic,n],i)=>{const b=this.button(W-U*8,U*21+i*U*11.5,U*4.8,ic,n,()=>{if(m=='wipe'){this.wipe();return}this.tool=m;this.sel(this.tb,b)});b._m=m;return b});
  this.done=this.button(U*8,U*24,U*6,'✅','画好啦',()=>this.finish(),{tint:0xc5e1a5});
  this.dice=this.button(U*8,U*40,U*5.5,'🎲','换一张',()=>this.next(),{tint:0xffe082});
  const md=[['free','🖍️','自由画画'],['color','📖','涂颜色'],['scratch','🪄','刮刮乐'],['gallery','🖼️','我的画廊']];
  this.mb=md.map(([m,ic,n],i)=>{const b=this.button(W/2+(i-1.5)*U*12.5,U*7.5,U*5,ic,n,()=>this.setMode(m),{tint:[0xffcdd2,0xbbdefb,0xe1bee7,0xffe0b2][i]});b._m=m;return b});
  this.gal=null;
  this.input.on('pointerdown',(p,over)=>{if(over.length||this.lock)return;this.down(p)});
  this.input.on('pointerup',p=>{const a=this.act.get(p.id);if(a&&a.veh)this.dropVeh(a);this.act.delete(p.id)});
  this.queue=Phaser.Utils.Array.Shuffle(CP.slice());this.tool=pk(['brush','truck','star','brush']);
  this.setMode(pk(['free','color','color','scratch']),true);
 }
 drawCard(col){const U=this.U,c=this.card,pw=this.pw,ph=this.ph;c.clear();c.fillStyle(0x000000,.12);c.fillRoundedRect(this.px0-U*1.5+U*.8,this.py0-U*1.5+U*1,pw+U*3,ph+U*3,U*2);c.fillStyle(col,1);c.fillRoundedRect(this.px0-U*1.5,this.py0-U*1.5,pw+U*3,ph+U*3,U*2)}
 sel(arr,b){arr.forEach(x=>x.ring.setVisible(x==b))}
 colRGB(a){if(a.ci>=0)return COL[a.ci];this.hue=(this.hue+3)%360;return Phaser.Display.Color.HSLToColor(((this.hue+a.ho)%360)/360,.9,.55).color}
 colOf(a){return hexS(this.colRGB(a))}
 setMode(m,first){if(this.lock)return;const W=this.W,H=this.H;this.mode=m;this.act.forEach(a=>a.veh&&a.veh.destroy());this.act.clear();this.sel(this.mb,this.mb.find(b=>b._m==m));if(this.scT){this.scT.remove();this.scT=null}
  const F=m=='free',C=m=='color',S=m=='scratch',G=m=='gallery';
  this.paperI.setVisible(F);this.card.setVisible(C||S);this.cfI.setVisible(C);this.lineI.setVisible(C);this.scI.setVisible(S);this.scC.setVisible(S);
  this.tb.forEach(b=>b.setVisible(F));this.pal.forEach(b=>b.setVisible(F||C));this.done.setVisible(F||C);this.dice.setVisible(C||S);
  if(this.gal){this.gal.destroy();this.gal=null}
  if(F){this.sel(this.tb,this.tb.find(b=>b._m==this.tool));sayT(pk(['画画吧！','用手指画一画！','好几个手指一起画！']),first?300:0);this.pointHand(W*.45,H*.5)}
  if(C){this.drawCard(0xffffff);this.loadPage()}if(S)this.newScratch();if(G)this.gallery()}
 next(){if(this.lock)return;if(this.mode=='color'){this.tweens.add({targets:[this.lineI,this.cfI],alpha:0,duration:180,onComplete:()=>{this.loadPage();this.lineI.setAlpha(1);this.cfI.setAlpha(1)}})}else if(this.mode=='scratch')this.newScratch()}
 /* ---------- coloring page: region map with forgiving fill ---------- */
 loadPage(){const k=this.page=this.queue.shift();this.queue.push(k);this.lineI.setTexture('cp_'+k).setDisplaySize(this.pw,this.ph);
  const src=this.textures.get('cp_'+k).getSourceImage(),cw=400,ch=300,N=cw*ch;const tc=document.createElement('canvas');tc.width=cw;tc.height=ch;const t=tc.getContext('2d');t.drawImage(src,0,0,cw,ch);const d=t.getImageData(0,0,cw,ch).data;
  const line=new Uint8Array(N);for(let i=0;i<N;i++)if(d[i*4+3]>90)line[i]=1;
  const L2=new Uint8Array(N);for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){const i=y*cw+x;if(line[i]||(x>0&&line[i-1])||(x<cw-1&&line[i+1])||(y>0&&line[i-cw])||(y<ch-1&&line[i+cw]))L2[i]=1}
  const lab=new Int32Array(N),st=new Int32Array(N),area=[0];let n=0;
  for(let i=0;i<N;i++){if(L2[i]||lab[i])continue;n++;let sp=0,a=0;st[sp++]=i;lab[i]=n;while(sp){const j=st[--sp];a++;const x=j%cw;
   if(x>0&&!L2[j-1]&&!lab[j-1]){lab[j-1]=n;st[sp++]=j-1}if(x<cw-1&&!L2[j+1]&&!lab[j+1]){lab[j+1]=n;st[sp++]=j+1}if(j>=cw&&!L2[j-cw]&&!lab[j-cw]){lab[j-cw]=n;st[sp++]=j-cw}if(j<N-cw&&!L2[j+cw]&&!lab[j+cw]){lab[j+cw]=n;st[sp++]=j+cw}}area.push(a)}
  for(let i=0;i<N;i++)if(lab[i]&&area[lab[i]]<30)lab[i]=0;
  let qh=0,qt=0;for(let i=0;i<N;i++)if(lab[i])st[qt++]=i;
  while(qh<qt){const j=st[qh++],x=j%cw,l=lab[j];if(x>0&&!lab[j-1]){lab[j-1]=l;st[qt++]=j-1}if(x<cw-1&&!lab[j+1]){lab[j+1]=l;st[qt++]=j+1}if(j>=cw&&!lab[j-cw]){lab[j-cw]=l;st[qt++]=j-cw}if(j<N-cw&&!lab[j+cw]){lab[j+cw]=l;st[qt++]=j+cw}}
  const bg=new Set();for(let x=0;x<cw;x++){bg.add(lab[x]);bg.add(lab[N-cw+x])}for(let y=0;y<ch;y++){bg.add(lab[y*cw]);bg.add(lab[y*cw+cw-1])}
  this.lab=lab;this.area=area;this.bgL=bg;this.filled=new Map();this.pours=[];let tot=0;for(let l=1;l<area.length;l++)if(!bg.has(l)&&area[l]>=120)tot+=area[l];this.tot=tot||1;
  this.fid=this.cf.context.createImageData(cw,ch);this.f32=new Uint32Array(this.fid.data.buffer);this.cf.context.clearRect(0,0,cw,ch);this.cf.refresh();
  this.lineI.setScale(this.lineI.scaleX*.6,this.lineI.scaleY*.6);this.tweens.add({targets:this.lineI,scaleX:this.lineI.scaleX/.6,scaleY:this.lineI.scaleY/.6,duration:380,ease:'Back.easeOut'});this.snd('max',{v:.4});
  sayT(pk(['给','帮'])+CPN(k)+'涂上颜色吧！',0);this.pointHand(this.pcx,this.pcy)}
 fillAt(p,a){const cw=400,ch=300,x=Math.floor((p.x-this.px0)/this.pw*cw),y=Math.floor((p.y-this.py0)/this.ph*ch);if(x<0||y<0||x>=cw||y>=ch||!this.lab)return;const l=this.lab[y*cw+x];if(!l||l===a.lastL)return;a.lastL=l;
  const col=this.colRGB(a);if(this.filled.get(l)===col)return;this.filled.set(l,col);const v=(255<<24)|((col&255)<<16)|(col&0xff00)|((col>>16)&255);
  const px=[],ds=[];let mx=0;const lab=this.lab;for(let i=0;i<lab.length;i++)if(lab[i]===l){px.push(i);const dx=i%cw-x,dy=(i/cw|0)-y,dd=Math.sqrt(dx*dx+dy*dy);ds.push(dd);if(dd>mx)mx=dd}
  this.pours.push({px,ds,v,r:0,step:Math.max(10,mx/6),max:mx});
  const big=this.area[l]>4000;bell(NOTES[ri(0,7)],big?.16:.1);this.snd(big?'pluck1':'pluck2',{v:.5,rate:rnd(.9,1.3),gap:60});this.burstStar(p.x,p.y,big?8:4);if(a.ci>=0)sayT(CNAME[a.ci],700);else sayT('彩虹色',1500);
  if(!this.bgL.has(l)){let c=0;this.filled.forEach((cc,ll)=>{if(!this.bgL.has(ll)&&this.area[ll]>=120)c+=this.area[ll]});if(c/this.tot>.72&&!this.lock){this.lock=true;this.time.delayedCall(700,()=>{this.lock=false;this.finish()})}}}
 stepPours(){if(!this.pours.length)return;this.pours=this.pours.filter(o=>{o.r+=o.step;for(let i=0;i<o.px.length;i++)if(o.ds[i]<=o.r)this.f32[o.px[i]]=o.v;return o.r<o.max});this.cf.context.putImageData(this.fid,0,0);this.cf.refresh()}
 snapshot(){const cw=400,ch=300,c=document.createElement('canvas');c.width=cw;c.height=ch;const x=c.getContext('2d'),id=x.createImageData(cw,ch),o=new Uint32Array(id.data.buffer);
  for(let i=0;i<cw*ch;i++){if(this.bgL.has(this.lab[i]))continue;o[i]=this.f32[i]||0xffffffff}x.putImageData(id,0,0);x.drawImage(this.textures.get('cp_'+this.page).getSourceImage(),0,0,cw,ch);return c}
 /* ---------- finish: picture comes alive, then goes to the gallery ---------- */
 finish(){if(this.lock)return;if(this.mode=='color'){if(!this.filled.size){sayT('先涂上颜色吧！',0);return}this.alivePage()}else if(this.mode=='free'){if(this.ink<20){sayT('先画一画吧！',0);return}this.saveFree()}}
 alivePage(){this.lock=true;this.pours.forEach(p=>p.r=1e9);this.stepPours();const k=this.page,kind=CPK(k),c=this.snapshot(),key='alive'+(this._an=(this._an||0)+1);this.textures.addCanvas(key,c);
  const t=document.createElement('canvas');t.width=240;t.height=180;t.getContext('2d').drawImage(c,0,0,240,180);galSave({d:t.toDataURL('image/png'),k,kind,t:Date.now()});
  const spr=this.add.image(this.pcx,this.pcy,key).setDisplaySize(this.pw,this.ph).setDepth(20);this.lineI.setVisible(false);this.cfI.setVisible(false);this.burstStar(this.pcx,this.pcy,20);this.snd('confirm');
  this.animate(spr,kind,k,()=>{this.party(pk(DPR));this.flyToGallery(spr,()=>{this.textures.remove(key);this.lock=false;if(this.mode=='color'){this.cfI.setVisible(true);this.lineI.setVisible(true);this.loadPage()}})})}
 saveFree(){this.lock=true;const W=this.W,H=this.H,t=document.createElement('canvas');t.width=320;t.height=Math.round(320*H/W);const x=t.getContext('2d');x.fillStyle='#fff8e1';x.fillRect(0,0,t.width,t.height);x.drawImage(this.ct.getSourceImage(),0,0,t.width,t.height);
  galSave({d:t.toDataURL('image/jpeg',.75),k:'free',kind:'free',t:Date.now()});const key='alive'+(this._an=(this._an||0)+1);this.textures.addCanvas(key,t);const spr=this.add.image(W/2,H/2,key).setDisplaySize(W,H).setDepth(20);this.paperI.setVisible(false);
  this.tweens.add({targets:spr,displayWidth:W*.6,displayHeight:H*.6,duration:500,ease:'Back.easeOut',onComplete:()=>this.animate(spr,'free','free',()=>{this.party(pk(DPR));this.flyToGallery(spr,()=>{this.textures.remove(key);this.cx.clearRect(0,0,W,H);this.ct.refresh();this.ink=0;this.nextWin=900;this.dripL=[];this.paperI.setVisible(this.mode=='free');this.lock=false;sayT('又是新的一张纸！',0)})})})}
 flyToGallery(spr,cb){const b=this.mb[3];this.tweens.add({targets:spr,x:b.x,y:b.y,scale:spr.scale*.06,angle:360,duration:700,ease:'Quad.easeIn',onComplete:()=>{spr.destroy();this.squash(b,1.5);this.burstStar(b.x,b.y,12);this.snd('select',{v:.7});cb&&cb()}})}
 animate(spr,kind,key,cb){const U=this.U,W=this.W,x0=spr.x,y0=spr.y,nmS=CPN(key);
  if(kind=='veh'){try{horn()}catch(e){}try{PJ.snd(key)}catch(e){}sayT(pk([nmS+'活过来啦！','嘀嘀！'+nmS+'出发啦！']),0);let tr=null;
   this.tweens.chain({targets:spr,tweens:[{y:y0-U*6,duration:200,yoyo:true,repeat:1,ease:'Quad.easeOut'},{angle:-7,duration:160,yoyo:true},
    {x:W+spr.displayWidth*.6,duration:1300,ease:'Quad.easeIn',onStart:()=>{try{tone(110,1.3,'sawtooth',.05,0,300)}catch(e){}tr=this.time.addEvent({delay:60,loop:true,callback:()=>this.fxDust.explode(2,spr.x-spr.displayWidth*.4,spr.y+spr.displayHeight*.3)})}},
    {x:{from:-spr.displayWidth*.6,to:x0},duration:1200,ease:'Back.easeOut',onStart:()=>{try{horn()}catch(e){}}}],onComplete:()=>{tr&&tr.remove();cb&&cb()}})}
  else if(kind=='animal'){try{PJ.snd('a_'+key)}catch(e){}sayT(nmS+'跳起来啦！',0);
   this.tweens.chain({targets:spr,tweens:[{y:y0-U*12,duration:260,yoyo:true,ease:'Quad.easeOut',onYoyo:()=>{}},{y:y0-U*16,angle:360,duration:420,yoyo:true,ease:'Quad.easeOut'},{y:y0-U*10,duration:240,yoyo:true,ease:'Quad.easeOut'}],onComplete:()=>{spr.angle=0;this.fxHeart.explode(10,x0,y0-U*6);try{PJ.snd('a_'+key)}catch(e){}cb&&cb()}});this.time.delayedCall(260,()=>this.snd('pluck2',{v:.6}))}
  else if(kind=='dino'){sayT(nmS+'嗷呜！',0);noiseS(.9,260,.55,110);try{tone(85,.9,'sawtooth',.12,0,55)}catch(e){}const steps=[];for(let i=0;i<4;i++)steps.push({x:x0+(i%2?-1:1)*U*4,angle:i%2?-5:5,y:y0-U*3,duration:240,yoyo:true,onYoyo:()=>{this.cameras.main.shake(150,.01);this.snd('mining',{v:.6,gap:100});this.fxDust.explode(8,spr.x,y0+spr.displayHeight*.4)}});
   this.tweens.chain({targets:spr,tweens:steps,onComplete:()=>{spr.setPosition(x0,y0).setAngle(0);noiseS(.7,300,.4,120);cb&&cb()}})}
  else{if(kind=='house'){sayT(pk(['叮咚！有人在家吗？',nmS+'亮灯啦！']),0);try{[660,550].forEach((f,i)=>tone(f,.3,'sine',.12,i*.3))}catch(e){}}else{sayT(pk(['我的画会跳舞！','画活过来啦！']),0);try{chime()}catch(e){}}
   for(let i=0;i<8;i++)this.time.delayedCall(i*160,()=>this.burstStar(spr.x+rnd(-1,1)*spr.displayWidth*.4,spr.y+rnd(-1,1)*spr.displayHeight*.4,6));const sx=spr.scaleX,sy=spr.scaleY;
   this.tweens.add({targets:spr,scaleX:sx*1.08,scaleY:sy*.92,angle:{from:-4,to:4},duration:180,yoyo:true,repeat:3,onComplete:()=>{spr.setScale(sx,sy).setAngle(0);this.fxConf.explode(30,spr.x,spr.y-spr.displayHeight*.4);cb&&cb()}})}}
 /* ---------- gallery wall ---------- */
 gallery(){const W=this.W,H=this.H,U=this.U;const c=this.gal=this.add.container(0,0).setDepth(60);c.add(this.add.rectangle(0,0,W,H,0xffe0b2).setOrigin(0));const st=this.add.graphics();st.fillStyle(0xffcc80,.45);for(let x=0;x<W;x+=U*8)st.fillRect(x,0,U*4,H);c.add(st);
  const items=galLoad().slice().reverse(),cols=4,rows=3,fw=Math.min((W-U*34)/cols/1.12,(H-U*26)/rows/1.2*4/3),fh=fw*.75;
  if(!items.length){c.add(this.add.text(W/2,H*.5,'还没有画哦～\n快去画一张吧！',{fontSize:Math.round(U*6)+'px',color:'#e65100',align:'center',fontStyle:'bold'}).setOrigin(.5));sayT('还没有画哦，快去画一张吧！',0)}else sayT('我的画廊！点一点，画会动哦！',0);
  for(let i=0;i<cols*rows;i++){const it=items[i];const x=W/2+U*4+(i%cols-(cols-1)/2)*fw*1.12,y=U*17+fh/2+Math.floor(i/cols)*fh*1.2;
   const fr=this.add.graphics();fr.fillStyle(0x000000,.15);fr.fillRect(x-fw/2-U*.6,y-fh/2-U*.2,fw+U*2.4,fh+U*2.4);fr.fillStyle(0x8d6e63,1);fr.fillRect(x-fw/2-U*1.2,y-fh/2-U*1.2,fw+U*2.4,fh+U*2.4);fr.fillStyle(0xd7a86e,1);fr.fillRect(x-fw/2-U*.6,y-fh/2-U*.6,fw+U*1.2,fh+U*1.2);fr.fillStyle(0xffffff,1);fr.fillRect(x-fw/2,y-fh/2,fw,fh);c.add(fr);
   if(!it){c.add(this.add.text(x,y,'？',{fontSize:Math.round(fh*.4)+'px',color:'#ffe0b2'}).setOrigin(.5));continue}
   const key='gal_'+it.t;const put=()=>{if(this.gal!==c||!c.active)return;const im=this.add.image(x,y,key);im.setScale(Math.min(fw*.96/im.width,fh*.96/im.height));c.add(im);im.setInteractive();im.on('pointerdown',(p,lx,ly,ev)=>{ev.stopPropagation();this.replay(im,it,key)});im.setScale(im.scale*.1);this.tweens.add({targets:im,scale:im.scale*10,duration:300,delay:i*50,ease:'Back.easeOut'})};
   if(this.textures.exists(key))put();else{const img=new Image();img.onload=()=>{if(!this.sys||!this.sys.isActive())return;if(!this.textures.exists(key))this.textures.addImage(key,img);put()};img.src=it.d}}}
 replay(im,it,key){if(this.lock)return;this.lock=true;const W=this.W,H=this.H;const spr=this.add.image(im.x,im.y,key).setDepth(70).setScale(im.scale);im.setVisible(false);const s=Math.min(W*.55/spr.width,H*.55/spr.height);this.snd('max',{v:.5});
  this.tweens.add({targets:spr,x:W/2,y:H/2,scale:s,duration:400,ease:'Back.easeOut',onComplete:()=>this.animate(spr,it.kind,it.k,()=>this.tweens.add({targets:spr,x:im.x,y:im.y,scale:im.scale,duration:400,ease:'Quad.easeInOut',onComplete:()=>{spr.destroy();im.setVisible(true);this.lock=false}}))})}
 /* ---------- scratch to reveal ---------- */
 newScratch(){const U=this.U;let k;do k=pk(SCR);while(k==this.scK);this.scK=k;this.revealed=false;if(this.scT){this.scT.remove();this.scT=null}
  this.drawCard(pk([0xfff9c4,0xe1f5fe,0xf3e5f5,0xe8f5e9,0xfce4ec]));const im=this.scI.setTexture(k);im.disableInteractive();im.setScale(Math.min(this.pw*.78/im.width,this.ph*.78/im.height)).setPosition(this.pcx,this.pcy).setAngle(0);im._s=im.scale;
  const c=this.sc.context,w=this.sc.width,h=this.sc.height;c.globalCompositeOperation='source-over';c.globalAlpha=1;const h0=ri(0,359);for(let i=-h,j=0;i<w;i+=U*6,j++){c.fillStyle=`hsl(${(h0+j*28)%360},85%,62%)`;c.beginPath();c.moveTo(i,0);c.lineTo(i+U*6,0);c.lineTo(i+U*6+h,h);c.lineTo(i+h,h);c.closePath();c.fill()}
  c.fillStyle='rgba(255,255,255,.5)';for(let i=0;i<40;i++){c.beginPath();c.arc(R()*w,R()*h,rnd(2,6),0,7);c.fill()}c.font='bold '+Math.round(h*.45)+'px sans-serif';c.textAlign='center';c.textBaseline='middle';c.lineWidth=U*1.2;c.strokeStyle='rgba(0,0,0,.25)';c.strokeText('?',w/2,h/2);c.fillStyle='#ffffff';c.fillText('?',w/2,h/2);
  this.sc.refresh();this.scC.setAlpha(1).setScale(1);this.scC.scaleX=.01;this.tweens.add({targets:this.scC,scaleX:1,duration:300,ease:'Back.easeOut'});sayT(pk(['刮一刮，看看是谁？','藏着什么呢？刮一刮！']),0);this.pointHand(this.pcx,this.pcy)}
 scratch(a,first){const p=a.p,c=this.sc.context,U=this.U,ox=this.pcx-this.sc.width/2,oy=this.pcy-this.sc.height/2;c.globalCompositeOperation='destination-out';c.lineCap='round';c.lineWidth=U*10;c.beginPath();c.moveTo(a.lx-ox,a.ly-oy);c.lineTo(p.x-ox+(first?.1:0),p.y-oy);c.stroke();c.globalCompositeOperation='source-over';this.sc.refresh();
  if(this.thr('scr',110))noiseS(.14,3200,.09,2000);if(R()<.25){this.fxMono.particleTint=pk(COL);this.fxMono.explode(2,p.x,p.y)}
  if(this.thr('scc',300)){const s=this.small.getContext('2d');s.clearRect(0,0,40,30);s.drawImage(this.sc.getSourceImage(),0,0,40,30);const d=s.getImageData(0,0,40,30).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>40)n++;if(n/1200<.45)this.reveal()}}
 reveal(){if(this.revealed)return;this.revealed=true;const k=this.scK,im=this.scI,U=this.U;this.tweens.add({targets:this.scC,alpha:0,duration:350});for(let i=0;i<6;i++)this.time.delayedCall(i*70,()=>this.burstStar(this.pcx+rnd(-1,1)*this.pw*.4,this.pcy+rnd(-1,1)*this.ph*.4,6));
  this.snd('confirm');try{PJ.snd(k)}catch(e){}sayT('是'+nm(k)+'！',0);this.fxConf.explode(40,this.pcx,this.pcy-this.ph*.3);
  this.tweens.add({targets:im,y:this.pcy-U*8,duration:260,yoyo:true,repeat:1,ease:'Quad.easeOut'});im.setInteractive();im.removeAllListeners('pointerdown');im.on('pointerdown',(p,lx,ly,ev)=>{ev.stopPropagation();sayT(nm(k),0);try{PJ.snd(k)}catch(e){}this.squash(im,1);this.burstStar(p.x,p.y,6)});
  this.scT=this.time.delayedCall(4200,()=>{this.scT=null;if(this.mode=='scratch'){sayT('再来一张！',0);this.newScratch()}})}
 /* ---------- free painting ---------- */
 down(p){const k=this.act.size,a={p,lx:p.x,ly:p.y,t:0,ci:this.col>=0?(this.col+k*3)%8:-1,ho:k*120};this.act.set(p.id,a);
  if(this.mode=='color'){this.fillAt(p,a);return}if(this.mode=='scratch'){if(!this.revealed)this.scratch(a,true);return}if(this.mode!='free')return;
  if(k>0&&a.ci>=0)sayT(CNAME[a.ci],500);const T=this.tool;
  if(T=='splat')this.splat(p.x,p.y,a);else if(T=='stamp')this.stamp(p.x,p.y);
  else if(T=='truck'){const vk=pk(VEH12);const v=a.veh=this.add.image(p.x,p.y-this.U*2,vk).setDepth(50);v.setScale(this.U*15/v.width);a.tx=p.x;a.ty=p.y;try{PJ.snd(vk)}catch(e){}sayT(nm(vk),0);this.squash(v,1)}}
 dropVeh(a){const v=a.veh;a.veh=null;try{tone(660,.12,'square',.05);tone(520,.15,'square',.05,.14)}catch(e){}this.tweens.add({targets:v,scale:0,alpha:0,angle:v.angle+180,duration:350,onComplete:()=>v.destroy()})}
 track(a){const p=a.p,U=this.U,c=this.cx;let dx=p.x-a.tx,dy=p.y-a.ty,d=Math.hypot(dx,dy);const st=U*1.4;if(d<st)return;const an=Math.atan2(dy,dx),nx=-Math.sin(an),ny=Math.cos(an);c.fillStyle=this.colOf(a);
  while(d>=st){a.tx+=dx/d*st;a.ty+=dy/d*st;for(const s of[-1,1]){c.save();c.translate(a.tx+nx*U*2.3*s,a.ty+ny*U*2.3*s);c.rotate(an);c.fillRect(-U*.4,-U*1,U*.8,U*2);c.restore()}dx=p.x-a.tx;dy=p.y-a.ty;d=Math.hypot(dx,dy)}
  const v=a.veh;if(v){v.setPosition(p.x,p.y-U*2);const left=Math.cos(an)<0;v.setFlipX(left);let r=left?an-Math.PI:an;r=Phaser.Math.Angle.Wrap(r);v.rotation=Phaser.Math.Clamp(r,-.5,.5)}
  if(this.thr('eng'+p.id,140))try{tone(85+ri(0,30),.15,'sawtooth',.035)}catch(e){}this.ink+=st/U*2}
 note(y){const f=220*Math.pow(2,(1-y/this.H)*2);try{tone(f,.12,'sine',.07)}catch(e){}}
 line(a){const p=a.p,c=this.cx,U=this.U;const d=Math.hypot(p.x-a.lx,p.y-a.ly);if(d<1)return;c.strokeStyle=this.colOf(a);c.lineCap='round';c.lineJoin='round';
  const w=U*2.6+Math.min(U*2,d*.08);c.lineWidth=w;c.beginPath();c.moveTo(a.lx,a.ly);c.lineTo(p.x,p.y);c.stroke();c.globalAlpha=.35;c.strokeStyle='#ffffff';c.lineWidth=w*.25;c.beginPath();c.moveTo(a.lx-w*.2,a.ly-w*.2);c.lineTo(p.x-w*.2,p.y-w*.2);c.stroke();c.globalAlpha=1;this.ink+=d/U;
  if(!a.t||performance.now()-a.t>90){a.t=performance.now();this.note(p.y)}}
 splat(x,y,a){const c=this.cx,U=this.U,col=this.colOf(a),r=U*rnd(4,7);splatTo(c,x,y,r,[col],false);
  for(let i=0;i<ri(2,4);i++)this.dripL.push({x:x+rnd(-r*.8,r*.8),y:y+r*.5,w:U*rnd(.8,1.6),l:U*rnd(4,14),c:col});
  this.cameras.main.shake(90,.003);this.snd(pk(['soft_h','soft_m','snow']),{v:.8,rate:rnd(.8,1.2),gap:30});this.mono(x,y,Phaser.Display.Color.HexStringToColor(col).color,10);this.ink+=12;sayT(pk(['啪！','吧唧！','哇！']),1200)}
 stamp(x,y){const k=pk(VEH12.concat(ANIM,['p_flower','p_butterfly','it_apple','p_rocket']));const U=this.U,src=this.textures.get(k).getSourceImage(),s=U*rnd(16,22)/Math.max(src.width,src.height);
  const im=this.add.image(x,y,k).setDepth(40).setScale(s*1.6).setAlpha(0);this.tweens.add({targets:im,scale:s,alpha:1,duration:180,ease:'Back.easeIn',onComplete:()=>{this.cx.drawImage(src,x-src.width*s/2,y-src.height*s/2,src.width*s,src.height*s);this.ct.refresh();im.destroy();this.fxDust.explode(6,x,y+U*6)}});
  this.snd('punch',{v:.5,rate:rnd(1.1,1.4),gap:60});try{PJ.snd(k)}catch(e){}sayT(nm(k),0);this.ink+=15}
 stars(a){const p=a.p,U=this.U,c=this.cx;if(a.t&&performance.now()-a.t<45)return;a.t=performance.now();const r=U*rnd(1,2.4);c.fillStyle=this.colOf(a);c.beginPath();const ox=p.x+rnd(-U*2,U*2),oy=p.y+rnd(-U*2,U*2),ro=R();for(let i=0;i<10;i++){const rr=i%2?r*.45:r,an=-Math.PI/2+i*Math.PI/5+ro;c.lineTo(ox+Math.cos(an)*rr,oy+Math.sin(an)*rr)}c.closePath();c.fill();
  this.ink+=1.5;if(R()<.3)this.burstStar(p.x,p.y,1);if(this.thr('st',120))try{tone(rnd(1200,2400),.08,'sine',.05)}catch(e){}}
 wipe(){const U=this.U;const sp=this.add.text(-U*20,this.H*.5,'🧽',{fontSize:Math.round(U*26)+'px'}).setOrigin(.5).setDepth(85);noiseS(.9,1200,.2,400);this.snd('roll');
  this.tweens.add({targets:sp,x:this.W+U*20,duration:900,ease:'Sine.easeInOut',onUpdate:()=>{this.cx.clearRect(0,0,Math.max(0,sp.x),this.H);this.ct.refresh();this.burstStar(sp.x,R()*this.H,1)},onComplete:()=>{sp.destroy();this.dripL=[];this.ink=0;this.nextWin=900;sayT('又是新的一张纸！',0)}})}
 update(){let ch=0;this.act.forEach((a,id)=>{const p=a.p;if(!p.isDown){if(a.veh)this.dropVeh(a);this.act.delete(id);return}
   if(this.mode=='free'){if(this.tool=='brush'){this.line(a);ch=1}else if(this.tool=='star'){this.stars(a);ch=1}else if(this.tool=='truck'){this.track(a);ch=1}}
   else if(this.mode=='color'){if(Math.hypot(p.x-a.lx,p.y-a.ly)>2)this.fillAt(p,a)}else if(this.mode=='scratch'&&!this.revealed)this.scratch(a);
   a.lx=p.x;a.ly=p.y});
  if(this.dripL.length){const c=this.cx;this.dripL=this.dripL.filter(d=>{c.fillStyle=d.c;c.beginPath();c.arc(d.x,d.y,d.w,0,7);c.fill();d.y+=1.2;d.l-=1.2;d.w*=.997;return d.l>0});ch=1}
  if(ch&&this.mode=='free')this.ct.refresh();this.stepPours();
  if(this.mode=='free'&&this.ink>this.nextWin){this.nextWin=this.ink+1400;this.party(pk(['画得真漂亮！','好多颜色呀！','小画家真棒！']))}}
}
/* ================= 喂小动物 Messy feeding (Matter throw) ================= */
const FOOD=['f_bone','f_carrot','f_corn','f_fish','f_grass','it_apple','it_banana','it_melon','it_orange'];
const FAV={a_dog:'f_bone',a_cat:'f_fish',a_cow:'f_grass',a_rabbit:'f_carrot',a_chick:'f_corn',a_monkey:'it_banana',a_elephant:'it_melon'};
class Feed extends Base{
 constructor(){super('Feed',true)}
 create(){this.base();const W=this.W,H=this.H,U=this.U;this.drags=new Set();this.foods=[];bg(this);const G=this.G=H*.88;ground(this,G);
  this.matter.world.setBounds(0,-H*2,W,G+H*2,200,true,true,false,true);
  this.deco([['sun',.2,.1,12],['cloud',.36,.2,15],['p_tree',.95,.62,20],['p_flower',.4,.95,6],['p_butterfly',.85,.25,6]],2);
  const bx=this.bx=W*.2;const bk=this.add.graphics().setDepth(20);bk.fillStyle(0x8d5a2b,1);bk.fillRoundedRect(bx-U*15,G-U*9,U*30,U*10,U*2);bk.fillStyle(0xc68642,1);for(let i=0;i<5;i++)bk.fillRect(bx-U*14+i*U*6,G-U*8,U*4.5,U*8);bk.lineStyle(U*1.2,0x6d4c41,1);bk.strokeRoundedRect(bx-U*15,G-U*9,U*30,U*10,U*2);
  this.matter.add.rectangle(bx-U*15,G-U*5,U*1.5,U*10,{isStatic:true,label:'basket'});this.matter.add.rectangle(bx+U*15,G-U*5,U*1.5,U*10,{isStatic:true,label:'basket'});
  this.ax=W*.64;this.ah=H*.56;this.ai=0;this.mouthB=this.matter.add.circle(this.ax,G-this.ah*.6,this.ah*.22,{isStatic:true,isSensor:true,label:'mouth'});
  this.animal=this.add.image(this.ax,G,ANIM[0]).setOrigin(.5,1).setDepth(10);this.setAnimal(0,true);
  this.animal.setInteractive();this.animal.on('pointerdown',(p,lx,ly,ev)=>{ev.stopPropagation();this.pet()});
  this.ports=ANIM.map((k,i)=>this.button(W*.33+i*U*9.6,U*7,U*4.2,k,nm(k),()=>this.setAnimal(i)));
  this.matter.world.on('collisionstart',e=>{for(const p of e.pairs){const a=p.bodyA,b=p.bodyB;const m=a.label=='mouth'?b:b.label=='mouth'?a:null;if(m&&m.gameObject&&m.label=='food'){this.eat(m.gameObject);continue}
   const dv=Math.hypot(a.velocity.x-b.velocity.x,a.velocity.y-b.velocity.y);if(dv>4&&!a.isSensor&&!b.isSensor){this.snd(pk(['soft_m','soft_h']),{v:Math.min(.8,dv/14),rate:rnd(.9,1.2),gap:70});const s=p.collision.supports[0];if(s&&dv>7){this.fxDust.explode(4,s.x,s.y);const fo=(a.gameObject&&a.gameObject._k=='it_melon')?a.gameObject:(b.gameObject&&b.gameObject._k=='it_melon')?b.gameObject:null;if(fo)this.mono(s.x,s.y,0xef5350,10)}}}});
  this.bites=0;for(let i=0;i<7;i++)this.time.delayedCall(i*120,()=>this.spawn());this.time.addEvent({delay:900,loop:true,callback:()=>{if(this.foods.length<8)this.spawn()}});
  this.pointHand(this.bx,G-U*12);this.time.delayedCall(400,()=>sayT('把好吃的扔给'+nm(ANIM[0])+'吧！',0));
 }
 setAnimal(i,first){const k=ANIM[i],U=this.U,a=this.animal;this.ai=i;this.bites=0;const apply=()=>{a.setTexture(k);this.base_s=this.ah/a.height;a.setScale(this.base_s);a._fat=1;
   const mh=this.ah*(k=='a_elephant'?.55:k=='a_chick'?.5:.62);this.matter.body.setPosition(this.mouthB,{x:this.ax,y:this.G-mh});};
  if(first){apply();return}this.tweens.add({targets:a,y:this.G+this.ah*1.2,duration:250,ease:'Back.easeIn',onComplete:()=>{apply();a.y=this.G+this.ah;this.tweens.add({targets:a,y:this.G,duration:500,ease:'Back.easeOut'});try{PJ.snd(k)}catch(e){}}})}
 pet(){const a=this.animal,k=ANIM[this.ai];try{PJ.snd(k)}catch(e){}sayT(nm(k),0);this.fxHeart.explode(4,a.x,a.y-this.ah*.7);const s=this.base_s*a._fat;this.tweens.add({targets:a,y:this.G-this.U*6,duration:180,yoyo:true,ease:'Quad.easeOut'});this.squash(a,.6);a._sx=s;a._sy=this.base_s}
 spawn(){const k=pk(FOOD),U=this.U;const o=this.matter.add.image(this.bx+rnd(-U*10,U*10),-U*5,k,null,{shape:{type:'circle',radius:120},restitution:.45,friction:.5,density:.002,label:'food'});o.setScale(U*(k=='it_melon'?11:8.5)/320).setDepth(15);o._k=k;
  o._dk=.3;dragMatter(this,o,()=>{sayT(nm(k),0);this.snd('select',{v:.4})});this.foods.push(o)}
 eat(o){if(!o.body||o._eaten)return;o._eaten=1;this.drags.delete(o);this.foods=this.foods.filter(f=>f!=o);const k=ANIM[this.ai],a=this.animal,mx=this.mouthB.position.x,my=this.mouthB.position.y;
  o.setSensor(true);o.setStatic(true);this.tweens.add({targets:o,x:mx,y:my,scale:0,angle:360,duration:260,onComplete:()=>o.destroy()});
  this.time.delayedCall(220,()=>{this.snd('soft_h',{v:.7,rate:1.3});try{PJ.S.chomp()}catch(e){}this.time.delayedCall(180,()=>this.snd('soft_m',{v:.5,rate:1.5}));
   this.mono(mx,my,o._k=='it_melon'?0xef5350:o._k=='f_grass'?0x7cb342:0xffca28,12);this.bites++;a._fat=Math.min(1.5,a._fat+.08);
   this.tweens.add({targets:a,scaleX:this.base_s*a._fat*1.12,scaleY:this.base_s*.9,duration:110,yoyo:true,onComplete:()=>a.setScale(this.base_s*a._fat,this.base_s)});
   if(FAV[k]==o._k){this.fxHeart.explode(8,mx,my-this.U*4);sayT('最爱吃'+nm(o._k)+'啦！',0)}else sayT(pk(['啊呜！','好吃！','嗯～香香！','吧唧吧唧']),700);
   if(this.bites>=6){this.bites=0;this.time.delayedCall(600,()=>this.burp())}})}
 burp(){const a=this.animal,U=this.U;try{tone(110,.5,'sawtooth',.18,0,70);tone(160,.3,'square',.06,0,90)}catch(e){}noiseS(.5,300,.25,120);this.cameras.main.shake(250,.008);sayT('嗝～吃饱啦！',0);
  this.tweens.add({targets:a,scaleX:this.base_s*a._fat*1.25,scaleY:this.base_s*.8,duration:160,yoyo:true,onComplete:()=>{a._fat=1;this.tweens.add({targets:a,scaleX:this.base_s,scaleY:this.base_s,duration:500,ease:'Elastic.easeOut'})}});
  this.fxDust.explode(14,a.x,this.mouthB.position.y);this.time.delayedCall(700,()=>this.party(pk(['小肚子圆滚滚！','吃得饱饱的！'])))}
 update(){dragStep(this);this.foods.forEach(o=>{if(o.body&&(o.y>this.H+100||o.x<-100||o.x>this.W+100)){o.setPosition(this.bx,-this.U*5);o.setVelocity(0,0)}})}
}
/* ================= 音乐弹珠 Marble music machine ================= */
const NOTES=[523,587,659,698,784,880,988,1047];
class Music extends Base{
 constructor(){super('Music',true)}
 create(){this.base();const W=this.W,H=this.H,U=this.U;this.cameras.main.setBackgroundColor('#2b2d5c');this.notes=0;this.balls=[];
  const st=this.add.graphics().setDepth(1);for(let i=0;i<60;i++){st.fillStyle(0xffffff,rnd(.2,.8));st.fillCircle(R()*W,R()*H,rnd(.5,2))}
    this.bars=[];const bw=Math.min(W*.27,U*48);for(let i=0;i<8;i++){const ev=i%2==0;const x=W*(ev?.42:.6),y=H*(.17+i*.093);
   const b=this.matter.add.image(x,y,'bar'+(7-i),null,{isStatic:true,label:'bar',restitution:.5,chamfer:{radius:10}});b.setScale(bw/300,U*4.2/60).setAngle(ev?13:-13).setDepth(10);b._n=7-i;b._sx=b.scaleX;b._sy=b.scaleY;
   b.setInteractive();this.input.setDraggable(b);b.on('pointerdown',(p,lx,ly,e)=>{e.stopPropagation();this.ding(b,.8)});b.on('drag',(p,x,y)=>b.setPosition(x,y));this.bars.push(b)}
  this.deco([['a_dog',.24,.92,9],['a_cat',.36,.93,8],['a_chick',.7,.93,7],['a_cow',.8,.91,10],['p_bird',.22,.45,7],['p_rocket',.88,.22,9]],5);
  this.button(W-U*9,H*.55,U*6.5,'🎱','好多弹珠',()=>{for(let i=0;i<8;i++)this.time.delayedCall(i*160,()=>this.ball(W*.42+rnd(-U*4,U*4),-U*4))});
  this.matter.world.setBounds(0,-H*2,W,H*3,100,true,true,false,false);
  this.input.on('pointerdown',(p,over)=>{if(over.length)return;this.ball(p.x,p.y)});
  this.matter.world.on('collisionstart',e=>{for(const p of e.pairs){const a=p.bodyA,b=p.bodyB;const bar=a.label=='bar'?a:b.label=='bar'?b:null;const dv=Math.hypot(a.velocity.x-b.velocity.x,a.velocity.y-b.velocity.y);
   if(bar&&bar.gameObject&&dv>1.2)this.ding(bar.gameObject,Math.min(1,dv/9));else if(a.label=='ball'&&b.label=='ball'&&dv>2)this.snd('click',{v:.3,rate:rnd(1.3,1.8),gap:60})}});
  this.pointHand(W*.42,H*.08);sayT('点一点，掉弹珠！',300);
 }
 ball(x,y){const U=this.U,i=ri(0,7);const o=this.matter.add.image(x,y,'ball'+i,null,{shape:{type:'circle',radius:30},restitution:.55,friction:.02,frictionAir:.002,density:.002,label:'ball'});o.setScale(U*5.2/64).setDepth(12);
  this.balls.push(o);if(this.balls.length>28){const d=this.balls.shift();d&&d.body&&d.destroy()}this.snd('pluck1',{v:.3,rate:1.6,gap:60});o.setScale(0.01);this.tweens.add({targets:o,scale:U*5.2/64,duration:160,ease:'Back.easeOut'})}
 ding(b,v){const f=NOTES[b._n];bell(f,.1+.2*v);this.notes++;b.setTint(0xffffff);this.time.delayedCall(90,()=>b.clearTint());
  this.tweens.killTweensOf(b);b.setScale(b._sx,b._sy);this.tweens.add({targets:b,scaleY:b._sy*1.35,duration:70,yoyo:true});
  this.fxHeart.particleTint=0xffffff;const nt=this.add.image(b.x+rnd(-this.U*6,this.U*6),b.y-this.U*3,'note').setTint(COL[b._n]).setDepth(30).setScale(this.U*.12);this.tweens.add({targets:nt,y:nt.y-this.U*12,alpha:0,angle:rnd(-30,30),duration:900,onComplete:()=>nt.destroy()});
  if(this.notes%45==0)this.party(pk(['好好听的音乐！','叮叮咚咚！','小音乐家！']))}
 update(){this.balls=this.balls.filter(o=>{if(o.body&&o.y>this.H+60){o.destroy();return false}return !!o.body})}
}
/* ================= 吹泡泡 Bubble blowing ================= */
const BITEM=['it_ball','it_bear','it_dino','it_apple','it_orange','it_banana','p_flower','a_chick','it_chest','p_balloon'];
class Bub extends Base{
 constructor(){super('Bub')}
 create(){this.base();const W=this.W,H=this.H,U=this.U;bg(this);const G=this.G=H*.9;ground(this,G);this.bubs=[];this.grow=new Map();this.items=[];this.pops=0;
  this.deco([['sun',.22,.1,12],['cloud',.45,.08,16],['a_dog',.07,.86,11],['a_rabbit',.93,.85,10],['p_tree',.82,.72,18],['p_flower',.3,.93,6]],3);
  this.input.on('pointerdown',(p,over)=>{if(over.length)return;const b=this.add.image(p.x,p.y,'bubble').setDepth(20).setScale(U*5/128);this.grow.set(p.id,{p,b,t0:this.time.now});sayT('呼～吹大泡泡',2500)});
  this.input.on('pointerup',p=>{const g=this.grow.get(p.id);if(!g)return;this.grow.delete(p.id);this.release(g.b)});
  this.time.addEvent({delay:1300,loop:true,callback:()=>{if(this.bubs.length<14){const b=this.add.image(rnd(W*.2,W*.8),G+U*4,'bubble').setDepth(20).setScale(U*rnd(6,11)/128);this.release(b,true)}}});
  this.pointHand(W*.5,H*.5);sayT('按住，吹泡泡！',300);
 }
 release(b,auto){const U=this.U,size=b.displayWidth/U;b.setInteractive(new Phaser.Geom.Circle(64,64,64),Phaser.Geom.Circle.Contains);b._vy=-rnd(.03,.07)*U*(1.4-Math.min(1,size/40));b._ph=R()*6;b._x0=b.x;b._sz=size;
  if(size>13&&!auto||auto&&R()<.25){const k=pk(BITEM);const it=this.add.image(b.x,b.y,k).setDepth(19);it.setScale(b.displayWidth*.55/Math.max(it.width,it.height));b._it=it;b._k=k}
  if(!auto){this.snd('max',{v:.35,rate:1.4});if(size>30)sayT('哇！超级大泡泡！',0)}
  b.on('pointerdown',(p,lx,ly,ev)=>{ev.stopPropagation();this.pop(b)});this.bubs.push(b)}
 pop(b,quiet){if(b._dead)return;b._dead=1;const U=this.U,sz=b._sz;this.bubs=this.bubs.filter(x=>x!=b);
  this.snd(sz>30?'glass1':'drop2',{v:quiet?.15:.7,rate:sz>30?.8:rnd(1.2,1.9),gap:20});try{if(!quiet)PJ.S.pp&&PJ.S.pp()}catch(e){}
  this.fxStar.explode(Math.round(4+sz/4),b.x,b.y);this.mono(b.x,b.y,0xb3e5fc,Math.round(4+sz/5));
  this.tweens.add({targets:b,scale:b.scale*1.3,alpha:0,duration:120,onComplete:()=>b.destroy()});
  if(b._it){const it=b._it,G=this.G;sayT(nm(b._k),0);try{PJ.snd(b._k)}catch(e){}this.tweens.add({targets:it,y:G-it.displayHeight/2,angle:rnd(-30,30),duration:Math.max(300,(G-it.y)*1.6),ease:'Bounce.easeOut',onComplete:()=>{this.snd('soft_m',{v:.5});it.setInteractive();it.on('pointerdown',(p,lx,ly,ev)=>{ev.stopPropagation();sayT(nm(b._k),0);this.squash(it);this.burstStar(it.x,it.y,4)})}});
   this.items.push(it);if(this.items.length>8){const o=this.items.shift();this.tweens.add({targets:o,alpha:0,duration:400,onComplete:()=>o.destroy()})}}
  if(sz>30){this.cameras.main.shake(260,.01);for(let i=0;i<10;i++){const m=this.add.image(b.x,b.y,'bubble').setDepth(20).setScale(U*rnd(3,6)/128);m.x+=rnd(-U*10,U*10);m.y+=rnd(-U*10,U*10);this.release(m,true);m._vy*=2}}
  if(!quiet){this.pops++;if(!quiet&&this.pops%25==0)this.party(pk(['泡泡真好玩！','啪啪啪！','好多泡泡！']));else if(R()<.25)sayT(pk(['啪！','哈哈！','破啦！']),900)}}
 update(t,dt){const U=this.U;this.grow.forEach((g,id)=>{if(!g.p.isDown){this.grow.delete(id);this.release(g.b);return}const age=(t-g.t0)/1000;const sz=Math.min(42,5+age*12);g.b.setPosition(g.p.x,g.p.y-sz*U*.3);g.b.setScale(sz*U/128*(1+Math.sin(t/90)*.04),sz*U/128*(1-Math.sin(t/90)*.04));
   if(!g.s||t-g.s>260){g.s=t;try{tone(200+sz*12,.25,'sine',.04)}catch(e){}}});
  this.bubs.forEach(b=>{b._ph+=dt/600;b.y+=b._vy*dt/16;b.x=b._x0+Math.sin(b._ph)*U*3;b.setScale(b.scaleX,b.scaleX*(1+Math.sin(b._ph*3)*.03));if(b._it)b._it.setPosition(b.x,b.y);if(b.y<-b.displayHeight)this.pop(b,true)})}
}
/* ================= Game manager ================= */
const SCENES={p_site:'Site',p_sand:'Sand',p_wash:'Wash',p_draw:'Draw',p_feed:'Feed',p_music:'Music',p_bub:'Bub'};
let game=null,pending=null,booted=false;const host=document.createElement('div');host.id='pg';host.style.cssText='position:absolute;inset:0;z-index:1;touch-action:none';
function run(key){if(!game)return;clearTimeout(window._gst);game.scene.getScenes(true).forEach(s=>{if(s.scene.key!='Boot')s.scene.stop()});game.scene.stop('Boot');game.loop.wake();game.scene.start(key)}
window.GAME={has:id=>!!SCENES[id],
 start(id,root){root.appendChild(host);const key=SCENES[id];
  if(!game){pending=key;game=new Phaser.Game({type:Phaser.AUTO,parent:host,transparent:false,backgroundColor:'#8fdcff',scale:{mode:Phaser.Scale.RESIZE,width:'100%',height:'100%'},
    input:{activePointers:5},render:{antialias:true,powerPreference:'high-performance'},banner:false,audio:{disableWebAudio:false},fps:{target:60},
    scene:[Boot,Site,Sand,Wash,Draw,Feed,Music,Bub]});
   game.events.on('booted',()=>{booted=true;run(pending)});let fT=0;game.events.on('step',t=>{game.sound.mute=isMuted();if(t-fT>2000){fT=t;const f=game.loop.actualFps;if(f&&f<40)Q.q=Math.max(.35,Q.q*.75);else if(f>55&&Q.q<1)Q.q=Math.min(1,Q.q+.05)}})}
  else if(booted){pending=key;game.scale.refresh();clearTimeout(window._gst);window._gst=setTimeout(()=>{if(host.parentNode&&pending==key){game.scale.refresh();run(key)}},60)}else pending=key},
 stop(){if(game){game.scene.getScenes(true).forEach(s=>s.scene.stop());}if(host.parentNode)host.parentNode.removeChild(host)},
 get game(){return game}};
})();
