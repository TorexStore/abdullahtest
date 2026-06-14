/**
 * Velocity Motors Web Application Logic
 * Premium Interactivity, Animations, and Visual States
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. PRELOADER
    // ==========================================================================
    const preloader = document.getElementById('preloader');
    
    // Hide preloader when everything is fully loaded
    window.addEventListener('load', () => {
        // Add a slight delay for aesthetic smoothness
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 1500);
    });

    // Fallback if window load takes too long
    setTimeout(() => {
        if (!preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
        }
    }, 4000);


    // ==========================================================================
    // 2. THEME TOGGLE (DARK / LIGHT MODE)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const body = document.body;

    // Load theme from LocalStorage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeIcon.className = 'fas fa-sun';
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-moon';
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            // Switch to Light
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to Dark
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    });


    // ==========================================================================
    // 3. STICKY NAVBAR & SCROLL SPY
    // ==========================================================================
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Sticky Header Scroll Event
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Scroll Spy logic to highlight active link
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // Offset for sticky header height
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // ==========================================================================
    // 4. MOBILE NAVIGATION MENU
    // ==========================================================================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('open');
            navMenu.classList.remove('open');
        }
    });


    // ==========================================================================
    // 5. HERO SLIDER / CAROUSEL
    // ==========================================================================
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 6000; // Auto scroll every 6 seconds

    function showSlide(index) {
        // Reset active classes
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Handle index boundaries
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // Activate new slide & dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startSlideShow() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    // Slider Event Listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        startSlideShow(); // Reset interval timer
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        startSlideShow(); // Reset interval timer
    });

    // Dot navigation
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            startSlideShow();
        });
    });

    // Initialize Hero Slider
    startSlideShow();


    // ==========================================================================
    // 6. STATISTICS COUNTER ANIMATION (ON VIEWPORT ENTRY)
    // ==========================================================================
    const statsSection = document.getElementById('stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function startCounting() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds animation duration
            const increment = target / (duration / 16); // 16ms per frame (~60fps)
            let current = 0;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    // Format output numbers for readability (e.g. 12,500)
                    stat.innerText = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCount);
                } else {
                    stat.innerText = target.toLocaleString();
                }
            };
            updateCount();
        });
    }

    // Intersection Observer to run stats when scrolled into view
    const observerOptions = {
        root: null,
        threshold: 0.3 // Trigger when 30% visible
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                startCounting();
                animated = true;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (statsSection) {
        statsObserver.observe(statsSection);
    }


    // ==========================================================================
    // 7. LIGHTBOX GALLERY
    // ==========================================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let activeGalleryIndex = 0;
    const galleryImages = [];

    // Populate gallery data array from HTML
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.gallery-img');
        const caption = item.querySelector('.gallery-caption').innerText;
        galleryImages.push({
            src: img.src,
            caption: caption
        });

        // Open Lightbox on Click
        item.addEventListener('click', () => {
            activeGalleryIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        lightboxImg.src = galleryImages[activeGalleryIndex].src;
        lightboxCaption.innerText = galleryImages[activeGalleryIndex].caption;
        lightbox.classList.add('active');
        body.style.overflow = 'hidden'; // Stop page scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        body.style.overflow = ''; // Resume page scrolling
    }

    function navigateLightbox(direction) {
        if (direction === 'next') {
            activeGalleryIndex = (activeGalleryIndex + 1) % galleryImages.length;
        } else {
            activeGalleryIndex = (activeGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
        }
        
        // Transition images smoothly
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            lightboxImg.src = galleryImages[activeGalleryIndex].src;
            lightboxCaption.innerText = galleryImages[activeGalleryIndex].caption;
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        }, 200);
    }

    // Lightbox Event Listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', () => navigateLightbox('next'));
    lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));

    // Close on clicking overlay background
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard Navigation for Lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateLightbox('next');
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
    });


    // ==========================================================================
    // 8. TESTIMONIALS SLIDER
    // ==========================================================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testDots = document.querySelectorAll('.test-dot');
    const testPrevBtn = document.getElementById('test-prev');
    const testNextBtn = document.getElementById('test-next');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        testDots.forEach(dot => dot.classList.remove('active'));

        if (index >= testimonialCards.length) currentTestimonial = 0;
        else if (index < 0) currentTestimonial = testimonialCards.length - 1;
        else currentTestimonial = index;

        testimonialCards[currentTestimonial].classList.add('active');
        testDots[currentTestimonial].classList.add('active');
    }

    testNextBtn.addEventListener('click', () => {
        showTestimonial(currentTestimonial + 1);
    });

    testPrevBtn.addEventListener('click', () => {
        showTestimonial(currentTestimonial - 1);
    });

    testDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });


    // ==========================================================================
    // 9. CONTACT FORM VALIDATION & TOAST
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formName = document.getElementById('form-name');
    const formEmail = document.getElementById('form-email');
    const formMessage = document.getElementById('form-message');
    const toast = document.getElementById('toast');

    // Email verification regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateField(input, condition, errorElId) {
        const formGroup = input.parentElement;
        const errorEl = document.getElementById(errorElId);

        if (condition) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
            return true;
        } else {
            formGroup.classList.remove('success');
            formGroup.classList.add('error');
            return false;
        }
    }

    // Real-time input validation on keystroke/blur
    formName.addEventListener('input', () => {
        validateField(formName, formName.value.trim().length >= 2, 'name-error');
    });

    formEmail.addEventListener('input', () => {
        validateField(formEmail, emailRegex.test(formEmail.value.trim()), 'email-error');
    });

    formMessage.addEventListener('input', () => {
        validateField(formMessage, formMessage.value.trim().length >= 10, 'message-error');
    });

    // Form submission validation
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateField(formName, formName.value.trim().length >= 2, 'name-error');
        const isEmailValid = validateField(formEmail, emailRegex.test(formEmail.value.trim()), 'email-error');
        const isMsgValid = validateField(formMessage, formMessage.value.trim().length >= 10, 'message-error');

        if (isNameValid && isEmailValid && isMsgValid) {
            // Trigger success message animation
            showToast();
            contactForm.reset();
            
            // Clean up visual status styling
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('success');
            });
        }
    });

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
});

// ==========================================================================
// 10. VEHICLE DETAILS MODAL (DYNAMIC DATA LOAD)
// ==========================================================================
const vehicleData = {
    aero: {
        title: "Velocity Aero",
        tag: "Electric Hypercar",
        price: "$2,400,000",
        image: "assets/car-aero.png",
        desc: "The Velocity Aero represents the pinnacle of electric propulsion. Built using advanced lightweight carbon composites, its quad-motor drivetrain generates torque-vectored response, delivering instant power and track dynamics.",
        powertrain: "Quad-Motor Electric EV",
        hp: "2000 HP",
        accel: "1.8s (0-60 mph)",
        speed: "258 mph / 415 km/h"
    },
    stealth: {
        title: "Velocity Stealth",
        tag: "V8 Hybrid Supercar",
        price: "$1,850,000",
        image: "assets/car-stealth.png",
        desc: "Cloaked in a hand-polished matte black finish, the Velocity Stealth integrates a twin-turbo V8 engine with two front-axle electric motors. The result is a hybrid marvel built to blend mechanical aggression with electric response.",
        powertrain: "Twin-Turbo 4.0L V8 Hybrid",
        hp: "1200 HP",
        accel: "2.2s (0-60 mph)",
        speed: "217 mph / 350 km/h"
    },
    chronos: {
        title: "Velocity Chronos",
        tag: "Luxury Grand Tourer",
        price: "$420,000",
        image: "assets/car-chronos.png",
        desc: "Designed for transcontinental touring. The Velocity Chronos features an handcrafted cabin wrapped in fine leather and matte aluminum details. Powered by a twin-turbo V6, it glides across highways with effortless performance.",
        powertrain: "3.5L Twin-Turbo V6",
        hp: "650 HP",
        accel: "3.1s (0-60 mph)",
        speed: "198 mph / 318 km/h"
    },
    electra: {
        title: "Velocity Electra",
        tag: "Autonomous Luxury EV Sedan",
        price: "$145,000",
        image: "assets/car-electra.png",
        desc: "The Velocity Electra offers premium luxury transit. With solid-state cell technology, a glass solar roof, and level 4 self-driving intelligence, it represents the absolute vanguard of executive daily commuting.",
        powertrain: "Dual-Motor Electric AWD",
        hp: "580 HP",
        accel: "2.9s (0-60 mph)",
        speed: "155 mph / 250 km/h"
    },
    apex: {
        title: "Velocity Apex",
        tag: "Track Only Coupe",
        price: "$380,000",
        image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80",
        desc: "Intended strictly for track enthusiasts. The Velocity Apex features a fully stripped cabin, full integrated roll-cage, manual adjustable racing dampers, and a high-revving naturally aspirated engine that sings up to 9,000 RPM.",
        powertrain: "4.2L Naturally Aspirated Flat-6",
        hp: "520 HP",
        accel: "3.4s (0-60 mph)",
        speed: "185 mph / 298 km/h"
    },
    horizon: {
        title: "Velocity Horizon",
        tag: "Premium Electric SUV",
        price: "$160,000",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
        desc: "The Velocity Horizon answers the call for premium off-road performance. It matches a high-capacity electric battery with dual-motor torque, giving drivers maximum towing capability and customizable air suspension for any terrain.",
        powertrain: "Dual-Motor Electric SUV AWD",
        hp: "670 HP",
        accel: "3.6s (0-60 mph)",
        speed: "160 mph / 257 km/h"
    }
};

const modal = document.getElementById('details-modal');
const modalClose = document.getElementById('modal-close');
const modalCarImg = document.getElementById('modal-car-img');
const modalCarTag = document.getElementById('modal-car-tag');
const modalCarTitle = document.getElementById('modal-car-title');
const modalCarPrice = document.getElementById('modal-car-price');
const modalCarDesc = document.getElementById('modal-car-desc');
const modalSpecPowertrain = document.getElementById('modal-spec-powertrain');
const modalSpecHp = document.getElementById('modal-spec-hp');
const modalSpecAccel = document.getElementById('modal-spec-accel');
const modalSpecSpeed = document.getElementById('modal-spec-speed');

function openDetails(carId) {
    const data = vehicleData[carId];
    if (!data) return;

    // Load data dynamically
    modalCarImg.src = data.image;
    modalCarImg.alt = data.title;
    modalCarTag.innerText = data.tag;
    modalCarTitle.innerText = data.title;
    modalCarPrice.innerText = data.price;
    modalCarDesc.innerText = data.desc;
    modalSpecPowertrain.innerText = data.powertrain;
    modalSpecHp.innerText = data.hp;
    modalSpecAccel.innerText = data.accel;
    modalSpecSpeed.innerText = data.speed;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable scroll
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Enable scroll
}

function closeModalAndContact() {
    closeModal();
    // Pre-populate contact subject dropdown based on selected car
    const formSubject = document.getElementById('form-subject');
    const modalTitleText = modalCarTitle.innerText.toLowerCase();
    
    if (modalTitleText.includes('aero')) formSubject.value = 'aero';
    else if (modalTitleText.includes('stealth')) formSubject.value = 'stealth';
    else if (modalTitleText.includes('chronos')) formSubject.value = 'chronos';
    else formSubject.value = 'general';
}

// Modal closing event handlers
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});
