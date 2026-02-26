
// bg.js – Professionelle Partikelanimation im Universum
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Zentrum
const center = { x: width/2, y: height/2 };

// Partikel-Array
const particles = [];
const particleCount = 90; // Realistische Anzahl

// Zufallsfunktion
function random(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for (let i=0; i<particleCount; i++) {
    const hue = random(40, 55); // warme Lichtfarbe
    particles.push({
      x: random(0, width),
      y: random(0, height),
      vx: random(-0.15,0.15),
      vy: random(-0.15,0.15),
      radius: random(1.5,3),
      alpha: random(0.5,1),
      decay: random(0.0008,0.002),
      color: `hsla(${hue},100%,70%,`
    });
  }
}

// Hintergrund zeichnen
function drawBackground() {
  // Dunkler, leicht transparenter Hintergrund für Motion Trails
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.fillRect(0, 0, width, height);

  // Sanfte Glow-Nebelpunkte
  for(let i=0;i<3;i++){
    const lx = random(0,width);
    const ly = random(0,height);
    const lr = random(60,150);
    const grad = ctx.createRadialGradient(lx,ly,0,lx,ly,lr);
    grad.addColorStop(0,'rgba(255,180,120,0.02)');
    grad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx,ly,lr,0,Math.PI*2);
    ctx.fill();
  }

  // Kleine Sterne
  for(let i=0;i<3;i++){
    const sx = random(0,width);
    const sy = random(0,height);
    const sr = random(0.3,1);
    const sa = random(0.3,0.7);
    ctx.beginPath();
    ctx.arc(sx,sy,sr,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.fill();
  }
}

// Phasen
let phase = 'float';
let timer = 0;

// Partikel zeichnen & bewegen
function drawParticles() {
  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 18 + 12*p.alpha;
    ctx.shadowColor = 'hsla(45,100%,80%,' + p.alpha + ')';
    ctx.fill();

    // Phase-bewegung
    if(phase==='float'){
      p.vx += random(-0.01,0.01);
      p.vy += random(-0.01,0.01);
      p.x += p.vx;
      p.y += p.vy;
      // Ränder abprallen
      if(p.x<0||p.x>width)p.vx*=-1;
      if(p.y<0||p.y>height)p.vy*=-1;
    } 
    else if(phase==='gather'){
      // sanft zur Mitte ziehen
      p.x += (center.x - p.x)*0.025;
      p.y += (center.y - p.y)*0.025;
      p.alpha = Math.min(p.alpha + 0.015,1); // Aufhellen
    } 
    else if(phase==='explode'){
      // Explosion aus der Mitte
      const angle = Math.atan2(p.y-center.y,p.x-center.x);
      const speed = random(2,4);
      p.x += Math.cos(angle)*speed + random(-0.3,0.3);
      p.y += Math.sin(angle)*speed + random(-0.3,0.3);
      p.alpha -= p.decay*1.5;

      if(p.alpha<=0){
        // Neu-Spawn am Rand für flüssige Animation
        const a = random(0, Math.PI*2);
        const r = random(width/2, width);
        p.x = center.x + Math.cos(a)*r;
        p.y = center.y + Math.sin(a)*r;
        p.alpha = random(0.5,1);
        p.radius = random(1.5,3);
      }
    }
  }
}

// Animation
function animate() {
  drawBackground();
  drawParticles();
  requestAnimationFrame(animate);

  timer++;
  // längere, fließende Phasen
  if(timer%1200===0) phase='gather';
  if(timer%1200===400) phase='explode';
  if(timer%1200===800) phase='float';
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
