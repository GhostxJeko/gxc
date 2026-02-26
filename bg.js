// bg.js – Professionelle Universum-Animation mit hochwertigen Partikeln & Glow
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Mittelpunkt
const center = { x: width / 2, y: height / 2 };

// Partikel-Array
const particles = [];
const particleCount = 180; // Weniger, dafür hochwertiger

// Zufallsfunktion
function random(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    const hue = random(40, 55); // warme Lichtfarbe
    particles.push({
      x: random(0, width),
      y: random(0, height),
      vx: random(-0.05, 0.05), // langsamer Start
      vy: random(-0.05, 0.05),
      radius: random(1.8, 3.2),
      alpha: random(0.5, 1),
      decay: random(0.001, 0.003),
      color: `hsla(${hue},100%,70%,`
    });
  }
}

// Animation Phasen
let phase = 'float'; // float -> gather -> explode
let timer = 0;

// Hintergrund zeichnen
function drawBackground() {
  ctx.fillStyle = '#000'; // Dunkel, Universumsschwarz
  ctx.fillRect(0, 0, width, height);
}

// Partikel zeichnen & bewegen
function drawParticles() {
  drawBackground();

  // Kleine Sterne für Universum-Tiefe
  for(let i=0; i<6; i++){
    const sx = random(0, width);
    const sy = random(0, height);
    const sr = random(0.2, 1.2);
    const sa = random(0.2, 0.6);
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.fill();
  }

  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 25 * p.alpha; // stärkerer Glow
    ctx.shadowColor = 'hsla(45,100%,85%,' + p.alpha + ')';
    ctx.fill();

    // Bewegung basierend auf Phase
    if (phase === 'float'){
      p.vx += random(-0.01, 0.01);
      p.vy += random(-0.01, 0.01);
      p.x += p.vx;
      p.y += p.vy;
    } 
    else if (phase === 'gather'){
      p.x += (center.x - p.x) * 0.03;
      p.y += (center.y - p.y) * 0.03;
      p.alpha = Math.min(p.alpha + 0.015,1);
    } 
    else if (phase === 'explode'){
      const angle = Math.atan2(p.y - center.y, p.x - center.x);
      const speed = random(1.5, 3); // Explosion etwas langsamer
      p.x += Math.cos(angle) * speed + random(-0.3,0.3);
      p.y += Math.sin(angle) * speed + random(-0.3,0.3);
      p.alpha -= p.decay * 1.5;

      if(p.alpha <= 0){
        const a = random(0, Math.PI*2);
        const r = random(width/3, width/2);
        p.x = center.x + Math.cos(a)*r;
        p.y = center.y + Math.sin(a)*r;
        p.alpha = random(0.5,1);
        p.radius = random(1.8,3.2);
      }
    }

    // Float-Begrenzung
    if(phase === 'float'){
      if(p.x < 0 || p.x > width) p.vx *= -1;
      if(p.y < 0 || p.y > height) p.vy *= -1;
    }
  }
}

// Animation Loop
function animate() {
  drawParticles();
  requestAnimationFrame(animate);
  timer++;

  // Phasensteuerung für smooth Effekt
  if(timer % 1200 === 0) phase = 'gather';
  if(timer % 1200 === 400) phase = 'explode';
  if(timer % 1200 === 800) phase = 'float';
}

// Resize
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width / 2;
  center.y = height / 2;
});

// Start
createParticles();
animate();
