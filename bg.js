  
const canvas = document.getElementById("bgCanvas");  
const ctx = canvas.getContext("2d");  
  
let width, height;  
  
function resizeCanvas() {  
  width = canvas.width = window.innerWidth;  
  height = canvas.height = window.innerHeight;  
}  
  
resizeCanvas();  
window.addEventListener("resize", resizeCanvas);  
  
const particles = [];  
const particleCount = 220;  
  
const center = {  
  x: () => width / 2,  
  y: () => height / 2  
};  
  
function random(min, max) {  
  return Math.random() * (max - min) + min;  
}  
  
function createParticles() {  
  particles.length = 0;  
  for (let i = 0; i < particleCount; i++) {  
    particles.push({  
      x: random(0, width),  
      y: random(0, height),  
      vx: random(-0.15, 0.15),  
      vy: random(-0.15, 0.15),  
      radius: random(1, 2.5),  
      alpha: random(0.3, 0.9),  
      decay: random(0.0008, 0.002)  
    });  
  }  
}  
  
createParticles();  
  
let phase = "float";  
let phaseTimer = 0;  
  
function drawBackground() {  
  ctx.fillStyle = "#000";  
  ctx.fillRect(0, 0, width, height);  
}  
  
function drawParticles() {  
  for (let p of particles) {  
  
    ctx.beginPath();  
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);  
  
    ctx.fillStyle = `rgba(255,140,0,${p.alpha})`;  
    ctx.shadowBlur = 20;  
    ctx.shadowColor = "rgba(255,120,0,0.8)";  
    ctx.fill();  
  
    if (phase === "float") {  
      p.x += p.vx;  
      p.y += p.vy;  
  
      if (p.x <= 0 || p.x >= width) p.vx *= -1;  
      if (p.y <= 0 || p.y >= height) p.vy *= -1;  
  
    } else if (phase === "gather") {  
  
      p.x += (center.x() - p.x) * 0.01;  
      p.y += (center.y() - p.y) * 0.01;  
  
    } else if (phase === "explode") {  
  
      p.x += p.vx * 1.5;  
      p.y += p.vy * 1.5;  
      p.alpha -= p.decay;  
  
      if (p.alpha <= 0.1) {  
        p.x = center.x();  
        p.y = center.y();  
        p.alpha = random(0.5, 0.9);  
      }  
    }  
  }  
}  
  
function animate() {  
  drawBackground();  
  drawParticles();  
  
  phaseTimer++;  
  
  if (phaseTimer === 600) phase = "gather";  
  if (phaseTimer === 900) phase = "explode";  
  if (phaseTimer === 1300) {  
    phase = "float";  
    phaseTimer = 0;  
  }  
  
  requestAnimationFrame(animate);  
}  
  
animate();
