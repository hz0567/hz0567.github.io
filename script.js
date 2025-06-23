// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 80, // Offset for fixed header
            behavior: 'smooth'
        });
    });
});

// Add active class to navigation items on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('nav a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// IP-based view counter using CountAPI
function updateViewCount() {
    // First, check if this IP has been recorded for this session
    const sessionKey = 'visitRecorded';
    if (sessionStorage.getItem(sessionKey)) {
        // Already counted this visit in this session, just display the count
        getLatestCount();
        return;
    }
    
    // Mark this session as counted
    sessionStorage.setItem(sessionKey, 'true');
    
    // Define namespace and key for CountAPI
    const namespace = 'hongzhengyang'; // Use your name as namespace
    const key = 'website-visits';
    
    // Increment the counter and update the display
    fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('viewCount').textContent = data.value;
        })
        .catch(error => {
            console.error('Error updating view count:', error);
            // Fallback to getting the current count without incrementing
            getLatestCount();
        });
}

// Get the latest count without incrementing (for repeat visitors in same session)
function getLatestCount() {
    const namespace = 'hongzhengyang';
    const key = 'website-visits';
    
    fetch(`https://api.countapi.xyz/get/${namespace}/${key}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('viewCount').textContent = data.value || 0;
        })
        .catch(error => {
            console.error('Error fetching view count:', error);
            document.getElementById('viewCount').textContent = '?';
        });
}

// Run view counter when page loads
document.addEventListener('DOMContentLoaded', updateViewCount);

// Optional: Display viewer location data 
function showVisitorDetails() {
    // Create an element to display IP info if you want to show it
    const infoElement = document.createElement('div');
    infoElement.className = 'visitor-info';
    infoElement.style.fontSize = '0.8rem';
    infoElement.style.marginTop = '5px';
    infoElement.textContent = 'Loading visitor information...';
    
    // Insert after view counter
    const viewCounter = document.querySelector('.view-counter');
    viewCounter.appendChild(infoElement);
    
    // Get visitor info using a free IP API
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            infoElement.textContent = `Visitor from: ${data.city || ''}, ${data.country_name || ''}`;
        })
        .catch(error => {
            infoElement.textContent = 'Visitor information unavailable';
            console.error('Error fetching location data:', error);
        });
}

// Uncomment this line if you want to show visitor location:
// document.addEventListener('DOMContentLoaded', showVisitorDetails);
