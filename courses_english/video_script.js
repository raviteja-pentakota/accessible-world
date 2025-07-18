const videos = document.querySelectorAll('.custom-video');

videos.forEach((videoContainer, index) => {
  const container = videoContainer.parentElement;
  const playPauseBtn = container.querySelector('.playPause');
  const muteBtn = container.querySelector('.mute');
  const fullscreenBtn = container.querySelector('.fullscreen');

  videoContainer.controls = false;

  playPauseBtn.addEventListener('click', () => {
    if (videoContainer.paused) {
      videoContainer.play();
      playPauseBtn.textContent = 'Pause';
    } else {
      videoContainer.pause();
      playPauseBtn.textContent = 'Play';
    }
  });

  muteBtn.addEventListener('click', () => {
    videoContainer.muted = !videoContainer.muted;
    muteBtn.textContent = videoContainer.muted ? 'Unmute' : 'Mute';
  });

  fullscreenBtn.addEventListener('click', () => {
    if (videoContainer.requestFullscreen) {
      videoContainer.requestFullscreen();
    } else if (videoContainer.webkitRequestFullscreen) {
      videoContainer.webkitRequestFullscreen();
    } else if (videoContainer.msRequestFullscreen) {
      videoContainer.msRequestFullscreen();
    }
  });
});
