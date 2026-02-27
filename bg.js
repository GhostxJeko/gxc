const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const CONFIG = {
  particleCount: 220,
  starCount: 8,
  colors: [
    'hsla(210, 100%, 70%,', // Blau
    'hsla(280, 100%, 75%,'  // Lila
  ],
  phases: { FLOAT: 'float', GATHER: 'gather', EXPLODE: 'explode' },
};

const random = (min, max) => Math.random() * (max - min) + min;
const createColor = () =>
  CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];

class Particle {
  constructor() { this.reset(); }

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
      const swirl = 0.08;
      const speed = random(2, 4);

      this.x += Math.cos(angle + swirl) * speed;
      this.y += Math.sin(angle + swirl) * speed;
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
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color + '0.7)';
    ctx.fill();
  }
}

const particles = Array.from(
  { length: CONFIG.particleCount },
  () => new Particle()
);

let phase = CONFIG.phases.FLOAT;
let timer = 0;

function drawBackground() {
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    center.x, center.y, 0,
    center.x, center.y, width / 1.4
  );
  gradient.addColorStop(0, 'rgba(120,0,200,0.15)');
  gradient.addColorStop(1, 'transparent');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawStars() {
  for (let i = 0; i < CONFIG.starCount; i++) {
    ctx.beginPath();
    const sx = random(0, width);
    const sy = random(0, height);
    const sr = random(0.3, 1.2);
    const sa = random(0.2, 0.6);
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
    ctx.fill();
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(150,150,255,${1 - dist / 120})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  drawBackground();
  drawStars();

  for (let p of particles) {
    p.update(phase);
    p.draw();
  }

  drawConnections();

  timer++;

  if (timer % 1500 === 0) phase = CONFIG.phases.GATHER;
  if (timer % 1500 === 500) phase = CONFIG.phases.EXPLODE;
  if (timer % 1500 === 1000) phase = CONFIG.phases.FLOAT;

  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width / 2;
  center.y = height / 2;
});

window.addEventListener('mousemove', (e) => {
  center.x += (e.clientX - center.x) * 0.05;
  center.y += (e.clientY - center.y) * 0.05;
});

animate();
