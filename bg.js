
// bg.js – Weiß/Blau Universum mit starkem Strudel (performant & flüssig)

const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let centerX = width / 2;
let centerY = height / 2;

const particles = [];
const START_COUNT = 60;   // Anfang wenige Partikel
const MAX_COUNT = 160;    // Im Strudel mehr Partikel

// Zufallsfunktion
function rand(min, max) {
    return Math.random() * (max - min) + min;
}

// Partikel erzeugen – nur Weiß & Blau
function createParticles() {
    particles.length = 0;
    for (let i = 0; i < MAX_COUNT; i++) {
        const hueOptions = [210, 220, 230, 240];
        const hue = hueOptions[Math.floor(rand(0, hueOptions.length))];

        particles.push({
            x: rand(0, width),
            y: rand(0, height),
            vx: rand(-0.15, 0.15),
            vy: rand(-0.15, 0.15),
            radius: rand(1.2, 2.4),
            alpha: i < START_COUNT ? rand(0.6, 1) : 0,
            active: i < START_COUNT,
            hue: hue
        });
    }
}

// Resize
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
}
window.addEventListener("resize", resize);

// Hintergrund zeichnen
function drawBackground() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
}

// Partikel zeichnen & bewegen
function drawParticles() {
    drawBackground();

    particles.forEach(p => {
        if (!p.active) return;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
        ctx.fill();

        if (phase === "float") {
            // Sanftes Schweben, kleine Anziehung zur Mitte
            p.x += p.vx + (centerX - p.x) * 0.001;
            p.y += p.vy + (centerY - p.y) * 0.001;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        if (phase === "gather") {
            // Partikel werden stärker zur Mitte gezogen
            p.x += (centerX - p.x) * 0.05;
            p.y += (centerY - p.y) * 0.05;
        }

        if (phase === "swirl") {
            // Starker Strudel / Spiralbewegung
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const angle = Math.atan2(dy, dx);
            const swirlStrength = 0.18;  // Stark aber stabil
            const outwardForce = 1.5;    // Partikel fliegen raus

            p.x += Math.cos(angle + swirlStrength) * outwardForce;
            p.y += Math.sin(angle + swirlStrength) * outwardForce;

            p.alpha -= 0.002;

            if (p.alpha <= 0) {
                p.x = centerX;
                p.y = centerY;
                p.alpha = rand(0.6, 1);
            }
        }
    });
}

// Aktiviert die restlichen Partikel beim Strudel
function activateMoreParticles() {
    particles.forEach(p => {
        if (!p.active) {
            p.active = true;
            p.x = centerX;
            p.y = centerY;
            p.alpha = rand(0.6, 1);
        }
    });
}

let phase = "float";
let timer = 0;

// Animation
function animate() {
    drawParticles();
    requestAnimationFrame(animate);

    timer++;

    if (timer === 400) phase = "gather";
    if (timer === 650) {
        activateMoreParticles(); // Mehr Partikel erst im Strudel
        phase = "swirl";
    }
    if (timer === 1400) {
        phase = "float";
        timer = 0;
    }
}

// Start
createParticles();
animate();
