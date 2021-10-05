
class VideoPlayer {
    constructor(el) {
        this.el = el
        this.videoSrc = this.el.getAttribute("data-video-src")
        this.videoThumb = this.el.getAttribute("data-video-thumb")
        this.el.classList.add("video-main-container")
        this.fillContent()

        // ! begin setting all elements
        this.video = this.el.querySelector("[data-video]")
        this.video.poster = this.videoThumb
        this.video.firstElementChild.src = this.videoSrc
        this.videoDuration

        this.videoControls = this.el.querySelector("[data-video-controls]")
        this.playButton = this.el.querySelector("[data-play]")
        this.playbackIcons = this.el.querySelectorAll(".playback-icons i")
        this.popupIcons = this.el.querySelectorAll(".popup-icons i")
        this.timeElapsed = this.el.querySelector("[data-time-elapsed]")
        this.duration = this.el.querySelector("[data-duration]")
        this.volumeBar = this.el.querySelector("[data-volume-bar]")
        this.seek = this.el.querySelector("[data-seek]")
        this.seekTooltip = this.el.querySelector("[data-seek-tooltip]")
        this.volumeControls = this.el.querySelector("[data-volume-controls]")
        this.volumeButton = this.el.querySelector("[data-volume-button]")
        this.volumeIcons = this.el.querySelectorAll('.volume-button i')
        this.volumeMute = this.el.querySelector("[data-volume-mute-i]")
        this.volumeDown = this.el.querySelector("[data-volume-down-i]")
        this.volumeUp = this.el.querySelector("[data-volume-up-i]")
        this.volume = this.el.querySelector("[data-volume-bar]")
        this.playbackAnimation = this.el.querySelector("[data-playback-animation]")
        this.fullscreenButton = this.el.querySelector("[data-fullscreen-button]")
        this.videoContainer = this.el.querySelector("[data-video-container]")
        this.fullscreenIcons = this.fullscreenButton.querySelectorAll('i')

        this.isMobile = false

        var videoWorks = !!document.createElement('video').canPlayType;
        if (videoWorks) {
            this.video.controls = false;
            this.videoControls.classList.remove('hidden');
        }

        this.initial = false

        var _self = this
        this.setUpListeners(this)
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // true for mobile device
            this.isMobile = true
            this.video.addEventListener('click', (e) => { this.toggleControls(e, _self) });
            this.volumeControls.classList.add("vol-hidden")
            this.seekTooltip.classList.add("vol-hidden")
        } else {
            // false for not mobile device
            this.isMobile = false
            this.video.addEventListener('click', (e) => { this.togglePlay(e, _self) });
            this.video.addEventListener('click', (e) => { this.animatePlayback(e, _self) });
        }
        this.setupTitles()
    }
    exampleEvent(e, _self) {
        _self = _self || this
    }

    setupTitles() {

        if (!this.isMobile) {
            this.playButton.setAttribute('data-title', 'Play (k)');
            this.volumeButton.setAttribute('data-title', 'Mute (m)');
            this.fullscreenButton.setAttribute('data-title', 'Full screen (f)');

        }

        if (!this.isMobile) {
            this.playButton.classList.add("title-hide")
            this.volumeButton.classList.add("title-hide")
            this.fullscreenButton.classList.add("title-hide")
        }
    }

    setUpListeners(_self) {
        this.playbackAnimation.addEventListener("click", (e) => { this.initialClick(e, _self) })//! done
        this.playButton.addEventListener('click', (e) => { this.togglePlay(e, _self) });//! done
        this.video.addEventListener('play', (e) => { this.updatePlayButton(e, _self) });//! done
        this.video.addEventListener('pause', (e) => { this.updatePlayButton(e, _self) });//! done
        this.video.addEventListener('loadedmetadata', (e) => { this.initializeVideo(e, _self) });//! done
        this.video.addEventListener('timeupdate', (e) => { this.updateTimeElapsed(e, _self) });//! done
        this.video.addEventListener('timeupdate', (e) => { this.updateProgress(e, _self) });//! done
        this.video.addEventListener('ended', (e) => { this.videoEnded(e, _self) });//! done
        this.video.addEventListener('volumechange', (e) => { this.updateVolumeIcon(e, _self) });//! done
        this.video.addEventListener('mouseenter', (e) => { this.showControls(e, _self) });//! done
        this.video.addEventListener('mouseleave', (e) => { this.hideControls(e, _self) });//! done
        this.videoControls.addEventListener('mouseenter', (e) => { this.showControls(e, _self) });//! done
        this.videoControls.addEventListener('mouseleave', (e) => { this.hideControls(e, _self) });//! done
        this.seek.addEventListener('mousemove', (e) => { this.updateSeekTooltip(e, _self) });//! done
        this.seek.addEventListener('mouseleave', (e) => { this.hideSeekTooltip(e, _self) });//! done
        this.seek.addEventListener('mouseenter', (e) => { this.showSeekTooltip(e, _self) });//! done
        this.seek.addEventListener('input', (e) => { this.skipAhead(e, _self) });//! done
        this.volume.addEventListener('input', (e) => { this.updateVolume(e, _self) });//! done
        this.volumeButton.addEventListener('click', (e) => { this.toggleMute(e, _self) });//! done
        this.fullscreenButton.addEventListener('click', (e) => { this.toggleFullScreen(e, _self) });//! done
        this.videoContainer.addEventListener('fullscreenchange', (e) => { this.updateFullscreenButton(e, _self) });//! done
    }

    initializeVideo(e) {
        this.videoDuration = Math.round(this.video.duration)
        this.seek.setAttribute("max", this.videoDuration)
        this.seek.style.setProperty("--percent", "0%")
        this.seek.style.setProperty("--percHandle", 0)

        var time = this.formatTime(this.videoDuration)
        this.duration.innerText = `${time.minutes}:${time.seconds}`
        this.duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
    }

    formatTime(timeInSeconds) {
        var result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

        return {
            minutes: result.substr(3, 2),
            seconds: result.substr(6, 2),
        };
    }

    initialClick() {
        this.initial = true;
        this.playbackAnimation.style.pointerEvents = "none"
        this.playbackAnimation.style.cursor = "unset"
        this.playbackAnimation.style.opacity = "0"
        this.el.querySelector("[data-pause-i]").style.opacity = "1"
        this.el.querySelector("[data-play-i]").style.opacity = "1"
        this.el.querySelector("[data-pause-i]").classList.toggle("hidden")
        this.el.querySelector("[data-play-i]").classList.toggle("hidden")
        this.el.querySelector("[data-restart-i]").classList.add('hidden')
        this.togglePlay()
        this.animatePlayback()
    }

    togglePlay() {
        if (!this.initial) {
            this.initialClick()
            return
        }
        if (this.video.paused || this.video.ended) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    animatePlayback() {
        this.playbackAnimation.animate(
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

    updatePlayButton() {
        this.playbackIcons.forEach((icon) => {
            icon.classList.toggle('hidden')
        });

        if (this.video.paused) {
            if (!this.isMobile) this.playButton.setAttribute('data-title', 'Play (k)');
            this.el.querySelector("[data-pause-i]").classList.toggle("hidden")
            this.el.querySelector("[data-play-i]").classList.toggle("hidden")
        } else {
            if (!this.isMobile) this.playButton.setAttribute('data-title', 'Pause (k)');
            this.el.querySelector("[data-pause-i]").classList.toggle("hidden")
            this.el.querySelector("[data-play-i]").classList.toggle("hidden")
        }
    }

    updateTimeElapsed() {
        var time = this.formatTime(Math.round(this.video.currentTime));
        this.timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
        this.timeElapsed.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
    }

    updateProgress() {
        this.seek.value = Math.floor(this.video.currentTime);
        this.seek.style.setProperty("--percent", Math.floor(this.video.currentTime / this.videoDuration * 100) + "%")
        this.seek.style.setProperty("--percHandle", (this.video.currentTime / this.videoDuration))
    }

    videoEnded() {
        this.initial = false
        this.seek.value = Math.floor(this.video.currentTime);
        this.seek.style.setProperty("--percent", Math.floor(this.video.currentTime / this.videoDuration * 100) + "%")
        this.seek.style.setProperty("--percHandle", (this.video.currentTime / this.videoDuration))
        this.playbackAnimation.style.pointerEvents = "unset"
        this.playbackAnimation.style.cursor = "pointer"
        this.playbackAnimation.style.opacity = "1"
        this.el.querySelector("[data-pause-i]").classList.toggle("hidden")
        this.el.querySelector("[data-play-i]").classList.toggle("hidden")
        this.el.querySelector("[data-pause-i]").style.opacity = "0"
        this.el.querySelector("[data-play-i]").style.opacity = "0"
        this.el.querySelector("[data-restart-i]").classList.remove('hidden')
    }

    updateVolumeIcon() {
        this.volumeIcons.forEach((icon) => {
            icon.classList.add('hidden');
        });

        if (!this.isMobile) this.volumeButton.setAttribute('data-title', 'Mute (m)');

        if (this.video.muted || this.video.volume === 0) {
            this.volumeMute.classList.remove('hidden');
            if (!this.isMobile) this.volumeButton.setAttribute('data-title', 'Unmute (m)');
        } else if (this.video.volume > 0 && this.video.volume <= 0.5) {
            this.volumeDown.classList.remove('hidden');
        } else {
            this.volumeUp.classList.remove('hidden');
        }
    }

    showControls() {
        if (!this.initial) {
            return
        }
        this.videoControls.classList.remove('hide');
    }

    hideControls() {
        if (!this.initial) {
            return
        }
        if (this.video.paused) {
            return;
        }

        this.videoControls.classList.add('hide');
    }

    toggleControls() {
        if (this.videoControls.classList.contains('hide')) {
            this.showControls()
        } else {
            this.hideControls()
        }
    }

    updateSeekTooltip(e) {
        var skipTo = Math.round(
            (e.offsetX / e.target.clientWidth) *
            parseInt(e.target.getAttribute('max'), 10)
        );


        if (e.offsetX > 0 && e.offsetX < Math.round(this.seek.getBoundingClientRect().width)) {
            this.showSeekTooltip()
            this.seek.setAttribute('data-seek', skipTo);
            var t = this.formatTime(skipTo);
            this.seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
            var rect = this.seek.getBoundingClientRect();
            this.seekTooltip.style.left = `${e.pageX - rect.left}px`;
        } else {
            this.hideSeekTooltip()
        }

    }

    showSeekTooltip() {
        this.seekTooltip.style.opacity = "1"
    }

    hideSeekTooltip() {
        this.seekTooltip.style.opacity = "0"
    }

    skipAhead(e) {
        var skipTo = e.target.dataset.seek
            ? e.target.dataset.seek
            : e.target.value;
        this.video.currentTime = skipTo;
        this.seek.style.setProperty("--percent", Math.floor(skipTo / this.videoDuration * 100) + "%")
        this.seek.style.setProperty("--percHandle", (skipTo / this.videoDuration))
        this.seek.value = skipTo;
    }

    updateVolume(e) {
        if (this.video.muted) {
            this.video.muted = false;
        }

        this.video.volume = this.volume.value;

        this.updateVolBar(this.volume.value);
    }

    updateVolBar(v) {
        this.volumeBar.value = v
    }

    toggleMute() {
        this.video.muted = !this.video.muted;

        if (this.video.muted) {
            if (!this.isMobile) this.volume.setAttribute('data-volume', this.volume.value);
            this.volume.value = 0;
            this.updateVolBar(0);
        } else {
            this.volume.value = this.volume.dataset.volume;
            this.updateVolBar(this.volume.dataset.volume);
        }
    }

    toggleFullScreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (document.webkitFullscreenElement) {
            // Need this to support Safari
            document.webkitExitFullscreen();
        } else if (this.videoContainer.webkitRequestFullscreen) {
            // Need this to support Safari
            this.videoContainer.webkitRequestFullscreen();
        } else {
            this.videoContainer.requestFullscreen();
        }
        this.updateFullscreenButton()
    }

    updateFullscreenButton() {
        this.fullscreenIcons.forEach((icon) => icon.classList.toggle('hidden'));
    }


    fillContent() {
        this.el.innerHTML = `<div class="video-container" data-video-container>
        <div class="playback-animation popup-icons"
            data-playback-animation>
            <i class="ri-pause-fill hidden" data-pause-i></i>
            <i class="ri-play-fill" data-play-i></i>
            <i class="ri-restart-line hidden" data-restart-i></i>
        </div>

        <video
            controls
            class="video"
            data-video
            preload="metadata"
            poster="">
            <source
                src=""
                type="video/mp4"
                />
        </video>
        <div class="video-controls hidden" data-video-controls>
            <div class="video-progress">
                <input class="seek" data-seek value="0" min="0"
                    type="range"
                    step="1" data-percent="50%">
                <div class="seek-tooltip" data-seek-tooltip>00:00</div>
            </div>

            <div class="bottom-controls">
                <div class="left-controls">
                    <button data-play class="playback-icons
                        control-btn">
                        <i class="ri-pause-fill hidden"></i>
                        <i class="ri-play-fill"></i>
                    </button>

                    <div class="volume-controls">
                        <button class="volume-button
                            control-btn"
                            data-volume-button>
                            <i class="ri-volume-mute-fill
                                hidden" data-volume-mute-i></i>
                            <i class="ri-volume-down-fill
                                hidden" data-volume-down-i></i>
                            <i class="ri-volume-up-fill"
                                data-volume-up-i></i>
                        </button>

                        <input class="volume" data-volume-bar
                            value="1"
                            data-mute="0.5" type="range" max="1"
                            min="0" step="0.01">
                    </div>


                    <div class="time">
                        <time data-time-elapsed>00:00</time>
                        <span> / </span>
                        <time data-duration>00:00</time>
                    </div>
                </div>



                <div class="right-controls">
                    <button
                        class="fullscreen-button control-btn
                        title-hide"
                        data-fullscreen-button>
                        <i class="ri-fullscreen-line"></i>
                        <i class="ri-fullscreen-exit-line
                            hidden"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>`
    }
}

document.querySelectorAll("[data-video]").forEach(e => {
    new VideoPlayer(e)
});