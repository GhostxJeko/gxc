// bg.js – Kosmischer Lichtball mit Strudel-Explosion (Weiß & Blau)
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const particles = [];
const MAX_PARTICLES = 200;

function rand(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const hues = [210, 220, 230, 240]; // Weiß-Blau Töne
    const hue = hues[Math.floor(rand(0, hues.length))];
    particles.push({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-0.2, 0.2),
      vy: rand(-0.2, 0.2),
      radius: rand(1.5, 3),
      alpha: rand(0.5, 1),
      hue: hue
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

function drawBackground() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
}

// Partikel zeichnen & bewegen
function drawParticles() {
  drawBackground();

  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
    ctx.shadowBlur = 20;
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
      // Anziehung zur Mitte → Lichtkugel
      p.x += (center.x - p.x) * 0.02;
      p.y += (center.y - p.y) * 0.02;
      p.alpha = Math.min(p.alpha + 0.01, 1);
    }

    else if (phase === 'explode') {
      // Strudel-Explosion
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const angle = Math.atan2(dy, dx);
      const swirl = 0.15;
      const speed = rand(1.5, 3);
      p.x += Math.cos(angle + swirl) * speed + rand(-0.2, 0.2);
      p.y += Math.sin(angle + swirl) * speed + rand(-0.2, 0.2);
      p.alpha -= 0.002;

      if (p.alpha <= 0) {
        // Reset zur Mitte für neuen Zyklus
        p.x = center.x + rand(-20, 20);
        p.y = center.y + rand(-20, 20);
        p.alpha = rand(0.6, 1);
        p.radius = rand(1.5, 3);
      }
    }
  }

  // subtiler Halo-Kreis um Lichtball während Strudel
  if (phase === 'explode') {
    ctx.beginPath();
    ctx.arc(center.x, center.y, 100 + Math.sin(timer * 0.03) * 30, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Aktiviert alle Partikel zur Explosion
function activateParticles() {
  particles.forEach(p => {
    p.alpha = rand(0.6, 1);
    p.x = center.x + rand(-50, 50);
    p.y = center.y + rand(-50, 50);
  });
}

// Animationsloop
function animate() {
  drawParticles();
  requestAnimationFrame(animate);
  timer++;

  if (timer === 300) phase = 'gather';
  if (timer === 800) {
    activateParticles();
    phase = 'explode';
  }
  if (timer === 1800) {
    phase = 'float';
    timer = 0;
  }
}

createParticles();
animate();
