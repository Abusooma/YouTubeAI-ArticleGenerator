// Classe pour gérer l'authentification
class AuthenticationManager {
  constructor() {
    this.loginModal = null;
    this.registerModal = null;
    this.initializeModals();
    this.initializeEventListeners();
  }

  initializeModals() {
    this.loginModal = new bootstrap.Modal(
      document.getElementById("loginModal")
    );
    this.registerModal = new bootstrap.Modal(
      document.getElementById("registerModal")
    );
  }

  initializeEventListeners() {
    // Événements des formulaires
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }

    if (registerForm) {
      registerForm.addEventListener("submit", (e) => this.handleRegister(e));
    }

    // Validation des formulaires
    const forms = document.querySelectorAll(".needs-validation");
    forms.forEach((form) => {
      form.addEventListener("submit", (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      });
    });

    // Animation des inputs
    document.querySelectorAll(".glass-input").forEach((input) => {
      input.addEventListener("focus", () => this.handleInputFocus(input));
      input.addEventListener("blur", () => this.handleInputBlur(input));
    });
  }

  handleInputFocus(input) {
    input.parentElement.classList.add("input-focused");
    input.closest(".modal-content")?.classList.add("modal-focused");
  }

  handleInputBlur(input) {
    input.parentElement.classList.remove("input-focused");
    input.closest(".modal-content")?.classList.remove("modal-focused");
  }

  handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    if (form.checkValidity()) {
      // Pour Django plus tard
      console.log("Login attempt");
    }
  }

  handleRegister(e) {
    e.preventDefault();
    const form = e.target;
    if (form.checkValidity()) {
      // Pour Django plus tard
      console.log("Register attempt");
    }
  }
}

// Classe pour gérer les effets de particules
class ParticleEffect {
  constructor() {
    this.particles = [];
    this.numParticles = 50;
    this.container = document.createElement("div");
    this.container.className = "particles-container";
    document.body.appendChild(this.container);
    this.createParticles();
    this.animate();
  }

  createParticles() {
    for (let i = 0; i < this.numParticles; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      this.setParticleProperties(particle);
      this.container.appendChild(particle);
      this.particles.push({
        element: particle,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
      });
    }
  }

  setParticleProperties(particle) {
    const hue = Math.random() * 60 - 30; // Variation autour du jaune
    particle.style.background = `hsl(${60 + hue}, 100%, 70%)`;
    particle.style.boxShadow = `0 0 ${10 + Math.random() * 10}px hsl(${
      60 + hue
    }, 100%, 70%)`;
    particle.style.width = particle.style.height = `${Math.random() * 3 + 1}px`;
  }

  animate() {
    this.particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > window.innerWidth)
        particle.speedX *= -1;
      if (particle.y < 0 || particle.y > window.innerHeight)
        particle.speedY *= -1;

      particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Classe pour gérer les effets de la navbar
class NavbarEffects {
  constructor() {
    this.navbar = document.querySelector(".navbar");
    this.lastScrollTop = 0;
    this.init();
  }

  init() {
    window.addEventListener("scroll", () => this.handleScroll());
    this.addHoverEffects();
  }

  handleScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;

    if (st > this.lastScrollTop) {
      this.navbar.style.transform = "translateY(-100%)";
    } else {
      this.navbar.style.transform = "translateY(0)";
      this.navbar.style.backdropFilter = "blur(20px)";
    }

    this.navbar.style.background =
      st > 50 ? "rgba(0, 0, 0, 0.8)" : "transparent";

    this.lastScrollTop = st;
  }

  addHoverEffects() {
    const buttons = this.navbar.querySelectorAll("button, .nav-link");
    buttons.forEach((button) => {
      button.addEventListener("mouseover", () => this.createRipple(button));
      button.addEventListener("mousemove", (e) =>
        this.updateButtonGlow(e, button)
      );
      button.addEventListener("mouseleave", () =>
        this.removeButtonGlow(button)
      );
    });
  }

  createRipple(element) {
    const ripple = document.createElement("div");
    ripple.className = "ripple";
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
  }

  updateButtonGlow(e, button) {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    button.style.setProperty("--x", `${x}px`);
    button.style.setProperty("--y", `${y}px`);
  }

  removeButtonGlow(button) {
    button.style.setProperty("--x", "50%");
    button.style.setProperty("--y", "50%");
  }
}

// Classe pour gérer le loader de génération
class GenerationLoader {
  constructor() {
    this.particles = [];
    this.currentStep = 0;
    this.steps = [
      "Extraction du contenu YouTube",
      "Transcription audio",
      "Analyse du contenu",
      "Génération de l'article",
      "Création de l'image",
      "Optimisation SEO",
    ];
    this.initializeLoader();
  }

