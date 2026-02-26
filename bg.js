// bg.js – Professionelle Partikelanimation: Schweben, Sammeln, Explodieren im Universum
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const particles = [];
const particleCount = 400; // mehr Partikel für dichte Szene

// Zufallsfunktion
function random(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(0, width),
      y: random(0, height),
      vx: random(-0.2, 0.2),
      vy: random(-0.2, 0.2),
      radius: random(1.5, 3.5),
      alpha: random(0.5, 1),
      decay: random(0.001, 0.004),
      color: `rgba(255,${Math.floor(random(140,255))},0,`
    });
  }
}

// Animation-Phasen
let phase = 'float'; // float -> gather -> explode
let timer = 0;

// Hintergrund + Sterne + leichter Nebel
function drawBackground() {
  // Dunkles Universum
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  // Sterne
  for (let i = 0; i < 6; i++) {
    const sx = random(0, width);
    const sy = random(0, height);
    const sr = random(0.3, 1.5);
    const sa = random(0.2, 0.7);
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.fill();
  }

  // Subtiler Lichtnebel
  for (let i = 0; i < 5; i++) {
    const lx = random(0, width);
    const ly = random(0, height);
    const lr = random(50, 200);
    const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
    grad.addColorStop(0, 'rgba(255,140,0,0.02)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx, ly, lr, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Partikel zeichnen und bewegen
function drawParticles() {
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 20 + 15 * p.alpha;
    ctx.shadowColor = '#ff7f00';
    ctx.fill();

    // Bewegung je Phase
    if (phase === 'float') {
      // sanftes Schweben
      p.vx += random(-0.015, 0.015);
      p.vy += random(-0.015, 0.015);
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    } 
    else if (phase === 'gather') {
      // Kreisförmig zur Mitte sammeln
      const dx = center.x - p.x;
      const dy = center.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      p.x += dx * 0.015 * (dist/width + 0.5); // sanft beschleunigen bei größerem Abstand
      p.y += dy * 0.015 * (dist/height + 0.5);
      p.alpha = Math.min(p.alpha + 0.01, 1); // Aufleuchten beim Sammeln
    } 
    else if (phase === 'explode') {
      // Explosion nach außen, sanft + random
      const angle = Math.atan2(p.y - center.y, p.x - center.x);
      const speed = 0.4 + random(0,1.2);
      p.x += Math.cos(angle) * speed;
      p.y += Math.sin(angle) * speed;
      p.alpha -= p.decay * 1.5;

      if (p.alpha <= 0.1) {
        const rad = random(width/2, width);
        const ang = random(0, Math.PI*2);
        p.x = center.x + Math.cos(ang) * rad;
        p.y = center.y + Math.sin(ang) * rad;
        p.alpha = random(0.5, 1);
        p.radius = random(1.5, 3.5);
        p.vx = random(-0.2, 0.2);
        p.vy = random(-0.2, 0.2);
      }
    }
  }
}

// Animation Loop
function animate() {
  drawBackground();
  drawParticles();
  requestAnimationFrame(animate);
  timer++;

  // Phasen länger und smooth
  if (timer % 1500 === 0) phase = 'gather';
  if (timer % 1500 === 500) phase = 'explode';
  if (timer % 1500 === 1000) phase = 'float';
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
