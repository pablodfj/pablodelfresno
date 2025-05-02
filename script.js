document.addEventListener('DOMContentLoaded', () => {

    const menuToggle = document.getElementById('mobile-menu');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    const header = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]'); // Selecciona todas las secciones con ID

    // --- Toggle Mobile Menu ---
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isActive = mainNav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars', !isActive);
                icon.classList.toggle('fa-times', isActive);
            }
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }

    // --- Cerrar Menú Móvil al hacer clic en un enlace ---
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                document.body.style.overflow = '';
            }
        });
    });

    // --- Smooth Scroll & Active Link Highlighting ---
    // Seleccionar TODOS los links que apuntan a un # (incluyendo los de las tarjetas hero)
    const allScrollLinks = document.querySelectorAll('a[href^="#"]');

    // Función para quitar clase activa de todos los links de NAVEGACIÓN PRINCIPAL
    const removeNavActiveClasses = () => {
        // Selecciona solo los links dentro de la barra de navegación
        document.querySelectorAll('.navbar .nav-link').forEach(navLink => {
            navLink.classList.remove('active');
        });
    };

    allScrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();

                // Cierra el menú móvil si está abierto y el click NO fue en el botón toggle
                if (mainNav.classList.contains('active') && !this.classList.contains('menu-toggle')) {
                    mainNav.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                       icon.classList.remove('fa-times');
                       icon.classList.add('fa-bars');
                    }
                    document.body.style.overflow = '';
                }

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    let elementPosition = targetElement.getBoundingClientRect().top;
                    // Ajuste especial para el link #hero para que no aplique el offset del header
                    let offsetPosition = (targetId === '#hero')
                         ? elementPosition + window.pageYOffset
                         : elementPosition + window.pageYOffset - headerHeight;

                     // Prevenir que el offset sea negativo (iría detrás del header)
                     if (offsetPosition < 0 && targetId !== '#hero') {
                          offsetPosition = 0;
                     }


                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Highlight active link on scroll ---
    const scrollHandler = () => {
        let currentSectionId = null; // Iniciar como null
        const scrollPosition = window.pageYOffset;
        const headerHeight = header ? header.offsetHeight : 0;
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.offsetHeight;

        // Revisar si estamos cerca del final de la página
        const nearBottom = scrollPosition + windowHeight >= documentHeight - 100;

        // Iterar secciones para encontrar la actual
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Margen superior
            const sectionBottom = sectionTop + section.offsetHeight;

            // Condición para ser la sección actual
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                 currentSectionId = section.getAttribute('id');
            }
        });

         // Si no se encontró sección y estamos cerca del final, usar la última
         if (!currentSectionId && nearBottom) {
             const lastSection = sections[sections.length - 1];
             if(lastSection) currentSectionId = lastSection.getAttribute('id');
         }

         // Si estamos muy arriba (antes de la primera sección CON offset), marcar 'hero'
         if (scrollPosition < sections[0].offsetTop - headerHeight - 50 ) {
             currentSectionId = 'hero'; // Marcar 'hero' si estamos arriba
         }

        // Actualizar clases 'active' en los links de navegación
        removeNavActiveClasses(); // Quitar de todos primero
        if (currentSectionId) {
             // Buscar el link correspondiente en la barra de navegación
             const activeNavLink = document.querySelector(`.navbar .nav-link[href="#${currentSectionId}"]`);
             if (activeNavLink) {
                 activeNavLink.classList.add('active');
             }
        }
    };

    window.addEventListener('scroll', scrollHandler);
    // Ejecutar al cargar para estado inicial, asegurando que 'Inicio' esté activo si estamos arriba
    // Esperar un poco puede ayudar si hay imágenes cargando
    setTimeout(scrollHandler, 100);

}); // End DOMContentLoaded