// Classe de génération d'articles avec affichage inline
class InlineArticleGenerator {
  constructor() {
    this.currentArticle = null;
    this.previewSection = document.getElementById("articlePreview");
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Écouter les changements de personnalisation
    document.getElementById("customTitle")?.addEventListener("input", (e) => {
      this.updatePreviewTitle(e.target.value);
    });

    document.getElementById("articleStyle")?.addEventListener("change", (e) => {
      this.updateArticleStyle(e.target.value);
    });

    // Gestionnaire de formulaire de génération
    const generateForm = document.getElementById("generateForm");
    if (generateForm) {
      generateForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const youtubeUrl = document.getElementById("youtubeUrl").value;
        await this.generateArticle(youtubeUrl);
      });
    }
  }

  async generateArticle(youtubeUrl) {
    try {
      // Cacher la section de prévisualisation pendant la génération
      this.previewSection.classList.add("d-none");
      this.previewSection.classList.remove("visible");

      // Afficher le loader de génération
      window.generationLoader.show();

      // Générer l'article
      this.currentArticle = await this.mockGenerateArticle(youtubeUrl);
      await this.generateImage();

      // Cacher le loader et afficher l'aperçu
      window.generationLoader.hide();
      this.showPreview();
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      window.generationLoader.hide();
      // Gérer l'erreur ici (afficher un message d'erreur par exemple)
    }
  }

  async generateImage() {
    // Simuler la génération d'image (à remplacer par votre API)
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentArticle.imageUrl = "/api/placeholder/800/400";
        resolve();
      }, 2000);
    });
  }

  showPreview() {
    if (!this.currentArticle) return;

    // Mettre à jour tous les éléments de l'aperçu
    document.getElementById("previewTitle").textContent =
      this.currentArticle.title;
    document.getElementById("previewContent").innerHTML =
      this.currentArticle.content;
    document.getElementById("previewImage").src = this.currentArticle.imageUrl;
    document.getElementById("previewAuthor").textContent =
      this.currentArticle.author;
    document.getElementById("previewDate").textContent =
      new Date().toLocaleDateString();

    // Mise à jour des champs de personnalisation
    const customTitleInput = document.getElementById("customTitle");
    if (customTitleInput) {
      customTitleInput.value = this.currentArticle.title;
    }

    // Afficher la section avec animation
    this.previewSection.classList.remove("d-none");
    requestAnimationFrame(() => {
      this.previewSection.classList.add("visible");
    });

    // Faire défiler jusqu'à l'aperçu
    setTimeout(() => {
      this.previewSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
  }

  async regenerateImage() {
    const imageContainer = document.querySelector(".featured-image-container");
    const image = document.getElementById("previewImage");

    // Ajouter l'effet de chargement
    imageContainer.classList.add("image-loading");

    try {
      await this.generateImage();
      image.src = this.currentArticle.imageUrl;
    } catch (error) {
      console.error("Erreur lors de la régénération de l'image:", error);
      // Gérer l'erreur ici
    } finally {
      imageContainer.classList.remove("image-loading");
    }
  }

  updatePreviewTitle(newTitle) {
    if (this.currentArticle) {
      this.currentArticle.title = newTitle;
      document.getElementById("previewTitle").textContent = newTitle;
    }
  }

  updateArticleStyle(style) {
    if (!this.currentArticle) return;

    // Appliquer différents styles selon la sélection
    const content = document.getElementById("previewContent");
    content.className = "article-content mt-4 " + style;

    // Vous pouvez ajouter une logique pour régénérer l'article avec le nouveau style
    console.log("Style mis à jour:", style);
  }

  editArticle() {
    // Remonter vers le formulaire pour modifications
    document
      .getElementById("youtubeUrl")
      .scrollIntoView({ behavior: "smooth" });
  }

  async publishArticle() {
    try {
      window.generationLoader.show();

      // Simuler la sauvegarde (à remplacer par votre API Django)
      await this.mockSaveArticle();

      window.generationLoader.hide();

      // Rediriger vers la page de l'article
      window.location.href = `/article/${this.currentArticle.id}`;
    } catch (error) {
      console.error("Erreur lors de la publication:", error);
      window.generationLoader.hide();
      // Gérer l'erreur ici
    }
  }

  // Méthodes de simulation (à remplacer par vos appels API)
  async mockGenerateArticle(youtubeUrl) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          title: "Analyse de la vidéo YouTube",
          content: `
                        <h2>Introduction</h2>
                        <p>Résumé détaillé de la vidéo : ${youtubeUrl}</p>
                        <h2>Points clés</h2>
                        <p>Les principaux points abordés dans cette vidéo sont...</p>
                        <h2>Analyse approfondie</h2>
                        <p>Cette section présente une analyse détaillée du contenu...</p>
                        <h2>Conclusion</h2>
                        <p>Pour conclure, nous pouvons retenir que...</p>
                    `,
          author: "AI Writer",
          imageUrl: null,
        });
      }, 3000);
    });
  }

  async mockSaveArticle() {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }
}

// Fonctions globales pour la génération d'articles
window.regenerateImage = function () {
  window.articleGenerator?.regenerateImage();
};

window.editArticle = function () {
  window.articleGenerator?.editArticle();
};

window.publishArticle = function () {
  window.articleGenerator?.publishArticle();
};

// Fonction d'initialisation exportée pour main.js
window.initializeArticleGeneration = () => {
  window.articleGenerator = new InlineArticleGenerator();
};
