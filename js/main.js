document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Menú Móvil Smooth
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    
    function toggleMenu() {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fa-solid fa-xmark"></i>' 
            : '<i class="fa-solid fa-bars"></i>';
    }

    hamburger.addEventListener('click', toggleMenu);
    
    // Cerrar al hacer clic en un enlace
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if(navLinks.classList.contains('active')) toggleMenu();
        });
    });

    // 2. Animaciones Fade-In (Intersection Observer)
    const initObserver = () => {
        const fadeElements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        fadeElements.forEach(el => observer.observe(el));
    };

    // 3. Efectos de Brillo Magnético (Cards y Fondo Global)
    const initGlowingEffects = () => {
        
        // --- Capa 1: Brillo Global del Fondo ---
        const globalGlow = document.querySelector('.global-background-glow');
        
        if(globalGlow) {
            document.addEventListener('mousemove', e => {
                globalGlow.style.setProperty('--mouse-x', `${e.clientX}px`);
                globalGlow.style.setProperty('--mouse-y', `${e.clientY}px`);
            });
        }

        // --- Capa 2: Brillo Fuerte en Tarjetas Individuales ---
        const cards = document.querySelectorAll('.magnetic-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    };

    // Ejecutar inicializadores (damos un pequeño timeout para que DOM inyectado termine)
    setTimeout(() => {
        initObserver();
        initGlowingEffects();
    }, 100);
});