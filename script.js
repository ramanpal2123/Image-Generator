const mainGrid = document.getElementById('main-grid');
const imgUrl = document.getElementById('url');
const imageName = document.getElementById('name');
const emptyState = document.getElementById('empty-state');
const galleryCount = document.getElementById('gallery-count');

// ── Toast ──
function showToast(msg, duration = 2800) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

// ── Count ──
function updateCount() {
    const n = mainGrid.querySelectorAll('.card-custom').length;
    galleryCount.textContent = n + (n === 1 ? ' image' : ' images');
    if (n === 0) emptyState.classList.add('visible');
    else emptyState.classList.remove('visible');
}

// ── Lightbox ──
function openLightbox(src, name) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lb-img').src = src;
    document.getElementById('lb-name').textContent = name || 'Untitled';
    lb.classList.add('open');
}
function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
}
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
});

// ── Load from storage ──
window.onload = () => {
    const images = JSON.parse(localStorage.getItem('visura-images')) || [];
    images.forEach(img => createCard(img.url, img.name, false));
    updateCount();
};

// ── Generate ──
function generate() {
    const url = imgUrl.value.trim();
    const name = imageName.value.trim();
    if (!url) { showToast('⚠️ Please enter an image URL!'); return; }

    createCard(url, name, true);

    const images = JSON.parse(localStorage.getItem('visura-images')) || [];
    images.push({ url, name });
    localStorage.setItem('visura-images', JSON.stringify(images));

    imgUrl.value = '';
    imageName.value = '';
    imgUrl.focus();
    showToast('✅ Image added to gallery!');
    updateCount();
}

// ── Create Card ──
function createCard(url, name, animate = true) {
    const card = document.createElement('div');
    card.classList.add('card-custom');
    if (!animate) card.style.animation = 'none';

    // Image wrapper
    const imgWrap = document.createElement('div');
    imgWrap.classList.add('card-img-wrap');

    const img = document.createElement('img');
    img.src = url;
    img.alt = name || 'Image';
    img.loading = 'lazy';
    img.onerror = () => {
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="240" height="190" viewBox="0 0 240 190"%3E%3Crect fill="%23111122" width="240" height="190"/%3E%3Ctext x="50%25" y="50%25" fill="%23555" font-size="13" text-anchor="middle" dy=".3em" font-family="sans-serif"%3EImage not found%3C/text%3E%3C/svg%3E';
    };

    const overlay = document.createElement('div');
    overlay.classList.add('card-overlay');
    overlay.innerHTML = '<i class="fas fa-expand"></i>';
    imgWrap.addEventListener('click', () => openLightbox(url, name || 'Untitled'));

    imgWrap.appendChild(img);
    imgWrap.appendChild(overlay);

    // Card body
    const body = document.createElement('div');
    body.classList.add('card-body');

    const title = document.createElement('span');
    title.classList.add('card-title');
    title.title = name || 'Untitled';
    title.textContent = name || 'Untitled';

    const delBtn = document.createElement('button');
    delBtn.classList.add('del-btn');
    delBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    delBtn.title = 'Delete image';
    delBtn.onclick = () => {
        card.style.transition = 'opacity 0.25s, transform 0.25s';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => {
            card.remove();
            let images = JSON.parse(localStorage.getItem('visura-images')) || [];
            images = images.filter(i => !(i.url === url && i.name === name));
            localStorage.setItem('visura-images', JSON.stringify(images));
            updateCount();
            showToast('🗑️ Image removed');
        }, 260);
    };

    body.appendChild(title);
    body.appendChild(delBtn);
    card.appendChild(imgWrap);
    card.appendChild(body);
    mainGrid.appendChild(card);

    updateCount();
}

// ── Enter key ──
imgUrl.addEventListener('keypress', e => { if (e.key === 'Enter') generate(); });
imageName.addEventListener('keypress', e => { if (e.key === 'Enter') generate(); });
