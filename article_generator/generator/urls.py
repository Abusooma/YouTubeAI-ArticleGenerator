from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('generate-article/', views.generate_article)
]