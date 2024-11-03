import os
import uuid
from django.conf import settings
import assemblyai as aai
from pytube import YouTube
from pydub import AudioSegment
from dotenv import load_dotenv

load_dotenv()


aai.settings.api_key = os.getenv('ASSEMBLY_API_KEY')

class YoutubeTranscriber:
    def __init__(self) -> None:
        self.temp_dir = os.path.join(settings.MEDIA_ROOT, 'yt_audios')
        os.makedirs(self.temp_dir, exist_ok=True)

    def dowload_and_convert_to_mp3(self, youtube_url):
        """ Telecharge et convertit une video youtube en mp3 """

        temp_id = str(uuid.uuid4)
        original_audio_path = None
        mp3_path = None
        
        try:
            yt = YouTube(youtube_url)
            audio_stream = yt.streams.filter(only_audio=True).first()
            if not audio_stream:
                raise ValueError('Aucun stream audio disponible')
            
            original_audio_path = os.path.join(self.temp_dir, f"temp_{temp_id}")
            mp3_path = os.path.join(self.temp_dir, f"audio_{temp_id}.mp3")

            original_audio_path = audio_stream.download(
                output_path=self.temp_dir,
                filename=f"temp_{temp_id}"
            )

            audio = AudioSegment.from_file(original_audio_path)
            audio.export(
                mp3_path,
                format="mp3",
                bitrate="192k",
                parameters=["-ac", "1"]
            )

            return mp3_path, yt.title
            
        except:
            raise ValueError("Erreur de conversion")
        
        finally:
            if original_audio_path and os.path.exists(original_audio_path):
                os.remove(original_audio_path)
  

    def transcribe(self, youtube_url: str) -> dict:
        """
        Transcrit une vidéo YouTube et retourne les informations.
        """
        mp3_path = None
        try:
            # Téléchargement et conversion
            mp3_path, _ = self.download_and_convert_to_mp3(youtube_url)

            # Configuration de la transcription
            config = aai.TranscriptionConfig(
                audio_format="mp3"
            )

            # Transcription
            transcript = aai.Transcriber().transcribe(
                mp3_path,
                config=config
            )

            return transcript.text,
         
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e)
            }

        finally:
            if mp3_path and os.path.exists(mp3_path):
                os.remove(mp3_path)
