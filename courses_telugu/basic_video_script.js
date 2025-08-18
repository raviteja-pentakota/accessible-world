// This function finds all custom video players and adds event listeners
function initializeCustomVideoPlayers() {
    const videoContainers = document.querySelectorAll('.video-container');

    videoContainers.forEach((container) => {
        const videoElement = container.querySelector('.custom-video');
        const playPauseBtn = container.querySelector('.playPause');
        const muteBtn = container.querySelector('.mute');
        const fullscreenBtn = container.querySelector('.fullscreen');
        
        // New: Select the rewind and forward buttons within this specific container
        const rewindBtn = container.querySelector('.rewind');
        const forwardBtn = container.querySelector('.forward');
        
        // Define the time to skip (e.g., 10 seconds)
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
            });
        }

        // Fullscreen
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (videoElement.requestFullscreen) {
                    videoElement.requestFullscreen();
                } else if (videoElement.webkitRequestFullscreen) {
                    videoElement.webkitRequestFullscreen();
                } else if (videoElement.msRequestFullscreen) {
                    videoElement.msRequestFullscreen();
                }
            });
        }

        // New: Rewind functionality
        if (rewindBtn) {
            rewindBtn.addEventListener('click', () => {
                videoElement.currentTime -= skipTime;
            });
        }

        // New: Forward functionality
        if (forwardBtn) {
            forwardBtn.addEventListener('click', () => {
                videoElement.currentTime += skipTime;
            });
        }
    });
}

// Automatically initialize custom video players when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeCustomVideoPlayers();
});