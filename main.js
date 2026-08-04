// Enhanced 3D Space Background with Rockets, Planets & Purple Glow
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.getElementById('canvas-container').appendChild(canvas);

let width, height;
let stars = [];
let rockets = [];
let planets = [];
let purpleGlows = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

// Create stars
function createStars() {
    stars = [];
    for (let i = 0; i < 300; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2.5,
            speed: Math.random() * 0.8 + 0.2,
            twinkle: Math.random() * Math.PI * 2
        });
    }
}

// Create flying rockets
function createRockets() {
    rockets = [];
    for (let i = 0; i < 3; i++) {
        rockets.push({
            x: Math.random() * width,
            y: height + 100,
            speed: Math.random() * 3 + 2,
            size: Math.random() * 20 + 15,
            angle: -Math.PI / 2 + (Math.random() - 0.5) * 0.5
        });
    }
}

// Create planets
function createPlanets() {
    planets = [];
    // Large planet (like Mars)
    planets.push({
        x: width * 0.85,
        y: height * 0.2,
        radius: 80,
        color: '#ff6b35',
        rings: false
    });
    
    // Smaller planet with rings (like Saturn)
    planets.push({
        x: width * 0.15,
        y: height * 0.7,
        radius: 50,
        color: '#a855f7',
        rings: true
    });
}

// Create purple glow particles (rocket burner effect)
function createPurpleGlows() {
    purpleGlows = [];
    for (let i = 0; i < 20; i++) {
        purpleGlows.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 100 + 50,
            alpha: Math.random() * 0.3 + 0.1,
            pulse: Math.random() * Math.PI * 2
        });
    }
}

// Draw rocket
function drawRocket(rocket) {
    ctx.save();
    ctx.translate(rocket.x, rocket.y);
    ctx.rotate(rocket.angle);
    
    // Rocket body
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.ellipse(0, 0, rocket.size * 0.4, rocket.size, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Rocket nose
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(0, -rocket.size * 0.7, rocket.size * 0.3, rocket.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Rocket fins
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(-rocket.size * 0.4, rocket.size * 0.5);
    ctx.lineTo(-rocket.size * 0.7, rocket.size * 0.9);
    ctx.lineTo(-rocket.size * 0.3, rocket.size * 0.7);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(rocket.size * 0.4, rocket.size * 0.5);
    ctx.lineTo(rocket.size * 0.7, rocket.size * 0.9);
    ctx.lineTo(rocket.size * 0.3, rocket.size * 0.7);
    ctx.fill();
    
    // Rocket window
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.arc(0, -rocket.size * 0.2, rocket.size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    // Rocket flame (purple/orange gradient)
    const flameGradient = ctx.createLinearGradient(0, rocket.size * 0.8, 0, rocket.size * 1.5);
    flameGradient.addColorStop(0, '#a855f7');
    flameGradient.addColorStop(0.5, '#f97316');
    flameGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = flameGradient;
    ctx.beginPath();
    ctx.moveTo(-rocket.size * 0.3, rocket.size * 0.8);
    ctx.quadraticCurveTo(0, rocket.size * 1.8, rocket.size * 0.3, rocket.size * 0.8);
    ctx.fill();
    
    ctx.restore();
}

// Draw planet
function drawPlanet(planet) {
    // Planet shadow/glow
    const glowGradient = ctx.createRadialGradient(planet.x, planet.y, planet.radius, planet.x, planet.y, planet.radius * 1.5);
    glowGradient.addColorStop(0, planet.color + '40');
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Planet body
    const planetGradient = ctx.createRadialGradient(
        planet.x - planet.radius * 0.3,
        planet.y - planet.radius * 0.3,
        0,
        planet.x,
        planet.y,
        planet.radius
    );
    planetGradient.addColorStop(0, planet.color);
    planetGradient.addColorStop(1, '#000');
    
    ctx.fillStyle = planetGradient;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Planet rings (if applicable)
    if (planet.rings) {
        ctx.strokeStyle = planet.color + '80';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.ellipse(planet.x, planet.y, planet.radius * 1.8, planet.radius * 0.4, Math.PI / 6, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// Draw purple glow
function drawPurpleGlow(glow) {
    const gradient = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.radius);
    gradient.addColorStop(0, `rgba(168, 85, 247, ${glow.alpha})`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(glow.x, glow.y, glow.radius, 0, Math.PI * 2);
    ctx.fill();
}

// Main animation loop
function animate() {
    // Clear with slight fade for trail effect
    ctx.fillStyle = 'rgba(2, 6, 23, 0.3)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw purple glows (background effect)
    purpleGlows.forEach(glow => {
        glow.pulse += 0.02;
        glow.alpha = 0.1 + Math.sin(glow.pulse) * 0.1;
        drawPurpleGlow(glow);
    });
    
    // Draw stars
    stars.forEach(star => {
        star.twinkle += 0.05;
        const alpha = 0.5 + Math.sin(star.twinkle) * 0.5;
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
    
    // Draw and update rockets
    rockets.forEach(rocket => {
        drawRocket(rocket);
        
        rocket.x += Math.cos(rocket.angle) * rocket.speed;
        rocket.y += Math.sin(rocket.angle) * rocket.speed;
        
        // Reset rocket if it goes off screen
        if (rocket.y < -100 || rocket.x < -100 || rocket.x > width + 100) {
            rocket.x = Math.random() * width;
            rocket.y = height + 100;
            rocket.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5;
        }
    });
    
    requestAnimationFrame(animate);
}

// Initialize
resize();
createStars();
createRockets();
createPlanets();
createPurpleGlows();
animate();

window.addEventListener('resize', () => {
    resize();
    createStars();
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

// Load social links
function loadSocialLinks() {
    const social = JSON.parse(localStorage.getItem('irp_social') || '{}');
    
    if (social.instagram) {
        document.getElementById('instagram-display').textContent = social.instagram;
        document.getElementById('footer-instagram').href = `https://instagram.com/${social.instagram.replace('@', '')}`;
    }
    
    if (social.whatsapp) {
        document.getElementById('whatsapp-display').textContent = social.whatsapp;
        const whatsappNum = social.whatsapp.replace(/[^0-9]/g, '');
        document.getElementById('footer-whatsapp').href = `https://wa.me/${whatsappNum}`;
    }
    
    if (social.email) {
        document.getElementById('email-display').textContent = social.email;
        document.getElementById('footer-email').href = `mailto:${social.email}`;
    }
}

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
loadSocialLinks();
