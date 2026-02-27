const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const center = { x: width / 2, y: height / 2 };
const mouse = { x: null, y: null };

const CONFIG = {
  particleCount: 210,
  layers: 3,
  starCount: 60,
  mouseInfluence: 0.0008,
  phases: { FLOAT: 'float', GATHER: 'gather', EXPLODE: 'explode' }
};

const random = (min, max) => Math.random() * (max - min) + min;

// Nur 2 Farben
function getColor() {
  return Math.random() > 0.5
    ? 'rgba(0,170,255,'   // Neon Blau
    : 'rgba(255,255,255,'; // Weiß
}

/* ---------- STERNE EINMAL ERZEUGEN ---------- */
const stars = [];
for (let i = 0; i < CONFIG.starCount; i++) {
  stars.push({
    x: random(0, width),
    y: random(0, height),
    r: random(0.2, 1.2),
    alpha: random(0.1, 0.5),
    twinkle: random(0.002, 0.01)
  });
}

/* ---------- PARTICLE CLASS ---------- */
class Particle {
  constructor(layer) {
    this.layer = layer;
    this.reset();
  }

  reset() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.vx = random(-0.3, 0.3) / this.layer;
    this.vy = random(-0.3, 0.3) / this.layer;
    this.radius = random(1, 2.5) * this.layer * 0.7;
    this.alpha = random(0.6, 1);
    this.decay = random(0.001, 0.002);
    this.color = getColor();
    this.explosionSpeed = random(1.5, 3);
  }

  update(phase) {

    // Weiche Maus-Reaktion
    if (mouse.x !== null) {
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
      this.x += (center.x - this.x) * 0.04;
      this.y += (center.y - this.y) * 0.04;
    }

    else if (phase === CONFIG.phases.EXPLODE) {
      const angle = Math.atan2(this.y - center.y, this.x - center.x);
      const swirl = 0.06;

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
    ctx.shadowBlur = 25;
    ctx.shadowColor = this.color + '1)';
    ctx.fill();
  }
}

/* ---------- PARTICLES ERZEUGEN ---------- */
const particles = [];
for (let l = 1; l <= CONFIG.layers; l++) {
  for (let i = 0; i < CONFIG.particleCount / CONFIG.layers; i++) {
    particles.push(new Particle(l));
  }
}

let phase = CONFIG.phases.FLOAT;
let timer = 0;

/* ---------- BACKGROUND ---------- */
function drawBackground() {
  const gradient = ctx.createRadialGradient(
    center.x, center.y, 0,
    center.x, center.y, width / 1.3
  );
  gradient.addColorStop(0, '#02030a');
  gradient.addColorStop(1, '#000000');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/* ---------- STARS ---------- */
function drawStars() {
  for (let s of stars) {
    s.alpha += s.twinkle;
    if (s.alpha <= 0.1 || s.alpha >= 0.6) s.twinkle *= -1;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
  }
}

/* ---------- CONNECTIONS ---------- */
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 110) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,170,255,${1 - dist / 110})`;
        ctx.lineWidth = 0.4;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

/* ---------- ANIMATION LOOP ---------- */
function animate() {
  drawBackground();
  drawStars();

  for (let p of particles) {
    p.update(phase);
    p.draw();
  }

  drawConnections();

  timer++;

  if (timer % 1600 === 0) phase = CONFIG.phases.GATHER;
  if (timer % 1600 === 600) phase = CONFIG.phases.EXPLODE;
  if (timer % 1600 === 1100) phase = CONFIG.phases.FLOAT;

  requestAnimationFrame(animate);
}

/* ---------- EVENTS ---------- */
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
