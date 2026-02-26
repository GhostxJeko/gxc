// bg.js – Galaktischer Partikel-Wirbel Universum
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let center = { x: width/2, y: height/2 };

const particles = [];
const MAX_PARTICLES = 180; // insgesamt
const START_PARTICLES = 40; // am Anfang

function rand(min, max){ return Math.random()*(max-min)+min; }

// Partikel erzeugen
function createParticles() {
    particles.length = 0;
    for(let i=0; i<MAX_PARTICLES; i++){
        const hueOptions = [210, 220, 230, 240];
        const hue = hueOptions[Math.floor(rand(0, hueOptions.length))];
        particles.push({
            x: rand(0, width),
            y: rand(0, height),
            vx: rand(-0.1, 0.1),
            vy: rand(-0.1, 0.1),
            radius: rand(1.2, 2.5),
            alpha: i < START_PARTICLES ? rand(0.6,1) : 0,
            active: i < START_PARTICLES,
            hue: hue
        });
    }
}

let phase = "float"; // float -> gather -> swirl
let timer = 0;

// Resize Event
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    center.x = width/2;
    center.y = height/2;
});

// Hintergrund zeichnen
function drawBackground(){
    ctx.fillStyle = "rgba(0,0,0,0.15)"; // leichter Trail
    ctx.fillRect(0,0,width,height);
}

// Zeichnen & Bewegen
function drawParticles(){
    drawBackground();

    // Lichtkugel Puls
    const pulse = Math.sin(Date.now()*0.002)*5;

    particles.forEach(p=>{
        if(!p.active) return;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + pulse*0.05, 0, Math.PI*2);
        ctx.fillStyle = `hsla(${p.hue},90%,75%,${p.alpha})`;
        ctx.shadowBlur = 20 + 10*p.alpha;
        ctx.shadowColor = `hsla(${p.hue},90%,75%,${p.alpha})`;
        ctx.fill();

        // Bewegung
        if(phase==="float"){
            p.vx += rand(-0.002,0.002);
            p.vy += rand(-0.002,0.002);
            p.x += p.vx;
            p.y += p.vy;
            if(p.x<0 || p.x>width) p.vx*=-1;
            if(p.y<0 || p.y>height) p.vy*=-1;
        } else if(phase==="gather"){
            const dx = center.x - p.x;
            const dy = center.y - p.y;
            p.x += dx*0.015;
            p.y += dy*0.015;
            p.alpha = Math.min(p.alpha+0.01,1);
        } else if(phase==="swirl"){
            const dx = p.x - center.x;
            const dy = p.y - center.y;
            const angle = Math.atan2(dy, dx);
            const swirlStrength = 0.12;
            const speed = rand(0.5,1.2);
            p.x += Math.cos(angle+swirlStrength)*speed + rand(-0.1,0.1);
            p.y += Math.sin(angle+swirlStrength)*speed + rand(-0.1,0.1);
            p.alpha -= 0.0015;

            // Farbe bei Explosion
            if(p.alpha<=0){
                p.x = center.x;
                p.y = center.y;
                p.alpha = rand(0.5,1);
                p.radius = rand(1.2,2.5);
                const hues = [0,45,210,240,60];
                const hue = hues[Math.floor(rand(0,hues.length))];
                p.hue = hue;
            }
        }
    });
}

// Aktivierung zusätzlicher Partikel im Strudel
function activateParticles(){
    particles.forEach(p=>{
        if(!p.active){
            p.active = true;
            p.x = center.x + rand(-50,50);
            p.y = center.y + rand(-50,50);
            p.alpha = rand(0.6,1);
        }
    });
}

// Animation Loop
function animate(){
    drawParticles();
    requestAnimationFrame(animate);
    timer++;

    if(timer===300) phase="gather";
    if(timer===700){
        activateParticles();
        phase="swirl";
    }
    if(timer===1600){
        phase="float";
        timer=0;
    }
}

// Start
createParticles();
animate();
