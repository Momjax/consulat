
// Modern JavaScript for Consulat d'Algérie à Nice

class ConsulateWebsite {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initSlider();
            this.initNavigation();
            this.initScrollEffects();
            this.initAnimations();
            this.initForms();
            this.initTicker();
            this.initPopup();
            this.initBackToTop();
            console.log('🇩🇿 Site du Consulat d\'Algérie à Nice initialisé avec succès');
        });
    }

    // Slider Hero moderne
    initSlider() {
        this.slides = document.querySelectorAll('.slide');
        const nextBtn = document.querySelector('.next-btn');
        const prevBtn = document.querySelector('.prev-btn');
        const dotsContainer = document.querySelector('.slider-dots');

        if (!this.slides.length) return;

        // Créer les dots
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer?.appendChild(dot);
        });

        // Event listeners
        nextBtn?.addEventListener('click', () => this.nextSlide());
        prevBtn?.addEventListener('click', () => this.prevSlide());

        // Auto-slide
        setInterval(() => this.nextSlide(), 6000);

        // Touch/swipe support
        this.initTouch();
    }

    goToSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        this.currentSlide = index;
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(this.currentSlide);
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(this.currentSlide);
    }

    initTouch() {
        const slider = document.querySelector('.hero-slider');
        if (!slider) return;

        let startX = 0;
        let endX = 0;

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }

    // Navigation moderne
    initNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navbar = document.getElementById('navbar');

        // Mobile menu toggle
        navToggle?.addEventListener('click', () => {
            navMenu?.classList.toggle('active');
            this.animateToggle(navToggle);
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar scroll effect
        let lastScrollY = 0;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 300) {
                navbar?.style.setProperty('transform', 'translateY(-100%)');
            } else {
                navbar?.style.setProperty('transform', 'translateY(0)');
            }

            lastScrollY = currentScrollY;
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-content')) {
                navMenu?.classList.remove('active');
            }
        });
    }

    animateToggle(toggle) {
        const spans = toggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.transform = toggle.classList.contains('active') 
                ? `rotate(${index === 0 ? '45deg' : index === 1 ? '0deg' : '-45deg'})` 
                : 'rotate(0deg)';
        });
        toggle.classList.toggle('active');
    }

    // Effets de scroll et révélation
    initScrollEffects() {
        // Intersection Observer pour les animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        // Observer tous les éléments à révéler
        document.querySelectorAll('.service-card, .news-card, .announcement-item').forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }

    // Animations dynamiques
    initAnimations() {
        // Counter animation for statistics
        const animateCounters = () => {
            const counters = document.querySelectorAll('[data-count]');
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.count);
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current);
                }, 16);
            });
        };

        // Parallax effect
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // Hover effects
        document.querySelectorAll('.service-card, .news-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Gestion des formulaires
    initForms() {
        const forms = document.querySelectorAll('.modern-form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });

            // Validation en temps réel
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Remove existing error
        this.clearFieldError(field);

        // Validation rules
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'Ce champ est requis';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            message = 'Adresse email invalide';
        }

        if (!isValid) {
            this.showFieldError(field, message);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async handleFormSubmit(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Validation
        const inputs = form.querySelectorAll('input, textarea, select');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
            return;
        }

        // Loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('Message envoyé avec succès!', 'success');
            form.reset();
        } catch (error) {
            this.showNotification('Erreur lors de l\'envoi. Réessayez plus tard.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    // Ticker des actualités
    initTicker() {
        const tickerContent = document.querySelector('.ticker-content');
        if (!tickerContent) return;

        // Pause on hover
        tickerContent.addEventListener('mouseenter', () => {
            tickerContent.style.animationPlayState = 'paused';
        });

        tickerContent.addEventListener('mouseleave', () => {
            tickerContent.style.animationPlayState = 'running';
        });
    }

    // Popup d'information
    initPopup() {
        // Show info popup after 3 seconds
        setTimeout(() => this.showInfoPopup(), 3000);
    }

    showInfoPopup() {
        if (sessionStorage.getItem('popup-shown')) return;

        const popup = this.createPopup();
        const overlay = this.createOverlay();

        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        // Animation d'entrée
        setTimeout(() => {
            popup.classList.add('visible');
            overlay.classList.add('visible');
        }, 100);

        // Auto-close après 15 secondes
        setTimeout(() => {
            this.closePopup(popup, overlay);
        }, 15000);

        sessionStorage.setItem('popup-shown', 'true');
    }

    createPopup() {
        const popup = document.createElement('div');
        popup.className = 'info-popup';
        popup.innerHTML = `
            <div class="popup-header">
                <h3><i class="fas fa-info-circle"></i> Information Important</h3>
                <button class="popup-close">&times;</button>
            </div>
            <div class="popup-content">
                <p>Il est porté à la connaissance du public que toutes les prestations consulaires seront assurées désormais <strong>sur rendez-vous</strong>.</p>
                <p class="popup-exception">
                    <i class="fas fa-exclamation-triangle"></i>
                    Sauf pour les visas pour motif familial
                </p>
                <div class="popup-actions">
                    <a href="#contact" class="btn btn-primary">Prendre RDV</a>
                    <button class="btn btn-outline popup-dismiss">Plus tard</button>
                </div>
            </div>
        `;

        // Event listeners
        popup.querySelector('.popup-close').addEventListener('click', () => {
            this.closePopup(popup, document.querySelector('.popup-overlay'));
        });

        popup.querySelector('.popup-dismiss').addEventListener('click', () => {
            this.closePopup(popup, document.querySelector('.popup-overlay'));
        });

        return popup;
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.addEventListener('click', () => {
            this.closePopup(document.querySelector('.info-popup'), overlay);
        });
        return overlay;
    }

    closePopup(popup, overlay) {
        if (!popup || !overlay) return;
        
        popup.classList.remove('visible');
        overlay.classList.remove('visible');
        
        setTimeout(() => {
            try {
                if (popup && document.body.contains(popup)) {
                    document.body.removeChild(popup);
                }
                if (overlay && document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
            } catch (error) {
                console.warn('Erreur lors de la suppression du popup:', error);
            }
        }, 300);
    }

    // Bouton retour en haut
    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Système de notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Animation d'entrée
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto-remove
        setTimeout(() => this.removeNotification(notification), 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            try {
                if (notification && document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            } catch (error) {
                console.warn('Erreur lors de la suppression de la notification:', error);
            }
        }, 300);
    }

    // Recherche en temps réel
    initSearch() {
        const searchInput = document.querySelector('#search-input');
        if (!searchInput) return;

        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    this.performSearch(query);
                }, 300);
            }
        });
    }

    performSearch(query) {
        // Simulation de recherche
        console.log('Recherche pour:', query);
        // Ici on pourrait implémenter une vraie recherche
    }
}

