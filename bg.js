// bg.js – Kosmischer Lichtball mit Strudel-Explosion (Weiß & Blau)
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const particles = [];
const TOTAL_PARTICLES = 200;

function rand(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for (let i = 0; i < TOTAL_PARTICLES; i++) {
    const hues = [210, 220, 230, 240]; // Weiß-Blau
    const hue = hues[Math.floor(rand(0, hues.length))];
    particles.push({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-0.5, 0.5),
      vy: rand(-0.5, 0.5),
      radius: rand(1.5, 3),
      alpha: rand(0.5, 1),
      hue: hue,
      blink: rand(0.01, 0.03)
    });
  }
}

// Resize
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

// Partikel zeichnen
function drawParticles() {
  drawBackground();

  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

    // Subtiles Funkeln
    const alpha = p.alpha + Math.sin(timer * 0.05 + p.blink) * 0.1;
    ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${alpha})`;
    ctx.shadowBlur = 20 + 10 * p.alpha;
    ctx.shadowColor = `hsla(${p.hue}, 90%, 75%, ${alpha})`;
    ctx.fill();

    // Anziehungskraft → Lichtkugel
    const dx = center.x - p.x;
    const dy = center.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const force = Math.min(0.03, 1 / (dist * 0.02 + 0.1)); // Kosmische Anziehung

    p.vx += dx * force;
    p.vy += dy * force;

    // Strudel-Bewegung
    const angle = Math.atan2(dy, dx);
    const swirl = Math.sin(timer * 0.02) * 0.1;
    p.vx += Math.cos(angle + Math.PI / 2) * swirl;
    p.vy += Math.sin(angle + Math.PI / 2) * swirl;

    // Update Position
    p.x += p.vx;
    p.y += p.vy;

    // Leichtes Abbremsen für Kontrolle
    p.vx *= 0.97;
    p.vy *= 0.97;
  }

  // Strudel-Kreis als Licht-Effekt
  ctx.beginPath();
  ctx.arc(center.x, center.y, 100 + Math.sin(timer * 0.03) * 30, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

let timer = 0;

// Animation
function animate() {
  drawParticles();
  requestAnimationFrame(animate);
  timer++;
}

createParticles();
animate();
