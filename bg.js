const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const center = { x: width / 2, y: height / 2 };
const mouse = { x: null, y: null };

const CONFIG = {
  particleCount: 160, // reduziert für Performance
  layers: 3,
  starCount: 35,
  mouseInfluence: 0.0007,
  phases: { FLOAT: 'float', GATHER: 'gather', EXPLODE: 'explode' }
};

const random = (min, max) => Math.random() * (max - min) + min;

/* ===== 2 FARBEN ===== */
function getColor() {
  return Math.random() > 0.5
    ? 'rgba(0,170,255,' 
    : 'rgba(255,255,255,';
}

/* ===== STERNE (EINMAL) ===== */
const stars = [];
for (let i = 0; i < CONFIG.starCount; i++) {
  stars.push({
    x: random(0, width),
    y: random(0, height),
    r: random(0.2, 1),
    alpha: random(0.2, 0.6),
    speed: random(0.002, 0.005)
  });
}

/* ===== PARTICLE ===== */
class Particle {
  constructor(layer) {
    this.layer = layer;
    this.reset();
  }

  reset() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.vx = random(-0.2, 0.2) / this.layer;
    this.vy = random(-0.2, 0.2) / this.layer;
    this.radius = random(1, 2.2) * (1 / this.layer + 0.6);
    this.alpha = random(0.6, 1);
    this.decay = random(0.001, 0.002);
    this.color = getColor();
    this.explosionSpeed = random(1.2, 2);
  }

  update(phase) {

    if (mouse.x !== null) {
      this.vx += (mouse.x - this.x) * CONFIG.mouseInfluence;
      this.vy += (mouse.y - this.y) * CONFIG.mouseInfluence;
    }

    if (phase === CONFIG.phases.FLOAT) {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    else if (phase === CONFIG.phases.GATHER) {
      this.x += (center.x - this.x) * 0.02;
      this.y += (center.y - this.y) * 0.02;
    }

    else if (phase === CONFIG.phases.EXPLODE) {
      const angle = Math.atan2(this.y - center.y, this.x - center.x);
      const swirl = 0.04;

      this.x += Math.cos(angle + swirl) * this.explosionSpeed;
      this.y += Math.sin(angle + swirl) * this.explosionSpeed;

      this.alpha -= this.decay;
      if (this.alpha <= 0) this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.shadowBlur = 18;
    ctx.shadowColor = this.color + '0.9)';
    ctx.fill();
  }
}

/* ===== PARTICLES ===== */
const particles = [];
for (let l = 1; l <= CONFIG.layers; l++) {
  for (let i = 0; i < CONFIG.particleCount / CONFIG.layers; i++) {
    particles.push(new Particle(l));
  }
}

let phase = CONFIG.phases.FLOAT;
let timer = 0;

/* ===== BACKGROUND ===== */
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#000000');
  gradient.addColorStop(1, '#040410');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/* ===== STARS ===== */
function drawStars() {
  for (let s of stars) {
    s.alpha += s.speed;
    if (s.alpha >= 0.6 || s.alpha <= 0.2) s.speed *= -1;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
  }
}

/* ===== LIGHT CONNECTIONS (LIMITIERT) ===== */
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {

    // nur 5 Nachbarn prüfen → Performance Boost
    for (let j = i + 1; j < i + 6 && j < particles.length; j++) {

      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 90) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,170,255,${1 - dist / 90})`;
        ctx.lineWidth = 0.3;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

/* ===== LOOP ===== */
function animate() {

  drawBackground();
  drawStars();

  for (let p of particles) {
    p.update(phase);
    p.draw();
  }

  drawConnections();

  timer++;

  if (timer % 2000 === 0) phase = CONFIG.phases.GATHER;
  if (timer % 2000 === 800) phase = CONFIG.phases.EXPLODE;
  if (timer % 2000 === 1400) phase = CONFIG.phases.FLOAT;

  requestAnimationFrame(animate);
}

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width / 2;
  center.y = height / 2;
});

animate();
