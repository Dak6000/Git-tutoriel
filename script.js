// Initialisation du site
document.addEventListener('DOMContentLoaded', function() {
    // ===== NAVIGATION =====
    const navLinks = document.querySelectorAll('.nav-link');
    const progressLinks = document.querySelectorAll('.progress-step');
    
    // Navigation principale
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Retirer la classe active de tous les liens
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            progressLinks.forEach(progressLink => progressLink.classList.remove('active'));
            
            // Ajouter la classe active au lien cliqué
            this.classList.add('active');
            
            // Trouver le lien correspondant dans la progression
            const targetId = this.getAttribute('href');
            const correspondingProgress = document.querySelector(`.progress-step[href="${targetId}"]`);
            if (correspondingProgress) {
                correspondingProgress.classList.add('active');
            }
            
            // Scroll vers la section
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 120,
                    behavior: 'smooth'
                });
            }
            
            // Fermer le menu mobile si ouvert
            if (window.innerWidth <= 768) {
                const navToggle = document.getElementById('navToggle');
                if (navToggle) {
                    navToggle.classList.remove('active');
                    const navLinksContainer = document.querySelector('.nav-links');
                    if (navLinksContainer) {
                        navLinksContainer.style.display = 'none';
                    }
                }
            }
        });
    });
    
    // Navigation de progression
    progressLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Retirer la classe active de tous les liens
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            progressLinks.forEach(progressLink => progressLink.classList.remove('active'));
            
            // Ajouter la classe active au lien cliqué
            this.classList.add('active');
            
            // Trouver le lien correspondant dans la navigation principale
            const targetId = this.getAttribute('href');
            const correspondingNav = document.querySelector(`.nav-link[href="${targetId}"]`);
            if (correspondingNav) {
                correspondingNav.classList.add('active');
            }
            
            // Scroll vers la section
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 120,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== BOUTON RETOUR EN HAUT =====
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
        
        // Mettre à jour la navigation active en fonction du scroll
        updateActiveSection();
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    function updateActiveSection() {
        const sections = document.querySelectorAll('.section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = '#' + section.id;
            }
        });
        
        if (currentSection) {
            navLinks.forEach(link => link.classList.remove('active'));
            progressLinks.forEach(link => link.classList.remove('active'));
            
            const activeNavLink = document.querySelector(`.nav-link[href="${currentSection}"]`);
            const activeProgressLink = document.querySelector(`.progress-step[href="${currentSection}"]`);
            
            if (activeNavLink) activeNavLink.classList.add('active');
            if (activeProgressLink) activeProgressLink.classList.add('active');
        }
    }
    
    // ===== BOUTONS DE COPIE =====
    const copyButtons = document.querySelectorAll('.copy-button');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            const textToCopy = code || this.parentElement.querySelector('code').textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Afficher le feedback
                const originalHTML = this.innerHTML;
                const originalBg = this.style.backgroundColor;
                
                this.innerHTML = '<i class="fas fa-check"></i> Copié';
                this.style.backgroundColor = 'var(--accent-green)';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.backgroundColor = originalBg;
                }, 2000);
            }).catch(err => {
                console.error('Erreur lors de la copie: ', err);
            });
        });
    });
    
    // ===== SELECTEUR OS =====
    const osTabs = document.querySelectorAll('.os-tab');
    const osInstructions = document.querySelectorAll('.os-instructions');
    
    osTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const os = this.getAttribute('data-os');
            
            // Retirer la classe active de tous les onglets
            osTabs.forEach(t => t.classList.remove('active'));
            osInstructions.forEach(inst => inst.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet cliqué
            this.classList.add('active');
            
            // Afficher le contenu correspondant
            const targetInstructions = document.getElementById(`${os}-instructions`);
            if (targetInstructions) {
                targetInstructions.classList.add('active');
            }
        });
    });
    
    // ===== CATÉGORIES DE COMMANDES =====
    const categoryTabs = document.querySelectorAll('.category-tab');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Retirer la classe active de tous les onglets
            categoryTabs.forEach(t => t.classList.remove('active'));
            
            // Ajouter la classe active à l'onglet cliqué
            this.classList.add('active');
            
            // Masquer tous les contenus de catégorie
            document.querySelectorAll('.command-category').forEach(cat => {
                cat.classList.remove('active');
            });
            
            // Afficher la catégorie correspondante
            const targetCategory = document.getElementById(`${category}-category`);
            if (targetCategory) {
                targetCategory.classList.add('active');
            }
        });
    });
    
    // ===== BOUTON TOGGLE MOBILE =====
    const navToggle = document.getElementById('navToggle');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            const navLinksContainer = document.querySelector('.nav-links');
            
            if (navLinksContainer) {
                if (this.classList.contains('active')) {
                    navLinksContainer.style.display = 'flex';
                    navLinksContainer.style.flexDirection = 'column';
                    navLinksContainer.style.position = 'absolute';
                    navLinksContainer.style.top = '100%';
                    navLinksContainer.style.left = '0';
                    navLinksContainer.style.right = '0';
                    navLinksContainer.style.backgroundColor = 'var(--bg-primary)';
                    navLinksContainer.style.padding = 'var(--spacing-md)';
                    navLinksContainer.style.borderTop = '1px solid var(--border-color)';
                    navLinksContainer.style.boxShadow = 'var(--shadow-lg)';
                } else {
                    navLinksContainer.style.display = 'none';
                }
            }
        });
    }
    
    // ===== GESTION DU TERMINAL INTERACTIF =====
    // (Le code du terminal sera dans terminal.js)
    
    // ===== ANIMATIONS AU SCROLL =====
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observer les cartes et sections
    document.querySelectorAll('.info-card, .command-card, .comparison-card').forEach(card => {
        observer.observe(card);
    });
    
    // Initialiser la section active
    updateActiveSection();
    
    // Afficher un message de bienvenue
    console.log('%c🎉 Tutoriel Git & GitHub chargé avec succès !', 'color: #2ea44f; font-size: 16px; font-weight: bold;');
    console.log('%c💡 Explorez les différentes sections pour maîtriser Git et GitHub.', 'color: #58a6ff; font-size: 14px;');
});