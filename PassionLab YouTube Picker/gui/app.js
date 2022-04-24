// Geting form, input and button elements
form = document.querySelector('form');
input = document.getElementById('link');
btn = document.getElementById('submit');

// Declaring empty matching link and link details from python
let data;
var details;


// Getting option portion
options = document.querySelector('.main-frame .options');

// Getting options elements
mediaElem = document.getElementsByClassName('video-audio')[0];
resolutionElem = document.getElementsByClassName('video-resolution')[0];
bitrateElem = document.getElementsByClassName('audio-bitrate')[0];

// Declaring global empty options
let media;
let resolution;
let bitrate;

// Determining whether or not user selected a option
var mediaSet = false;
var resolutionSet = false;
var bitrateSet = false;


// function while typing in the link input
function checker() {

    // Geting most recet input data in realtime
    data = input.value;

    if (data.trim() === "") {
        console.warn("Enter or paste a valid YouTube URL to download that video.");

        // Styling
        btn.setAttribute('disabled', 'true');
        btn.classList.remove('animate');
        btn.style.cursor = 'not-allowed';
        btn.innerText = "DOWNLOAD";
        options.style.display = 'none';
    } else {
        // Styling
        btn.innerText = "Enter a valid YouTube URL";
        options.style.display = 'none';

        // Checking only for the YouTube link inputted
        var ytLink = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        var match = data.trim().match(ytLink);

        if (match && match[2].length == 11) {
            btn.innerText = "Searching...";

            // Getting YouTube link details if exists else return false
            eel.link_details(data.trim())(function (ret) {
                details = JSON.parse(ret);

                // Proceeding if link availibility is true and the video is downloadable
                if (details.exist) {
                    console.log("OK! Click on download button to save the video.");
                  
                    // Styling
                    options.style.display = 'block';
                    btn.removeAttribute('disabled');
                    btn.classList.add('animate');
                    btn.style.cursor = 'pointer';
                    btn.innerText = "DOWNLOAD";

                    // Reloading to the main window after sunccessful submission for download
                    form.setAttribute('action', './index.html');
                    form.setAttribute('method', 'get');
                } else {
                    console.log("Sorry! This YouTube link seems to be broken. The video may be unavilable or transfered by the author.");
                  
                    // Styling
                    btn.innerText = "Video unavailable! Please try another.";
                }
            });
        }
    }
}


// Automatically clicking the submit button while press enter (code=13) key
input.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        btn.click();
    }
});


// Getting the download options from the radio inputs by a function with the name tag as a parameter
function firedUp(param) {

    if (param === 'vid-aud') {
        
        // Capturing user choise and making this option true for user selected
        media = document.querySelector("input[name=vid-aud]:checked").value;
        mediaSet = true;
        
        // Styling
        mediaElem.classList.add('rev');
        setTimeout(() => {
            mediaElem.style.display = 'none';
            media === 'video' ? resolutionElem.style.display = 'block' : bitrateElem.style.display = 'block';
        }, 1000);
        
    } else if (param === 'vid-res') {
        
        // Capturing user choise and making this option true for user selected
        resolution = document.querySelector("input[name=vid-res]:checked").value;
        resolutionSet = true;

        // Styling
        resolutionElem.classList.add('rev');
        setTimeout(() => {
            resolutionElem.style.display = 'none';
            bitrateElem.style.display = 'block';
        }, 1000)
        
    } else if (param === 'aud-bit') {
        
        // Capturing user choise and making this option true for user selected
        bitrate = document.querySelector("input[name=aud-bit]:checked").value;
        bitrateSet = true;

        // Styling
        bitrateElem.classList.add('rev');
        setTimeout(() => {
            bitrateElem.style.display = 'none';
            options.style.display = 'none';
        }, 1000)
    };
};



// Submit button for downloading the user specified or default media
function ytdDownload() {

    // Making default download options if not given
    if (!mediaSet) {
        media = document.querySelector("input[name=vid-aud]:checked").value;
    }
    if (!resolutionSet) {
        resolution = document.querySelector("input[name=vid-res]:checked").value;
    }
    if (!bitrateSet) {
        bitrate = document.querySelector("input[name=aud-bit]:checked").value;
    }

    console.log("Downloading the " + media + " of '" + details.title + "' in pregress...");

    // Sending the link to the python backend for downloading
    eel.yt_download(data.trim(), media, resolution, bitrate);
    // INFO:
    // A callback function has to be mentioned to get python return value and use it here...
    // for example 1: eel.download(data.trim())(<callbackFunctionName>(ret) { <functionContent> });
    // for example 2: eel.download(data.trim())(<callbackFunctionName>);
    // function <callbackFunctionName>(ret) { <functionContent> };
    
    // Styling
    input.value = "";
    input.focus();

    // INFO:
    // YouTube video thumbline requests:
    // __MAX[1280x720] : https://img.youtube.com/vi/E4y05va5EVw/maxres2.jpg
    // __STD[320x180]  : https://img.youtube.com/vi/E4y05va5EVw/mqdefault.jpg
}



// TODO:
// Making a online YouTube video player with controls...
// <iframe id="videoObject" type="text/html" width="500" height="265" frameborder="0" allowfullscreen></iframe>
function validateYouTubeUrl() {
    var url = $('#youTubeUrl').val();
    if (url != undefined || url != '') {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length == 11) {
            // Do anything for being valid
            // if need to change the url to embed url then use below line
            $('#videoObject').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?&enablejsapi=1');
        } else {
            alert('not valid');
            // Do anything for not being valid
        }
    }
}
