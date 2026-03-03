// app.js - Pathway2Pro International Website with Language Support

document.addEventListener('DOMContentLoaded', function() {
    // ==================== //
    // DYNAMIC YEAR UPDATE //
    // ==================== //
    
    function updateCopyrightYear() {
        const currentYear = new Date().getFullYear();
        const copyrightElement = document.querySelector('.footer p');
        
        if (copyrightElement) {
            // Update both English and Spanish translations dynamically
            const baseText = 'Pathway2Pro International Soccer Development. All rights reserved.';
            const baseTextEs = 'Pathway2Pro International Soccer Development. Todos los derechos reservados.';
            
            // Update translations object
            if (window.translations) {
                if (window.translations.en && window.translations.en['footer.copyright']) {
                    window.translations.en['footer.copyright'] = `© ${currentYear} Pathway2Pro International Soccer Development. All rights reserved.`;
                }
                if (window.translations.es && window.translations.es['footer.copyright']) {
                    window.translations.es['footer.copyright'] = `© ${currentYear} Pathway2Pro International Soccer Development. Todos los derechos reservados.`;
                }
            }
            
            // Update displayed text based on current language
            const currentLang = localStorage.getItem('preferredLanguage') || 'en';
            if (currentLang === 'en') {
                copyrightElement.textContent = `© ${currentYear} Pathway2Pro International Soccer Development. All rights reserved.`;
            } else {
                copyrightElement.textContent = `© ${currentYear} Pathway2Pro International Soccer Development. Todos los derechos reservados.`;
            }
        }
    }
    
    // ==================== //
    // LANGUAGE MANAGEMENT //
    // ==================== //
    
    let currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
    
    // Initialize language
    function initLanguage() {
        // Set HTML lang attribute
        document.documentElement.lang = currentLanguage;
        
        // Update toggle button
        updateLanguageToggle();
        
        // Load translations
        updatePageContent();
        
        // Update copyright year after translations load
        updateCopyrightYear();
        
        // Check if we need to restore from URL hash
        const hashLang = window.location.hash.substring(1);
        if (hashLang === 'es' || hashLang === 'en') {
            switchLanguage(hashLang, false);
        }
    }
    
    // Update page content with current language
    function updatePageContent() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            
            if (translations[currentLanguage] && translations[currentLanguage][key]) {
                // For elements that might contain HTML (like <br> tags)
                if (element.tagName === 'P' || element.tagName === 'H1' || 
                    element.tagName === 'H2' || element.tagName === 'H3' || 
                    element.tagName === 'H4' || element.tagName === 'H5' ||
                    element.tagName === 'SPAN' || element.tagName === 'DIV') {
                    
                    // Check if translation contains HTML tags
                    const translation = translations[currentLanguage][key];
                    if (translation.includes('<br>') || translation.includes('<br/>')) {
                        element.innerHTML = translation;
                    } else {
                        element.textContent = translation;
                    }
                } else {
                    element.textContent = translations[currentLanguage][key];
                }
            } else {
                console.warn(`Translation key "${key}" not found for language "${currentLanguage}"`);
            }
        });
        
        // Update copyright year after language change
        updateCopyrightYear();
    }
    
    // Switch language
    function switchLanguage(lang, updateURL = true) {
        if (lang === currentLanguage) return;
        
        currentLanguage = lang;
        localStorage.setItem('preferredLanguage', lang);
        document.documentElement.lang = lang;
        
        // Update toggle button
        updateLanguageToggle();
        
        // Update page content
        updatePageContent();
        
        // Update URL hash without page reload
        if (updateURL) {
            window.location.hash = lang;
        }
        
        // Dispatch custom event for any other components that need to know
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }
    
    // Update language toggle button state
    function updateLanguageToggle() {
        const toggle = document.getElementById('languageToggle');
        if (!toggle) return;
        
        const enOption = toggle.querySelector('[data-lang="en"]');
        const esOption = toggle.querySelector('[data-lang="es"]');
        
        if (enOption && esOption) {
            enOption.classList.toggle('active', currentLanguage === 'en');
            esOption.classList.toggle('active', currentLanguage === 'es');
        }
    }
    
    // Initialize language toggle event
    function initLanguageToggle() {
        const toggle = document.getElementById('languageToggle');
        if (!toggle) return;
        
        // Remove any existing listeners to prevent duplicates
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
        
        // Add click event to new toggle
        newToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const newLang = currentLanguage === 'en' ? 'es' : 'en';
            switchLanguage(newLang);
        });
        
        // Add click events to individual language options for better UX
        const options = newToggle.querySelectorAll('.language-option');
        options.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const lang = this.getAttribute('data-lang');
                if (lang && lang !== currentLanguage) {
                    switchLanguage(lang);
                }
            });
        });
    }
    
    // ==================== //
    // CAROUSEL FUNCTIONALITY //
    // ==================== //
    
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let carouselInterval;

    // Update carousel position
    function updateCarousel() {
        if (carouselTrack) {
            carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        
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

    // Start auto-advance
    function startCarousel() {
        stopCarousel(); // Clear any existing interval
        carouselInterval = setInterval(nextSlide, 5000);
    }

    // Stop auto-advance
    function stopCarousel() {
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
    }

    // Initialize carousel if elements exist
    if (slides.length > 0) {
        // Event listeners for buttons
        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startCarousel(); // Restart timer after manual interaction
            });
            
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startCarousel(); // Restart timer after manual interaction
            });
        }

        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
                startCarousel(); // Restart timer after manual interaction
            });
        });

        // Start auto-advance
        startCarousel();
        
        // Pause on hover
        const carousel = document.querySelector('.carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopCarousel);
            carousel.addEventListener('mouseleave', startCarousel);
        }
    }

    // ==================== //
    // ANIMATIONS //
    // ==================== //
    
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

    // Observe map items
    document.querySelectorAll('.map-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.6s ease ${index * 0.1 + 0.5}s`;
        observer.observe(item);
    });

    // ==================== //
    // CONTACT INTERACTIONS //
    // ==================== //
    
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

    // ==================== //
    // INITIALIZATION //
    // ==================== //
    
    // Initialize everything
    initLanguage();
    initLanguageToggle();
    
    // Reinitialize animations when language changes
    window.addEventListener('languageChanged', () => {
        // Reapply animations to newly translated elements if needed
        setTimeout(() => {
            document.querySelectorAll('.improvement-item, .training-item, .map-item').forEach(item => {
                observer.observe(item);
            });
        }, 100);
    });

    // Console message
    console.log('Pathway2Pro International Soccer Development - Coach Kevin Elias');
    console.log('Global soccer development organization guiding youth players worldwide');
    console.log('Language support: English & Español');
});