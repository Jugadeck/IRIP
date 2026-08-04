// Space Background - Realistic Faint Planets & Better Rockets
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.getElementById('canvas-container').appendChild(canvas);

let width, height;
let stars = [];
let rockets = [];
let planets = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createPlanets();
    createRockets();
}

function createStars() {
    stars = [];
    for (let i = 0; i < 250; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.2 + 0.3,
            speed: Math.random() * 0.2 + 0.05,
            twinkle: Math.random() * Math.PI * 2
        });
    }
}

// Better designed rockets - actual rocket shape
function createRockets() {
    rockets = [];
    for (let i = 0; i < 3; i++) {
        rockets.push({
            x: Math.random() * width,
            y: Math.random() * height,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 8 + 6, // Small size
            angle: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.2 + 0.1
        });
    }
}

// Only 2 planets - smaller and realistic
function createPlanets() {
    planets = [];
    
    // Planet 1: Small realistic gray planet (top right)
    planets.push({
        x: width * 0.82,
        y: height * 0.22,
        radius: 28,
        color: '#475569',
        hasRings: false
    });
    
    // Planet 2: Saturn-like with rings (bottom left) - smaller
    planets.push({
        x: width * 0.18,
        y: height * 0.72,
        radius: 22,
        color: '#334155',
        hasRings: true
    });
}

// Draw realistic rocket with nose, body, fins, window, flame
function drawRocket(rocket) {
    ctx.save();
    ctx.globalAlpha = rocket.opacity;
    ctx.translate(rocket.x, rocket.y);
    ctx.rotate(rocket.angle);
    
    const s = rocket.size;
    
    // Flame (flickering)
    const flameLength = s * (0.6 + Math.random() * 0.3);
    ctx.fillStyle = 'rgba(203, 213, 225, 0.4)';
    ctx.beginPath();
    ctx.moveTo(-s * 0.2, s * 0.5);
    ctx.quadraticCurveTo(0, s * 0.5 + flameLength, s * 0.2, s * 0.5);
    ctx.closePath();
    ctx.fill();
    
    // Main body (cylinder)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-s * 0.25, -s * 0.3, s * 0.5, s * 0.8);
    
    // Nose cone
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(-s * 0.25, -s * 0.3);
    ctx.lineTo(0, -s * 0.8);
    ctx.lineTo(s * 0.25, -s * 0.3);
    ctx.closePath();
    ctx.fill();
    
    // Left fin
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(-s * 0.25, s * 0.3);
    ctx.lineTo(-s * 0.5, s * 0.6);
    ctx.lineTo(-s * 0.25, s * 0.5);
    ctx.closePath();
    ctx.fill();
    
    // Right fin
    ctx.beginPath();
    ctx.moveTo(s * 0.25, s * 0.3);
    ctx.lineTo(s * 0.5, s * 0.6);
    ctx.lineTo(s * 0.25, s * 0.5);
    ctx.closePath();
    ctx.fill();
    
    // Window (small circle)
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(0, -s * 0.05, s * 0.12, 0, Math.PI * 2);
    ctx.fill();
    
    // Window highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(-s * 0.04, -s * 0.08, s * 0.04, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Draw realistic planet with 3D shading
function drawPlanet(planet) {
    // Very faint outer glow
    const glowGradient = ctx.createRadialGradient(
        planet.x, planet.y, planet.radius * 0.8,
        planet.x, planet.y, planet.radius * 2
    );
    glowGradient.addColorStop(0, 'rgba(148, 163, 184, 0.08)');
    glowGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Planet base color
    ctx.fillStyle = planet.color;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 3D shading - light from top-left
    const shadeGradient = ctx.createRadialGradient(
        planet.x - planet.radius * 0.35,
        planet.y - planet.radius * 0.35,
        planet.radius * 0.1,
        planet.x,
        planet.y,
        planet.radius
    );
    shadeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)'); // Highlight
    shadeGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.05)');
    shadeGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.2)');
    shadeGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)'); // Shadow
    
    ctx.fillStyle = shadeGradient;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Saturn rings (drawn behind and in front for 3D effect)
    if (planet.hasRings) {
        ctx.save();
        ctx.translate(planet.x, planet.y);
        ctx.rotate(Math.PI / 7);
        
        // Ring shadow
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.15)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, planet.radius * 1.7, planet.radius * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Ring highlight
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, planet.radius * 1.7, planet.radius * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
}

function animate() {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);
    
    // Stars
    stars.forEach(star => {
        star.twinkle += 0.02;
        const alpha = 0.2 + Math.sin(star.twinkle) * 0.2;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        star.y += star.speed;
        if (star.y > height) {
            star.y = 0;
            star.x = Math.random() * width;
        }
    });
    
    // Planets
    planets.forEach(planet => drawPlanet(planet));
    
    // Rockets
    rockets.forEach(rocket => {
        drawRocket(rocket);
        rocket.x += rocket.speedX;
        rocket.y += rocket.speedY;
        rocket.angle += 0.002;
        
        if (rocket.x < -50) rocket.x = width + 50;
        if (rocket.x > width + 50) rocket.x = -50;
        if (rocket.y < -50) rocket.y = height + 50;
        if (rocket.y > height + 50) rocket.y = -50;
    });
    
    requestAnimationFrame(animate);
}

function init() {
    resize();
    createStars();
    createRockets();
    createPlanets();
    animate();
}

init();
window.addEventListener('resize', resize);

function loadGallery() {
    const photos = JSON.parse(localStorage.getItem('irp_photos') || '[]');
    const galleryContainer = document.getElementById('gallery-container');
    if (photos.length === 0) {
        galleryContainer.innerHTML = '<p style="text-align: center; color: #94a3b8; grid-column: 1/-1; font-size: 1.2rem;">No photos yet. Add photos from the admin panel.</p>';
        return;
    }
    galleryContainer.innerHTML = photos.map(photo => `
        <div class="gallery-item" onclick="openLightbox('${photo.url}')">
            <img src="${photo.url}" alt="${photo.title}">
            <div class="gallery-overlay">
                <h4>${photo.title}</h4>
                <span>${photo.category}</span>
            </div>
        </div>
    `).join('');
}

function openLightbox(url) {
    document.getElementById('lightbox').style.display = 'flex';
    document.getElementById('lightbox-img').src = url;
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
});

function handleSubmit(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(15, 23, 42, 0.98)';
        navLinks.style.padding = '2rem';
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

loadGallery();
