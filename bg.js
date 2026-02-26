
// bg.js – Kosmisches Universum: Lichtkugel, Strudel & Partikel
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width/2, y: height/2 };

const particles = [];
const PARTICLE_COUNT = 250; // genug für dichten Kosmos

function random(min, max) { return Math.random()*(max-min)+min; }

// Partikel erzeugen – starten überall
function createParticles() {
    particles.length = 0;
    for(let i=0;i<PARTICLE_COUNT;i++){
        const hues = [210,220,230,240]; // Weiß-Blau
        const hue = hues[Math.floor(random(0,hues.length))];
        const light = random(80,100);
        particles.push({
            x: random(0,width),
            y: random(0,height),
            vx: random(-0.3,0.3),
            vy: random(-0.3,0.3),
            radius: random(1.5,3),
            alpha: random(0.4,1),
            decay: random(0.001,0.003),
            color: `hsla(${hue},80%,${light}%,`
        });
    }
}

let phase = 'float'; // float -> gather -> explode -> float
let timer = 0;

// Hintergrund
function drawBackground(){
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,width,height);
}

// Partikel zeichnen
function drawParticles(){
    drawBackground();

    for(let p of particles){
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
        ctx.fillStyle = p.color+p.alpha+')';
        ctx.shadowBlur = 15 + 15*p.alpha;
        ctx.shadowColor = 'rgba(255,255,255,'+p.alpha+')';
        ctx.fill();

        // FLOAT: frei schweben
        if(phase==='float'){
            p.vx += random(-0.01,0.01);
            p.vy += random(-0.01,0.01);
            p.x += p.vx;
            p.y += p.vy;
            if(p.x<0||p.x>width)p.vx*=-1;
            if(p.y<0||p.y>height)p.vy*=-1;
        }

        // GATHER: Partikel ziehen zur Lichtkugel
        else if(phase==='gather'){
            p.x += (center.x-p.x)*0.04;
            p.y += (center.y-p.y)*0.04;
            p.alpha = Math.min(p.alpha+0.01,1);
        }

        // EXPLODE: Strudelartige Explosion
        else if(phase==='explode'){
            const dx = p.x - center.x;
            const dy = p.y - center.y;
            const angle = Math.atan2(dy,dx);
            const swirl = 0.25; // Strudelstärke
            const speed = random(1.5,3);
            p.x += Math.cos(angle+swirl)*speed + random(-0.3,0.3);
            p.y += Math.sin(angle+swirl)*speed + random(-0.3,0.3);
            p.alpha -= p.decay*1.5;

            if(p.alpha<=0){
                // Reset an zufälliger Position für kontinuierliche Bewegung
                p.x = random(0,width);
                p.y = random(0,height);
                p.alpha = random(0.4,1);
                p.radius = random(1.5,3);
            }
        }
    }
}

// Animation Loop
function animate(){
    drawParticles();
    requestAnimationFrame(animate);
    timer++;

    // Phasensteuerung – lange und smooth
    if(timer%2500===0) phase='gather';
    if(timer%2500===1200) phase='explode';
    if(timer%2500===2000) phase='float';
}

// Fenstergröße anpassen
window.addEventListener('resize',()=>{
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    center.x = width/2;
    center.y = height/2;
});

// Start
createParticles();
animate();  
