// bg.js – Realistische Partikel im Universum: Schweben, Zusammenziehen, Explodieren
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const particles = [];
const particleCount = 220; // realistische Anzahl

// Zufallsfunktion
function random(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    const colorTone = Math.floor(random(180, 255));
    particles.push({
      x: random(0, width),
      y: random(0, height),
      vx: random(-0.1, 0.1),
      vy: random(-0.1, 0.1),
      radius: random(1.5, 3),
      alpha: random(0.5, 0.9),
      decay: random(0.001, 0.003),
      color: `rgba(255,${colorTone},0,`
    });
  }
}

// Sterne & Nebel für Universum-Hintergrund
function drawBackground() {
  ctx.fillStyle = '#000'; // tiefschwarz
  ctx.fillRect(0, 0, width, height);

  // Hintergrundsterne
  for (let i = 0; i < 4; i++) {
    const sx = random(0, width);
    const sy = random(0, height);
    const sr = random(0.3, 1);
    const sa = random(0.2, 0.6);
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.fill();
  }

  // Subtiler Lichtnebel (optional für Tiefe)
  for (let i = 0; i < 3; i++) {
    const lx = random(0, width);
    const ly = random(0, height);
    const lr = random(60, 180);
    const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
    grad.addColorStop(0, 'rgba(255,140,0,0.015)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx, ly, lr, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Partikel zeichnen & bewegen
function drawParticles() {
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 12 + 8 * p.alpha;
    ctx.shadowColor = '#ff8c00';
    ctx.fill();

    if (phase === 'float') {
      // sanftes Schweben
      p.vx += random(-0.008, 0.008);
      p.vy += random(-0.008, 0.008);
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
    else if (phase === 'gather') {
      // Kreisbündelung zur Mitte
      const dx = center.x - p.x;
      const dy = center.y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      p.x += dx * 0.02 * (dist / width + 0.5);
      p.y += dy * 0.02 * (dist / height + 0.5);
      p.alpha = Math.min(p.alpha + 0.01, 1); // Aufleuchten beim Sammeln
    }
    else if (phase === 'explode') {
      // Langsame Explosion nach außen
      const angle = Math.atan2(p.y - center.y, p.x - center.x);
      const speed = 0.3 + random(0, 0.8);
      p.x += Math.cos(angle) * speed;
      p.y += Math.sin(angle) * speed;
      p.alpha -= p.decay * 1.2;
      if (p.alpha <= 0.1) {
        const rad = random(width/2, width);
        const ang = random(0, Math.PI*2);
        p.x = center.x + Math.cos(ang)*rad;
        p.y = center.y + Math.sin(ang)*rad;
        p.alpha = random(0.5,0.9);
        p.radius = random(1.5,3);
        p.vx = random(-0.1,0.1);
        p.vy = random(-0.1,0.1);
      }
    }
  }
}

// Animation Loop
let phase = 'float';
let timer = 0;
function animate() {
  drawBackground();
  drawParticles();
  requestAnimationFrame(animate);
  timer++;

  if (timer % 1200 === 0) phase = 'gather';      // zusammenziehen
  if (timer % 1200 === 400) phase = 'explode';   // langsame Explosion
  if (timer % 1200 === 800) phase = 'float';     // wieder schweben
}

// Resize
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width/2;
  center.y = height/2;
});

// Start
createParticles();
animate();
