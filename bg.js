// bg.js – Professionelle Universum-Animation mit Glow & Explosion

const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Mittelpunkt
const center = { x: width / 2, y: height / 2 };

// Partikel-Array
const particles = [];
const particleCount = 250; // realistisch, nicht überladen

// Zufallsfunktion
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Partikel erzeugen
function createParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: random(0, width),
            y: random(0, height),
            vx: 0,
            vy: 0,
            radius: random(1.5, 3),
            alpha: random(0.5, 1),
            decay: random(0.001, 0.005),
            color: `rgba(255,${Math.floor(random(140, 255))},0,`
        });
    }
}

// Animation-Phasen
let phase = 'float'; // float -> gather -> explode
let timer = 0;

// Hintergrund zeichnen
function drawBackground() {
    ctx.fillStyle = '#000'; // Universumsschwarz
    ctx.fillRect(0, 0, width, height);
}

// Partikel zeichnen & bewegen
function drawParticles() {
    drawBackground();

    // Kleine Sterne für Tiefe
    for (let i = 0; i < 3; i++) {
        const sx = random(0, width);
        const sy = random(0, height);
        const sr = random(0.3, 1.2);
        const sa = random(0.2, 0.6);

        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${sa})`;
        ctx.fill();
    }

    // Partikel zeichnen
    for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.shadowBlur = 20 + 15 * p.alpha;
        ctx.shadowColor = '#ff7f00';
        ctx.fill();

        // Bewegung basierend auf Phase
        if (phase === 'float') {
            // sanftes Schweben
            p.vx += random(-0.02, 0.02);
            p.vy += random(-0.02, 0.02);
            p.x += p.vx;
            p.y += p.vy;

        } else if (phase === 'gather') {
            // Zusammenziehen zur Mitte
            p.x += (center.x - p.x) * 0.03;
            p.y += (center.y - p.y) * 0.03;
            p.alpha = Math.min(p.alpha + 0.01, 1);

        } else if (phase === 'explode') {
            // Explosion nach außen
            p.x += (p.x - center.x) * 0.08 + random(-1, 1);
            p.y += (p.y - center.y) * 0.08 + random(-1, 1);
            p.alpha -= p.decay * 1.5;

            if (p.alpha <= 0) {
                // Reset für kontinuierliche Partikel
                const angle = random(0, Math.PI * 2);
                const radius = random(width / 2, width);
                p.x = center.x + Math.cos(angle) * radius;
                p.y = center.y + Math.sin(angle) * radius;
                p.alpha = random(0.5, 1);
                p.radius = random(1.5, 3);
            }
        }

        // Float-Begrenzung
        if (phase === 'float') {
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        }
    }
}

// Animation Loop
function animate() {
    drawParticles();
    requestAnimationFrame(animate);
    timer++;

    // Steuerung der Phasen
    if (timer % 900 === 0) phase = 'gather';    // sammeln
    if (timer % 900 === 300) phase = 'explode'; // explodieren
    if (timer % 900 === 600) phase = 'float';   // schweben
}

// Resize
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    center.x = width / 2;
    center.y = height / 2;
});

// Start
createParticles();
animate();
