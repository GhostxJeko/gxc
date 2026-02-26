// bg.js – Universum: Lichtkugel, Strudel & Explosion (weiß/blau, performant)
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width/2, y: height/2 };

const particles = [];
const PARTICLE_COUNT = 250; // genug Partikel für Lichtkugel & Strudel

// Zufall zwischen min und max
function rand(min,max){ return Math.random()*(max-min)+min; }

// Partikel erzeugen: überall verstreut, Lichtfarben Weiß-Blau
function createParticles(){
  particles.length = 0;
  for(let i=0;i<PARTICLE_COUNT;i++){
    const hues = [210,220,230,240];
    const hue = hues[Math.floor(rand(0,hues.length))];
    const sat = rand(60,100);
    const light = rand(70,100);
    particles.push({
      x: rand(0,width),
      y: rand(0,height),
      vx: rand(-0.25,0.25),
      vy: rand(-0.25,0.25),
      radius: rand(1.5,3),
      alpha: rand(0.5,1),
      decay: rand(0.001,0.003),
      hue:hue,
      sat:sat,
      light:light
    });
  }
}

let phase = 'float';
let timer = 0;
let lastTime = performance.now();

// Hintergrund zeichnen – schwarz wie Universum
function drawBackground(){
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,width,height);
}

// Partikel zeichnen & bewegen
function drawParticles(delta){
  drawBackground();

  for(let p of particles){
    // Glow Partikel
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle = `hsla(${p.hue},${p.sat}%,${p.light}%,${p.alpha})`;
    ctx.shadowBlur = 15 + 10*p.alpha;
    ctx.shadowColor = `hsla(${p.hue},${p.sat}%,${p.light}%,${p.alpha})`;
    ctx.fill();

    // Bewegungen je Phase
    if(phase==='float'){
      p.vx += rand(-0.004,0.004)*delta;
      p.vy += rand(-0.004,0.004)*delta;
      p.x += p.vx*delta;
      p.y += p.vy*delta;
      if(p.x<0 || p.x>width) p.vx*=-1;
      if(p.y<0 || p.y>height) p.vy*=-1;
    }
    else if(phase==='gather'){
      // Partikel ziehen sich zur Mitte → Lichtkugel
      p.x += (center.x - p.x)*0.02*delta;
      p.y += (center.y - p.y)*0.02*delta;
      p.alpha = Math.min(p.alpha + 0.005*delta,1);
    }
    else if(phase==='explode'){
      // Strudel & Explosion
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const angle = Math.atan2(dy,dx);
      const swirl = 0.03*delta; // spiralige Rotation
      const speed = 0.8*delta + rand(0,0.5)*delta; // Geschwindigkeit der Explosion
      p.x += Math.cos(angle+swirl)*speed;
      p.y += Math.sin(angle+swirl)*speed;
      p.alpha -= p.decay*delta;

      // Reset Partikel nach Explosion
      if(p.alpha<=0){
        p.x = rand(0,width);
        p.y = rand(0,height);
        p.alpha = rand(0.5,1);
        p.radius = rand(1.5,3);
      }
    }
  }
}

// Animation Loop
function animate(now=performance.now()){
  const delta = (now-lastTime)/16.666; // normalisiert auf ~60FPS
  lastTime = now;

  drawParticles(delta);
  requestAnimationFrame(animate);

  timer += delta;
  if(timer>=400 && phase==='float') phase='gather';
  if(timer>=650 && phase!=='explode') phase='explode';
  if(timer>=1400){ phase='float'; timer=0; }
}

// Fenstergröße ändern → anpassen
window.addEventListener('resize',()=>{
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  center.x = width/2;
  center.y = height/2;
});

// Start
createParticles();
animate();
