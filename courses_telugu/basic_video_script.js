// This function finds all custom video players and adds event listeners
function initializeCustomVideoPlayers() {
  const videos = document.querySelectorAll('.custom-video');

  videos.forEach((videoElement) => {
    const container = videoElement.parentElement;
    const playPauseBtn = container.querySelector('.playPause');
    const muteBtn = container.querySelector('.mute');
    const fullscreenBtn = container.querySelector('.fullscreen');

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
  });
}

// Optional: Automatically initialize if videos are already on the page
document.addEventListener('DOMContentLoaded', () => {
  initializeCustomVideoPlayers();
});
