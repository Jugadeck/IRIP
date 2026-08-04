let photos = JSON.parse(localStorage.getItem('irp_photos') || '[]');

// Initialize preview
updatePhotoPreview();

// Add Photo
function addPhoto() {
    const title = document.getElementById('photo-title').value;
    const url = document.getElementById('photo-url').value;
    const file = document.getElementById('photo-file').files[0];
    const category = document.getElementById('photo-category').value;

    if (!title) {
        alert('Please enter a photo title');
        return;
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            savePhoto(title, e.target.result, category);
        };
        reader.readAsDataURL(file);
    } else if (url) {
        savePhoto(title, url, category);
    } else {
        alert('Please provide a photo URL or upload a file');
    }
}

function savePhoto(title, url, category) {
    const photo = {
        id: Date.now(),
        title: title,
        url: url,
        category: category,
        date: new Date().toISOString()
    };

    photos.push(photo);
    localStorage.setItem('irp_photos', JSON.stringify(photos));
    
    // Clear form
    document.getElementById('photo-title').value = '';
    document.getElementById('photo-url').value = '';
    document.getElementById('photo-file').value = '';
    
    updatePhotoPreview();
    alert('Photo added successfully!');
}

function updatePhotoPreview() {
    const preview = document.getElementById('photo-preview');
    preview.innerHTML = photos.map(photo => `
        <div class="photo-item">
            <img src="${photo.url}" alt="${photo.title}">
            <button class="delete-btn" onclick="deletePhoto(${photo.id})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function deletePhoto(id) {
    if (confirm('Delete this photo?')) {
        photos = photos.filter(p => p.id !== id);
        localStorage.setItem('irp_photos', JSON.stringify(photos));
        updatePhotoPreview();
    }
}

// Generate Gallery Code
function generateGalleryCode() {
    const code = `<!-- Gallery Section Code -->
<div class="gallery-grid">
${photos.map(photo => `    <div class="gallery-item" onclick="openLightbox('${photo.url}')">
        <img src="${photo.url}" alt="${photo.title}">
        <div class="gallery-overlay">
            <h4>${photo.title}</h4>
            <span>${photo.category}</span>
        </div>
    </div>`).join('\n')}
</div>`;

    document.getElementById('gallery-code').textContent = code;
    document.getElementById('gallery-code-output').style.display = 'block';
    document.getElementById('copy-gallery-btn').style.display = 'inline-block';
}

// Update Social Links
function updateSocialLinks() {
    const instagram = document.getElementById('instagram-username').value;
    const whatsapp = document.getElementById('whatsapp-number').value;
    const email = document.getElementById('email-address').value;

    const social = { instagram, whatsapp, email };
    localStorage.setItem('irp_social', JSON.stringify(social));

    alert('Social links updated successfully! Refresh index.html to see changes.');
}

// Generate Social Code
function generateSocialCode() {
    const instagram = document.getElementById('instagram-username').value;
    const whatsapp = document.getElementById('whatsapp-number').value;
    const email = document.getElementById('email-address').value;

    const code = `<!-- Social Media Links -->
<ul class="contact-details">
    <li>
        <i class="fas fa-envelope"></i>
        <div>
            <strong>Email Us</strong><br>
            <span>${email}</span>
        </div>
    </li>
    <li>
        <i class="fab fa-whatsapp"></i>
        <div>
            <strong>WhatsApp</strong><br>
            <span>${whatsapp}</span>
        </div>
    </li>
    <li>
        <i class="fab fa-instagram"></i>
        <div>
            <strong>Instagram</strong><br>
            <span>${instagram}</span>
        </div>
    </li>
</ul>

<!-- Footer Social Links -->
<div class="social-links">
    <a href="https://instagram.com/${instagram.replace('@', '')}" target="_blank">
        <i class="fab fa-instagram"></i>
    </a>
    <a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}" target="_blank">
        <i class="fab fa-whatsapp"></i>
    </a>
    <a href="mailto:${email}">
        <i class="fas fa-envelope"></i>
    </a>
</div>`;

    document.getElementById('social-code').textContent = code;
    document.getElementById('social-code-output').style.display = 'block';
    document.getElementById('copy-social-btn').style.display = 'inline-block';
}

// Copy Code
function copyCode(elementId) {
    const code = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(code).then(() => {
        const successMsg = elementId === 'gallery-code' ? 
            document.getElementById('gallery-success') : 
            document.getElementById('social-success');
        
        successMsg.style.display = 'block';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 3000);
    });
}

// Export All Data
function exportAllData() {
    const data = {
        photos: photos,
        social: JSON.parse(localStorage.getItem('irp_social') || '{}'),
        exportDate: new Date().toISOString()
    };

    const code = JSON.stringify(data, null, 2);
    document.getElementById('export-code').textContent = code;
    document.getElementById('export-output').style.display = 'block';
    document.getElementById('copy-export-btn').style.display = 'inline-block';

    // Also download as file
    const blob = new Blob([code], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'irp-data-backup.json';
    a.click();
}

// Import Data
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.photos) {
                photos = data.photos;
                localStorage.setItem('irp_photos', JSON.stringify(photos));
                updatePhotoPreview();
            }
            
            if (data.social) {
                localStorage.setItem('irp_social', JSON.stringify(data.social));
            }
            
            alert('Data imported successfully!');
        } catch (error) {
            alert('Error importing data: ' + error.message);
        }
    };
    reader.readAsText(file);
}
