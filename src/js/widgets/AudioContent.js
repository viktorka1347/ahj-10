export default class AudioContent {
  constructor(parentEl, blob) {
    this.parentEl = parentEl;
    this.blob = blob;
    this.play = false;
    this.classes = this.constructor.classes;
  }

  static get classes() {
    return {
      widget: 'audio-widget',
      audio: 'audio',
      button: 'button-play',
      icon: 'image-play',
      progress: 'progress',
    };
  }

  static get markup() {
    return `
      <audio class="${this.classes.audio}">
      </audio>
      <button class="${this.classes.button}" type="button">
        <img class="${this.classes.icon}" src="img/play.png" width="50%" alt="play button">
      </button>
      <input class="${this.classes.progress}" type="range" min="0" step="0.1" value="0">  
    `;
  }

  bindToDOM() {
    this.widget = document.createElement('div');
    this.widget.className = this.classes.widget;
    this.widget.innerHTML = this.constructor.markup;

    this.audio = this.widget.querySelector(`.${this.classes.audio}`);
    this.audio.src = URL.createObjectURL(this.blob);
    this.button = this.widget.querySelector(`.${this.classes.button}`);
    this.icon = this.widget.querySelector(`.${this.classes.icon}`);
    this.progress = this.widget.querySelector(`.${this.classes.progress}`);

    this.audio.addEventListener('durationchange', () => {
      if (this.audio.duration === Infinity) {
        this.audio.currentTime = 1e100;
        return;
      }

      this.audio.currentTime = 0.01;
      this.progress.max = +this.audio.duration.toFixed(1);
    });

    this.audio.addEventListener('timeupdate', () => {
      this.progress.value = +this.audio.currentTime.toFixed(1);
    });

    this.audio.addEventListener('ended', () => {
      this.icon.src = 'img/play.png';
      this.progress.disabled = 0;
    });

    this.button.addEventListener('click', () => {
      if (this.audio.paused) {
        this.icon.src = 'img/pause.png';
        this.progress.disabled = 1;
        this.audio.play();
      } else {
        this.audio.pause();
        this.icon.src = 'img/play.png';
        this.progress.disabled = 0;
      }
    });

    this.progress.addEventListener('change', () => {
      this.audio.currentTime = this.progress.value;
    });

    this.parentEl.prepend(this.widget);
  }
}
