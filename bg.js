// bg.js – Ultimative kosmische Partikel-Lichtkugel mit Strudel
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const particles = [];
const PARTICLE_COUNT = 180;
const START_RADIUS = 120; // Anfangs Lichtkugelgröße

function rand(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen
function createParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = rand(0, Math.PI * 2);
        const radius = rand(0, width / 2); // Start überall verteilt
        const hue = 210 + rand(0, 30); // Weiß-Blau
        const light = rand(75, 100);
        particles.push({
            x: center.x + Math.cos(angle) * radius,
            y: center.y + Math.sin(angle) * radius,
            vx: rand(-0.02, 0.02),
            vy: rand(-0.02, 0.02),
            radius: rand(1.5, 3),
            alpha: rand(0.4, 1),
            decay: rand(0.001, 0.003),
            color: `hsla(${hue},90%,${light}%,`,
        });
    }
}

let phase = 'float';
let timer = 0;

// Hintergrund
function drawBackground() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
}

// Partikel zeichnen & bewegen
function drawParticles() {
    drawBackground();

    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.shadowBlur = 15 + 15 * p.alpha;
        ctx.shadowColor = p.color + p.alpha + ')';
        ctx.fill();

        if (phase === 'float') {
            // Sanft schweben
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        } else if (phase === 'gather') {
            // Anziehung zur Lichtkugel
            p.x += (center.x - p.x) * 0.015;
            p.y += (center.y - p.y) * 0.015;
            p.alpha = Math.min(p.alpha + 0.015, 1);
        } else if (phase === 'explode') {
            // Strudelartige Explosion
            const dx = p.x - center.x;
            const dy = p.y - center.y;
            const angle = Math.atan2(dy, dx);
            const swirl = 0.12;
            const speed = rand(0.8, 2);
            p.x += Math.cos(angle + swirl) * speed + rand(-0.1, 0.1);
            p.y += Math.sin(angle + swirl) * speed + rand(-0.1, 0.1);
            p.alpha -= p.decay * 1.5;

            if (p.alpha <= 0) {
                // Partikel neu starten in der Kugel
                const a = rand(0, Math.PI * 2);
                const r = rand(0, START_RADIUS);
                const hue = 210 + rand(0, 30);
                const light = rand(70, 100);
                p.color = `hsla(${hue},90%,${light}%,`;
                p.x = center.x + Math.cos(a) * r;
                p.y = center.y + Math.sin(a) * r;
                p.alpha = rand(0.5, 1);
                p.radius = rand(1.5, 3);
            }
        }
    });
}

// Animation Loop
function animate() {
    drawParticles();
    requestAnimationFrame(animate);
    timer++;

    if (timer === 400) phase = 'gather';
    if (timer === 800) phase = 'explode';
    if (timer === 1600) {
        phase = 'float';
        timer = 0;
    }
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
