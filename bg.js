// bg.js – Partikel-Tunnel mit Mehrfarben, Glow & Explosion
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const particles = [];
const particleCount = 200;

function random(min, max) { return Math.random() * (max - min) + min; }

function createParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    // verschiedene Farbtöne: Gelb, Orange, Pink, Blau, Lila
    const hues = [50, 30, 330, 200, 270]; 
    const hue = hues[Math.floor(random(0, hues.length))];
    const sat = random(80, 100);
    const light = random(60, 90);
    particles.push({
      x: random(0, width),
      y: random(0, height),
      vx: random(-0.2, 0.2),
      vy: random(-0.2, 0.2),
      radius: random(1.5, 3),
      alpha: random(0.5, 1),
      decay: random(0.001, 0.003),
      color: `hsla(${hue},${sat}%,${light}%,`
    });
  }
}

let phase = 'float';
let timer = 0;

function drawBackground() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
}

function drawParticles() {
  drawBackground();

  // Hintergrund-Sterne
  for (let i = 0; i < 6; i++) {
    const sx = random(0, width);
    const sy = random(0, height);
    const sr = random(0.3, 1.2);
    const sa = random(0.2, 0.5);
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${sa})`;
