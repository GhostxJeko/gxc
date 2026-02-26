// bg.js – Professionelle Universum-Partikelanimation: Schweben, Sammeln, Explodieren
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Zentrum
const center = { x: width/2, y: height/2 };

// Partikel-Array
const particles = [];
const particleCount = 180; // realistisch, nicht überladen

// Zufallsfunktion
function random(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
    particles.length = 0;
    for(let i=0;i<particleCount;i++){
        particles.push({
            x: random(0,width),
            y: random(0,height),
            vx: random(-0.3,0.3),
            vy: random(-0.3,0.3),
            radius: random(1.5,3),
            alpha: random(0.4,0.9),
            decay: random(0.001,0.004),
            color: `rgba(${Math.floor(random(200,255))},${Math.floor(random(180,230))},100,`
        });
    }
}

// Hintergrund mit Sternen und Nebel
function drawBackground(){
    // dunkler, universum-artiger Hintergrund
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,width,height);

    // subtile Lichtnebel
    for(let i=0;i<3;i++){
        const lx = random(0,width);
        const ly = random(0,height);
        const lr = random(80,180);
        const grad = ctx.createRadialGradient(lx,ly,0,lx,ly,lr);
        grad.addColorStop(0, `rgba(255,200,100,0.02)`);
        grad.addColorStop(1, `rgba(0,0,0,0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(lx,ly,lr,0,Math.PI*2);
        ctx.fill();
    }

    // kleine Sterne
    for(let i=0;i<4;i++){
        const sx=random(0,width), sy=random(0,height), sr=random(0.3,1.2), sa=random(0.2,0.6);
        ctx.beginPath();
        ctx.arc(sx,sy,sr,0,Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${sa})`;
        ctx.fill();
    }
}

// Partikel zeichnen & bewegen
function drawParticles(){
    for(let p of particles){
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.shadowBlur = 15 + 10*p.alpha;
        ctx.shadowColor = '#ffcc66';
        ctx.fill();

        // Bewegung nach Phase
        if(phase==='float'){
            // sanftes Schweben
            p.vx += random(-0.015,0.015);
            p.vy += random(-0.015,0.015);
            p.x += p.vx;
            p.y += p.vy;
        } 
        else if(phase==='gather'){
            // ziehen zur Mitte
            p.x += (center.x - p.x) * 0.04;
            p.y += (center.y - p.y) * 0.04;
            p.alpha = Math.min(p.alpha + 0.01,1);
        } 
        else if(phase==='explode'){
            // Explosion nach außen
            const angle = Math.atan2(p.y - center.y, p.x - center.x);
            const speed = random(0.5,1.5);
            p.x += Math.cos(angle) * speed;
            p.y += Math.sin(angle) * speed;
            p.alpha -= p.decay * 1.5;

            // Partikel reset, wenn unsichtbar
            if(p.alpha <= 0){
                const angle = random(0,Math.PI*2);
                const radius = random(width/3, width/2);
                p.x = center.x + Math.cos(angle)*radius;
                p.y = center.y + Math.sin(angle)*radius;
                p.alpha = random(0.5,0.9);
                p.radius = random(1.5,3);
            }
        }

        // Begrenzung Float-Bereich
        if(phase==='float'){
            if(p.x<0 || p.x>width) p.vx*=-1;
            if(p.y<0 || p.y>height) p.vy*=-1;
        }
    }
}

// Animation Phasen
let phase='float';
let timer=0;

// Animation Loop
function animate(){
    drawBackground();
    drawParticles();
    requestAnimationFrame(animate);
    timer++;

    if(timer%1000===0) phase='gather';     // Partikel ziehen sich zusammen
    if(timer%1000===400) phase='explode';  // Partikel explodieren
    if(timer%1000===800) phase='float';    // Schweben
}

// Fenster Resize
window.addEventListener('resize',()=>{
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    center.x = width/2;
    center.y = height/2;
});

// Start
createParticles();
animate():
