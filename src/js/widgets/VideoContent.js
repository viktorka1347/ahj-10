export default class VideoContent {
  constructor(parentEl, blob) {
    this.parentEl = parentEl;
    this.blob = blob;
    this.play = false;
    this.classes = this.constructor.classes;
  }

  static get classes() {
    return {
      widget: 'video-widget',
      frame: 'video-frame',
      video: 'video',
      button: 'button-play',
      progress: 'progress',
    };
  }

  static get markup() {
    return `
      <div class="${this.classes.frame}">
        <video class="${this.classes.video}">
        </video>
        <button class="${this.classes.button}" type="button">
          <img src="img/play.png" width="50%" alt="play button">
        </button>
      </div>
      <input class="${this.classes.progress}" type="range" min="0" step="0.1" value="0">  
    `;
  }

  bindToDOM() {
    this.widget = document.createElement('div');
    this.widget.className = this.classes.widget;
    this.widget.innerHTML = this.constructor.markup;

    this.video = this.widget.querySelector(`.${this.classes.video}`);
    this.video.src = URL.createObjectURL(this.blob);
    this.button = this.widget.querySelector(`.${this.classes.button}`);
    this.progress = this.widget.querySelector(`.${this.classes.progress}`);

    this.video.addEventListener('durationchange', () => {
      if (this.video.duration === Infinity) {
        this.video.currentTime = 1e100;
        return;
      }

      this.video.currentTime = 0.01;
      this.progress.max = +this.video.duration.toFixed(1);
    });

    this.video.addEventListener('timeupdate', () => {
      this.progress.value = +this.video.currentTime.toFixed(1);
    });

    this.video.addEventListener('click', () => {
      this.video.pause();
      this.stopPlay();
    });

    this.video.addEventListener('ended', () => {
      this.stopPlay();
    });

    this.button.addEventListener('click', () => {
      this.startPlay();
    });

    this.progress.addEventListener('change', () => {
      this.video.currentTime = this.progress.value;
    });

    this.parentEl.prepend(this.widget);
  }

  startPlay() {
    this.progress.disabled = 1;
    this.button.classList.add('hidden');
    this.video.play();
  }

  stopPlay() {
    this.progress.disabled = 0;
    this.button.classList.remove('hidden');
  }
}
