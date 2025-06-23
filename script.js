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

// Page view counter
function updateViewCount() {
    let count = localStorage.getItem('pageViews') || 0;
    count = parseInt(count) + 1;
    localStorage.setItem('pageViews', count);
    document.getElementById('viewCount').textContent = count;
}

// Update view count when page loads
document.addEventListener('DOMContentLoaded', updateViewCount); 

// Uncomment this line if you want to show visitor location:
// document.addEventListener('DOMContentLoaded', showVisitorDetails);
