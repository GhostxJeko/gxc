// bg.js – Kosmische Lichtkugel mit Strudel-Explosion (Weiß & Blau)
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const particles = [];
const START_COUNT = 50;   // Partikel starten nah an der Mitte
const MAX_COUNT = 200;    // Maximal sichtbar im Strudel

function rand(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for (let i = 0; i < MAX_COUNT; i++) {
    const hues = [210, 220, 230, 240]; // Weiß-Blau Töne
    const hue = hues[Math.floor(rand(0, hues.length))];
    particles.push({
      x: center.x + rand(-50, 50),  // Start nahe der Mitte
      y: center.y + rand(-50, 50),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.3, 0.3),
      radius: rand(1.5, 3),
      alpha: i < START_COUNT ? rand(0.6, 1) : 0,
      active: i < START_COUNT,
      hue: hue
    });
  }
}

let phase = 'float';
let timer = 0;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width / 2;
  center.y = height / 2;
});

function drawBackground() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
}

function drawParticles() {
  drawBackground();

  for (let p of particles) {
    if (!p.active) continue;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue},90%,75%,${p.alpha})`;
    ctx.shadowBlur = 20;
    ctx.shadowColor = `hsla(${p.hue},90%,75%,${p.alpha})`;
    ctx.fill();

    if (phase === 'float') {
      p.vx += rand(-0.004, 0.004);
      p.vy += rand(-0.004, 0.004);
      p.x += p.vx;
      p.y += p.vy;
    }

    if (phase === 'gather') {
      // Anziehung zur Mitte → Lichtkugel
      p.x += (center.x - p.x) * 0.02;
      p.y += (center.y - p.y) * 0.02;
      p.alpha = Math.min(p.alpha + 0.01, 1);
    }

    if (phase === 'explode') {
      // Strudel-Explosion
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const angle = Math.atan2(dy, dx);
      const swirl = 0.15;       // Drehung für kosmischen Wirbel
      const speed = rand(1.5, 3);
      p.x += Math.cos(angle + swirl) * speed + rand(-0.2, 0.2);
      p.y += Math.sin(angle + swirl) * speed + rand(-0.2, 0.2);
      p.alpha -= 0.002;

      if (p.alpha <= 0) {
        // Reset zur Mitte nach Explosion
        p.x = center.x + rand(-30, 30);
        p.y = center.y + rand(-30, 30);
        p.alpha = rand(0.6, 1);
        p.radius = rand(1.5, 3);
      }
    }
  }

  // Subtiler Kreis während Strudel
  if (phase === 'explode') {
    ctx.beginPath();
    ctx.arc(center.x, center.y, 100 + Math.sin(timer * 0.03) * 30, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Neue Partikel aktivieren (für Strudel)
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
