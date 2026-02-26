// bg.js – Glühende Partikel, float → gather → explode, Universum-Stil
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Zentrum für Gather/Explosion
const center = { x: width / 2, y: height / 2 };

const particles = [];
const particleCount = 250;

// Zufallsfunktion
function random(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for(let i=0; i<particleCount; i++){
    particles.push({
      x: random(0, width),
      y: random(0, height),
      vx: random(-0.25,0.25),
      vy: random(-0.25,0.25),
      radius: random(1.5,3),
      alpha: random(0.4,1),
      decay: random(0.001,0.005),
      color: `rgba(255,${Math.floor(random(140,255))},0,`
    });
  }
}

// Hintergrund zeichnen – Dunkel, Universum-Stil
function drawBackground() {
  ctx.fillStyle = '#000'; // **dunkel/schwarz**
  ctx.fillRect(0,0,width,height);

  // sanfte Licht-Nebelpunkte
  for(let i=0;i<3;i++){
    const lx = random(0,width);
    const ly = random(0,height);
    const lr = random(50,120);
    const grad = ctx.createRadialGradient(lx,ly,0,lx,ly,lr);
    grad.addColorStop(0,'rgba(255,140,0,0.02)');
    grad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx,ly,lr,0,Math.PI*2);
    ctx.fill();
  }

  // kleine Sterne
  for(let i=0;i<2;i++){
    const sx = random(0,width);
    const sy = random(0,height);
    const sr = random(0.5,1.5);
    const sa = random(0.2,0.8);
    ctx.beginPath();
    ctx.arc(sx,sy,sr,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.fill();
  }
}

// Partikel bewegen & zeichnen
let phase = 'float'; // float -> gather -> explode
let timer = 0;

function drawParticles() {
  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 15 + 10*p.alpha;
    ctx.shadowColor = '#ff7f00';
    ctx.fill();

    // Float Phase – frei schweben
    if(phase==='float'){
      p.x += p.vx;
      p.y += p.vy;
      if(p.x<0||p.x>width)p.vx*=-1;
      if(p.y<0||p.y>height)p.vy*=-1;
    }

    // Gather Phase – langsam zur Mitte
    else if(phase==='gather'){
      const dx = center.x - p.x;
      const dy = center.y - p.y;
      p.x += dx*0.02;
      p.y += dy*0.02;
    }

    // Explode Phase – Partikel fliegen auseinander
    else if(phase==='explode'){
      p.x += p.vx*3;
      p.y += p.vy*3;
      p.alpha -= p.decay*2;
      if(p.alpha <= 0){
        p.x = center.x + random(-50,50);
        p.y = center.y + random(-50,50);
        p.vx = random(-0.25,0.25);
        p.vy = random(-0.25,0.25);
        p.radius = random(1.5,3);
        p.alpha = random(0.4,1);
        p.decay = random(0.001,0.005);
      }
    }
  }
}

// Animation Loop
function animate(){
  drawBackground();
  drawParticles();
  requestAnimationFrame(animate);

  timer++;
  if(timer % 600 === 0) phase = 'gather';       // 10 Sekunden float
  if(timer % 600 === 200) phase = 'explode';    // danach Explode
  if(timer % 600 === 400) phase = 'float';      // wieder float
}

// Resize
window.addEventListener('resize',()=>{
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width/2;
  center.y = height/2;
});

// Start
createParticles();
animate();
