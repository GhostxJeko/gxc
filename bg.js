const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width/2, y: height/2 };

const CONFIG = {
  particleCount: 200,
  starCount: 6,
  hues: [210, 240, 270],
  phases: { FLOAT:'float', GATHER:'gather', EXPLODE:'explode' },
};

const random = (min,max)=>Math.random()*(max-min)+min;
const randomHue = ()=>CONFIG.hues[Math.floor(random(0,CONFIG.hues.length))];
const createColor = ()=>`hsla(${randomHue()},${random(50,100)}%,${random(70,100)}%,`;

class Particle {
  constructor(){ this.reset(); }
  reset(){
    this.x=random(0,width);
    this.y=random(0,height);
    this.vx=random(-0.2,0.2);
    this.vy=random(-0.2,0.2);
    this.radius=random(1.5,3);
    this.alpha=random(0.5,1);
    this.decay=random(0.001,0.003);
    this.color=createColor();
  }
  update(phase){
    if(phase===CONFIG.phases.FLOAT){
      this.vx+=random(-0.008,0.008);
      this.vy+=random(-0.008,0.008);
      this.x+=this.vx;
      this.y+=this.vy;
      if(this.x<0||this.x>width)this.vx*=-1;
      if(this.y<0||this.y>height)this.vy*=-1;
    } else if(phase===CONFIG.phases.GATHER){
      this.x+=(center.x-this.x)*0.03;
      this.y+=(center.y-this.y)*0.03;
      this.alpha=Math.min(this.alpha+0.01,1);
    } else if(phase===CONFIG.phases.EXPLODE){
      const angle=Math.atan2(this.y-center.y,this.x-center.x);
      const swirl=0.05;
      const speed=random(1.5,3);
      this.x+=Math.cos(angle+swirl)*speed+random(-0.2,0.2);
      this.y+=Math.sin(angle+swirl)*speed+random(-0.2,0.2);
      this.alpha-=this.decay*1.5;
      if(this.alpha<=0)this.reset();
    }
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
    ctx.fillStyle=this.color+this.alpha+')';
    ctx.shadowBlur=15+10*this.alpha;
    ctx.shadowColor=`rgba(255,255,255,${this.alpha})`;
    ctx.fill();
  }
}

const particles=Array.from({length:CONFIG.particleCount},()=>new Particle());
let phase=CONFIG.phases.FLOAT;
let timer=0;

const drawBackground=()=>{
  ctx.fillStyle='#000'; // schwarzer Hintergrund, kein Weiß mehr
  ctx.fillRect(0,0,width,height);
};

const drawStars=()=>{
  for(let i=0;i<CONFIG.starCount;i++){
    ctx.beginPath();
    const sx=random(0,width);
    const sy=random(0,height);
    const sr=random(0.3,1.2);
    const sa=random(0.2,0.5);
    ctx.arc(sx,sy,sr,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${sa})`;
    ctx.fill();
  }
};

function animate(){
  drawBackground();
  drawStars();
  particles.forEach(p=>{p.update(phase); p.draw();});
  timer++;
  if(timer%1500===0)phase=CONFIG.phases.GATHER;
  if(timer%1500===500)phase=CONFIG.phases.EXPLODE;
  if(timer%1500===1000)phase=CONFIG.phases.FLOAT;
  requestAnimationFrame(animate);
}

window.addEventListener('resize',()=>{
  width=canvas.width=window.innerWidth;
  height=canvas.height=window.innerHeight;
  center.x=width/2;
  center.y=height/2;
});

animate();
