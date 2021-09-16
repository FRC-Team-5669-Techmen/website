// Select elements here
const video = document.getElementById('video');
const videoControls = document.getElementById('video-controls');
const playButton = document.getElementById('play');
const playbackIcons = document.querySelectorAll('.playback-icons i');
const popupIcons = document.querySelectorAll('.popup-icons i');
const timeElapsed = document.getElementById('time-elapsed');
const duration = document.getElementById('duration');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const seek = document.getElementById('seek');
const seekTooltip = document.getElementById('seek-tooltip');
const volumeControls = document.getElementById('volume-controls');
const volumeButton = document.getElementById('volume-button');
const volumeIcons = document.querySelectorAll('.volume-button i');
const volumeMute = document.getElementById('volume-mute-i');
const volumeLow = document.getElementById('volume-down-i');
const volumeHigh = document.getElementById('volume-up-i');
const volume = document.getElementById('volume');
const playbackAnimation = document.getElementById('playback-animation');
const fullscreenButton = document.getElementById('fullscreen-button');
const videoContainer = document.getElementById('video-container');
const fullscreenIcons = fullscreenButton.querySelectorAll('i');
//const pipButton = document.getElementById('pip-button');

var isMobile = false

const videoWorks = !!document.createElement('video').canPlayType;
if (videoWorks) {
    video.controls = false;
    videoControls.classList.remove('hidden');
}

var initial = false

// Add functions here

// togglePlay toggles the playback state of the video.
// If the video playback is paused or ended, the video is played
// otherwise, the video is paused
function togglePlay() {
    if (!initial) {
        initialClick()
        return
    }
    if (video.paused || video.ended) {
        video.play();
    } else {
        video.pause();
    }
}

// updatePlayButton updates the playback icon and tooltip
// depending on the playback state
function updatePlayButton() {
    playbackIcons.forEach((icon) => {
        icon.classList.toggle('hidden')
    });

    if (video.paused) {
        if (!isMobile) playButton.setAttribute('data-title', 'Play (k)');
        document.getElementById("pause-i").classList.toggle("hidden")
        document.getElementById("play-i").classList.toggle("hidden")
    } else {
        if (!isMobile) playButton.setAttribute('data-title', 'Pause (k)');
        document.getElementById("pause-i").classList.toggle("hidden")
        document.getElementById("play-i").classList.toggle("hidden")
    }
}

function initialClick() {
    initial = true;
    playbackAnimation.style.pointerEvents = "none"
    playbackAnimation.style.cursor = "unset"
    playbackAnimation.style.opacity = "0"
    document.getElementById("pause-i").style.opacity = "1"
    document.getElementById("play-i").style.opacity = "1"
    document.getElementById("pause-i").classList.toggle("hidden")
    document.getElementById("play-i").classList.toggle("hidden")
    document.getElementById("restart-i").classList.add('hidden')
    togglePlay()
    animatePlayback()
}

// formatTime takes a time length in seconds and returns the time in
// minutes and seconds
function formatTime(timeInSeconds) {
    const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

    return {
        minutes: result.substr(3, 2),
        seconds: result.substr(6, 2),
    };
}

// initializeVideo sets the video duration, and maximum value of the
// progressBar
function initializeVideo() {
    const videoDuration = Math.round(video.duration);
    seek.setAttribute('max', videoDuration);
    progressBar.setAttribute('max', videoDuration);
    const time = formatTime(videoDuration);
    duration.innerText = `${time.minutes}:${time.seconds}`;
    duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
}

// updateTimeElapsed indicates how far through the video
// the current playback is by updating the timeElapsed element
function updateTimeElapsed() {
    const time = formatTime(Math.round(video.currentTime));
    timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
    timeElapsed.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
}

// updateProgress indicates how far through the video
// the current playback is by updating the progress bar
function updateProgress() {
    seek.value = Math.floor(video.currentTime);
    progressBar.value = Math.floor(video.currentTime);
}


