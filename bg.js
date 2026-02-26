// bg.js – Kosmisches Universum mit Strudel, Lichtkugel & professionellem Look
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const particles = [];
const START_COUNT = 30;   // Wenige Partikel am Anfang
const MAX_COUNT = 180;    // Maximale Partikelzahl im Strudel

function random(min, max) { return Math.random() * (max - min) + min; }

// Partikel erzeugen – nur weiß & blau
function createParticles() {
    particles.length = 0;
    for (let i = 0; i < MAX_COUNT; i++) {
        const hueOptions = [210, 220, 230, 240]; // Blautöne
        const hue = hueOptions[Math.floor(random(0, hueOptions.length))];
        particles.push({
            x: random(0, width),
            y: random(0, height),
            vx: random(-0.05, 0.05),
            vy: random(-0.05, 0.05),
            radius: random(1.2, 3),
            alpha: i < START_COUNT ? random(0.6, 1) : 0,
            active: i < START_COUNT,
            hue: hue,
            decay: random(0.0005, 0.002)
        });
    }
}

let phase = 'float';
let timer = 0;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    center.x = width / 2;
    center.y = height / 2;
}
window.addEventListener('resize', resizeCanvas);

function drawBackground() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
}

function drawParticles() {
    drawBackground();

    particles.forEach(p => {
        if (!p.active) return;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
        ctx.shadowBlur = 25 + 15 * p.alpha;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
        ctx.fill();

        // Float: sanftes Schweben
        if (phase === 'float') {
            p.vx += random(-0.002, 0.002);
            p.vy += random(-0.002, 0.002);
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        // Gather: Partikel sammeln sich zur Kugel
        else if (phase === 'gather') {
            const dx = center.x - p.x;
            const dy = center.y - p.y;
            p.x += dx * 0.015; // sanfte Anziehung
            p.y += dy * 0.015;
            p.alpha = Math.min(p.alpha + 0.01, 1);
        }

        // Explode: Strudelartige Explosion
        else if (phase === 'explode') {
            const dx = p.x - center.x;
            const dy = p.y - center.y;
            const angle = Math.atan2(dy, dx);
            const swirl = 0.2;           // Drehstärke
            const speed = random(1, 2.5); // Geschwindigkeit
            p.x += Math.cos(angle + swirl) * speed + random(-0.2, 0.2);
            p.y += Math.sin(angle + swirl) * speed + random(-0.2, 0.2);
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                p.x = center.x + random(-5, 5);
                p.y = center.y + random(-5, 5);
                p.alpha = random(0.6, 1);
                p.radius = random(1.2, 3);
            }
        }
    });
}

// Aktiviert weitere Partikel für den Strudel
function activateMoreParticles() {
    particles.forEach(p => {
        if (!p.active) {
            p.active = true;
            p.x = center.x + random(-5, 5);
            p.y = center.y + random(-5, 5);
            p.alpha = random(0.6, 1);
        }
    });
}

// Animation
function animate() {
    drawParticles();
    requestAnimationFrame(animate);
    timer++;

    if (timer === 400) phase = 'gather';
    if (timer === 900) {
        activateMoreParticles();
        phase = 'explode';
    }
    if (timer === 2200) {
        phase = 'float';
        timer = 0;
    }
}

createParticles();
animate();
