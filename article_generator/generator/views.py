import os
import yt_dlp
from dotenv import load_dotenv
from django.conf import settings
from django.shortcuts import render
from django.views.decorators.http import require_POST
from django.http import JsonResponse
import assemblyai as aai
import openai
import json

load_dotenv()


def home(request):
    return render(request, 'generator/index.html')


def generate_article(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    try:
        data = json.loads(request.body)
        yt_link = data['link']
    except (KeyError, json.JSONDecodeError):
        return JsonResponse({'error': 'Invalid data sent'}, status=400)

    transcription, title = get_transcription(yt_link)
    
    if not transcription:
        return JsonResponse({'error': " Failed to get transcript"}, status=500)
    
    blog_content = get_blog_from_transcription(transcription=transcription)
    print(blog_content)

def download_audio_and_title(link):
    output_dir = os.path.join(settings.MEDIA_ROOT, 'yt_audios')
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, '%(title)s.%(ext)s')

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_file,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'ffmpeg_location': r'C:\Users\souma\Downloads\ffmpeg-7.1-essentials_build\ffmpeg-7.1-essentials_build\bin',
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(link, download=True)
        title = info_dict.get('title', 'Untitled')
        new_file = ydl.prepare_filename(info_dict).replace(
            ".webm", ".mp3").replace(".m4a", ".mp3")

    return new_file, title


def get_transcription(link):
    audio_file, title = download_audio_and_title(link)
    aai.settings.api_key = os.getenv("ASSEMBLY_API_KEY")

    transcriber = aai.Transcriber()
    transcript = transcriber.transcribe(audio_file)

    return transcript.text, title


def get_blog_from_transcription(transcription):
    openai.api_key = os.getenv("OPENAI_API_KEY")

    prompt = f"""Génère un article de blog professionnel à partir de cette transcription vidéo. Format de sortie JSON requis.

FORMAT DE SORTIE :
{{
    "title": "Titre SEO optimisé (60-70 caractères)",
    "tags": ["tag1", "tag2", "tag3"],
    "author": "AI Content Expert",
    "summary": "Résumé accrocheur (150-200 caractères)",
    "readingTime": "X min de lecture",
    "keyPoints": [
        "Point clé 1",
        "Point clé 2",
        "Point clé 3"
    ],
    "content": "<h2>Section 1</h2><p>Contenu...</p>",
    "resources": [
        "Ressource 1",
        "Ressource 2"
    ]
}}

CONSIGNES :
- Style naturel et engageant
- Structure claire avec H2 et H3
- Paragraphes courts
- Ton professionnel mais conversationnel
- 3-5 tags pertinents
- 3-4 points clés
- 2-3 ressources complémentaires

TRANSCRIPTION :
{transcription}"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "Tu es un expert en rédaction web qui transforme des transcriptions vidéo en articles de blog structurés."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=2000
        )

        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Erreur lors de la génération de l'article : {str(e)}")
        return None
