import os
import yt_dlp
from dotenv import load_dotenv
from django.conf import settings
from django.shortcuts import render
from django.views.decorators.http import require_POST
from django.http import JsonResponse
import assemblyai as aai
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
    print(transcription)
    if not transcription:
        return JsonResponse({'error': " Failed to get transcript"}, status=500)

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
