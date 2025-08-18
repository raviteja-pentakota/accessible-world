// This function finds all custom video players and adds event listeners
function initializeCustomVideoPlayers() {
    const videoContainers = document.querySelectorAll('.video-container');

    videoContainers.forEach((container) => {
        const videoElement = container.querySelector('.custom-video');
        const playPauseBtn = container.querySelector('.playPause');
        const muteBtn = container.querySelector('.mute');
        const fullscreenBtn = container.querySelector('.fullscreen');
        const rewindBtn = container.querySelector('.rewind');
        const forwardBtn = container.querySelector('.forward');
        const seekSlider = container.querySelector('.seek-slider');
        const volumeSlider = container.querySelector('.volume-slider');
        
        const skipTime = 10;

        // Disable browser's default video controls
        videoElement.controls = false;

        // Play/Pause toggle
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                if (videoElement.paused) {
                    videoElement.play();
                    playPauseBtn.textContent = 'Pause';
                } else {
                    videoElement.pause();
                    playPauseBtn.textContent = 'Play';
                }
            });
        }

        // Mute/Unmute toggle
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                videoElement.muted = !videoElement.muted;
                muteBtn.textContent = videoElement.muted ? 'Unmute' : 'Mute';
                volumeSlider.value = videoElement.muted ? 0 : videoElement.volume;
            });
        }

        // Fullscreen functionality
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    if (container.requestFullscreen) {
                        container.requestFullscreen();
                    } else if (container.webkitRequestFullscreen) {
                        container.webkitRequestFullscreen();
                    } else if (container.msRequestFullscreen) {
                        container.msRequestFullscreen();
                    }
                }
            });
        }

        // Update fullscreen button label on change
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                fullscreenBtn.textContent = 'Exit Fullscreen';
            } else {
                fullscreenBtn.textContent = 'Fullscreen';
            }
        });

        // Rewind functionality
        if (rewindBtn) {
            rewindBtn.addEventListener('click', () => {
                videoElement.currentTime -= skipTime;
            });
        }

        // Forward functionality
        if (forwardBtn) {
            forwardBtn.addEventListener('click', () => {
                videoElement.currentTime += skipTime;
            });
        }
        
        // Seek slider functionality
        if (seekSlider) {
            videoElement.addEventListener('loadedmetadata', () => {
                seekSlider.max = videoElement.duration;
            });
            
            videoElement.addEventListener('timeupdate', () => {
                seekSlider.value = videoElement.currentTime;
            });

            seekSlider.addEventListener('input', () => {
                videoElement.currentTime = seekSlider.value;
            });
        }

        // Volume slider functionality
        if (volumeSlider) {
            volumeSlider.addEventListener('input', () => {
                videoElement.volume = volumeSlider.value;
                videoElement.muted = false; // Unmute if the user adjusts the volume
                muteBtn.textContent = 'Mute';
            });
        }
    });
}

// Automatically initialize custom video players when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeCustomVideoPlayers();
});