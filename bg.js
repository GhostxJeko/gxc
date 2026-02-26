
// bg.js – Ultra-realistische Partikel im Universum mit Glow & Explosion
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Mittelpunkt
const center = { x: width / 2, y: height / 2 };

// Partikel
const particles = [];
const particleCount = 80; // Realistisch, nicht zu voll

function random(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    const hue = random(45, 55); // warme Lichtfarbe
    particles.push({
      x: random(0, width),
      y: random(0, height),
      vx: random(-0.2, 0.2),
      vy: random(-0.2, 0.2),
      radius: random(1.5, 3),
      alpha: random(0.5, 1),
      decay: random(0.0008, 0.002),
      color: `hsla(${hue},100%,70%,`
    });
  }
}

// Hintergrund zeichnen
function drawBackground() {
  // Dunkel + leicht transparent für Trails
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0, 0, width, height);

  // Sanfte Nebel-Lichter
  for (let i = 0; i < 3; i++) {
    const lx = random(0, width);
    const ly = random(0, height);
    const lr = random(60, 150);
    const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
    grad.addColorStop(0, 'rgba(255,180,120,0.02)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx, ly, lr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Kleine Sterne
  for (let i = 0; i < 3; i++) {
    const sx = random(0, width);
    const sy = random(0, height);
    const sr = random(0.3, 1);
    const sa = random(0.2, 0.6);
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.fill();
  }
}

// Phase
let phase = 'float'; // float -> gather -> explode
let timer = 0;

// Partikel zeichnen & bewegen
function drawParticles() {
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 20 + 15 * p.alpha;
    ctx.shadowColor = 'hsla(45,100%,80%,' + p.alpha + ')';
    ctx.fill();

    // Bewegung je Phase
    if (phase === 'float') {
      // sanftes Schweben
      p.vx += random(-0.01, 0.01);
      p.vy += random(-0.01, 0.01);
      p.x += p.vx;
      p.y += p.vy;
    } 
    else if (phase === 'gather') {
      // Zusammenziehen
      p.x += (center.x - p.x) * 0.03;
      p.y += (center.y - p.y) * 0.03;
      p.alpha = Math.min(p.alpha + 0.01, 1);
    } 
    else if (phase === 'explode') {
      // Explosion nach außen
      const angle = Math.atan2(p.y - center.y, p.x - center.x);
      const speed = random(2, 3.5);
      p.x += Math.cos(angle) * speed + random(-0.5, 0.5);
      p.y += Math.sin(angle) * speed + random(-0.5, 0.5);
      p.alpha -= p.decay * 1.5;

      if (p.alpha <= 0) {
        // Neu-Spawn außerhalb für kontinuierliche Partikel
        const a = random(0, Math.PI * 2);
        const r = random(width / 2, width);
        p.x = center.x + Math.cos(a) * r;
        p.y = center.y + Math.sin(a) * r;
        p.alpha = random(0.5, 1);
        p.radius = random(1.5, 3);
      }
    }

    // Float-Grenzen
    if (phase === 'float') {
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
  }
}

// Animation
function animate() {
  drawBackground();
  drawParticles();
  requestAnimationFrame(animate);

  timer++;
  if (timer % 900 === 0) phase = 'gather';
  if (timer % 900 === 300) phase = 'explode';
  if (timer % 900 === 600) phase = 'float';
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
