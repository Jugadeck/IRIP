// Space Background with Faint Planets, Saturn, and Small Rockets
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.getElementById('canvas-container').appendChild(canvas);

let width, height;
let stars = [];
let spaceships = [];
let planets = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createPlanets();
    createSpaceships();
}

function createStars() {
    stars = [];
    for (let i = 0; i < 300; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.5,
            speed: Math.random() * 0.3 + 0.1,
            twinkle: Math.random() * Math.PI * 2
        });
    }
}

// Small, faint white/gray rockets
function createSpaceships() {
    spaceships = [];
    for (let i = 0; i < 3; i++) {
        spaceships.push({
            x: Math.random() * width,
            y: Math.random() * height,
            speedX: (Math.random() - 0.5) * 0.8,
            speedY: (Math.random() - 0.5) * 0.8,
            size: Math.random() * 10 + 8, // Smaller size
            angle: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.15 + 0.1 // Very faint
        });
    }
}

// Faint gray/blue-gray planets (No bright colors), smaller size, added Saturn
function createPlanets() {
    planets = [];
    
    // Planet 1: Faint dark gray
    planets.push({
        x: width * 0.85,
        y: height * 0.2,
        radius: 50, // Reduced size
        gradient: ['#0f172a', '#1e293b', '#334155']
    });
    
    // Planet 2: Faint medium gray
    planets.push({
        x: width * 0.15,
        y: height * 0.75,
        radius: 35, // Reduced size
        gradient: ['#1e293b', '#334155', '#475569']
    });
    
    // Planet 3: Very faint small gray
    planets.push({
        x: width * 0.88,
        y: height * 0.6,
        radius: 25, // Reduced size
        gradient: ['#020617', '#0f172a', '#1e293b']
    });

    // Planet 4: SATURN (Faint with rings)
    planets.push({
        x: width * 0.2,
        y: height * 0.25,
        radius: 40,
        gradient: ['#1e293b', '#334155', '#475569'],
        hasRings: true
    });
}

// Draw small faint rocket
function drawSpaceship(ship) {
    ctx.save();
    ctx.globalAlpha = ship.opacity;
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    
    // Body (White/Gray)
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(0, -ship.size);
    ctx.lineTo(-ship.size * 0.3, ship.size * 0.4);
    ctx.lineTo(ship.size * 0.3, ship.size * 0.4);
    ctx.closePath();
    ctx.fill();
    
    // Faint flame
    ctx.fillStyle = 'rgba(203, 213, 225, 0.5)';
    ctx.beginPath();
    ctx.moveTo(-ship.size * 0.15, ship.size * 0.4);
    ctx.lineTo(0, ship.size * 0.8);
    ctx.lineTo(ship.size * 0.15, ship.size * 0.4);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

// Draw faint planet with optional rings
function drawPlanet(planet) {
    // Very faint glow
    const glowGradient = ctx.createRadialGradient(planet.x, planet.y, planet.radius * 0.5, planet.x, planet.y, planet.radius * 1.5);
    glowGradient.addColorStop(0, 'rgba(148, 163, 184, 0.1)'); // Faint gray glow
    glowGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Planet body
    const planetGradient = ctx.createRadialGradient(
        planet.x - planet.radius * 0.3, planet.y - planet.radius * 0.3, 0,
        planet.x, planet.y, planet.radius
    );
    planetGradient.addColorStop(0, planet.gradient[2]);
    planetGradient.addColorStop(0.5, planet.gradient[1]);
    planetGradient.addColorStop(1, planet.gradient[0]);
    
    ctx.fillStyle = planetGradient;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Saturn Rings (Faint gray)
    if (planet.hasRings) {
        ctx.save();
        ctx.translate(planet.x, planet.y);
        ctx.rotate(Math.PI / 6); // Tilt rings
        
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)'; // Faint gray ring
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(0, 0, planet.radius * 1.8, planet.radius * 0.5, 0, 0, Math.PI * 2);
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
        const alpha = 0.3 + Math.sin(star.twinkle) * 0.3;
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
    
    // Spaceships
    spaceships.forEach(ship => {
        drawSpaceship(ship);
        ship.x += ship.speedX;
        ship.y += ship.speedY;
        ship.angle += 0.002;
        
        if (ship.x < -50) ship.x = width + 50;
        if (ship.x > width + 50) ship.x = -50;
        if (ship.y < -50) ship.y = height + 50;
        if (ship.y > height + 50) ship.y = -50;
    });
    
    requestAnimationFrame(animate);
}

function init() {
    resize();
    createStars();
    createSpaceships();
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
