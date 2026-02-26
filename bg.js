
// bg.js – Realistische Partikel im Universum, zusammenziehend & explodierend
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Mittelpunkt
const center = { x: width / 2, y: height / 2 };

// Partikel
const particles = [];
const particleCount = 120; // realistisch, nicht überladen

function random(min,max){return Math.random()*(max-min)+min;}

// Partikel erzeugen
function createParticles(){
  particles.length = 0;
  for(let i=0;i<particleCount;i++){
    const hue = random(45,55); // warme Lichtfarbe
    particles.push({
      x: random(0,width),
      y: random(0,height),
      vx: random(-0.05,0.05),
      vy: random(-0.05,0.05),
      radius: random(1.5,3),
      alpha: random(0.6,1),
      decay: random(0.0005,0.0015),
      color: `hsla(${hue},100%,85%,`
    });
  }
}

// Hintergrund schwarz + Sterne
function drawBackground(){
  ctx.fillStyle = '#000'; // **absolut schwarz**
  ctx.fillRect(0,0,width,height);

  // vereinzelte Sterne
  for(let i=0;i<5;i++){
    const sx=random(0,width);
    const sy=random(0,height);
    const sr=random(0.3,1);
    const sa=random(0.2,0.5);
    ctx.beginPath();
    ctx.arc(sx,sy,sr,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${sa})`;
    ctx.fill();
  }
}

// Partikel zeichnen & bewegen
let phase = 'float';
let timer = 0;
