// bg.js – Ultra-realistische Partikel im Universum, zusammenziehend & explodierend
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Zentrum für gather/explode
const center = { x: width/2, y: height/2 };

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
  ctx.fillStyle = '#000'; // absolut schwarz
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

function drawParticles(){
  for(let p of particles){
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle = p.color + p.alpha + ')';
    ctx.shadowBlur = 10 + 15*p.alpha;
    ctx.shadowColor = 'hsla(55,100%,90%,'+p.alpha+')';
    ctx.fill();

    if(phase==='float'){
      // sanftes schweben
      p.vx += random(-0.01,0.01);
      p.vy += random(-0.01,0.01);
      p.x += p.vx;
      p.y += p.vy;

      // begrenzung
      if(p.x<0||p.x>width)p.vx*=-1;
      if(p.y<0||p.y>height)p.vy*=-1;

    } else if(phase==='gather'){
      // zusammenziehen
      p.x += (center.x - p.x) * 0.03;
      p.y += (center.y - p.y) * 0.03;
      p.alpha = Math.min(p.alpha + 0.015,1);

    } else if(phase==='explode'){
      // Explosion nach außen
      const angle = Math.atan2(p.y-center.y, p.x-center.x);
      const speed = random(1.5,3);
      p.x += Math.cos(angle)*speed + random(-0.2,0.2);
      p.y += Math.sin(angle)*speed + random(-0.2,0.2);
      p.alpha -= p.decay*2;

      if(p.alpha<=0){
        // Respawn rund um Zentrum für realistischen Effekt
        const a=random(0,Math.PI*2);
        const r=random(width/2, width/1.2);
        p.x = center.x + Math.cos(a)*r;
        p.y = center.y + Math.sin(a)*r;
        p.alpha = random(0.6,1);
        p.radius = random(1.5,3);
      }
    }
  }
}

// Animation
function animate(){
  drawBackground();
  drawParticles();
  requestAnimationFrame(animate);

  timer++;
  // Phasensteuerung – lang und smooth
  if(timer%1400===0) phase='gather';
  if(timer%1400===600) phase='explode';
  if(timer%1400===1000) phase='float';
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
