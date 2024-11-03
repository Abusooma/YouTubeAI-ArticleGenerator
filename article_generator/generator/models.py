import math

from django.db import models
from django.utils.text import slugify
from django.utils.html import strip_tags
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.name
    
    class Meta:
        verbose_name = 'Categorie'
        verbose_name_plural = 'Catégories'
        ordering = ['name']

        
class Tag(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name



class  Article(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('published', 'publié')
    ]
    category = models.ForeignKey(Category, related_name='articles', on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=200)
    slug = models.CharField(max_length=200, unique=True)
    tags = models.ManyToManyField(Tag, related_name='articles', blank=True, verbose_name='Tags')
    content = models.TextField()
    youtube_url = models.URLField(verbose_name='URL Youtube')
    image = models.ImageField(upload_to='articles/image', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='articles', on_delete=models.CASCADE)

    # ---------------------------------------------
    # Champs neccessaires pour le referencement (SEO)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)

        return super().save(*args, **kwargs)
    
    def get_reading_time(self):
        """Calculer le nombre de temps en minute de lecture de l'article"""
        text = strip_tags(self.content)
        word_count = len(text.split())
        reading_time = math.ceil(word_count/238)
        reading_time = max(1, reading_time)

        if reading_time == 1:
            return '1 minute de lecture'
        else:
            return f"{reading_time} minutes de lecture"

    
