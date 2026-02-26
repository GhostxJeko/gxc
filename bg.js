// bg.js – Partikel-Tunnel mit Kugelstart & Strudel
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const particles = [];
const particleCount = 250; // gleiche Anzahl wie vorher

function random(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen – kugelförmig
function createParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    const angle = random(0, Math.PI * 2);
    const radius = random(0, Math.min(width, height)/3); // kugelförmig
    const hue = 210; // blau
    const light = random(180, 255); // hell/blau-weiß
    particles.push({
      x: center.x + Math.cos(angle)*radius,
      y: center.y + Math.sin(angle)*radius,
      vx: 0,
      vy: 0,
      radius: random(1.5,3),
      alpha: random(0.5,1),
      decay: random(0.001,0.005),
      color: `rgba(255,${light},${light},` // weiß-blau
    });
  }
}

let phase = 'float';
let timer = 0;

// Partikel zeichnen
function drawParticles() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  // mehr kleine weiße Sterne
  for(let i=0;i<6;i++){
    const sx = random(0,width);
    const sy = random(0,height);
    const sr = random(0.3,1.2);
    const sa = random(0.2,0.6);
    ctx.beginPath();
    ctx.arc(sx,sy,sr,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.fill();
  }

  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 20 + 15*p.alpha;
    ctx.shadowColor = '#fff';
    ctx.fill();

    if(phase==='float'){
      p.vx += random(-0.02,0.02);
      p.vy += random(-0.02,0.02);
      p.x += p.vx;
      p.y += p.vy;
    } else if(phase==='gather'){
      p.x += (center.x-p.x)*0.03;
      p.y += (center.y-p.y)*0.03;
      p.alpha = Math.min(p.alpha+0.01,1);
    } else if(phase==='explode'){
      const dx = p.x-center.x;
      const dy = p.y-center.y;
      const angle = Math.atan2(dy,dx);
      const swirl = 0.2; // starker Strudel
      const speed = random(1.5,3.5);
      p.x += Math.cos(angle+swirl)*speed + random(-0.3,0.3);
      p.y += Math.sin(angle+swirl)*speed + random(-0.3,0.3);
      p.alpha -= p.decay*1.5;

      if(p.alpha<=0){
        const a = random(0,Math.PI*2);
        const r = random(width/3,width/2);
        p.x = center.x + Math.cos(a)*r;
        p.y = center.y + Math.sin(a)*r;
        p.alpha = random(0.5,1);
        p.radius = random(1.5,3);
        // Explosion: rot, gelb, blau, weiß
        const hues = [0,45,210,240,60];
        const hue = hues[Math.floor(random(0,hues.length))];
        const sat = random(60,100);
        const light = random(70,100);
        p.color = `hsla(${hue},${sat}%,${light}%,`;
      }
    }

    if(phase==='float'){
      if(p.x<0 || p.x>width) p.vx*=-1;
      if(p.y<0 || p.y>height) p.vy*=-1;
    }
  }
}

function animate(){
  drawParticles();
  requestAnimationFrame(animate);
  timer++;
  if(timer%900===0) phase='gather';
  if(timer%900===300) phase='explode';
  if(timer%900===600) phase='float';
}

window.addEventListener('resize',()=>{
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width/2;
  center.y = height/2;
});

createParticles();
animate();
