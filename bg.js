// bg.js – Professionelle Kosmische Lichtkugel mit Strudel (Weiß & Blau)
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const particles = [];
const START_COUNT = 30;  // Partikel am Anfang
const MAX_COUNT = 220;   // Gesamtanzahl

function rand(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for (let i = 0; i < MAX_COUNT; i++) {
    const hues = [210, 220, 230, 240]; // Weiß-Blau
    const hue = hues[Math.floor(rand(0, hues.length))];
    particles.push({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.3, 0.3),
      radius: rand(1.2, 3.2),
      alpha: i < START_COUNT ? rand(0.6, 1) : 0,
      active: i < START_COUNT,
      hue: hue,
      baseRadius: rand(1.2, 3.2) // für Pulsschlag
    });
  }
}

let phase = 'float';
let timer = 0;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width / 2;
  center.y = height / 2;
}

window.addEventListener('resize', resize);

// Hintergrund
function drawBackground() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
}

// Partikel zeichnen & bewegen
function drawParticles() {
  drawBackground();

  for (let p of particles) {
    if (!p.active) continue;

    // Leichter Pulsschlag der Partikel
    const radius = p.baseRadius + Math.sin(timer * 0.05) * 0.5;

    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
    ctx.shadowBlur = 15 + 10 * p.alpha;
    ctx.shadowColor = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
    ctx.fill();

    if (phase === 'float') {
      p.vx += rand(-0.005, 0.005);
      p.vy += rand(-0.005, 0.005);
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }

    else if (phase === 'gather') {
      // Anziehungskraft → Lichtkugel
      const dx = center.x - p.x;
      const dy = center.y - p.y;
      p.x += dx * 0.02 + Math.sin(timer * 0.01) * 0.5;
      p.y += dy * 0.02 + Math.cos(timer * 0.01) * 0.5;
      p.alpha = Math.min(p.alpha + 0.01, 1);
    }

    else if (phase === 'explode') {
      // Strudelartige Explosion
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const angle = Math.atan2(dy, dx);
      const swirl = rand(0.12, 0.18);  // variabler Strudel
      const speed = rand(1.5, 3.5);
      p.x += Math.cos(angle + swirl) * speed + rand(-0.2, 0.2);
      p.y += Math.sin(angle + swirl) * speed + rand(-0.2, 0.2);
      p.alpha -= 0.002;

      // Reset Partikel
      if (p.alpha <= 0) {
        p.x = center.x + rand(-20, 20);
        p.y = center.y + rand(-20, 20);
        p.alpha = rand(0.6, 1);
        p.radius = p.baseRadius = rand(1.2, 3.2);
      }
    }
  }

  // Glow-Halo um Lichtkugel
  if (phase === 'gather' || phase === 'explode') {
    ctx.beginPath();
    ctx.arc(center.x, center.y, 80 + Math.sin(timer * 0.03) * 30, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Neue Partikel aktivieren
function activateMoreParticles() {
  particles.forEach(p => {
    if (!p.active) {
      p.active = true;
      p.x = center.x + rand(-50, 50);
      p.y = center.y + rand(-50, 50);
      p.alpha = rand(0.6, 1);
    }
  });
}

// Animation Loop
function animate() {
  drawParticles();
  requestAnimationFrame(animate);
  timer++;

  if (timer === 300) phase = 'gather';
  if (timer === 800) {
    activateMoreParticles();
    phase = 'explode';
  }
  if (timer === 1800) {
    phase = 'float';
    timer = 0;
  }
}

createParticles();
animate();
