
// bg.js – Finale Version: Partikel-Tunnel mit Strudel & Farb-Rückflug
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
const center = { x: width / 2, y: height / 2 };

const particles = [];
const particleCount = 200; // übersichtlich & klein

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
        const hue = 210; // Startfarbe Blau
        const sat = random(50, 100);
        const light = random(70, 100);
        particles.push({
            x: random(0, width),
            y: random(0, height),
            vx: random(-0.2, 0.2),
            vy: random(-0.2, 0.2),
            radius: random(1.5, 3),
            alpha: random(0.5, 1),
            decay: random(0.001, 0.003),
            color: `hsla(${hue},${sat}%,${light}%,`
        });
    }
}

let phase = 'float';
let timer = 0;

function drawBackground() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
}

function drawParticles() {
    drawBackground();

    // Hintergrund-Sterne für Tiefenwirkung
    for (let i = 0; i < 6; i++) {
        const sx = random(0, width);
        const sy = random(0, height);
        const sr = random(0.3, 1.2);
        const sa = random(0.2, 0.5);
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${sa})`;
        ctx.fill();
    }

    for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.shadowBlur = 15 + 10 * p.alpha;
        ctx.shadowColor = p.color + p.alpha + ')';
        ctx.fill();

        // Bewegungen
        if (phase === 'float') {
            p.vx += random(-0.008, 0.008);
            p.vy += random(-0.008, 0.008);
            p.x += p.vx;
            p.y += p.vy;
        } else if (phase === 'gather') {
            // Strudelbewegung zur Mitte
            const dx = center.x - p.x;
            const dy = center.y - p.y;
            const angle = Math.atan2(dy, dx);
            const swirl = 0.08;
            const speed = 2;
            p.x += Math.cos(angle + swirl) * speed;
            p.y += Math.sin(angle + swirl) * speed;
            p.alpha = Math.min(p.alpha + 0.01, 1);
        } else if (phase === 'explode') {
            const dx = p.x - center.x;
            const dy = p.y - center.y;
            const angle = Math.atan2(dy, dx);
            const swirl = 0.05;
            const speed = random(1.5, 3);
            p.x += Math.cos(angle + swirl) * speed + random(-0.2, 0.2);
            p.y += Math.sin(angle + swirl) * speed + random(-0.2, 0.2);
            p.alpha -= p.decay * 1.5;

            if (p.alpha <= 0) {
                const a = random(0, Math.PI * 2);
                const r = random(width / 3, width / 2);
                p.x = center.x + Math.cos(a) * r;
                p.y = center.y + Math.sin(a) * r;
                p.alpha = random(0.5, 1);
                p.radius = random(1.5, 3);

                // Farben beim Rückflug: Rot, Gelb, Weiß, Blau
                const hues = [0, 60, 210, 240];
                const hue = hues[Math.floor(random(0, hues.length))];
                const sat = random(60, 100);
                const light = random(70, 100);
                p.color = `hsla(${hue},${sat}%,${light}%,`;
            }
        }

        // Float-Grenzen
        if (phase === 'float') {
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        }
    }
}

function animate() {
    drawParticles();
    requestAnimationFrame(animate);
    timer++;

    if (timer % 1500 === 0) phase = 'gather';
    if (timer % 1500 === 500) phase = 'explode';
    if (timer % 1500 === 1000) phase = 'float';
}

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    center.x = width / 2;
    center.y = height / 2;
});

createParticles();
animate();
