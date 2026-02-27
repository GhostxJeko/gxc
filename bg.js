// bg.js – Galaxie-Strudel High-End, schwarz, wenige Partikel am Anfang
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const CONFIG = {
  initialParticles: 8,      // wenige Partikel am Anfang
  totalParticles: 180,      // volle Strudel-Dichte nach Start
  hues: [210, 0],           // Blau & Weiß
  phases: { FLOAT:'float', GATHER:'gather', EXPLODE:'explode' },
  gatherRadius: 120,
  swirlSpeed: 0.04,
  explodeSpeed: 2,
  glowBlur: 20,
  trailAlpha: 0.05          // Transparenter Hintergrund, schwarz bleibt schwarz
};

const random = (min,max)=>Math.random()*(max-min)+min;
const randomHue = ()=>CONFIG.hues[Math.floor(random(0,CONFIG.hues.length))];
const createColor = ()=>`hsla(${randomHue()},80%,75%,`;

class Particle {
  constructor(initial=false){
    this.reset(initial);
    this.trail = [];
  }

  reset(initial=false){
    if(initial){
      this.x = center.x + random(-40,40);
      this.y = center.y + random(-40,40);
    } else {
      const angle = random(0, Math.PI*2);
      const r = random(10, CONFIG.gatherRadius);
      this.x = center.x + Math.cos(angle)*r;
      this.y = center.y + Math.sin(angle)*r;
    }
    this.vx = random(-0.1,0.1);
    this.vy = random(-0.1,0.1);
    this.radius = random(1.5,2.5);
    this.alpha = random(0.5,0.9);
    this.decay = random(0.001,0.002);
    this.color = createColor();
    this.angleOffset = random(0, Math.PI*2);
    this.trail = [];
  }

  update(phase){
    if(phase===CONFIG.phases.FLOAT){
      this.vx += random(-0.003,0.003);
      this.vy += random(-0.003,0.003);
      this.x += this.vx;
      this.y += this.vy;
      if(this.x<0||this.x>width) this.vx*=-1;
      if(this.y<0||this.y>height) this.vy*=-1;

    } else if(phase===CONFIG.phases.GATHER){
      const dx = center.x - this.x;
      const dy = center.y - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const angle = Math.atan2(dy, dx) + this.angleOffset;
      const swirl = 0.03 * dist; // sanfter Strudel
      this.x = center.x + Math.cos(angle + swirl) * Math.min(dist, CONFIG.gatherRadius);
      this.y = center.y + Math.sin(angle + swirl) * Math.min(dist, CONFIG.gatherRadius);
      this.alpha = Math.min(this.alpha + 0.02, 1);

    } else if(phase===CONFIG.phases.EXPLODE){
      const dx = this.x - center.x;
      const dy = this.y - center.y;
      const angle = Math.atan2(dy, dx);
      const swirl = CONFIG.swirlSpeed;
      const speed = random(CONFIG.explodeSpeed*0.7, CONFIG.explodeSpeed*1.3);
      this.x += Math.cos(angle + swirl)*speed + random(-0.2,0.2);
      this.y += Math.sin(angle + swirl)*speed + random(-0.2,0.2);
      this.alpha -= this.decay;
      if(this.alpha<=0) this.reset(false);
    }

    this.trail.push({x:this.x, y:this.y, alpha:this.alpha});
    if(this.trail.length>6) this.trail.shift();
  }

  draw(){
    for(let i=0;i<this.trail.length;i++){
      const t = this.trail[i];
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.radius*(i/6+0.3), 0, Math.PI*2);
      ctx.fillStyle = this.color + t.alpha*(i/6+0.3) + ')';
      ctx.shadowBlur = CONFIG.glowBlur*(i/6+0.3);
      ctx.shadowColor = `rgba(255,255,255,${t.alpha*(i/6+0.3)})`;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.shadowBlur = CONFIG.glowBlur;
    ctx.shadowColor = `rgba(255,255,255,${this.alpha})`;
    ctx.fill();
  }
}

let particles = Array.from({length: CONFIG.initialParticles}, ()=>new Particle(true));
let extraAdded = false;
let phase = CONFIG.phases.FLOAT;
let timer = 0;

const drawBackground = ()=>{
  ctx.fillStyle = `rgba(0,0,0,${CONFIG.trailAlpha})`; // schwarzer Hintergrund
  ctx.fillRect(0,0,width,height);
};

function animate(){
  drawBackground();
  particles.forEach(p=>{ p.update(phase); p.draw(); });

  // volle Partikel erst nach sanftem Start
  if(!extraAdded && timer>180){
    const more = Array.from({length: CONFIG.totalParticles - CONFIG.initialParticles}, ()=>new Particle());
    particles = particles.concat(more);
    extraAdded = true;
  }

  timer++;
  if(timer%3000===0) phase=CONFIG.phases.GATHER;
  if(timer%3000===1500) phase=CONFIG.phases.EXPLODE;
  if(timer%3000===2500) phase=CONFIG.phases.FLOAT;

  requestAnimationFrame(animate);
}

window.addEventListener('resize', ()=>{
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width/2;
  center.y = height/2;
});

animate();
