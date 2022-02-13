export default class TextContent {
  constructor(parentEl, text) {
    this.parentEl = parentEl;
    this.text = text;
    this.classes = this.constructor.classes;
  }

  static get classes() {
    return {
      widget: 'text-widget',
    };
  }

  bindToDOM() {
    this.widget = document.createElement('div');
    this.widget.className = this.classes.widget;
    this.widget.innerHTML = `<p>${this.text}</p>`;

    this.parentEl.prepend(this.widget);
  }
}
