document.addEventListener('DOMContentLoaded', function() {
    // Category Carousel Navigation
    const categoryCards = document.querySelectorAll('.category-card');
    const categoryCarousel = document.querySelector('.category-carousel');
    const carouselPrev = document.querySelector('.carousel-prev');
    const carouselNext = document.querySelector('.carousel-next');
    const currentCategoryTitle = document.getElementById('current-category');
    
    // Project Grids
    const projectGrids = {
        'business': document.getElementById('business-projects'),
        'marketing': document.getElementById('marketing-projects'),
        'money': document.getElementById('money-projects'),
        'leadership': document.getElementById('leadership-projects'),
        'digital': document.getElementById('digital-projects')
    };
    
    const categoryTitles = {
        'business': 'Mini Business Creation Projects',
        'marketing': 'Marketing & Branding Projects',
        'money': 'Money & Business Management Projects',
        'leadership': 'Collaboration & Leadership Projects',
        'digital': 'Digital and Online Mini Projects'
    };
    
    // Initialize first category as active
    let currentCategory = 'business';
    
    // Category click handler
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active card
            categoryCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Update projects display
            showProjects(category);
        });
    });
    
    // Carousel navigation
    carouselPrev.addEventListener('click', scrollCarousel.bind(null, -1));
    carouselNext.addEventListener('click', scrollCarousel.bind(null, 1));
    
    // Testimonial Carousel
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialDots = document.querySelectorAll('.dot');
    const testimonialPrev = document.querySelector('.testimonial-prev');
    const testimonialNext = document.querySelector('.testimonial-next');
    let currentTestimonial = 0;
    
    // Initialize testimonials
    showTestimonial(currentTestimonial);
    
    // Testimonial navigation
    testimonialPrev.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    });
    
    testimonialNext.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    });
    
    // Dot navigation
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
        });
    });
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Functions
    function showProjects(category) {
        // Hide all project grids
        Object.values(projectGrids).forEach(grid => {
            if (grid) grid.classList.add('hidden');
        });
        
        // Show selected grid
        if (projectGrids[category]) {
            projectGrids[category].classList.remove('hidden');
        }
        
        // Update category title
        currentCategoryTitle.textContent = categoryTitles[category] || 'Projects';
        currentCategory = category;
    }
    
    function scrollCarousel(direction) {
        const scrollAmount = 270; // Width of card + gap
        categoryCarousel.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        testimonialDots.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        testimonialDots[index].classList.add('active');
    }
});
