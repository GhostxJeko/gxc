// bg.js – Ultimative Partikel-Animation: float → gather → explode, digital universe Look
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Zentrum
const center = { x: width/2, y: height/2 };

// Partikel-Setup
const particles = [];
const particleCount = 220;

function random(min, max) { return Math.random() * (max - min) + min; }

function createParticles() {
  particles.length = 0;
  for(let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(0, width),
      y: random(0, height),
      vx: random(-0.2, 0.2),
      vy: random(-0.2, 0.2),
      radius: random(1.5, 3),
      alpha: random(0.3, 0.9),
      decay: random(0.0005, 0.002),
      color: `rgba(255,${Math.floor(random(150,255))},0,`
    });
  }
}

// Animation Phasen
let phase = 'float'; // float -> gather -> explode
let timer = 0;

// Zeichenfunktion
function drawParticles() {
  // Hintergrund leicht transparent für Trails
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(0, 0, width, height);

  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 15 + 10*p.alpha;
    ctx.shadowColor = '#ff7f00';
    ctx.fill();

    // Float Phase – leichte Bewegung
    if(phase === 'float'){
      p.x += p.vx;
      p.y += p.vy;

      if(p.x < 0 || p.x > width) p.vx *= -1;
      if(p.y < 0 || p.y > height) p.vy *= -1;
    }
    // Gather Phase – Partikel bewegen sich langsam zum Zentrum
    else if(phase === 'gather'){
      p.x += (center.x - p.x) * 0.02;
      p.y += (center.y - p.y) * 0.02;
    }
    // Explode Phase – Partikel fliegen langsam nach außen
    else if(phase === 'explode'){
      p.x += p.vx * 1.8;
      p.y += p.vy * 1.8;
      p.alpha -= p.decay;
      if(p.alpha <= 0.05){
        p.x = center.x;
        p.y = center.y;
        p.alpha = random(0.3, 0.9);
        p.vx = random(-0.2, 0.2);
        p.vy = random(-0.2, 0.2);
      }
    }
  }
}

// Kleine zufällige Lichter wie Sterne
function drawStars() {
  const starCount = 3; // Anzahl pro Frame
  for(let i = 0; i < starCount; i++){
    const x = random(0, width);
    const y = random(0, height);
    const radius = random(0.5, 1.5);
    const alpha = random(0.2, 0.8);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  }
}

// Animation Loop
function animate(){
  drawParticles();
  drawStars();
  requestAnimationFrame(animate);
  timer++;

  // Steuerung Phasen langsamer & smooth
  if(timer % 900 === 0) phase = 'gather';      // 15 Sekunden float
  if(timer % 900 === 300) phase = 'explode';   // 5 Sekunden gather
  if(timer % 900 === 600) phase = 'float';     // 5 Sekunden explode
}

// Resize
window.addEventListener('resize', ()=>{
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width/2;
  center.y = height/2;
});

// Start
createParticles();
animate(); 
