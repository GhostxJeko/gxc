// bg.js – Professionelle Universum-Tunnelanimation mit Glow & Explosion

const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Mittelpunkt
const center = { x: width / 2, y: height / 2 };

// Partikel-Array
const particles = [];
const particleCount = 120; // Weniger = realistisch

// Zufallsfunktion
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Partikel erzeugen
function createParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
        const hue = random(45, 55); // warme Lichtfarbe
        particles.push({
            x: random(0, width),
            y: random(0, height),
            vx: random(-0.2, 0.2),
            vy: random(-0.2, 0.2),
            radius: random(1.5, 3),
            alpha: random(0.5, 1),
            decay: random(0.001, 0.003),
            color: `hsla(${hue},100%,70%,`
        });
    }
}

// Animation-Phasen
let phase = 'float'; // float -> gather -> explode
let timer = 0;

// Hintergrund zeichnen
function drawBackground() {
    // Universumsschwarz, leicht transparent für Glow-Trails
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, 0, width, height);

    // sanfte Sterne im Hintergrund
    for (let i = 0; i < 5; i++) {
        const sx = random(0, width);
        const sy = random(0, height);
        const sr = random(0.2, 1.2);
        const sa = random(0.2, 0.6);
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${sa})`;
        ctx.fill();
    }
}

// Partikel zeichnen & bewegen
function drawParticles() {
    drawBackground();

    for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.shadowBlur = 20 + 15 * p.alpha;
        ctx.shadowColor = 'hsla(45,100%,80%,' + p.alpha + ')';
        ctx.fill();

        // Bewegung basierend auf Phase
        if (phase === 'float') {
            // sanftes Herumfliegen
            p.vx += random(-0.01, 0.01);
            p.vy += random(-0.01, 0.01);
            p.x += p.vx;
            p.y += p.vy;
        } else if (phase === 'gather') {
            // ziehen zum Zentrum (Tunnel-Effekt)
            const dx = center.x - p.x;
            const dy = center.y - p.y;
            p.x += dx * 0.03;
            p.y += dy * 0.03;
            p.alpha = Math.min(p.alpha + 0.02, 1);
        } else if (phase === 'explode') {
            // Explosion nach außen
            const dx = p.x - center.x;
            const dy = p.y - center.y;
            p.x += dx * 0.08 + random(-0.5, 0.5);
            p.y += dy * 0.08 + random(-0.5, 0.5);
            p.alpha -= p.decay * 2;

            if (p.alpha <= 0) {
                // Reset Partikel außerhalb der Mitte für Tunnel-Effekt
                const angle = random(0, Math.PI * 2);
                const radius = random(width / 3, width / 2);
                p.x = center.x + Math.cos(angle) * radius;
                p.y = center.y + Math.sin(angle) * radius;
                p.alpha = random(0.5, 1);
                p.radius = random(1.5, 3);
            }
        }

        // Begrenzung für float
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

    // Phasensteuerung – langsam & fließend
    if (timer % 1200 === 0) phase = 'gather';
    if (timer % 1200 === 400) phase = 'explode';
    if (timer % 1200 === 800) phase = 'float';
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
