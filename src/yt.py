from __future__ import unicode_literals
from PIL import Image
import youtube_dl
from urllib.parse import urlparse


def cropImage(imageURL):
    im = Image.open(imageURL)
    cropped = im.crop((280, 0, 1000, 720))
    # del original image, save new image into metadata of mp3
    cropped.show()


ydl_opts = {
    "format": "bestaudio/best",
    "postprocessors": [
        {
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        },
        {"key": "FFmpegMetadata"},
    ],
    "outtmpl": "%(id)s.%(ext)s",
    "noplaylist": True,
    "writethumbnail": True,
    "forcefilename": True,
}

# url = yt link
# returns mp3 object without metadata
# also should return image url
def getImage(url):
    url_data = urlparse(url)
    ID = url_data.query[2:]
    imageURL = f"https://img.youtube.com/vi/{ID}/maxresdefault.jpg"

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])


getImage("https://www.youtube.com/watch?v=fREEntfI27c")

# youtube-dl.exe --newline -o "C:\Users\kelvi\OneDrive\Documents\Adobe\%(title)s.%(ext)s" -x --audio-format mp3
# --audio-quality 0 --hls-prefer-native --embed-thumbnail --add-metadata --cookies cookies.txt
# "https://www.youtube.com/watch?v=wQ1_0oeXW6M"
