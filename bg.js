// bg.js – Kosmischer Partikel-Strudel mit Lichtkugel (weiß & blau, professionell)
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const particles = [];
const MAX_PARTICLES = 250; // Gesamtzahl
const START_PARTICLES = 40; // Anfang weniger Partikel

function rand(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const hueOptions = [210, 220, 230, 240]; // Weiß-Blau
    const hue = hueOptions[Math.floor(rand(0, hueOptions.length))];
    particles.push({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.15, 0.15),
      radius: rand(1.5, 3),
      alpha: i < START_PARTICLES ? rand(0.6, 1) : 0,
      decay: rand(0.001, 0.003),
      active: i < START_PARTICLES,
      hue: hue
    });
  }
}

let phase = 'float';
let timer = 0;

// Fenstergröße
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width / 2;
  center.y = height / 2;
});

// Partikel zeichnen
function drawParticles() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);

  particles.forEach(p => {
    if (!p.active) return;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
    ctx.shadowBlur = 20 + 10 * p.alpha;
    ctx.shadowColor = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
    ctx.fill();

    // Bewegungen nach Phase
    if (phase === 'float') {
      p.vx += rand(-0.008, 0.008);
      p.vy += rand(-0.008, 0.008);
      p.x += p.vx;
      p.y += p.vy;
    } else if (phase === 'gather') {
      // Anziehung zur Mitte → Lichtkugel
      p.x += (center.x - p.x) * 0.05;
      p.y += (center.y - p.y) * 0.05;
      p.alpha = Math.min(p.alpha + 0.01, 1);
    } else if (phase === 'explode') {
      // Explosion & Strudel
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const angle = Math.atan2(dy, dx);
      const swirl = 0.18; // Starker Strudel
      const speed = rand(1.5, 3);

      p.x += Math.cos(angle + swirl) * speed + rand(-0.3, 0.3);
      p.y += Math.sin(angle + swirl) * speed + rand(-0.3, 0.3);
      p.alpha -= p.decay * 1.5;

      if (p.alpha <= 0) {
        // Reset Partikel in der Mitte
        const a = rand(0, Math.PI * 2);
        const r = rand(width / 4, width / 2);
        p.x = center.x + Math.cos(a) * r;
        p.y = center.y + Math.sin(a) * r;
        p.alpha = rand(0.6, 1);
        p.radius = rand(1.5, 3);
        const hueOptions = [210, 220, 230, 240];
        p.hue = hueOptions[Math.floor(rand(0, hueOptions.length))];
      }
    }

    // Float-Begrenzung
    if (phase === 'float') {
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
  });
}

// Mehr Partikel aktivieren
function activateMoreParticles() {
  particles.forEach(p => {
    if (!p.active) {
      p.active = true;
      p.x = center.x;
      p.y = center.y;
      p.alpha = rand(0.6, 1);
    }
  });
}

// Animation Loop
function animate() {
  drawParticles();
  requestAnimationFrame(animate);
  timer++;

  if (timer === 400) phase = 'gather';
  if (timer === 650) {
    activateMoreParticles(); // Mehr Partikel für Strudel
    phase = 'explode';
  }
  if (timer === 1400) {
    phase = 'float';
    timer = 0;
  }
}

// Start
createParticles();
animate();
