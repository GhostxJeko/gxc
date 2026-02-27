// bg.js – High-End Neon Partikel-Tunnel mit 3D, Strudel & Maus-Interaktion
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

// CONFIG
const CONFIG = {
  particleCount: 250,
  layers: 3, // 3D Tiefe
  starCount: 6,
  hues: [210, 230, 250], // Blau-Nuancen
  phases: { FLOAT: 'float', GATHER: 'gather', EXPLODE: 'explode' },
  mouseInfluence: 0.02
};

// UTILS
const random = (min, max) => Math.random() * (max - min) + min;
const randomHue = () => CONFIG.hues[Math.floor(random(0, CONFIG.hues.length))];
const createColor = () => `hsla(${randomHue()},${random(60, 100)}%,${random(70, 100)}%,`;

// PARTICLE CLASS
class Particle {
  constructor(layer = 1) {
    this.layer = layer; // für 3D Tiefe
    this.reset();
  }

  reset() {
    const range = 50 + this.layer * 30;
    this.x = center.x + random(-range, range);
    this.y = center.y + random(-range, range);
    this.vx = random(-0.3, 0.3) / this.layer;
    this.vy = random(-0.3, 0.3) / this.layer;
    this.radius = random(1.2, 2.5) * this.layer * 0.8;
    this.alpha = random(0.5, 1);
    this.decay = random(0.001, 0.003);
    this.color = createColor();
  }

  update(phase, mouse) {
    // Maus-Interaktion
    if(mouse) {
      this.vx += (mouse.x - this.x) * CONFIG.mouseInfluence / this.layer;
      this.vy += (mouse.y - this.y) * CONFIG.mouseInfluence / this.layer;
    }

    if (phase === CONFIG.phases.FLOAT) {
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
      const speed = random(1.5, 3) * this.layer * 0.8;
      this.x += Math.cos(angle + swirl) * speed + random(-0.2, 0.2);
      this.y += Math.sin(angle + swirl) * speed + random(-0.2, 0.2);
      this.alpha -= this.decay * 1.5;

      if (this.alpha <= 0) this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.shadowBlur = 12 + 10 * this.alpha;
    ctx.shadowColor = `rgba(255,255,255,${this.alpha})`;
    ctx.fill();
  }
}

// INIT PARTICLES
const particles = [];
for(let l = 1; l <= CONFIG.layers; l++){
  for(let i = 0; i < CONFIG.particleCount / CONFIG.layers; i++){
    particles.push(new Particle(l));
  }
}

let phase = CONFIG.phases.FLOAT;
let timer = 0;

// MAUSPOSITION
const mouse = { x: null, y: null };
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

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
  // Hintergrund
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  drawStars();

  // Partikel zeichnen
  for (let p of particles) {
    p.update(phase, mouse.x && mouse.y ? mouse : null);
    p.draw();
  }

  // Phasen wechseln
  timer++;
  if (timer % 1500 === 0) phase = CONFIG.phases.GATHER;
  if (timer % 1500 === 500) phase = CONFIG.phases.EXPLODE;
  if (timer % 1500 === 1000) phase = CONFIG.phases.FLOAT;

  requestAnimationFrame(animate);
}

// RESIZE HANDLING
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width / 2;
  center.y = height / 2;
});

// START ANIMATION
animate();