  initializeLoader() {
    if (!document.querySelector(".generation-loader")) {
      const loader = document.createElement("div");
      loader.className = "generation-loader";
      loader.innerHTML = `
                <div class="loader-content">
                    <div class="loader-circle"></div>
                    <div class="loader-particles"></div>
                    <div class="progress-status">
                        <div class="progress-circle">
                            <svg class="progress-svg" width="120" height="120" viewBox="0 0 120 120">
                                <circle class="progress-circle-bg" cx="60" cy="60" r="54"/>
                                <circle class="progress-circle-path" cx="60" cy="60" r="54"/>
                            </svg>
                            <div class="progress-percentage">0%</div>
                        </div>
                    </div>
                    <div class="generation-text">
                        <span class="current-step">Initialisation...</span>
                    </div>
                    <div class="loading-text">
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                    </div>
                </div>
            `;
      document.body.appendChild(loader);
      this.loader = loader;
    } else {
      this.loader = document.querySelector(".generation-loader");
    }

    this.progressCircle = this.loader.querySelector(".progress-circle-path");
    this.progressText = this.loader.querySelector(".progress-percentage");
    this.stepText = this.loader.querySelector(".current-step");

    const circumference = 2 * Math.PI * 54;
    this.progressCircle.style.strokeDasharray = circumference;
    this.progressCircle.style.strokeDashoffset = circumference;

    this.createParticles();
  }

  createParticles() {
    const particlesContainer = this.loader.querySelector(".loader-particles");
    if (!particlesContainer) return;

    particlesContainer.innerHTML = "";
    this.particles = [];

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      const angle = (i / 12) * Math.PI * 2;
      const radius = 80;
      particle.style.left = `${Math.cos(angle) * radius}px`;
      particle.style.top = `${Math.sin(angle) * radius}px`;

      particlesContainer.appendChild(particle);
      this.particles.push(particle);
    }
  }

  animateParticles() {
    this.particles.forEach((particle, index) => {
      if (particle && particle.style) {
        particle.style.animation = `float ${
          2 + index * 0.1
        }s infinite ease-in-out ${index * 0.1}s`;
      }
    });
  }

  show() {
    if (this.loader) {
      this.loader.classList.add("active");
      this.animateParticles();
      this.startProgress();
    }
  }

  hide() {
    if (this.loader) {
      this.loader.classList.remove("active");
      this.stopProgress();
    }
  }

  updateProgress(percent) {
    if (!this.progressCircle || !this.progressText) return;

    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (percent / 100) * circumference;
    this.progressCircle.style.strokeDashoffset = offset;
    this.progressText.textContent = `${Math.round(percent)}%`;
  }

  nextStep() {
    if (this.currentStep < this.steps.length) {
      if (this.stepText) {
        this.stepText.textContent = this.steps[this.currentStep];
      }
      this.updateProgress((this.currentStep + 1) * (100 / this.steps.length));
      this.currentStep++;
    }
  }

  startProgress() {
    this.currentStep = 0;
    this.progressInterval = setInterval(() => this.nextStep(), 3000);
  }

  stopProgress() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }
}

// Fonctions globales pour la gestion des modaux d'authentification
window.openLoginModal = function () {
  const authManager = window.authManager;
  if (authManager.registerModal) authManager.registerModal.hide();
  if (authManager.loginModal) authManager.loginModal.show();
};

window.openRegisterModal = function () {
  const authManager = window.authManager;
  if (authManager.loginModal) authManager.loginModal.hide();
  if (authManager.registerModal) authManager.registerModal.show();
};

window.switchToLogin = function () {
  const authManager = window.authManager;
  if (authManager.registerModal) authManager.registerModal.hide();
  if (authManager.loginModal) authManager.loginModal.show();
};

window.switchToRegister = function () {
  const authManager = window.authManager;
  if (authManager.loginModal) authManager.loginModal.hide();
  if (authManager.registerModal) authManager.registerModal.show();
};

// Fonction d'initialisation des fonctionnalités principales
window.initializeMainFeatures = () => {
  window.authManager = new AuthenticationManager();
  window.particleEffect = new ParticleEffect();
  window.navbarEffects = new NavbarEffects();
  window.generationLoader = new GenerationLoader();
};

// Initialisation de l'application
document.addEventListener("DOMContentLoaded", () => {
  // Initialiser les fonctionnalités principales
  window.initializeMainFeatures();

  // Initialiser la génération d'articles (sera appelé depuis articleGeneration.js)
  if (typeof window.initializeArticleGeneration === "function") {
    window.initializeArticleGeneration();
  }

  // Personnalisation de l'interface
  const customizeUI = () => {
    // Ajout des effets de survol sur tous les boutons jaunes
    document.querySelectorAll(".btn-yellow").forEach((button) => {
      button.addEventListener("mousemove", (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        button.style.setProperty("--x", `${x}px`);
        button.style.setProperty("--y", `${y}px`);
      });
    });

    // Animation des inputs en verre
    document.querySelectorAll(".glass-input").forEach((input) => {
      input.addEventListener("focus", () => {
        input.parentElement.classList.add("input-focused");
      });

      input.addEventListener("blur", () => {
        input.parentElement.classList.remove("input-focused");
      });
    });
  };

  // Appliquer les personnalisations
  customizeUI();

  // Observer les changements DOM pour les nouveaux éléments
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        customizeUI();
      }
    });
  });

  // Démarrer l'observation
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
