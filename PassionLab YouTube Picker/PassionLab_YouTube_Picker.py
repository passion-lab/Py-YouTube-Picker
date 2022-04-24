from __future__ import unicode_literals

import io
from json import dumps

import eel
from plyer import notification
from requests import get
from youtube_dl import YoutubeDL, utils

eel.init('gui')

# Media download folders
mp4_download_folder = './PassionLab YouTube Picker_DOWNLOADS/Videos/'
mp3_download_folder = './PassionLab YouTube Picker_DOWNLOADS/Audios/'

# Empty media details
details = {}


@eel.expose
def link_details(link):
    res = get(link).status_code
    global details
    try:
        with YoutubeDL({}) as ydl:
            info = ydl.extract_info(link, download=False)

        details['exist'] = True
        details['title'] = info['title']
        return dumps(details)
    except (utils.ExtractorError,
            utils.DownloadError,
            utils.YoutubeDLError,
            utils.UnsupportedError,
            utils.GeoRestrictedError,
            utils.PostProcessingError,
            utils.compat_HTTPError,
            utils.XAttrMetadataError,
            utils.XAttrUnavailableError,
            utils.UnavailableVideoError):
        details['exist'] = False
        return dumps(details)


@eel.expose
def yt_download(link, media, vidres, audbit):
    options = {
        # TODO: Change download path
        "outtmpl": f"{mp3_download_folder}%(title)s.%(ext)s",
        "format": "bestaudio/best",
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": str(audbit),
        }],
        # 'postprocessor_args': [
        #     '-ar', '16000'
        # ],
        # 'prefer_ffmpeg': True,
        # 'ffmpeg_location': "./ffbin/",
        # "writeinfojson": True,
    } if media == "audio" else {
        "outtmpl": f"{mp4_download_folder}%(title)s.%(ext)s",
        "format": f"bestvideo[height<={str(vidres)}]+bestaudio/best[height<={str(vidres)}]",
        "writesubtitles": True,
        "writeautomaticsub": True,
    }

    try:
        with YoutubeDL(options) as ydl:
            ydl.download([link])

            notification.notify(
                title=f"{media} Downloaded".upper(),
                message=f"The {media} of '{details['title']}' was downloaded successfully in "
                        f"{mp4_download_folder if media == 'video' else mp3_download_folder}",
                app_name="PassionLab YouTube Picker",
                app_icon="./gui/assets/video.ico" if media == 'video' else "./gui/assets/audio.ico",
                timeout=5
            )
    except (utils.ExtractorError,
            utils.DownloadError,
            utils.YoutubeDLError,
            utils.UnsupportedError,
            utils.GeoRestrictedError,
            utils.PostProcessingError,
            utils.compat_HTTPError,
            utils.XAttrMetadataError,
            utils.XAttrUnavailableError,
            utils.UnavailableVideoError):
        print('Something went wrong with the video')


eel.start('./index.html', size=(992, 584))
