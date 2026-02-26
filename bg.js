// bg.js – Professioneller Partikelhintergrund mit sanfter Explosion
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const particles = [];
const particleCount = 250; // mehr Partikel für dichteres Universum

const center = { x: width / 2, y: height / 2 };

// Zufallsfunktion
function random(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(0, width),
      y: random(0, height),
      vx: random(-0.2, 0.2),   // langsamer schwebend
      vy: random(-0.2, 0.2),
      radius: random(1, 3),
      alpha: random(0.2, 0.8),
      decay: random(0.001, 0.004),
      color: `rgba(255,${Math.floor(random(150,255))},0,`
    });
  }
}

// Animation Phasen
let phase = 'float';
let timer = 0;

function drawParticles() {
  // Schwarzer Hintergrund
  ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.fillRect(0, 0, width, height);

  for (let p of particles) {
    // Glow-Effekt
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 12 + 12 * p.alpha;
    ctx.shadowColor = '#ff7f00';
    ctx.fill();

    // Bewegung nach Phase
    if (phase === 'float') {
      p.x += p.vx;
      p.y += p.vy;
    } else if (phase === 'gather') {
      p.x += (center.x - p.x) * 0.02; // langsames Zusammenziehen
      p.y += (center.y - p.y) * 0.02;
    } else if (phase === 'explode') {
