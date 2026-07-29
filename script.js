document.addEventListener('DOMContentLoaded', () => {
    const snapContainer = document.querySelector('.snap-container');
    const zones = document.querySelectorAll('.tour-zone');
    const currentZoneLabel = document.getElementById('current-zone-name');
    const progressFill = document.getElementById('progress-fill');
    const timelineDots = document.querySelectorAll('.timeline-dot');

    // ==========================================
    // 1. GESTION DU MENU BURGER
    // ==========================================
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');

    if (burger && navMenu) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            const icon = burger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Fermer le menu au clic sur un lien
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = burger.querySelector('i');
                if (icon) icon.classList.replace('fa-times', 'fa-bars');
            });
        });

        // Fermer le menu en cliquant hors de la zone
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !burger.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = burger.querySelector('i');
                if (icon) icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // ==========================================
    // 2. SUIVI DE LA PROGRESSION & FLOU DYNAMIQUE
    // ==========================================
    function updateProgress() {
        if (!snapContainer) return;
        
        const scrollTop = snapContainer.scrollTop;
        const totalZones = zones.length;

        zones.forEach((zone, index) => {
            const top = zone.offsetTop - 150;
            const height = zone.offsetHeight;

            if (scrollTop >= top && scrollTop < top + height) {
                
                // GESTION DU FOND : Net sur l'Accueil (index 0), Flouté sur le reste (index > 0)
                if (index === 0) {
                    document.body.classList.remove('is-blurred');
                } else {
                    document.body.classList.add('is-blurred');
                }

                // Mettre à jour le texte du tracker supérieur
                const zoneName = zone.getAttribute('data-zone');
                if (currentZoneLabel) {
                    currentZoneLabel.textContent = zoneName;
                }

                // Mettre à jour la barre de progression
                const progressPercent = ((index + 1) / totalZones) * 100;
                if (progressFill) {
                    progressFill.style.width = `${progressPercent}%`;
                }

                // Mettre à jour la timeline latérale
                timelineDots.forEach((dot, dotIndex) => {
                    dot.classList.remove('active', 'completed');
                    if (dotIndex === index) {
                        dot.classList.add('active');
                    } else if (dotIndex < index) {
                        dot.classList.add('completed');
                    }
                });

                // Déclencher les animations d'apparition
                const reveals = zone.querySelectorAll('.reveal');
                reveals.forEach(r => r.classList.add('active'));
            }
        });
    }

    // Déclenchement du suivi lors du défilement
    if (snapContainer) {
        snapContainer.addEventListener('scroll', updateProgress);
        updateProgress(); // Exécution initiale
    }

    // ==========================================
    // 3. EFFET TILT 3D SUR SURVOL DES CARTES
    // ==========================================
    const cards3D = document.querySelectorAll('.tilt-effect');
    cards3D.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    });
});