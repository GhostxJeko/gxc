// bg.js – High-End Partikel-Tunnel mit Strudel-Explosion
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

// CONFIG
const CONFIG = {
  particleCount: 120, // weniger Partikel
  starCount: 5,
  hues: [210, 220, 230], // Blau-Nuancen
  phases: { FLOAT: 'float', GATHER: 'gather', EXPLODE: 'explode' },
};

// UTILS
const random = (min, max) => Math.random() * (max - min) + min;
const randomHue = () => CONFIG.hues[Math.floor(random(0, CONFIG.hues.length))];
const createColor = () => `hsla(${randomHue()}, ${random(30, 60)}%, ${random(60, 90)}%,`;

// PARTICLE CLASS
class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.vx = random(-0.2, 0.2);
    this.vy = random(-0.2, 0.2);
    this.radius = random(1.5, 3);
    this.alpha = random(0.5, 1);
    this.decay = random(0.001, 0.003);
    this.color = createColor();
  }

  update(phase) {
    if (phase === CONFIG.phases.FLOAT) {
      this.vx += random(-0.008, 0.008);
      this.vy += random(-0.008, 0.008);
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

    } else if (phase === CONFIG.phases.GATHER) {
      this.x += (center.x - this.x) * 0.03;
      this.y += (center.y - this.y) * 0.03;
      this.alpha = Math.min(this.alpha + 0.01, 1);

    } else if (phase === CONFIG.phases.EXPLODE) {
      const angle = Math.atan2(this.y - center.y, this.x - center.x);
      const swirl = 0.05;
      const speed = random(1.5, 3);
      this.x += Math.cos(angle + swirl) * speed + random(-0.2, 0.2);
      this.y += Math.sin(angle + swirl) * speed + random(-0.2, 0.2);
      this.alpha -= this.decay * 1.5;

      if (this.alpha <= 0) {
        const a = random(0, Math.PI * 2);
        const r = random(width / 3, width / 2);
        this.x = center.x + Math.cos(a) * r;
        this.y = center.y + Math.sin(a) * r;
        this.alpha = random(0.5, 1);
        this.radius = random(1.5, 3);
        this.color = createColor();
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.shadowBlur = 15 + 10 * this.alpha;
    ctx.shadowColor = `rgba(255,255,255,${this.alpha})`;
    ctx.fill();
  }
}

// INIT
const particles = Array.from({ length: CONFIG.particleCount }, () => new Particle());

let phase = CONFIG.phases.FLOAT;
let timer = 0;

// DRAW BACKGROUND
const drawBackground = () => {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
};

// DRAW STARS
const drawStars = () => {
  for (let i = 0; i < CONFIG.starCount; i++) {
    ctx.beginPath();
    const sx = random(0, width);
    const sy = random(0, height);
    const sr = random(0.3, 1.2);
    const sa = random(0.2, 0.5);
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.fill();
  }
};

// ANIMATE
function animate() {
  drawBackground();
  drawStars();

  for (let p of particles) {
    p.update(phase);
    p.draw();
  }

  timer++;
  if (timer % 1500 === 0) phase = CONFIG.phases.GATHER;
  if (timer % 1500 === 500) phase = CONFIG.phases.EXPLODE;
  if (timer % 1500 === 1000) phase = CONFIG.phases.FLOAT;

  requestAnimationFrame(animate);
}

// RESIZE
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width / 2;
  center.y = height / 2;
});

// START
animate();
