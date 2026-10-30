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
 'it_apple','it_ball','it_banana','it_bear','it_chest','it_dino','it_melon','it_orange','p_balloon','p_bee','p_bird','p_butterfly','p_flower','p_heli','p_plane','p_rocket','p_train','p_tree','p_worker','b_house'];
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
class Base extends Phaser.Scene{
 constructor(key,matter){super(matter?{key,physics:{default:'matter',matter:{gravity:{y:1.1},enableSleeping:false}}}:{key})}
 init(){this.W=this.scale.width;this.H=this.scale.height;this.U=Math.min(this.W,this.H)/100;this.sT={};this.wins=0;this.touched=0}
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
/* ================= 泥巴洗车 Messy car wash (canvas masking) ================= */
class Wash extends Base{
 constructor(){super('Wash')}
 create(){this.base();const W=this.W,H=this.H,U=this.U;bg(this);this.cameras.main.setBackgroundColor('#bfe9ff');
  const gg=this.add.graphics().setDepth(2);gg.fillStyle(0x90a4ae,1);gg.fillRect(0,H*.84,W,H*.16);gg.fillStyle(0x78909c,1);for(let x=0;x<W;x+=U*12)gg.fillRect(x,H*.84,U*6,U*.8);
  this.deco([['sun',.76,.1,13],['cloud',.6,.08,16],['a_dog',.06,.9,10],['a_cat',.94,.9,9],['p_flower',.16,.94,6],['p_bird',.3,.12,6]],3);
  this.MW=320;this.MH=240;const mk=()=>{const c=document.createElement('canvas');c.width=this.MW;c.height=this.MH;return c};this.mud=mk();this.foam=mk();this.mx=this.mud.getContext('2d');this.fx=this.foam.getContext('2d');
  if(this.textures.exists('washtex'))this.textures.remove('washtex');this.ct=this.textures.createCanvas('washtex',this.MW,this.MH);
  this.dw=Math.min(W*.6,H*.72*4/3);this.dh=this.dw*.75;this.vx=W*.53;this.vy=H*.84-this.dh*.46;
  this.car=this.add.image(this.vx,this.vy,'water').setDisplaySize(this.dw,this.dh).setDepth(10);this.layer=this.add.image(this.vx,this.vy,'washtex').setDisplaySize(this.dw,this.dh).setDepth(11);
  this.drips=[];this.tool='water';this.act=new Map();this.dirty=false;this.vehI=-1;
  const tl=[['mud','🟤','泥巴',0xbcaaa4],['soap','🧼','泡泡',0xf8bbd0],['water','🚿','水枪',0x81d4fa],['dry','💨','吹风机',0xfff59d]];
  this.btns=tl.map(([m,ic,n,t],i)=>{const b=this.button(U*8,U*25+i*U*15.5,U*6.5,ic,n,()=>{this.tool=m;this.btns.forEach(x=>x.ring.setVisible(x==b))},{tint:t});return b});this.btns[2].ring.setVisible(true);
  this.button(W-U*9,H-U*25,U*6.5,'🔄','换一辆车',()=>this.nextCar());
  this.nozzle={x:W*.5,y:H+U*2};this.stream=this.add.graphics().setDepth(30);
  this.fxWater=this.add.particles(0,0,'drop',{emitting:false,speed:{min:120,max:380},angle:{min:200,max:340},gravityY:1300,lifespan:700,scale:{start:.9,end:.4},tint:[0x4fc3f7,0x81d4fa,0xe1f5fe],alpha:{start:.95,end:.3},depth:31});
  this.fxBub=this.add.particles(0,0,'bubble',{emitting:false,speed:{min:20,max:90},angle:{min:240,max:300},gravityY:-40,lifespan:1600,scale:{start:.08,end:.22},alpha:{start:.9,end:0},depth:32});
  this.input.on('pointerdown',(p,over)=>{if(over.length&&over.some(o=>o!=this.car&&o!=this.layer))return;this.act.set(p.id,{p,lx:p.x,ly:p.y});this.toolStart()});
  this.input.on('pointerup',p=>this.act.delete(p.id));
  this.car.setInteractive();this.layer.setInteractive({pixelPerfect:false});
  this.nextCar(true);this.time.addEvent({delay:450,loop:true,callback:()=>this.check()});this.pointHand(this.vx,this.vy);
 }
 toolStart(){const t=this.tool;sayT(t=='mud'?'泥巴来啦！':t=='soap'?'擦泡泡':t=='water'?'冲冲冲！':'呼呼呼',1500)}
 nextCar(first){const U=this.U;let k;do k=pk(VEH);while(k==this.curV);this.curV=k;
  const go=()=>{this.car.setTexture(k).setDisplaySize(this.dw,this.dh);this.mask=null;this.mx.clearRect(0,0,this.MW,this.MH);this.fx.clearRect(0,0,this.MW,this.MH);
   for(let i=0;i<26;i++)this.splat(rnd(30,290),rnd(40,220),rnd(12,30),true);this.dirty=true;this.car.x=this.layer.x=this.W+this.dw;
   this.tweens.add({targets:[this.car,this.layer],x:this.vx,duration:900,ease:'Back.easeOut',onComplete:()=>{this.snd('soft_h');sayT('脏脏的'+nm(k)+'，洗一洗吧！',0)}});try{PJ.snd(k)}catch(e){}};
  if(first){go();return}this.snd('roll');try{horn()}catch(e){}this.tweens.add({targets:[this.car,this.layer],x:-this.dw,duration:700,ease:'Back.easeIn',onComplete:go})}
 toLocal(p){return{x:(p.x-(this.car.x-this.dw/2))/this.dw*this.MW,y:(p.y-(this.car.y-this.dh/2))/this.dh*this.MH}}
 splat(x,y,r,quiet){const c=this.mx;const cols=['#6d4c41','#795548','#5d4037','#8d6e63','#4e342e'];c.globalCompositeOperation='source-over';
  for(let i=0;i<7;i++){c.fillStyle=pk(cols);c.globalAlpha=.85+R()*.15;c.beginPath();c.arc(x+rnd(-r,r),y+rnd(-r,r)*.8,r*rnd(.3,.75),0,7);c.fill()}
  for(let i=0;i<5;i++){c.beginPath();c.arc(x+rnd(-r*2,r*2),y+rnd(-r*1.5,r*1.5),rnd(2,5),0,7);c.fill()}c.globalAlpha=1;if(R()<.5)this.drips.push({x:x+rnd(-r,r)*.6,y:y+r*.4,w:rnd(3,6),l:rnd(10,40),c:pk(cols)})}
 erase(ctx,x,y,r,a=1){ctx.globalCompositeOperation='destination-out';ctx.globalAlpha=a;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
 foamAt(x,y){const c=this.fx;for(let i=0;i<6;i++){const r=rnd(4,11),xx=x+rnd(-16,16),yy=y+rnd(-14,14);c.fillStyle='rgba(255,255,255,.95)';c.beginPath();c.arc(xx,yy,r,0,7);c.fill();c.strokeStyle='rgba(144,202,249,.9)';c.lineWidth=1.2;c.stroke();c.fillStyle='rgba(255,255,255,1)';c.beginPath();c.arc(xx-r*.35,yy-r*.35,r*.25,0,7);c.fill()}}
 update(t,dt){const U=this.U;this.stream.clear();
  this.act.forEach((a,id)=>{const p=a.p;if(!p.isDown){this.act.delete(id);return}const L=this.toLocal(p),mv=Math.hypot(p.x-a.lx,p.y-a.ly);a.lx=p.x;a.ly=p.y;const on=L.x>-20&&L.x<this.MW+20&&L.y>-20&&L.y<this.MH+20;const T=this.tool;
   if(T=='mud'){if(mv>U*1.2||!a.t||t-a.t>220){a.t=t;this.splat(L.x,L.y,rnd(14,24));this.snd(pk(['snow','soft_m']),{v:.6,rate:rnd(.7,1),gap:120});this.mono(p.x,p.y,0x6d4c41,5);this.dirty=true;this.changed=1}}
   else if(T=='soap'){if(mv>U*.6||!a.t||t-a.t>120){a.t=t;this.foamAt(L.x,L.y);this.erase(this.mx,L.x,L.y,18,.12);this.fxBub.explode(2,p.x,p.y);this.snd('pluck1',{v:.35,rate:rnd(1.4,2.2),gap:90});this.changed=1}}
   else if(T=='water'){const n=this.nozzle;this.stream.lineStyle(U*1.6,0x4fc3f7,.75);this.stream.beginPath();this.stream.moveTo(n.x,n.y);const cx=(n.x+p.x)/2,cy=Math.min(n.y,p.y)-U*10;const c=new Phaser.Curves.QuadraticBezier(new Phaser.Math.Vector2(n.x,n.y),new Phaser.Math.Vector2(cx,cy),new Phaser.Math.Vector2(p.x,p.y));c.draw(this.stream,20);
    this.stream.lineStyle(U*.5,0xe1f5fe,.9);c.draw(this.stream,20);this.fxWater.explode(3,p.x,p.y);if(on){this.erase(this.mx,L.x,L.y,22,.5);this.erase(this.fx,L.x,L.y,24,.6);this.changed=1}
    if(!a.s||t-a.s>140){a.s=t;noiseS(.22,2600,.12,1800)}}
   else{if(!a.s||t-a.s>200){a.s=t;noiseS(.25,5000,.06,3000)}if(on){this.erase(this.fx,L.x,L.y,20,.25);this.erase(this.mx,L.x,L.y,14,.04);this.changed=1}if(R()<.4)this.burstStar(p.x+rnd(-U*3,U*3),p.y+rnd(-U*3,U*3),2);this.car.angle=Math.sin(t/40)*.6}});
  if(!this.act.size)this.car.angle=0;
  if(this.drips.length){this.mx.globalCompositeOperation='source-over';this.drips=this.drips.filter(d=>{this.mx.fillStyle=d.c;this.mx.fillRect(d.x-d.w/2,d.y,d.w,1.2);this.mx.beginPath();this.mx.arc(d.x,d.y+1.2,d.w/2,0,7);this.mx.fill();d.y+=.6;d.l-=.6;return d.l>0});this.changed=1}
  if(this.changed||this.drips.length){this.changed=0;const c=this.ct.context;c.clearRect(0,0,this.MW,this.MH);c.globalCompositeOperation='source-over';c.drawImage(this.mud,0,0);c.drawImage(this.foam,0,0);c.globalCompositeOperation='destination-in';
   c.drawImage(this.textures.get(this.curV).getSourceImage(),0,0,this.MW,this.MH);c.globalCompositeOperation='source-over';this.ct.refresh()}}
 check(){if(!this.mask){const c=document.createElement('canvas');c.width=80;c.height=60;const x=c.getContext('2d');x.drawImage(this.textures.get(this.curV).getSourceImage(),0,0,80,60);const d=x.getImageData(0,0,80,60).data;this.mask=new Uint8Array(4800);this.mcount=0;for(let i=0;i<4800;i++)if(d[i*4+3]>60){this.mask[i]=1;this.mcount++}
   this.sc=document.createElement('canvas');this.sc.width=80;this.sc.height=60;this.sx=this.sc.getContext('2d',{willReadFrequently:true})}
  const cov=(src)=>{this.sx.clearRect(0,0,80,60);this.sx.drawImage(src,0,0,80,60);const d=this.sx.getImageData(0,0,80,60).data;let n=0;for(let i=0;i<4800;i++)if(this.mask[i]&&d[i*4+3]>50)n++;return n/Math.max(1,this.mcount)};
  const m=cov(this.mud),f=cov(this.foam);if(m>.1)this.dirty=true;
  if(this.dirty&&m<.025&&f<.04){this.dirty=false;this.shine()}}
 shine(){const U=this.U;this.snd('glass1',{v:.8});for(let i=0;i<6;i++)this.time.delayedCall(i*120,()=>this.burstStar(this.car.x-this.dw/2+R()*this.dw,this.car.y-this.dh/2+R()*this.dh,8));
  this.tweens.add({targets:this.car,scaleX:this.car.scaleX*1.06,scaleY:this.car.scaleY*1.06,yoyo:true,duration:220,repeat:1});this.party('洗干净啦！亮晶晶！');try{PJ.snd(this.curV)}catch(e){}}
}
/* ================= 魔法画画 Magic paint ================= */
class Draw extends Base{
 constructor(){super('Draw')}
 create(){this.base();const W=this.W,H=this.H,U=this.U;this.cameras.main.setBackgroundColor('#fff8e1');
  if(this.textures.exists('paper'))this.textures.remove('paper');this.ct=this.textures.createCanvas('paper',W,H);this.cx=this.ct.context;this.add.image(0,0,'paper').setOrigin(0).setDepth(1);this.ink=0;this.nextWin=900;
  this.col=-1;this.hue=0;this.tool='brush';this.act=new Map();this.dripL=[];
  const pal=COL.map((c,i)=>{const b=this.button(W/2+(i-4)*U*10,H-U*7,U*4.4,'',CNAME[i],()=>{this.col=i;this.sel(pal,b)},{tint:c,depth:80});b.bg.setTint(c);return b});
  const rb=this.button(W/2+4*U*10,H-U*7,U*4.4,'🌈','彩虹',()=>{this.col=-1;this.sel(pal,rb)});pal.push(rb);this.sel(pal,rb);
  const tl=[['brush','🖌️','画笔'],['splat','💥','泼颜料'],['stamp','bulldozer','印章'],['star','✨','星星'],['wipe','🧽','擦干净']];
  const tb=tl.map(([m,ic,n],i)=>{const b=this.button(U*7,U*22+i*U*12.5,U*5.2,ic,n,()=>{if(m=='wipe'){this.wipe();return}this.tool=m;this.sel(tb,b)});return b});this.sel(tb,tb[0]);
  this.input.on('pointerdown',(p,over)=>{if(over.length)return;const a={p,lx:p.x,ly:p.y,t:0};this.act.set(p.id,a);if(this.tool=='splat')this.splat(p.x,p.y);else if(this.tool=='stamp')this.stamp(p.x,p.y);this.dot(a)});
  this.input.on('pointerup',p=>this.act.delete(p.id));this.pointHand(W*.45,H*.5);sayT('画画吧！',300);
  // tiny friends watching in the corners
  this.deco([['p_bee',.35,.07,6],['p_butterfly',.6,.07,6],['a_chick',.95,.55,7]],70);
 }
 sel(arr,b){arr.forEach(x=>x.ring.setVisible(x==b))}
 color(){if(this.col>=0)return '#'+COL[this.col].toString(16).padStart(6,'0');this.hue=(this.hue+3)%360;return `hsl(${this.hue},90%,55%)`}
 note(y){const f=220*Math.pow(2,(1-y/this.H)*2);try{tone(f,.12,'sine',.07)}catch(e){}}
 dot(a){}
 line(a){const p=a.p,c=this.cx,U=this.U;const d=Math.hypot(p.x-a.lx,p.y-a.ly);if(d<1)return;c.strokeStyle=this.color();c.lineCap='round';c.lineJoin='round';
  const w=U*2.6+Math.min(U*2,d*.08);c.lineWidth=w;c.beginPath();c.moveTo(a.lx,a.ly);c.lineTo(p.x,p.y);c.stroke();c.globalAlpha=.35;c.strokeStyle='#ffffff';c.lineWidth=w*.25;c.beginPath();c.moveTo(a.lx-w*.2,a.ly-w*.2);c.lineTo(p.x-w*.2,p.y-w*.2);c.stroke();c.globalAlpha=1;this.ink+=d/U;
  if(!a.t||performance.now()-a.t>90){a.t=performance.now();this.note(p.y)}}
 splat(x,y){const c=this.cx,U=this.U,col=this.color(),r=U*rnd(4,7);c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,7);c.fill();
  for(let i=0;i<14;i++){const a=R()*7,dd=r*rnd(1,2.6),rr=U*rnd(.4,1.6);c.beginPath();c.arc(x+Math.cos(a)*dd,y+Math.sin(a)*dd,rr,0,7);c.fill()}
  for(let i=0;i<ri(2,4);i++)this.dripL.push({x:x+rnd(-r*.8,r*.8),y:y+r*.5,w:U*rnd(.8,1.6),l:U*rnd(4,14),c:col});
  this.cameras.main.shake(90,.003);this.snd(pk(['soft_h','soft_m','snow']),{v:.8,rate:rnd(.8,1.2),gap:30});this.mono(x,y,Phaser.Display.Color.HexStringToColor(col.startsWith('#')?col:'#ff4081').color,10);this.ink+=12;sayT(pk(['啪！','吧唧！','哇！']),1200)}
 stamp(x,y){const k=pk(VEH.concat(ANIM,['p_flower','p_butterfly','it_apple','p_rocket']));const U=this.U,src=this.textures.get(k).getSourceImage(),s=U*rnd(16,22)/Math.max(src.width,src.height);
  const im=this.add.image(x,y,k).setDepth(40).setScale(s*1.6).setAlpha(0);this.tweens.add({targets:im,scale:s,alpha:1,duration:180,ease:'Back.easeIn',onComplete:()=>{this.cx.drawImage(src,x-src.width*s/2,y-src.height*s/2,src.width*s,src.height*s);this.ct.refresh();im.destroy();this.fxDust.explode(6,x,y+src.height*s*.4)}});
  this.snd('punch',{v:.5,rate:rnd(1.1,1.4),gap:60});try{PJ.snd(k)}catch(e){}sayT(nm(k),0);this.ink+=15}
 stars(a){const p=a.p,U=this.U,c=this.cx;if(a.t&&performance.now()-a.t<45)return;a.t=performance.now();const r=U*rnd(1,2.4);c.fillStyle=this.color();c.beginPath();for(let i=0;i<10;i++){const rr=i%2?r*.45:r,an=-Math.PI/2+i*Math.PI/5+R();c.lineTo(p.x+rnd(-U*2,U*2)+Math.cos(an)*rr,p.y+rnd(-U*2,U*2)+Math.sin(an)*rr)}c.fill();this.burstStar(p.x,p.y,2);this.snd('glass',{v:.25,rate:rnd(1.2,2),gap:110});this.ink+=1.5}
 wipe(){const U=this.U;const sp=this.add.text(-U*20,this.H*.5,'🧽',{fontSize:Math.round(U*26)+'px'}).setOrigin(.5).setDepth(85);noiseS(.9,1200,.2,400);this.snd('roll');
  this.tweens.add({targets:sp,x:this.W+U*20,duration:900,ease:'Sine.easeInOut',onUpdate:()=>{this.cx.clearRect(0,0,Math.max(0,sp.x),this.H);this.ct.refresh();this.fxBubble?0:this.burstStar(sp.x,R()*this.H,1)},onComplete:()=>{sp.destroy();this.dripL=[];sayT('又是新的一张纸！',0)}})}
 update(){let ch=0;this.act.forEach((a,id)=>{if(!a.p.isDown){this.act.delete(id);return}const p=a.p;if(this.tool=='brush'){this.line(a);ch=1}else if(this.tool=='star'){this.stars(a);ch=1}a.lx=p.x;a.ly=p.y});
  if(this.dripL.length){const c=this.cx;this.dripL=this.dripL.filter(d=>{c.fillStyle=d.c;c.beginPath();c.arc(d.x,d.y,d.w,0,7);c.fill();d.y+=1.2;d.l-=1.2;d.w*=.997;return d.l>0});ch=1}
  if(ch||this.act.size)this.ct.refresh();if(this.ink>this.nextWin){this.nextWin=this.ink+1400;this.party(pk(['画得真漂亮！','好多颜色呀！','小画家真棒！']))}}
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
  this.deco([['a_dog',.12,.9,10],['a_cat',.3,.92,9],['a_chick',.8,.92,8],['a_cow',.93,.9,11],['p_bird',.12,.3,7],['p_rocket',.9,.25,9]],5);
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
   game.events.on('booted',()=>{booted=true;run(pending)});game.events.on('step',()=>{game.sound.mute=isMuted()})}
  else if(booted){pending=key;game.scale.refresh();clearTimeout(window._gst);window._gst=setTimeout(()=>{if(host.parentNode&&pending==key){game.scale.refresh();run(key)}},60)}else pending=key},
 stop(){if(game){game.scene.getScenes(true).forEach(s=>s.scene.stop());}if(host.parentNode)host.parentNode.removeChild(host)},
 get game(){return game}};
})();
