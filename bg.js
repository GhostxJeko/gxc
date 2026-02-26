// bg.js – Glühende Partikel im Universum, kreisförmiges Sammeln & Explosion
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Mittelpunkt für Kreissammlung/Explosion
const center = { x: width / 2, y: height / 2 };

const particles = [];
const particleCount = 250;

// Zufallsfunktion
function random(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for(let i = 0; i < particleCount; i++){
    const angle = Math.random() * Math.PI * 2;
    const radius = random(50, Math.max(width, height)/2);
    particles.push({
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
      vx: random(-0.15,0.15),
      vy: random(-0.15,0.15),
      radius: random(1.5,3),
      alpha: random(0.4,1),
      decay: random(0.0008,0.002),
      baseAngle: angle,
      baseRadius: radius
    });
  }
}
createParticles();

let phase = "float";
let phaseTimer = 0;

// Hintergrund Universum
function drawBackground() {
  // Dunkles Universum
  ctx.fillStyle = "#000010"; // sehr dunkles Blau-Schwarz
  ctx.fillRect(0, 0, width, height);

  // Sternenpunkte
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

  // Sanfte Lichtnebel
  for(let i=0;i<3;i++){
    const lx = random(0,width);
    const ly = random(0,height);
    const lr = random(50,120);
    const grad = ctx.createRadialGradient(lx,ly,0,lx,ly,lr);
    grad.addColorStop(0, 'rgba(255,140,0,0.02)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx,ly,lr,0,Math.PI*2);
    ctx.fill();
  }
}

// Partikel zeichnen und bewegen
function drawParticles() {
  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,${Math.floor(random(140,200))},0,${p.alpha})`;
    ctx.shadowBlur = 20 + 10*p.alpha;
    ctx.shadowColor = "#ff7f00";
    ctx.fill();

    if(phase === "float"){
      // sanftes schweben
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < 0 || p.x > width) p.vx *= -1;
      if(p.y < 0 || p.y > height) p.vy *= -1;
    }
    else if(phase === "gather"){
      // kreisförmiges Zusammenziehen zur Mitte
      const dx = center.x - p.x;
      const dy = center.y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const angle = Math.atan2(dy, dx);
      const targetRadius = 50 + Math.random()*20;
      p.x += Math.cos(angle) * dist * 0.02;
      p.y += Math.sin(angle) * dist * 0.02;
    }
    else if(phase === "explode"){
      // sanfte Explosion
      const angle = Math.random() * Math.PI * 2;
      const speed = random(1.2,2.5);
      p.x += Math.cos(angle) * speed;
      p.y += Math.sin(angle) * speed;
      p.alpha -= p.decay*2;
      if(p.alpha <= 0){
        // Reset zum Kreis
        const startAngle = Math.random()*Math.PI*2;
        const startRadius = random(50, Math.max(width,height)/2);
        p.x = center.x + startRadius * Math.cos(startAngle);
        p.y = center.y + startRadius * Math.sin(startAngle);
        p.alpha = random(0.4,1);
        p.decay = random(0.0008,0.002);
      }
    }
  }
}

// Hauptloop
function animate() {
  drawBackground();
  drawParticles();

  phaseTimer++;
  if(phaseTimer === 800) phase = "gather";    // langsamere Phasen
  if(phaseTimer === 1200) phase = "explode";
  if(phaseTimer === 2000){
    phase = "float";
    phaseTimer = 0;
  }

  requestAnimationFrame(animate);
}

animate();

// Fenstergröße anpassen
window.addEventListener('resize',()=>{
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width/2;
  center.y = height/2;
});
