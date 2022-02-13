import validatePosition from '../tools/validation';

export default class GeolocationErrorPopup {
  constructor(parentEl, callback) {
    this.parentEl = parentEl;
    this.callback = callback;
    this.classes = this.constructor.classes;
  }

  static get classes() {
    return {
      widget: 'geolocation-popup',
      form: 'geolocation-form',
      input: 'position',
      error: 'error',
      buttons: 'buttons',
      buttonOk: 'button-ok',
      buttonCancel: 'button-cancel',
    };
  }

  static get markup() {
    return `
      <form class="${this.classes.form}">
        <p>
          Что-то пошло не так
        </p>
        <p>
          К сожалению, нам не удалось определить ваше местоположение, пожалуйста,
          дайте разрешение на использование геолокации или введите координаты вручную.
        </p>
        <p>
          Широта и долгота через запятую 
        </p>
        <input class="${this.classes.input}" name="${this.classes.input}" placeholder="Пример: 51.50851, -0.12572">
        <p class="${this.classes.error}">
        </p>
        <div class="${this.classes.buttons}">
          <button class="${this.classes.buttonCancel}" type="reset">
            Отмена
          </button>
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
    this.input = this.form.querySelector(`.${this.classes.input}`);
    this.error = this.form.querySelector(`.${this.classes.error}`);

    this.form.addEventListener('submit', (evt) => this.setPosition(evt));
    this.form.addEventListener('reset', () => this.hide());

    this.parentEl.append(this.widget);
  }

  show() {
    this.widget.classList.remove('hidden');
  }

  hide() {
    this.widget.classList.add('hidden');
    this.hideError();
  }

  showError(error) {
    this.error.innerText = error;
  }

  hideError() {
    this.error.innerText = '';
  }

  setPosition(evt) {
    evt.preventDefault();
    try {
      const position = validatePosition(this.input.value);
      this.hide();
      this.input.value = '';
      this.callback(position);
    } catch (e) {
      this.showError(e.message);
    }
  }
}
