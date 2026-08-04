// Space Background with Spaceships and Planets
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
}

// Create stars
function createStars() {
    stars = [];
    for (let i = 0; i < 250; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.5,
            speed: Math.random() * 0.4 + 0.1,
            twinkle: Math.random() * Math.PI * 2
        });
    }
}

// Create flying spaceships
function createSpaceships() {
    spaceships = [];
    for (let i = 0; i < 3; i++) {
        spaceships.push({
            x: Math.random() * width,
            y: Math.random() * height,
            speedX: (Math.random() - 0.5) * 0.8,
            speedY: (Math.random() - 0.5) * 0.8,
            size: Math.random() * 15 + 10,
            angle: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.2 + 0.1
        });
    }
}

// Create planets
function createPlanets() {
    planets = [];
    // Large planet (top right)
    planets.push({
        x: width * 0.85,
        y: height * 0.2,
        radius: 70,
        color: '#1e3a8a',
        gradient: ['#1e3a8a', '#3b82f6', '#1e40af']
    });
    
    // Medium planet (bottom left)
    planets.push({
        x: width * 0.15,
        y: height * 0.75,
        radius: 50,
        color: '#312e81',
        gradient: ['#312e81', '#6366f1', '#4338ca']
    });
    
    // Small planet (center right)
    planets.push({
        x: width * 0.9,
        y: height * 0.6,
        radius: 30,
        color: '#0f172a',
        gradient: ['#0f172a', '#1e293b', '#334155']
    });
}

// Draw spaceship
function drawSpaceship(ship) {
    ctx.save();
    ctx.globalAlpha = ship.opacity;
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    
    // Spaceship body
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(0, -ship.size);
    ctx.lineTo(-ship.size * 0.4, ship.size * 0.3);
    ctx.lineTo(-ship.size * 0.3, ship.size * 0.6);
    ctx.lineTo(ship.size * 0.3, ship.size * 0.6);
    ctx.lineTo(ship.size * 0.4, ship.size * 0.3);
    ctx.closePath();
    ctx.fill();
    
    // Cockpit
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(0, -ship.size * 0.2, ship.size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    // Engine glow
    ctx.fillStyle = 'rgba(249, 115, 22, 0.6)';
    ctx.beginPath();
    ctx.moveTo(-ship.size * 0.2, ship.size * 0.6);
    ctx.lineTo(0, ship.size * 0.9);
    ctx.lineTo(ship.size * 0.2, ship.size * 0.6);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

// Draw planet with gradient
function drawPlanet(planet) {
    // Planet glow
    const glowGradient = ctx.createRadialGradient(
        planet.x, planet.y, planet.radius * 0.8,
        planet.x, planet.y, planet.radius * 1.5
    );
    glowGradient.addColorStop(0, planet.color + '40');
    glowGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Planet body with gradient
    const planetGradient = ctx.createRadialGradient(
        planet.x - planet.radius * 0.3,
        planet.y - planet.radius * 0.3,
        0,
        planet.x,
        planet.y,
        planet.radius
    );
    
    planet.gradient.forEach((color, index) => {
        planetGradient.addColorStop(index / (planet.gradient.length - 1), color);
    });
    
    ctx.fillStyle = planetGradient;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Planet shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fill();
}

// Main animation
function animate() {
    // Dark background
    ctx.fillStyle = 'rgba(2, 6, 23, 0.3)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw stars
    stars.forEach(star => {
        star.twinkle += 0.03;
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
    
    // Draw planets
    planets.forEach(planet => {
        drawPlanet(planet);
    });
    
    // Draw and update spaceships
    spaceships.forEach(ship => {
        drawSpaceship(ship);
        
        // Move spaceship
        ship.x += ship.speedX;
        ship.y += ship.speedY;
        ship.angle += 0.005;
        
        // Wrap around screen
        if (ship.x < -50) ship.x = width + 50;
        if (ship.x > width + 50) ship.x = -50;
        if (ship.y < -50) ship.y = height + 50;
        if (ship.y > height + 50) ship.y = -50;
    });
    
    requestAnimationFrame(animate);
}

// Initialize
resize();
createStars();
createSpaceships();
createPlanets();
animate();

window.addEventListener('resize', () => {
    resize();
    createStars();
    createSpaceships();
    createPlanets();
});

// Load photos from localStorage
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

// Lightbox
function openLightbox(url) {
    document.getElementById('lightbox').style.display = 'flex';
    document.getElementById('lightbox-img').src = url;
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === document.getElementById('lightbox')) {
        closeLightbox();
    }
});

// Form handler
function handleSubmit(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}

// Mobile menu toggle
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

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Initialize
loadGallery();
