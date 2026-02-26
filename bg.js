// bg.js – Glühende Partikel über Live-Bitcoin
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const particles = [];
const particleCount = 200; // mehr Partikel für coolen Effekt

// Position über der Live-Bitcoin-Zahl
const btcBox = document.getElementById('btc-box');
let btcX = width / 2;
let btcY = height / 3;

function random(min, max){ return Math.random()*(max-min)+min; }

// Partikel erzeugen
function createParticles() {
  for(let i=0; i<particleCount; i++){
    particles.push({
      x: btcX + random(-200,200),
      y: btcY + random(-50,50),
      vx: random(-0.7,0.7),
      vy: random(-0.7,0.7),
      radius: random(1,3),
      alpha: random(0.3,1),
      decay: random(0.005,0.02),
      color: `rgba(255,${Math.floor(random(127,255))},0,`,
    });
  }
}

// Partikel zeichnen
function drawParticles() {
  // semi-transparentes Schwarz für "Verblassen" der Trails
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0,0,width,height);

  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff7f00';
    ctx.fill();

    // Bewegung
    p.x += p.vx;
    p.y += p.vy;

    // Alpha verringern (Verglühen)
    p.alpha -= p.decay;
    if(p.alpha <= 0){
      // Reset über Live-Bitcoin-Box
      p.x = btcX + random(-200,200);
      p.y = btcY + random(-50,50);
      p.vx = random(-0.7,0.7);
      p.vy = random(-0.7,0.7);
      p.radius = random(1,3);
      p.alpha = random(0.5,1);
      p.decay = random(0.005,0.02);
    }
  }
}

// Update BTC-Box-Position
function updateBTCPos(){
  if(btcBox){
    btcX = btcBox.offsetLeft + btcBox.offsetWidth/2;
    btcY = btcBox.offsetTop + btcBox.offsetHeight/2;
  }
}

// Animation
function animate() {
  updateBTCPos();
  drawParticles();
  requestAnimationFrame(animate);
}

// Resize
window.addEventListener('resize', ()=>{
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Partikel initialisieren
createParticles();
animate();

// Optional: Glow-Puls auf Live-Bitcoin
const btcPriceEl = document.getElementById('btc-price');
if(btcPriceEl){
  let pulse = 0;
  setInterval(()=>{
    pulse += 0.05;
    btcPriceEl.style.textShadow = `
      0 0 ${10+10*Math.abs(Math.sin(pulse))}px #ff7f00,
      0 0 ${20+10*Math.abs(Math.sin(pulse))}px #ffa64d
    `;
  },30);
}
