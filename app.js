// DOM Elements
const themeIcon = document.getElementById("theme-img");
const themeButton = document.getElementById("theme-btn");
const extensionsContainer = document.querySelector('.grid');
const filterButtons = document.querySelectorAll('.filter-btn');
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
            <div class="extension-info">
                <img src="${extension.logo}" alt="${extension.name}" class="extension-image">
                <div class="extension-data">
                    <h3 class="extension-name">${extension.name}</h3>
                    <p class="extension-description">${extension.description}</p>
                </div>
            </div>
            <div class="options">
                <button class="remove-btn">Remove</button>
                <div class="switch">
                    <input type="checkbox" class="extension-checkbox" id="checkbox-${extension.name}" ${extension.isActive ? 'checked' : ''}>
                    <label for="checkbox-${extension.name}" class="extension-label"></label>
                </div>
            </div>
        `;

        extensionsContainer.appendChild(extensionElement);
    });
}

function filterExtensions(filter, event) {
    const allExtensions = document.querySelectorAll('.extension');

    // Reset filter button styles
    filterButtons.forEach(button => { 
        button.classList.remove('selected');
    });
    event.target.classList.add('selected');

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
    allFilter.addEventListener('click', () => filterExtensions('all', event));
    activeFilter.addEventListener('click', () => filterExtensions('active', event));
    inactiveFilter.addEventListener('click', () => filterExtensions('inactive', event));
    extensionsContainer.addEventListener('click', removeExtension);
    extensionsContainer.addEventListener('change', toggleExtensionStatus);
})();