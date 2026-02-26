// bg.js – Professioneller Kosmischer Partikel-Strudel
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let center = { x: width / 2, y: height / 2 };

const particles = [];
const INITIAL_COUNT = 30;  // Start wenige Partikel
const MAX_COUNT = 180;     // Maximal im Strudel
const COLORS = [210, 240, 270, 0, 45, 60]; // Blau + Rot/Gelb für Explosion

function rand(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for (let i = 0; i < MAX_COUNT; i++) {
    const hue = COLORS[Math.floor(rand(0, COLORS.length))];
    particles.push({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-0.05, 0.05),
      vy: rand(-0.05, 0.05),
      radius: rand(1.5, 3),
      alpha: i < INITIAL_COUNT ? rand(0.6, 1) : 0,
      active: i < INITIAL_COUNT,
      hue: hue
    });
  }
}

let phase = 'float';
let timer = 0;

// Fenster Resize
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width / 2;
  center.y = height / 2;
});

function drawBackground() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
}

// Partikel zeichnen & bewegen
function drawParticles() {
  drawBackground();

  particles.forEach(p => {
    if (!p.active) return;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue},90%,75%,${p.alpha})`;
    ctx.shadowBlur = 20 + 10 * p.alpha;
    ctx.shadowColor = `hsla(${p.hue},90%,75%,${p.alpha})`;
    ctx.fill();

    if (phase === 'float') {
      // Sanftes Schweben
      p.vx += rand(-0.003, 0.003);
      p.vy += rand(-0.003, 0.003);
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    } else if (phase === 'gather') {
      // Anziehung zur Kugel
      p.x += (center.x - p.x) * 0.04;
      p.y += (center.y - p.y) * 0.04;
      p.alpha = Math.min(p.alpha + 0.01, 1);
    } else if (phase === 'explode') {
      // Kosmischer Strudel / Explosion
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const angle = Math.atan2(dy, dx);
      const swirl = 0.15;  // Spiralbewegung stärker
      const speed = rand(1.5, 3);
      p.x += Math.cos(angle + swirl) * speed + rand(-0.2, 0.2);
      p.y += Math.sin(angle + swirl) * speed + rand(-0.2, 0.2);
      p.alpha -= 0.0015;

      if (p.alpha <= 0) {
        // Reset im Zentrum für nächste Kugel
        p.x = center.x + rand(-50, 50);
        p.y = center.y + rand(-50, 50);
        p.alpha = rand(0.6, 1);
        p.radius = rand(1.5, 3);
        p.hue = COLORS[Math.floor(rand(0, COLORS.length))];
      }
    }
  });
}

// Aktiviert mehr Partikel für Strudel
function activateMoreParticles() {
  particles.forEach(p => {
    if (!p.active) {
      p.active = true;
      p.x = rand(0, width);
      p.y = rand(0, height);
      p.alpha = rand(0.6, 1);
    }
  });
}

// Animation
function animate() {
  drawParticles();
  requestAnimationFrame(animate);
  timer++;

  // Phasensteuerung
  if (timer === 500) phase = 'gather';
  if (timer === 1200) {
    activateMoreParticles();
    phase = 'explode';
  }
  if (timer === 3000) {
    phase = 'float';
    timer = 0;
  }
}

// Start
createParticles();
animate();
