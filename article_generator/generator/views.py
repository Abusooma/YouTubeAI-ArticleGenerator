import google.generativeai as genai
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.shortcuts import render
from pathlib import Path
import os
from dotenv import load_dotenv
import yt_dlp
import json
from django.conf import settings
import time

load_dotenv()

# Configurer le modèle GEMINI
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GENAI_API_KEY)


def home(request):
    return render(request, 'generator/index.html')


@require_POST
def generate_article(request):
    """Handle POST request to generate a blog article from a YouTube link."""
    try:
        data = json.loads(request.body)
        yt_link = data.get('link')
        if not yt_link:
            raise ValueError("Lien YouTube manquant")
    except (KeyError, json.JSONDecodeError, ValueError) as e:
        return JsonResponse({'error': str(e)}, status=400)

    try:
        audio_path = download_audio(yt_link)
        blog_content = generate_blog_content(audio_path)
        print(blog_content)
        return JsonResponse({'message': 'Success', 'content': blog_content})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



def download_audio(yt_link):
    """ Télecharge l'audio de Youtube et 
        retourne le chemin du fichier audio mp3
    """
    output_dir = Path(settings.MEDIA_ROOT) / "audios"
    output_dir.mkdir(parents=True, exist_ok=True)
    timestamp = int(time.time())
    output_file = output_dir / f"audio_{timestamp}.mp3"

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': str(output_file.with_suffix('.%(ext)s')),
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '128',
        }],
        'ffmpeg_location': r'C:\Users\souma\Downloads\ffmpeg-7.1-essentials_build\ffmpeg-7.1-essentials_build\bin',
        'quiet': True,
        'no_warnings': True,
        'socket_timeout': 30,
        'retries': 3,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            ydl.extract_info(yt_link, download=True)
            return output_file
        except Exception as e:
            raise RuntimeError(
                f"Erreur lors du téléchargement audio : {str(e)}") from e


def generate_blog_content(audio_path):
    """Soumettre l'audio à l'API Gemini pour générer un contenu de blog."""
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = """
        Génère un article de blog professionnel à partir de cet audio.
        FORMAT DE SORTIE : {
            "title": "Titre SEO optimisé (60-70 caractères)",
            "tags": ["tag1", "tag2", "tag3"],
            "content": ```<h2>Introduction captivante</h2><p>Contenu d'introduction...</p><h2>Corps de l'article</h2><p>Section 1</p><p>Contenu...</p><h3>Sous-section 1</h3><p>Contenu...</p><h2>Conclusion</h2><p>Résumé et appel à l'action...</p>```,
            "resources": ["Ressource 1", "Ressource 2"]
        }
        CONSIGNES : Style naturel et engageant, structure claire avec H2 et H3, paragraphes courts, ton professionnel mais conversationnel.
    """

    try:
        audio_file = genai.upload_file(audio_path)

        # Passer le contenu binaire à l'API Gemini
        response = model.generate_content([
            prompt,
            {
                "mime_type": "audio/mp3",
                "data": audio_file  # Ici, on s'assure que l'API reçoit bien des bytes
            }
        ])

        return response.text

        #return extract_data(response.text)
    except Exception as e:
        error_message = f"Erreur lors de la génération de l'article : {str(e)}"
        log_error(error_message)
        return None
    
    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)


def extract_data(text):
    """Extraire les données JSON de la réponse texte."""
    try:
        cleaned_text = text.replace("json", '').replace("```", '').strip()
        return json.loads(cleaned_text)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Erreur lors de l'extraction des données : {e}") from e


def log_error(message):
    """Log de l'erreur dans un fichier pour débogage."""
    with open('error_log.txt', 'a') as log_file:
        log_file.write(message + '\n')
