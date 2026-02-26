
// bg.js – Glühende Partikel im Universum, langsam explodierend und verglühend
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Zentrum für Explosionen
const center = { x: width/2, y: height/2 };

const particles = [];
const particleCount = 250;

// Zufallsfunktion
function random(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for(let i = 0; i < particleCount; i++){
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

// Hintergrund zeichnen (Universum)
function drawBackground() {
  // Dunkel, leicht transparent für Trails
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(0, 0, width, height);

  // Sanfte Lichtpunkte wie Nebel
  for(let i=0;i<5;i++){
    const lx = random(0,width);
    const ly = random(0,height);
    const lr = random(50,150);
    const grad = ctx.createRadialGradient(lx,ly,0,lx,ly,lr);
    grad.addColorStop(0, 'rgba(255,140,0,0.02)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx,ly,lr,0,Math.PI*2);
    ctx.fill();
  }

  // Kleine Sterne
  for(let i=0;i<3;i++){
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

// Partikel bewegen und zeichnen
function drawParticles() {
  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 15 + 10*p.alpha;
    ctx.shadowColor = '#ff7f00';
    ctx.fill();

    // Bewegung
    p.x += p.vx;
    p.y += p.vy;

    // Alpha verringern (verglühen)
    p.alpha -= p.decay;

    // Wenn Partikel weg, neu erzeugen in der Mitte
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

// Animation Loop
function animate() {
  drawBackground();
  drawParticles();
  requestAnimationFrame(animate);
}

// Fenstergröße ändern
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width/2;
  center.y = height/2;
});

// Start
createParticles();
animate(); 
