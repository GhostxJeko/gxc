// bg.js – Klar erkennbares Bitcoin-Logo aus Partikeln über Live-Bitcoin
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const particles = [];
const particleCount = 500; // viele Partikel für klares Logo

// Position über der Live-Bitcoin-Zahl
const btcBox = document.getElementById('btc-box');
function updateBTCPos() {
  const rect = btcBox.getBoundingClientRect();
  return {
    x: rect.left + rect.width/2,
    y: rect.top + rect.height/2
  };
}

// Bitcoin-Logo als Pixel-Matrix (kleine B-Form)
const logoPattern = [
  "001111100",
  "011111110",
  "111001111",
  "111111111",
  "111111111",
  "111001111",
  "011111110",
  "001111100"
];

// Skaliere Logo
const logoScale = 10; 

// Partikel erzeugen
for(let i=0;i<particleCount;i++){
  const pos = updateBTCPos();
  particles.push({
    x: pos.x + Math.random()*400-200,
    y: pos.y + Math.random()*200-100,
    vx: Math.random()*1-0.5,
    vy: Math.random()*1-0.5,
    radius: Math.random()*2+1,
    color: `rgba(255,${Math.floor(Math.random()*128+127)},0,${Math.random()*0.5+0.5})`,
    target: null
  });
}

// Partikel zeichnen
function drawParticles(){
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(0,0,width,height);

  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle = p.color;
    ctx.fill();

    if(p.target){
      p.x += (p.target.x - p.x)*0.07;
      p.y += (p.target.y - p.y)*0.07;
    } else {
      p.x += p.vx;
      p.y += p.vy;
    }

    if(p.x<0||p.x>width)p.vx*=-1;
    if(p.y<0||p.y>height)p.vy*=-1;
  }
}

// Bitcoin-Logo formen
function formBitcoin(){
  const pos = updateBTCPos();
  const flatLogo = [];
  for(let row=0;row<logoPattern.length;row++){
    for(let col=0;col<logoPattern[row].length;col++){
      if(logoPattern[row][col]==="1"){
        flatLogo.push({
          x: pos.x + (col-logoPattern[row].length/2)*logoScale,
          y: pos.y + (row-logoPattern.length/2)*logoScale
        });
      }
    }
  }
  for(let i=0;i<particles.length;i++){
    particles[i].target = flatLogo[i%flatLogo.length];
  }
}

// Zurück zu zufälliger Bewegung
function resetParticles(){
  for(let p of particles){
    p.target = null;
  }
}

// Animation
function animate(){
  drawParticles();
  requestAnimationFrame(animate);
}
animate();

// Resize
window.addEventListener('resize',()=>{
  width=canvas.width=window.innerWidth;
  height=canvas.height=window.innerHeight;
});

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