// Styles CSS additionnels injectés
const additionalStyles = `
    /* Popup styles */
    .info-popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.7);
        background: white;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        z-index: 10001;
        max-width: 500px;
        width: 90%;
        opacity: 0;
        transition: all 0.3s ease;
    }

    .info-popup.visible {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }

    .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(5px);
    }

    .popup-overlay.visible {
        opacity: 1;
    }

    .popup-header {
        background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
        color: white;
        padding: 1.5rem;
        border-radius: 15px 15px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .popup-header h3 {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .popup-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;
    }

    .popup-close:hover {
        background: rgba(255,255,255,0.2);
    }

    .popup-content {
        padding: 2rem;
    }

    .popup-exception {
        background: var(--warning);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .popup-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
    }

    /* Notifications */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10002;
        min-width: 300px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        border-left: 4px solid var(--primary-color);
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left-color: var(--success);
    }

    .notification-error {
        border-left-color: var(--danger);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
    }

    .notification-close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: var(--gray-600);
    }

    /* Form errors */
    .field-error {
        color: var(--danger);
        font-size: 0.8rem;
        margin-top: 0.25rem;
    }

    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
        border-color: var(--danger);
    }

    /* Navigation scrolled state */
    .navbar.scrolled {
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(10px);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the website
new ConsulateWebsite();
