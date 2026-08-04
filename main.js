// Three.js 3D Background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create stars
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 2000;
const posArray = new Float32Array(starsCount * 3);

for(let i = 0; i < starsCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starsMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
});

const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starsMesh);

camera.position.z = 5;

// Animation
function animate() {
    requestAnimationFrame(animate);
    starsMesh.rotation.y += 0.0005;
    starsMesh.rotation.x += 0.0002;
    renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Load photos from localStorage
function loadGallery() {
    const photos = JSON.parse(localStorage.getItem('irp_photos') || '[]');
    const galleryContainer = document.getElementById('gallery-container');
    
    if (photos.length === 0) {
        galleryContainer.innerHTML = '<p style="text-align: center; color: #94a3b8; grid-column: 1/-1;">No photos yet. Add photos from the admin panel.</p>';
        return;
    }

    galleryContainer.innerHTML = photos.map((photo, index) => `
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

document.querySelector('.close-lightbox').addEventListener('click', () => {
    document.getElementById('lightbox').style.display = 'none';
});

document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === document.getElementById('lightbox')) {
        document.getElementById('lightbox').style.display = 'none';
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

// Initialize
loadGallery();
loadSocialLinks();

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

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

gsap.from('.hero-content', {
    duration: 1.5,
    y: 100,
    opacity: 0,
    ease: 'power3.out'
});

gsap.from('.stat-item', {
    scrollTrigger: {
        trigger: '.stats',
        start: 'top 80%'
    },
    duration: 0.8,
    y: 50,
    opacity: 0,
    stagger: 0.2
});

gsap.from('.program-card', {
    scrollTrigger: {
        trigger: '.programs',
        start: 'top 80%'
    },
    duration: 0.8,
    y: 50,
    opacity: 0,
    stagger: 0.3
});