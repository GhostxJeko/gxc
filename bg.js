// bg.js – Kosmisches Universum mit Lichtball, Explosion & Strudel (optimiert)
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let centerX = width / 2;
let centerY = height / 2;

// Partikel-Einstellungen
const particles = [];
const START_COUNT = 40;   // Anfangspartikel für Performance
const MAX_COUNT = 120;    // Maximal im Strudel
const hueOptions = [210, 220, 230, 240]; // Weiß-Blau-Töne

function rand(min, max) { return Math.random() * (max - min) + min; }

// Partikel erstellen
function createParticles() {
    particles.length = 0;
    for (let i = 0; i < MAX_COUNT; i++) {
        const hue = hueOptions[Math.floor(rand(0, hueOptions.length))];
        particles.push({
            x: rand(0, width),
            y: rand(0, height),
            vx: rand(-0.15, 0.15),
            vy: rand(-0.15, 0.15),
            radius: rand(1.2, 2.4),
            alpha: i < START_COUNT ? rand(0.6, 1) : 0,
            active: i < START_COUNT,
            hue: hue,
            exploded: false
        });
    }
}

let phase = "float";
let timer = 0;

// Canvas Resize
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
        ctx.shadowBlur = 10 + 5 * p.alpha; // Performance angepasst
        ctx.shadowColor = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
        ctx.fill();

        // Float-Phase
        if (phase === "float") {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        // Zur Mitte ziehen
        else if (phase === "gather") {
            p.x += (centerX - p.x) * 0.08;
            p.y += (centerY - p.y) * 0.08;
        }

        // Lichtball-Explosion
        else if (phase === "explode") {
            if (!p.exploded) {
                const angle = rand(0, Math.PI * 2);
                const speed = rand(2.5, 5); // flüssig aber sichtbar
                p.vx = Math.cos(angle) * speed;
                p.vy = Math.sin(angle) * speed;
                p.exploded = true;
            }
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.004;

            if (p.alpha <= 0) {
                p.x = centerX;
                p.y = centerY;
                p.alpha = rand(0.6, 1);
                p.exploded = false;
            }
        }

        // Strudel-Phase
        else if (phase === "swirl") {
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            let angle = Math.atan2(dy, dx) + 0.05; // Drehung
            let radius = dist * 0.97;             // leicht einsaugen
            p.x = centerX + Math.cos(angle) * radius;
            p.y = centerY + Math.sin(angle) * radius;

            p.x += (Math.random() - 0.5) * 1.2;
            p.y += (Math.random() - 0.5) * 1.2;

            p.alpha -= 0.002;
            if (p.alpha <= 0) {
                p.x = centerX;
                p.y = centerY;
                p.alpha = rand(0.6, 1);
            }
        }
    });
}

// Mehr Partikel aktivieren
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

// Animation Loop
function animate() {
    drawParticles();
    requestAnimationFrame(animate);

    timer++;
    if (timer === 400) phase = "gather";       // Partikel zur Mitte
    if (timer === 650) phase = "explode";      // Lichtball explodiert
    if (timer === 950) {                       // Strudel
        activateMoreParticles();
        phase = "swirl";
    }
    if (timer === 1500) {                      // Reset auf float
        phase = "float";
        timer = 0;
    }
}

// Start
createParticles();
animate();
