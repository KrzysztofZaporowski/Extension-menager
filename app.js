// DOM Elements
const themeIcon = document.getElementById("theme-img");
const themeButton = document.getElementById("theme-btn");
const extensionsContainer = document.querySelector('.grid');
const allFilter = document.getElementById('all');
const activeFilter = document.getElementById('active');
const inactiveFilter = document.getElementById('inactive');

// Initial theme setup
let theme = localStorage.getItem('theme') || 'light';
let currentTheme = theme;
document.documentElement.setAttribute('data-theme', currentTheme);
if (!theme) {
    localStorage.setItem('theme', currentTheme);
}

// Functions
function updateThemeIcon() {
    if (currentTheme === 'light') {
        themeIcon.src = './assets/images/icon-moon.svg';
    } else {
        themeIcon.src = './assets/images/icon-sun.svg';
    }
}

function toggleTheme() {
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        currentTheme = 'dark';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        currentTheme = 'light';
    }
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

async function fetchData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        } 
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return null;
    }
}

function displayExtensions(extensions) {
    extensionsContainer.innerHTML = ''; // Clear existing content

    extensions.forEach(extension => {
        const extensionElement = document.createElement('div');
        extensionElement.classList.add('extension');
        if (!extension.isActive) {
            extensionElement.classList.add('inactive');
        }
        extensionElement.innerHTML = `
            <img src="${extension.logo}" alt="${extension.name}" class="extension-image">
            <div class="extension-info">
                <h3 class="extension-name">${extension.name}</h3>
                <p class="extension-description">${extension.description}</p>
                <div class="options">
                    <button class="remove-btn">Remove</button>
                    <input type="checkbox" class="extension-checkbox" ${extension.isActive ? 'checked' : ''}>
                    <label class="extension-label">Enable</label>
            </div>
        `;

        extensionsContainer.appendChild(extensionElement);
    });
}

function filterExtensions(filter) {
    const allExtensions = document.querySelectorAll('.extension');
    allExtensions.forEach(extension => {
        if (filter === 'all') {
            extension.style.display = 'block';
        } else if (filter === 'active' && !extension.classList.contains('inactive')) {
            extension.style.display = 'block';
        } else if (filter === 'inactive' && extension.classList.contains('inactive')) {
            extension.style.display = 'block';
        } else {
            extension.style.display = 'none';
        }
    });
}

function removeExtension(event) {
    const button = event.target;
    if (button.classList.contains('remove-btn')) {
        const extensionElement = button.closest('.extension');
        extensionElement.remove();
    }
}

function toggleExtensionStatus(event) {
    const checkbox = event.target;
    const extensionElement = checkbox.closest('.extension');
    if (checkbox.checked) {
        extensionElement.classList.remove('inactive');
    } else {
        extensionElement.classList.add('inactive');
    }
}

// Initialize app
(async () => {
    updateThemeIcon();
    themeButton.addEventListener('click', toggleTheme);
    const extensions = await fetchData();
    displayExtensions(extensions);
    allFilter.addEventListener('click', () => filterExtensions('all'));
    activeFilter.addEventListener('click', () => filterExtensions('active'));
    inactiveFilter.addEventListener('click', () => filterExtensions('inactive'));
    extensionsContainer.addEventListener('click', removeExtension);
    extensionsContainer.addEventListener('change', toggleExtensionStatus);
})();