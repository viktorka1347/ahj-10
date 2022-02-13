export default class AudioVideoErrorPopup {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.classes = this.constructor.classes;
  }

  static get classes() {
    return {
      widget: 'audio-video-popup',
      form: 'audio-video-form',
      text: 'text',
      buttons: 'buttons',
      buttonOk: 'button-ok',
    };
  }

  static get markup() {
    return `
      <form class="${this.classes.form}">
        <p>
          Что-то пошло не так
        </p>
        <p class="${this.classes.text}">
        </p>
        <div class="${this.classes.buttons}">
          <button class="${this.classes.buttonOk}" type="submit">
            OK
          </button>
        </div>
      </form>
    `;
  }

  bindToDOM() {
    this.widget = document.createElement('div');
    this.widget.className = `${this.classes.widget} popup hidden`;
    this.widget.innerHTML = this.constructor.markup;

    this.form = this.widget.querySelector(`.${this.classes.form}`);
    this.text = this.widget.querySelector(`.${this.classes.text}`);

    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.hide();
    });

    this.parentEl.append(this.widget);
  }

  show(videoMode) {
    const text = `К сожалению, нам не удалось выполнить ${videoMode ? 'видео' : 'аудио'}запись, `
      + `пожалуйста, дайте разрешение на использование ${videoMode ? 'камеры и микрофона' : 'микрофона'} `
      + 'или откройте страницу в другом браузере.';
    this.text.innerText = text;
    this.widget.classList.remove('hidden');
  }

  hide() {
    this.widget.classList.add('hidden');
  }
}