// videoEnded is called when the video ends and adds a rewind button
function videoEnded() {
    initial = false
    seek.value = Math.floor(video.currentTime);
    progressBar.value = Math.floor(video.currentTime);
    playbackAnimation.style.pointerEvents = "unset"
    playbackAnimation.style.cursor = "pointer"
    playbackAnimation.style.opacity = "1"
    document.getElementById("pause-i").classList.toggle("hidden")
    document.getElementById("play-i").classList.toggle("hidden")
    document.getElementById("pause-i").style.opacity = "0"
    document.getElementById("play-i").style.opacity = "0"
    document.getElementById("restart-i").classList.remove('hidden')
}

// updateSeekTooltip uses the position of the mouse on the progress bar to
// roughly work out what point in the video the user will skip to if
// the progress bar is clicked at that point
function updateSeekTooltip(event) {
    //console.log(event.pageX)
    const skipTo = Math.round(
        (event.offsetX / event.target.clientWidth) *
        parseInt(event.target.getAttribute('max'), 10)
    );


    if (event.offsetX > 0 && event.offsetX < Math.round(seek.getBoundingClientRect().width)) {
        showSeekTooltip()
        seek.setAttribute('data-seek', skipTo);
        const t = formatTime(skipTo);
        seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
        const rect = seek.getBoundingClientRect();
        seekTooltip.style.left = `${event.pageX - rect.left}px`;
    } else {
        hideSeekTooltip()
    }

}

function hideSeekTooltip() {
    seekTooltip.style.opacity = "0"
}
function showSeekTooltip() {
    seekTooltip.style.opacity = "1"
}

// skipAhead jumps to a different point in the video when the progress bar
// is clicked
function skipAhead(event) {
    const skipTo = event.target.dataset.seek
        ? event.target.dataset.seek
        : event.target.value;
    video.currentTime = skipTo;
    progressBar.value = skipTo;
    seek.value = skipTo;
}

// updateVolume updates the video's volume
// and disables the muted state if active
function updateVolume(e) {
    if (video.muted) {
        video.muted = false;
    }

    video.volume = volume.value;

    updateVolBar(volume.value);
}

function updateVolBar(v) {
    volumeBar.value = v
}

// updateVolumeIcon updates the volume icon so that it correctly reflects
// the volume of the video
function updateVolumeIcon() {
    volumeIcons.forEach((icon) => {
        icon.classList.add('hidden');
    });



    if (!isMobile) volumeButton.setAttribute('data-title', 'Mute (m)');

    if (video.muted || video.volume === 0) {
        volumeMute.classList.remove('hidden');
        if (!isMobile) volumeButton.setAttribute('data-title', 'Unmute (m)');
    } else if (video.volume > 0 && video.volume <= 0.5) {
        volumeLow.classList.remove('hidden');
    } else {
        volumeHigh.classList.remove('hidden');
    }
}

// toggleMute mutes or unmutes the video when executed
// When the video is unmuted, the volume is returned to the value
// it was set to before the video was muted
function toggleMute() {
    video.muted = !video.muted;

    if (video.muted) {
        if (!isMobile) volume.setAttribute('data-volume', volume.value);
        volume.value = 0;
        updateVolBar(0);
    } else {
        volume.value = volume.dataset.volume;
        updateVolBar(volume.dataset.volume);
    }
}

// animatePlayback displays an animation when
// the video is played or paused
function animatePlayback() {
    playbackAnimation.animate(
        [
            {
                opacity: 1,
                transform: 'translate(-50%, -50%)',
            },
            {
                opacity: 0,
                transform: 'translate(-50%, -50%)',
            },
        ],
        {
            duration: 500,
        }
    );
}

//shows playback
function showPlayback() {
    playbackAnimation.animate(
        [
            {
                opacity: 1,
                transform: 'scale(1)',
            },
            {
                opacity: 0,
                transform: 'scale(1.3)',
            },
        ],
        {
            duration: 500,
        }
    );
}

function setupTitles() {
    if (!isMobile) playButton.setAttribute('data-title', 'Play (k)');
    if (!isMobile) volumeButton.setAttribute('data-title', 'Mute (m)');
    if (!isMobile) fullscreenButton.setAttribute('data-title', 'Full screen (f)');
}

