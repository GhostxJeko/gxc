const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const CONFIG = {
  particleCount: 210,
  starCount: 5,
  layers: 3,
  phases: { FLOAT: 'float', GATHER: 'gather', EXPLODE: 'explode' },
  mouseInfluence: 0.01
};

const random = (min, max) => Math.random() * (max - min) + min;

// Nur 2 Farben: Blau oder Weiß
function getColor() {
  return Math.random() > 0.5
    ? 'rgba(0,170,255,'   // Neon Blau
    : 'rgba(255,255,255,'; // Weiß
}

class Particle {
  constructor(layer) {
    this.layer = layer;
    this.reset();
  }

  reset() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.vx = random(-0.25, 0.25) / this.layer;
    this.vy = random(-0.25, 0.25) / this.layer;
    this.radius = random(1.2, 2.8) * this.layer * 0.7;
    this.alpha = random(0.6, 1);
    this.decay = random(0.001, 0.002);
    this.color = getColor();
  }

  update(phase, mouse) {

    // Subtile Mausreaktion
    if (mouse) {
      this.vx += (mouse.x - this.x) * CONFIG.mouseInfluence / this.layer;
      this.vy += (mouse.y - this.y) * CONFIG.mouseInfluence / this.layer;
    }

    if (phase === CONFIG.phases.FLOAT) {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    else if (phase === CONFIG.phases.GATHER) {
      this.x += (center.x - this.x) * 0.03;
      this.y += (center.y - this.y) * 0.03;
    }

    else if (phase === CONFIG.phases.EXPLODE) {
      const angle = Math.atan2(this.y - center.y, this.x - center.x);
      const swirl = 0.04;
      const speed = random(1.2, 2.5);

      this.x += Math.cos(angle + swirl) * speed;
      this.y += Math.sin(angle + swirl) * speed;

      this.alpha -= this.decay;

      if (this.alpha <= 0) {
        this.reset();
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.shadowBlur = 18;
    ctx.shadowColor = this.color + '1)';
    ctx.fill();
  }
}

// 3D Layer Aufbau
const particles = [];
for (let l = 1; l <= CONFIG.layers; l++) {
  for (let i = 0; i < CONFIG.particleCount / CONFIG.layers; i++) {
    particles.push(new Particle(l));
  }
}

let phase = CONFIG.phases.FLOAT;
let timer = 0;

const mouse = { x: null, y: null };
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function drawBackground() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
}

function drawStars() {
  for (let i = 0; i < CONFIG.starCount; i++) {
    ctx.beginPath();
    const sx = random(0, width);
    const sy = random(0, height);
    const sr = random(0.3, 1);
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fill();
  }
}

function animate() {
  drawBackground();
  drawStars();

  for (let p of particles) {
    p.update(phase, mouse.x ? mouse : null);
    p.draw();
  }

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

animate();
