document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const primaryNav = document.querySelector('#primary-navigation');
    
    mobileToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        primaryNav.classList.toggle('active');
    });
    
    // Dropdown functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('a');
        
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                toggle.setAttribute('aria-expanded', dropdown.classList.contains('active'));
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Close mobile menu when clicking a link (for single page applications)
    const navLinks = document.querySelectorAll('.club-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && !this.parentElement.classList.contains('dropdown')) {
                primaryNav.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
});
