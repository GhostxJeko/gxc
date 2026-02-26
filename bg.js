// bg.js – Kosmisches Universum: Lichtkugel, Strudel & Explosion (weiß & blau)
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let center = { x: width / 2, y: height / 2 };

const particles = [];
const START_COUNT = 20;  // Anfangs wenige Partikel
const MAX_COUNT = 250;   // Explosion & Strudel volle Stärke

function rand(min, max) { return Math.random() * (max - min) + min; }

function createParticles() {
  particles.length = 0;
  for (let i = 0; i < MAX_COUNT; i++) {
    const hue = [210, 220, 230, 240][Math.floor(rand(0,4))]; // Weiß-Blau
    particles.push({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-0.15, 0.15),
      vy: rand(-0.15, 0.15),
      radius: rand(1.5, 3),
      alpha: i < START_COUNT ? rand(0.6, 1) : 0,
      active: i < START_COUNT,
      hue: hue
    });
  }
}

let phase = 'float'; // float -> gather -> explode -> swirl
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

function drawParticles() {
  drawBackground();

  for (let p of particles) {
    if (!p.active) continue;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
    ctx.fillStyle = `hsla(${p.hue}, 90%, 80%, ${p.alpha})`;
    ctx.shadowBlur = 20 + 15*p.alpha;
    ctx.shadowColor = `hsla(${p.hue}, 90%, 80%, ${p.alpha})`;
    ctx.fill();

    if (phase === 'float') {
      p.vx += rand(-0.004, 0.004);
      p.vy += rand(-0.004, 0.004);
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

    } else if (phase === 'gather') {
      // Sanftes Zusammenziehen zur Lichtkugel
      p.x += (center.x - p.x)*0.015;
      p.y += (center.y - p.y)*0.015;
      p.alpha = Math.min(p.alpha + 0.008, 1);

    } else if (phase === 'explode') {
      // Explosion Richtung Außen
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const angle = Math.atan2(dy, dx);
      const speed = rand(2,4);
      p.x += Math.cos(angle)*speed + rand(-0.3,0.3);
      p.y += Math.sin(angle)*speed + rand(-0.3,0.3);
      p.alpha -= 0.003;

      if (p.alpha <= 0) {
        const a = rand(0, Math.PI*2);
        const r = rand(width/4, width/2);
        p.x = center.x + Math.cos(a)*r;
        p.y = center.y + Math.sin(a)*r;
        p.alpha = rand(0.5,1);
        p.radius = rand(1.5,3);
      }

    } else if (phase === 'swirl') {
      // Kosmischer Strudel
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const angle = Math.atan2(dy, dx);
      const swirl = 0.12;
      const speed = 1.5;
      p.x += Math.cos(angle+swirl)*speed;
      p.y += Math.sin(angle+swirl)*speed;
    }
  }
}

function activateMoreParticles() {
  particles.forEach(p => {
    if (!p.active) {
      p.active = true;
      p.x = rand(0, width);
      p.y = rand(0, height);
      p.alpha = rand(0.5,1);
    }
  });
}

function animate() {
  drawParticles();
  requestAnimationFrame(animate);
  timer++;

  if (timer === 300) phase = 'gather';
  if (timer === 900) { activateMoreParticles(); phase = 'explode'; }
  if (timer === 2000) phase = 'swirl';
  if (timer === 4000) { phase = 'float'; timer = 0; }
}

createParticles();
animate();
