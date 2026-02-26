// bg.js – Universum Partikel-Strudel mit Lichtkugel-Effekt
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const particleCount = 250;
const particles = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    // Start zufällig über die ganze Fläche
    const hue = [210, 220, 230, 240][Math.floor(random(0, 4))]; // Weiß-Blau
    const light = random(70, 100);
    particles.push({
      x: random(0, width),
      y: random(0, height),
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3),
      radius: random(1.2, 2.8),
      alpha: random(0.5, 1),
      decay: random(0.001, 0.003),
      color: `hsla(${hue}, 80%, ${light}%,`,
    });
  }
}

let phase = 'float'; // float -> gather -> explode
let timer = 0;

function drawBackground() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
}

function drawParticles() {
  drawBackground();

  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 10 + 20 * p.alpha;
    ctx.shadowColor = 'hsla(220, 80%, 90%,' + p.alpha + ')';
    ctx.fill();

    if (phase === 'float') {
      // Sanftes Schweben durch das Universum
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }

    if (phase === 'gather') {
      // Partikel sammeln sich zur Lichtkugel
      p.x += (center.x - p.x) * 0.04;
      p.y += (center.y - p.y) * 0.04;
      p.alpha = Math.min(p.alpha + 0.01, 1);
    }

    if (phase === 'explode') {
      // Strudelartige Explosion
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const angle = Math.atan2(dy, dx);
      const swirl = 0.18;
      const speed = random(1.5, 3);
      p.x += Math.cos(angle + swirl) * speed + random(-0.2, 0.2);
      p.y += Math.sin(angle + swirl) * speed + random(-0.2, 0.2);
      p.alpha -= p.decay * 1.5;

      if (p.alpha <= 0) {
        // Zurücksetzen zur Mitte für nächsten Zyklus
        p.x = random(center.x - 50, center.x + 50);
        p.y = random(center.y - 50, center.y + 50);
        p.alpha = random(0.6, 1);
      }
    }
  }
}

function animate() {
  drawParticles();
  requestAnimationFrame(animate);
  timer++;

  if (timer % 2000 === 0) phase = 'gather';
  if (timer % 2000 === 800) phase = 'explode';
  if (timer % 2000 === 1600) phase = 'float';
}

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width / 2;
  center.y = height / 2;
});

// Start
createParticles();
animate();
