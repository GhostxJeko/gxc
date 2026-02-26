// bg.js – Partikel schweben, sammeln sich, explodieren, perfekter Dunkel-Glow
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const particles = [];
const particleCount = 200;

function random(min,max){return Math.random()*(max-min)+min;}

// Partikel erzeugen
function createParticles(){
  for(let i=0;i<particleCount;i++){
    particles.push({
      x: random(0,width),
      y: random(0,height),
      vx: random(-0.5,0.5),
      vy: random(-0.5,0.5),
      radius: random(1,3),
      alpha: random(0.4,1),
      decay: random(0.002,0.01),
      color: `rgba(255,${Math.floor(random(127,255))},0,`
    });
  }
}

// Animation-Zustände
let phase = 'float'; // float -> gather -> explode
let timer = 0;

// Mittelpunkt
const center = { x: width/2, y: height/2 };

// Zeichne Partikel
function drawParticles(){
  // **Dunkler Hintergrund für Universum-Effekt**
  ctx.fillStyle = '#000'; // komplett schwarz
  ctx.fillRect(0,0,width,height);

  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle = p.color + p.alpha + ')';

    // **Glow verstärkt, für besseres Ausstrahlen**
    ctx.shadowBlur = 20 + 10*p.alpha;
    ctx.shadowColor = '#ff7f00';
    ctx.fill();

    // Phase Float – normale Bewegung
    if(phase==='float'){
      p.x += p.vx;
      p.y += p.vy;
    }
    // Phase Gather – bewegen zum Mittelpunkt
    else if(phase==='gather'){
      p.x += (center.x - p.x)*0.05;
      p.y += (center.y - p.y)*0.05;
    }
    // Phase Explode – zufällige Explosion
    else if(phase==='explode'){
      p.x += p.vx*5;
      p.y += p.vy*5;
      p.alpha -= p.decay*2;
      if(p.alpha<=0){
        p.x = random(0,width);
        p.y = random(0,height);
        p.vx = random(-0.5,0.5);
        p.vy = random(-0.5,0.5);
        p.alpha = random(0.4,1);
      }
    }

    // Grenzen für Float
    if(phase==='float'){
      if(p.x<0||p.x>width)p.vx*=-1;
      if(p.y<0||p.y>height)p.vy*=-1;
    }
  }
}

// Animation Loop
function animate(){
  drawParticles();
  requestAnimationFrame(animate);
  timer++;
  // Steuerung der Phasen
  if(timer%600===0) phase='gather';      // nach 10 Sekunden (bei 60fps) sammeln
  if(timer%600===150) phase='explode';   // 2,5 Sekunden später explodieren
  if(timer%600===300) phase='float';     // danach wieder frei schweben
}

// Resize
window.addEventListener('resize',()=>{
  width=canvas.width=window.innerWidth;
  height=canvas.height=window.innerHeight;
  center.x=width/2;
  center.y=height/2;
});

// Start
createParticles();
animate();
