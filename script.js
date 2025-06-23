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
// Function to show visitor details
function showVisitorDetails() {
    const infoElement = document.getElementById('visitorInfo');
    infoElement.innerHTML = '<i class="fas fa-globe"></i> Loading visitor information...';
    
    // Get visitor info
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            // Create visitor info display with icon
            let locationText = '';
            if (data.city && data.country_name) {
                locationText = `${data.city}, ${data.country_name}`;
            } else if (data.country_name) {
                locationText = data.country_name;
            } else {
                locationText = 'Location unknown';
            }
            
            infoElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> Visitor from: ${locationText}`;
            
            // Optional: If you want to add a tiny map visualization
            if (data.latitude && data.longitude) {
                createVisitorMap(data.latitude, data.longitude);
            }
        })
        .catch(error => {
            infoElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> Visitor information unavailable';
            console.error('Error fetching location data:', error);
        });
}

// Optional: Create a small map showing visitor location
function createVisitorMap(lat, lng) {
    // You would need to add a map container to your HTML:
    // <div id="visitorMap"></div>
    
    // If you want to add a map, you could use a static map image:
    const mapContainer = document.createElement('div');
    mapContainer.id = 'visitorMap';
    
    // Create a static map image (using OpenStreetMap)
    const mapImg = document.createElement('img');
    mapImg.src = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=5&size=300x100&markers=${lat},${lng},red`;
    mapImg.alt = "Visitor location map";
    mapImg.style.width = "100%";
    mapImg.style.height = "100%";
    mapImg.style.objectFit = "cover";
    
    mapContainer.appendChild(mapImg);
    document.querySelector('.visitor-stats').appendChild(mapContainer);
}

// Run visitor details when page loads (after the counter)
document.addEventListener('DOMContentLoaded', function() {
    updateViewCount();
    setTimeout(showVisitorDetails, 500); // Slight delay to load counter first
});

// Uncomment this line if you want to show visitor location:
// document.addEventListener('DOMContentLoaded', showVisitorDetails);