// toggleFullScreen toggles the full screen state of the video
// If the browser is currently in fullscreen mode,
// then it should exit and vice versa.
function toggleFullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        updateFullscreenButton()
    } else if (document.webkitFullscreenElement) {
        // Need this to support Safari
        document.webkitExitFullscreen();
        updateFullscreenButton()
    } else if (videoContainer.webkitRequestFullscreen) {
        // Need this to support Safari
        videoContainer.webkitRequestFullscreen();
        updateFullscreenButton()
    } else {
        videoContainer.requestFullscreen();
        updateFullscreenButton()
    }
}

// updateFullscreenButton changes the icon of the full screen button
// and tooltip to reflect the current full screen state of the video
function updateFullscreenButton() {
    fullscreenIcons.forEach((icon) => icon.classList.toggle('hidden'));


    if (document.fullscreenElement) {
        if (!isMobile) fullscreenButton.setAttribute('data-title', 'Full screen (f)');
    } else {
        if (!isMobile) fullscreenButton.setAttribute('data-title', 'Exit full screen (f)');
    }
}

// togglePip toggles Picture-in-Picture mode on the video
async function togglePip() {
    try {
        if (video !== document.pictureInPictureElement) {
            pipButton.disabled = true;
            await video.requestPictureInPicture();
        } else {
            await document.exitPictureInPicture();
        }
    } catch (error) {
        console.error(error);
    } finally {
        pipButton.disabled = false;
    }
}

// hideControls hides the video controls when not in use
// if the video is paused, the controls must remain visible
function hideControls() {
    if (!initial) {
        return
    }
    if (video.paused) {
        return;
    }

    videoControls.classList.add('hide');
}

// showControls displays the video controls
function showControls() {
    if (!initial) {
        return
    }
    videoControls.classList.remove('hide');
}

function toggleControls() {
    if (videoControls.classList.contains('hide')) {
        showControls()
    } else {
        hideControls()
    }
}

// keyboardShortcuts executes the relevant functions for
// each supported shortcut key
function keyboardShortcuts(event) {
    const { key } = event;
    switch (key) {
        case 'k':
            togglePlay();
            animatePlayback();
            if (video.paused) {
                showControls();
            } else {
                setTimeout(() => {
                    hideControls();
                }, 2000);
            }
            break;
        case 'm':
            toggleMute();
            break;
        case 'f':
            toggleFullScreen();
            break;
        //case 'p':
        //    togglePip();
        //    break;
    }
}

// Add eventlisteners here

playbackAnimation.addEventListener("click", initialClick)
playButton.addEventListener('click', togglePlay);
video.addEventListener('play', updatePlayButton);
video.addEventListener('pause', updatePlayButton);
video.addEventListener('loadedmetadata', initializeVideo);
video.addEventListener('timeupdate', updateTimeElapsed);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('ended', videoEnded);
video.addEventListener('volumechange', updateVolumeIcon);
video.addEventListener('mouseenter', showControls);
video.addEventListener('mouseleave', hideControls);
videoControls.addEventListener('mouseenter', showControls);
videoControls.addEventListener('mouseleave', hideControls);
seek.addEventListener('mousemove', updateSeekTooltip);
seek.addEventListener('mouseleave', hideSeekTooltip);
seek.addEventListener('mouseenter', showSeekTooltip);
seek.addEventListener('input', skipAhead);
volume.addEventListener('input', updateVolume);
volumeButton.addEventListener('click', toggleMute);
fullscreenButton.addEventListener('click', toggleFullScreen);
videoContainer.addEventListener('fullscreenchange', updateFullscreenButton);
//pipButton.addEventListener('click', togglePip);

document.addEventListener('DOMContentLoaded', () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // true for mobile device
        isMobile = true
        video.addEventListener('click', toggleControls);
        volumeControls.classList.add("vol-hidden")
        seekTooltip.classList.add("vol-hidden")
    } else {
        // false for not mobile device
        isMobile = false
        video.addEventListener('click', togglePlay);
        video.addEventListener('click', animatePlayback);
    }
    setupTitles()
    if (!('pictureInPictureEnabled' in document)) {
        //pipButton.classList.add('hidden');
    }
});
document.addEventListener('keyup', keyboardShortcuts);