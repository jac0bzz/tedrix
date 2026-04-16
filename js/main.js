// ================= PANTALLA DE CARGA (PRELOADER) =================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 500); // Suaviza la desaparición
    }
});

document.addEventListener('DOMContentLoaded', () => {
    
    // ================= 1. MENÚ MÓVIL (HAMBURGUESA) =================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    
    function toggleMenu() {
        if(!navLinks || !hamburger) return;
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fa-solid fa-xmark"></i>' 
            : '<i class="fa-solid fa-bars"></i>';
    }

    if(hamburger) hamburger.addEventListener('click', toggleMenu);
    
    // Cerrar al hacer clic en un enlace (en móvil)
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if(navLinks && navLinks.classList.contains('active')) toggleMenu();
        });
    });

    // ================= 2. SCROLL REVEAL (Aparición suave) =================
    const initObserver = () => {
        const fadeElements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Solo se anima una vez
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        fadeElements.forEach(el => observer.observe(el));
    };

    // ================= 3. EFECTOS MÁGNETICOS Y 3D TILT =================
    // Lo guardamos en window. para que store.js pueda llamarlo al inyectar productos
    window.initGlowingEffects = function() {
        
        // --- Capa 1: Brillo Global del Fondo ---
        const globalGlow = document.querySelector('.global-background-glow');
        if(globalGlow) {
            document.addEventListener('mousemove', e => {
                globalGlow.style.setProperty('--mouse-x', `${e.clientX}px`);
                globalGlow.style.setProperty('--mouse-y', `${e.clientY}px`);
            });
        }

        // --- Capa 2: Efecto 3D Tilt y Brillo Interno en Tarjetas ---
        const cards = document.querySelectorAll('.magnetic-card');
        
        cards.forEach(card => {
            // Evitar duplicar listeners si se ejecuta varias veces
            if(card.dataset.magneticInit) return;
            card.dataset.magneticInit = true;

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Mueve el foco de luz
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                // Efecto 3D Tilt (Inclinación suave)
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5; // Max 5 grados
                const rotateY = ((x - centerX) / centerX) * 5;  // Max 5 grados
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            // Resetea el 3D y el brillo al quitar el mouse
            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--mouse-x', `-1000px`);
                card.style.setProperty('--mouse-y', `-1000px`);
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    };

    // Ejecutar inicializadores
    setTimeout(() => {
        initObserver();
        window.initGlowingEffects();
    }, 100);
});