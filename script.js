// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBH8x1sdPpGmArL8jFOTgFYJtOXciMt9Pc",
    authDomain: "darknpt-bio.firebaseapp.com",
    databaseURL: "https://darknpt-bio-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "darknpt-bio",
    storageBucket: "darknpt-bio.firebasestorage.app",
    messagingSenderId: "126764704879",
    appId: "1:126764704879:web:e637392ba2b73566b4d99a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM Elements
const welcomePopup = document.getElementById('welcomePopup');
const welcomeClose = document.getElementById('welcomeClose');
const welcomeLogo = document.getElementById('welcomeLogo');
const welcomeTitle = document.getElementById('welcomeTitle');
const welcomeSubtitle = document.getElementById('welcomeSubtitle');
const profileImg = document.getElementById('profileImg');
const mainTitle = document.getElementById('mainTitle');
const usernameText = document.getElementById('usernameText');
const bioText = document.getElementById('bioText');
const buttonsContainer = document.getElementById('buttonsContainer');
const devLink = document.getElementById('devLink');
const footerText = document.getElementById('footerText');
const tiltContainer = document.getElementById('tiltContainer');
const bgMusic1 = document.getElementById('bgMusic1');
const bgMusic2 = document.getElementById('bgMusic2');
const clickSound = document.getElementById('clickSound');

// Prevent zooming and text selection
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Fetch Data from Firebase
function fetchData() {
    // Welcome Popup Data
    database.ref('/welcome').once('value').then(snapshot => {
        const data = snapshot.val();
        if (data) {
            if (data.title) welcomeTitle.textContent = data.title;
            if (data.subtitle) welcomeSubtitle.innerHTML = data.subtitle;
            if (data.logo) welcomeLogo.src = data.logo;
        }
    });
    
    // Profile Data
    database.ref('/profile').once('value').then(snapshot => {
        const data = snapshot.val();
        if (data) {
            if (data.title) mainTitle.textContent = data.title;
            if (data.username) usernameText.textContent = data.username;
            if (data.bio) bioText.textContent = data.bio;
            if (data.image) profileImg.src = data.image;
        }
    });
    
    // Buttons Data
    database.ref('/buttons').once('value').then(snapshot => {
        const buttonsData = snapshot.val();
        if (buttonsData) {
            buttonsContainer.innerHTML = '';
            Object.values(buttonsData).forEach(button => {
                if (button.name && button.link) {
                    const buttonElement = document.createElement('a');
                    buttonElement.href = button.link;
                    buttonElement.target = '_blank';
                    buttonElement.className = 'btn';
                    
                    // Button Style
                    if (button.style === 'youtube') buttonElement.classList.add('btn-youtube');
                    else if (button.style === 'instagram') buttonElement.classList.add('btn-instagram');
                    else if (button.style === 'whatsapp') buttonElement.classList.add('btn-whatsapp');
                    else if (button.style === 'earn') buttonElement.classList.add('btn-earn');
                    else if (button.style === 'webapp') buttonElement.classList.add('btn-webapp');
                    else buttonElement.classList.add('btn-telegram');
                    
                    // Button Icon
                    if (button.icon) {
                        const icon = document.createElement('img');
                        icon.src = button.icon;
                        icon.className = 'btn-logo';
                        buttonElement.appendChild(icon);
                    }
                    
                    buttonElement.appendChild(document.createTextNode(button.name));
                    
                    // Click Sound
                    buttonElement.addEventListener('click', () => {
                        clickSound.currentTime = 0;
                        clickSound.play();
                    });
                    
                    buttonsContainer.appendChild(buttonElement);
                }
            });
        }
    });
    
    // Footer & Dev Link
    database.ref('/footer').once('value').then(snapshot => {
        const data = snapshot.val();
        if (data) {
            if (data.text) footerText.textContent = data.text;
            if (data.devLink) devLink.href = data.devLink;
        }
    });
}

// Initialize Floating Balls
function initFloatingBalls() {
    const floatingBalls = document.getElementById('floatingBalls');
    const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff9900', '#9900ff'];
    
    for (let i = 0; i < 30; i++) {
        const ball = document.createElement('div');
        ball.classList.add('ball');
        
        const size = Math.random() * 80 + 20;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100 + 100;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const delay = Math.random() * 15;
        const duration = Math.random() * 15 + 10;
        
        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;
        ball.style.left = `${posX}%`;
        ball.style.top = `${posY}%`;
        ball.style.background = color;
        ball.style.animationDelay = `${delay}s`;
        ball.style.animationDuration = `${duration}s`;
        
        floatingBalls.appendChild(ball);
    }
}

// 3D Tilt Effect
function initTiltEffect() {
    tiltContainer.addEventListener('mousemove', (e) => {
        const x = e.clientX - tiltContainer.getBoundingClientRect().left;
        const y = e.clientY - tiltContainer.getBoundingClientRect().top;
        
        const centerX = tiltContainer.offsetWidth / 2;
        const centerY = tiltContainer.offsetHeight / 2;
        
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;
        
        tiltContainer.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    });
    
    tiltContainer.addEventListener('mouseleave', () => {
        tiltContainer.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
}

// Background Music Player
function startBackgroundMusic() {
    if (bgMusic1.paused && bgMusic2.paused) {
        bgMusic1.volume = 0.2;
        bgMusic1.play().catch(e => console.log("Autoplay prevented:", e));
        
        bgMusic1.addEventListener('ended', () => {
            bgMusic2.volume = 0.2;
            bgMusic2.play();
        });
        
        bgMusic2.addEventListener('ended', () => {
            bgMusic1.volume = 0.5;
            bgMusic1.play();
        });
    }
}

// Close Welcome Popup
welcomeClose.addEventListener('click', () => {
    welcomePopup.classList.add('hidden');
    tiltContainer.classList.add('visible');
    startBackgroundMusic();
});

// Auto-close popup after 3 seconds
setTimeout(() => {
    welcomePopup.classList.add('hidden');
    tiltContainer.classList.add('visible');
    startBackgroundMusic();
}, 1000);

// Initialize Everything
fetchData();
initFloatingBalls();
initTiltEffect();

// Start music on first click
document.addEventListener('click', startBackgroundMusic, { once: true });