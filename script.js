const mainDiv = document.getElementById('main');
const imgUrl = document.getElementById('url');
const imageName = document.getElementById('name');

// Load images on page load
window.onload = () => {
    const images = JSON.parse(localStorage.getItem('images')) || [];
    images.forEach(img => createCard(img.url, img.name));
};

// Generate button function
function generate() {
    if (!imgUrl.value) {
        alert("Please enter an image URL!");
        return;
    }

    createCard(imgUrl.value, imageName.value);

    // Save to localStorage
    const images = JSON.parse(localStorage.getItem('images')) || [];
    images.push({
        url: imgUrl.value,
        name: imageName.value
    });
    localStorage.setItem('images', JSON.stringify(images));

    // Clear inputs
    imgUrl.value = '';
    imageName.value = '';
}

// Create card function
function createCard(url, name) {

    const card = document.createElement('div');
    card.classList.add('card-custom');

    // Image
    const image = document.createElement('img');
    image.src = url;
    image.alt = name || "Image";

    // Click to zoom
    image.onclick = () => {
        window.open(image.src, '_blank');
    };

    // Title
    const title = document.createElement('p');
    title.innerText = name || "Untitled";

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.innerText = "Delete";
    delBtn.style.marginBottom = "10px";

    delBtn.onclick = () => {
        card.remove();

        // Remove from localStorage
        let images = JSON.parse(localStorage.getItem('images')) || [];
        images = images.filter(img => img.url !== url);
        localStorage.setItem('images', JSON.stringify(images));
    };

    // Append elements
    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(delBtn);

    mainDiv.appendChild(card);
}

// Enter key support
imgUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generate();
});

imageName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generate();
});