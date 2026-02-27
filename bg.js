// bg.js – Kosmischer Strudel mit Lichtkugel
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width/2, y: height/2 };

const CONFIG = {
  particleCount: 250,
  hues: [210, 240], // Blau & Weiß
  phases: { FLOAT:'float', GATHER:'gather', EXPLODE:'explode' },
  gatherRadius: 80,
  swirlSpeed: 0.1,
  explodeSpeed: 4
};

const random = (min,max)=>Math.random()*(max-min)+min;
const randomHue = ()=>CONFIG.hues[Math.floor(random(0,CONFIG.hues.length))];
const createColor = ()=>`hsla(${randomHue()}, 80%, 70%,`;

class Particle {
  constructor(){
    this.reset(true); // initial zufällig
  }

  reset(initial=false){
    if(initial){
      // Anfang: überall verteilt
      this.x = random(0,width);
      this.y = random(0,height);
    } else {
      // Reset nach Explode: Lichtkugel
      const angle = random(0,Math.PI*2);
      const r = random(20, CONFIG.gatherRadius);
      this.x = center.x + Math.cos(angle)*r;
      this.y = center.y + Math.sin(angle)*r;
    }
    this.vx = random(-0.2,0.2);
    this.vy = random(-0.2,0.2);
    this.radius = random(1.5,3);
    this.alpha = random(0.6,1);
    this.decay = random(0.002,0.004);
    this.color = createColor();
    this.angleOffset = random(0, Math.PI*2); // für Drehung um Kugel
  }

  update(phase){
    if(phase === CONFIG.phases.FLOAT){
      // Leichtes Schweben
      this.vx += random(-0.008,0.008);
      this.vy += random(-0.008,0.008);
      this.x += this.vx;
      this.y += this.vy;
      if(this.x<0||this.x>width) this.vx*=-1;
      if(this.y<0||this.y>height) this.vy*=-1;

    } else if(phase === CONFIG.phases.GATHER){
      // Kreisförmig zur Mitte
      const dx = center.x - this.x;
      const dy = center.y - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const targetRadius = CONFIG.gatherRadius;

      // Winkel für Rotation um Lichtkugel
      const angle = Math.atan2(dy,dx) + this.angleOffset;
      this.x = center.x + Math.cos(angle)*Math.min(dist, targetRadius);
      this.y = center.y + Math.sin(angle)*Math.min(dist, targetRadius);

      // alpha erhöhen
      this.alpha = Math.min(this.alpha + 0.02, 1);

    } else if(phase === CONFIG.phases.EXPLODE){
      // Strudel-Explosion
      const dx = this.x - center.x;
      const dy = this.y - center.y;
      const angle = Math.atan2(dy, dx);
      const swirl = CONFIG.swirlSpeed;
      const speed = random(CONFIG.explodeSpeed*0.5, CONFIG.explodeSpeed*1.5);
      this.x += Math.cos(angle + swirl)*speed + random(-0.5,0.5);
      this.y += Math.sin(angle + swirl)*speed + random(-0.5,0.5);
      this.alpha -= this.decay;

      if(this.alpha <=0){
        this.reset(false);
      }
    }
  }

  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.shadowBlur = 20 + 15*this.alpha;
    ctx.shadowColor = `rgba(255,255,255,${this.alpha})`;
    ctx.fill();
  }
}

const particles = [];
for(let i=0;i<CONFIG.particleCount;i++) particles.push(new Particle());

let phase = CONFIG.phases.FLOAT;
let timer=0;

const drawBackground=()=>{
  ctx.fillStyle='#000';
  ctx.fillRect(0,0,width,height);
};

function animate(){
  drawBackground();
  for(let p of particles){ p.update(phase); p.draw(); }

  timer++;
  if(timer%2000===0) phase=CONFIG.phases.GATHER;
  if(timer%2000===800) phase=CONFIG.phases.EXPLODE;
  if(timer%2000===1500) phase=CONFIG.phases.FLOAT;

  requestAnimationFrame(animate);
}

window.addEventListener('resize',()=>{
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width/2;
  center.y = height/2;
});

animate();
