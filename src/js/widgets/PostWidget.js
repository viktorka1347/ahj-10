import TextContent from './TextContent';
import AudioContent from './AudioContent';
import VideoContent from './VideoContent';
import { coordsToString, dateTimeToString } from '../tools/utils';

export const textType = 'text';
export const audioType = 'audio';
export const videoType = 'video';

export default class PostWidget {
  constructor(parentEl, position, type, content) {
    this.parentEl = parentEl;
    this.position = position;
    this.type = type;
    this.content = content;
    this.classes = this.constructor.classes;
  }

  static get classes() {
    return {
      widget: 'post-widget',
      leftPanel: 'left-panel',
      position: 'position',
      coords: 'coords',
      eye: 'eye',
      rightPanel: 'right-panel',
      datetime: 'datetime',
    };
  }

  static get markup() {
    return `
      <div class="${this.classes.leftPanel}">
        <div class="${this.classes.position}">
          <p class="${this.classes.coords}"></p>
          <img class="${this.classes.eye}" src="img/eye.png" alt="eye">
        </div>    
      </div>
      <div class="${this.classes.rightPanel}">
        <p class="${this.classes.datetime}">
        </p>
      </div>
    `;
  }

  bindToDOM() {
    this.widget = document.createElement('div');
    this.widget.className = this.classes.widget;
    this.widget.innerHTML = this.constructor.markup;

    this.leftPanel = this.widget.querySelector(`.${this.classes.leftPanel}`);

    this.coords = this.widget.querySelector(`.${this.classes.coords}`);
    this.coords.innerHTML = coordsToString(this.position.coords);

    this.datetime = this.widget.querySelector(`.${this.classes.datetime}`);
    this.datetime.innerText = dateTimeToString(this.position.timestamp);

    switch (this.type) {
      case textType:
        this.htmlContent = new TextContent(this.leftPanel, this.content);
        break;
      case audioType:
        this.htmlContent = new AudioContent(this.leftPanel, this.content);
        break;
      case videoType:
        this.htmlContent = new VideoContent(this.leftPanel, this.content);
        break;
      default:
        delete this;
        return;
    }

    this.htmlContent.bindToDOM();

    this.parentEl.prepend(this.widget);
  }
}
