// Clean Space Background - Vertical Rockets Only
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.getElementById('canvas-container').appendChild(canvas);

let width, height;
let stars = [];
let rockets = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

// Create stars (white/light gray only)
function createStars() {
    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.5,
            speed: Math.random() * 0.5 + 0.2,
            twinkle: Math.random() * Math.PI * 2
        });
    }
}

// Create vertical rockets (flying straight up)
function createRockets() {
    rockets = [];
    for (let i = 0; i < 2; i++) {
        rockets.push({
            x: Math.random() * width,
            y: height + 50,
            speed: Math.random() * 2 + 1.5,
            size: Math.random() * 12 + 8,
            opacity: Math.random() * 0.15 + 0.1
        });
    }
}

// Draw simple rocket (white/gray only)
function drawRocket(rocket) {
    ctx.save();
    ctx.globalAlpha = rocket.opacity;
    ctx.translate(rocket.x, rocket.y);
    
    // Rocket body (white)
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(0, -rocket.size);
    ctx.lineTo(-rocket.size * 0.3, rocket.size * 0.5);
    ctx.lineTo(rocket.size * 0.3, rocket.size * 0.5);
    ctx.closePath();
    ctx.fill();
    
    // Rocket flame (subtle white/gray)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.moveTo(-rocket.size * 0.2, rocket.size * 0.5);
    ctx.lineTo(0, rocket.size * 1.2);
    ctx.lineTo(rocket.size * 0.2, rocket.size * 0.5);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

// Main animation
function animate() {
    // Dark background with slight fade
    ctx.fillStyle = 'rgba(2, 6, 23, 0.4)';
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
    
    // Draw and update rockets (vertical only)
    rockets.forEach(rocket => {
        drawRocket(rocket);
        
        // Move straight up
        rocket.y -= rocket.speed;
        
        // Reset when off screen
        if (rocket.y < -50) {
            rocket.y = height + 50;
            rocket.x = Math.random() * width;
        }
    });
    
    requestAnimationFrame(animate);
}

// Initialize
resize();
createStars();
createRockets();
animate();

window.addEventListener('resize', () => {
    resize();
    createStars();
    createRockets();
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
