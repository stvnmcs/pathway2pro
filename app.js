// Simple JavaScript for Pathway2Pro website

document.addEventListener('DOMContentLoaded', function() {
    // Carousel functionality
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Update carousel position
    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // Event listeners for buttons
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });

    // Auto-advance carousel every 5 seconds
    setInterval(nextSlide, 5000);

    // Simple animation for improvement items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe improvement items
    document.querySelectorAll('.improvement-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Observe training items
    document.querySelectorAll('.training-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.6s ease ${index * 0.1 + 0.3}s`;
        observer.observe(item);
    });

    // Make phone number clickable on mobile
    const phoneElements = document.querySelectorAll('.contact-item p');
    phoneElements.forEach(element => {
        if (element.textContent.includes('(201)')) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', function() {
                window.location.href = 'tel:+12012753665';
            });
        }
    });

    // Make email clickable
    const emailElements = document.querySelectorAll('.contact-item p');
    emailElements.forEach(element => {
        if (element.textContent.includes('@')) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', function() {
                window.location.href = 'mailto:pathway2prosoccer@gmail.com';
            });
        }
    });

    // Simple console log for coaching business
    console.log('Pathway2Pro Soccer Development - Coach Kevin Elias');
    console.log('Personalized coaching for motivated players in NJ & NYC');
});