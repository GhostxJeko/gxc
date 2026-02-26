// bg.js – Partikel über Live-Bitcoin mit Bitcoin-Logo Effekt
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const particles = [];
const particleCount = 150;

// Position über der Live-Bitcoin-Zahl
const btcBox = document.getElementById('btc-box');
let btcX = width / 2;
let btcY = height / 3;

const btcLogo = [
  {x:0,y:-2},{x:1,y:-2},{x:-1,y:-2},{x:0,y:-1},{x:1,y:-1},{x:-1,y:-1},
  {x:0,y:0},{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:1,y:1},{x:-1,y:1},
  {x:0,y:2},{x:1,y:2},{x:-1,y:2}
];

function random(min,max){return Math.random()*(max-min)+min;}

// Partikel erstellen
function createParticles() {
  for(let i=0;i<particleCount;i++){
    particles.push({
      x: btcX + random(-200,200),
      y: btcY + random(-100,100),
      vx: random(-0.5,0.5),
      vy: random(-0.5,0.5),
      radius: random(1,3),
      color: `rgba(255,${Math.floor(random(127,255))},0,${random(0.5,1)})`,
      target: null
    });
  }
}

// Zeichne Partikel
function drawParticles() {
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(0,0,width,height);

  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle = p.color;
    ctx.fill();

    if(p.target){
      // Bewege Partikel zum Ziel
      p.x += (p.target.x - p.x)*0.05;
      p.y += (p.target.y - p.y)*0.05;
    } else {
      p.x += p.vx;
      p.y += p.vy;
    }

    // Grenzen
    if(p.x<0||p.x>width)p.vx*=-1;
    if(p.y<0||p.y>height)p.vy*=-1;
  }
}

// Bitcoin-Logo formen
function formBitcoin() {
  btcX = btcBox.offsetLeft + btcBox.offsetWidth/2;
  btcY = btcBox.offsetTop + btcBox.offsetHeight/2;

  for(let i=0;i<btcLogo.length;i++){
    if(particles[i]){
      particles[i].target = {
        x: btcX + btcLogo[i].x*20,
        y: btcY + btcLogo[i].y*20
      };
    }
  }
}

// Zurück zu normalem Flug
function resetParticles() {
  for(let p of particles){
    p.target = null;
  }
}

// Animation
function animate() {
  drawParticles();
  requestAnimationFrame(animate);
}

// Resize
window.addEventListener('resize',()=>{
  width=canvas.width=window.innerWidth;
  height=canvas.height=window.innerHeight;
});

// Partikel initialisieren und Animation starten
createParticles();
animate();

// Alle 8 Sekunden Bitcoin-Logo für 4 Sekunden
setInterval(()=>{
  formBitcoin();
  setTimeout(resetParticles,4000);
},8000);

// Glow-Puls für Live-Bitcoin
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
