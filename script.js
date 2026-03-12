document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Cache navbar reference early (used by scroll effect + mobile menu)
    const navbar = document.querySelector('#navbar');

    // --- CYBERNETIC SCANNER ANIMATION ---
    const hudOverlay = document.querySelector('#hud-overlay');
    const hudVignette = document.querySelector('#hud-vignette');
    const hudScanningLine = document.querySelector('.hud-scanning-line');
    const hudCorners = document.querySelectorAll('.hud-corner');
    const hudReadout = document.querySelector('.hud-readout');
    const mainContent = document.querySelector('#main-content');

    // Initial state for animation
    gsap.set(mainContent, { opacity: 0, filter: 'blur(10px) brightness(0.5)' });
    gsap.set(hudOverlay, { opacity: 1, visibility: 'visible' });
    gsap.set(hudVignette, { opacity: 1 });
    gsap.set(hudCorners, { scale: 1.2, opacity: 0 });
    gsap.set(hudReadout, { x: 20, opacity: 0 });

    const tl = gsap.timeline({
        onComplete: () => {
            hudOverlay.classList.remove('hud-active');
            gsap.set(hudOverlay, { display: 'none' });
            gsap.set(hudVignette, { display: 'none' });
        }
    });

    tl.to(hudCorners, { opacity: 0.5, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" })
      .to(hudReadout, { opacity: 1, x: 0, duration: 0.4 }, "-=0.2")
      .to(hudScanningLine, { opacity: 1, duration: 0.1 })
      .to(hudScanningLine, { top: '100%', duration: 1.5, ease: "power2.inOut" })
      .to(mainContent, { 
          opacity: 1, 
          filter: 'blur(0px) brightness(1)', 
          duration: 1.2, 
          ease: "power3.out" 
      }, "-=1.0")
      .to(hudVignette, { opacity: 0, duration: 1 }, "-=0.5")
      .to(hudOverlay, { opacity: 0, duration: 0.5 });

    // Navbar and Hero elements should start invisible and be handled by the timeline or set immediately
    gsap.set('#navbar', { y: -100, opacity: 0 });
    gsap.set('.hero-title, .hero-subtitle, .hero-desc', { opacity: 0, y: 30 });
    
    tl.to('#navbar', { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5")
      .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .to('.hero-title', { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
      .to('.hero-desc', { opacity: 1, y: 0, duration: 0.5 }, "-=0.1");

    // --- TERMINAL TYPEWRITER EFFECT ---
    function terminalTypewriter(element, finalString, duration = 800) {
        if (!element) return;
        let i = 0;
        element.innerText = "_";
        clearInterval(element.terminalInterval);
        element.terminalInterval = setInterval(() => {
            element.innerText = finalString.substring(0, i) + "_";
            i++;
            if (i > finalString.length) {
                element.innerText = finalString;
                clearInterval(element.terminalInterval);
            }
        }, duration / Math.max(finalString.length, 1));
    }

    // --- SCROLL ANIMATIONS ---
    function initScrollAnimations() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const headerTitle = section.querySelector('.section-title');
            const headerExtras = section.querySelectorAll('.section-num, .section-line');
            const contentElements = section.querySelectorAll('.about-text, .skills-wrapper, .expertise-grid, .credentials-grid, .contact-box');
            
            if (headerTitle) {
                const originalText = headerTitle.innerText;
                ScrollTrigger.create({
                    trigger: headerTitle,
                    start: "top 95%",
                    onEnter: () => {
                        terminalTypewriter(headerTitle, originalText);
                        gsap.to(headerExtras, { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 });
                    },
                    onLeaveBack: () => { 
                        headerTitle.innerText = "";
                        gsap.to(headerExtras, { opacity: 0, x: -20, duration: 0.3 });
                    },
                    toggleActions: "play none none reverse"
                });
                // Initial hide for extras
                gsap.set(headerExtras, { opacity: 0, x: -20 });
            }

            if (contentElements.length > 0) {
                gsap.from(contentElements, {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    clipPath: "inset(0 0 100% 0)",
                    filter: "brightness(2) contrast(1.2)",
                    y: 40,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power2.out"
                });
            }
        });

        ScrollTrigger.refresh();
    }

    // Start scroll engine immediately
    initScrollAnimations();

    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".credential-card"), {
            max: 5, speed: 400, glare: true, "max-glare": 0.2
        });
    }

    // --- NAVIGATION SCROLL EFFECT ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });

    // --- CUSTOM CURSOR ---
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorOutline = document.querySelector('.custom-cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            gsap.to(cursorDot, { x: posX, y: posY, duration: 0 });
            gsap.to(cursorOutline, { x: posX, y: posY, duration: 0.15 });
        });

        const interactiveElements = document.querySelectorAll('a, button, .skill-chip, .credential-card, .social-link');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursorOutline, { 
                    scale: 1.8, 
                    backgroundColor: 'rgba(56, 189, 248, 0.05)', 
                    borderColor: 'rgba(56, 189, 248, 0.4)', 
                    duration: 0.3 
                });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursorOutline, { 
                    scale: 1, 
                    backgroundColor: 'transparent', 
                    borderColor: '#818cf8', 
                    duration: 0.3 
                });
            });
        });
    }

    // --- MOBILE MENU ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navLinksList = document.querySelector('.nav-links');

    if (navToggle && navbar) {
        navToggle.addEventListener('click', () => {
            navbar.classList.toggle('nav-active');
        });

        // Close menu when link is clicked
        navLinksList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('nav-active');
            });
        });
    }

    // Smooth Scroll
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (document.querySelector(targetId)) {
                gsap.to(window, { duration: 1.5, scrollTo: targetId, ease: "power4.inOut" });
            }
        });
    });
});


