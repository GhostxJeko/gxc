// bg.js – Partikel-Tunnel im Universum mit Explosion
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Zentrum
const center = { x: width / 2, y: height / 2 };

// Partikel
const particles = [];
const particleCount = 200; // weniger = realistisch, professionell

function random(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) {
    const hue = random(45, 55); // warme Lichtfarbe
    particles.push({
      x: random(0, width),
      y: random(0, height),
      vx: random(-0.2, 0.2),
      vy: random(-0.2, 0.2),
      radius: random(1.5, 3),
      alpha: random(0.5, 1),
      decay: random(0.001, 0.003),
      color: `hsla(${hue},100%,70%,`
    });
  }
}

// Animation-Phasen
let phase = 'float'; // float -> gather -> explode
let timer = 0;

// Hintergrund zeichnen
function drawBackground() {
  ctx.fillStyle = '#000'; // komplett schwarz
  ctx.fillRect(0, 0, width, height);
}

// Partikel zeichnen & bewegen
function drawParticles() {
  drawBackground();

  // Sterne für
