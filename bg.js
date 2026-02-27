// bg.js – Kosmos-Strudel Partikel
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const CONFIG = {
  particleCount: 250,
  initialCount: 50,       // Anfang weniger Partikel
  starCount: 8,
  hues: [210, 240, 270], // Blau-Weiß Töne
  phases: { FLOAT:'float', GATHER:'gather', EXPLODE:'explode' },
  swirlSpeed: 0.08,       // Rotation um die Lichtkugel
  explodeSpeed: 2.5,      // Geschwindigkeit bei Explosion
};

const random = (min,max)=>Math.random()*(max-min)+min;
const randomHue = ()=>CONFIG.hues[Math.floor(random(0,CONFIG.hues.length))];
const createColor = ()=>`hsla(${randomHue()},${random(50,100)}%,${random(70,100)}%,`;

class Particle {
  constructor(init=false){
    this.init=init;
    this.reset();
  }

  reset(){
    if(this.init){
      // Anfangs nur wenige Partikel in der Lichtkugel
      const angle = random(0, Math.PI*2);
      const r = random(0, 80);
      this.x = center.x + Math.cos(angle)*r;
      this.y = center.y + Math.sin(angle)*r;
    } else {
      this.x=random(0,width);
      this.y=random(0,height);
    }
    this.vx=random(-0.2,0.2);
    this.vy=random(-0.2,0.2);
    this.radius=random(1.5,3);
    this.alpha=random(0.5,1);
    this.decay=random(0.002,0.004);
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
    }
    else if(phase===CONFIG.phases.GATHER){
      // Runen-Lichtkugel zieht Partikel an
      const dx = center.x - this.x;
      const dy = center.y - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const angle = Math.atan2(dy, dx);
      this.x += Math.cos(angle) * Math.min(5, dist*0.05);
      this.y += Math.sin(angle) * Math.min(5, dist*0.05);
      // leichte Rotation
      this.x += Math.cos(dist/50)*CONFIG.swirlSpeed*100;
      this.y += Math.sin(dist/50)*CONFIG.swirlSpeed*100;
      this.alpha=Math.min(this.alpha+0.01,1);
    }
    else if(phase===CONFIG.phases.EXPLODE){
      // Explosion + Strudel
      const angle = Math.atan2(this.y - center.y, this.x - center.x);
      const swirl = CONFIG.swirlSpeed*1.5;
      const speed = random(CONFIG.explodeSpeed*0.5, CONFIG.explodeSpeed*1.5);
      this.x += Math.cos(angle + swirl) * speed + random(-0.3,0.3);
      this.y += Math.sin(angle + swirl) * speed + random(-0.3,0.3);
      this.alpha -= this.decay;

      if(this.alpha<=0){
        // Reset in Lichtkugel
        const a=random(0,Math.PI*2);
        const r=random(50,120);
        this.x=center.x+Math.cos(a)*r;
        this.y=center.y+Math.sin(a)*r;
        this.alpha=random(0.5,1);
        this.radius=random(1.5,3);
        this.color=createColor();
      }
    }
  }

  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
    ctx.fillStyle=this.color+this.alpha+')';
    ctx.shadowBlur=20+15*this.alpha;
    ctx.shadowColor=`rgba(255,255,255,${this.alpha})`;
    ctx.fill();
  }
}

// INIT
const particles = [];
// Anfangs weniger Partikel
for(let i=0;i<CONFIG.initialCount;i++) particles.push(new Particle(true));
for(let i=CONFIG.initialCount;i<CONFIG.particleCount;i++) particles.push(new Particle());

let phase = CONFIG.phases.FLOAT;
let timer=0;

const drawBackground = ()=>{
  ctx.fillStyle='#000';
  ctx.fillRect(0,0,width,height);
};

const drawStars = ()=>{
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
  for(let p of particles){ p.update(phase); p.draw(); }

  timer++;
  if(timer%2000===0) phase=CONFIG.phases.GATHER;
  if(timer%2000===800) phase=CONFIG.phases.EXPLODE;
  if(timer%2000===1500) phase=CONFIG.phases.FLOAT;

  requestAnimationFrame(animate);
}

window.addEventListener('resize',()=>{
  width=canvas.width=window.innerWidth;
  height=canvas.height=window.innerHeight;
  center.x=width/2;
  center.y=height/2;
});

animate();
