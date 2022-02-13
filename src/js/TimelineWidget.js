import PostWidget, { textType, audioType, videoType } from './widgets/PostWidget';
import GeolocationErrorPopup from './popups/GeolocationErrorPopup';
import AudioVideoErrorPopup from './popups/AudioVideoErrorPopup';
import { timer } from './tools/utils';

export default class TimelineWidget {
  constructor(parentEl, parentPopupEl) {
    this.parentEl = parentEl;
    this.parentPopupEl = parentPopupEl;
    this.classes = this.constructor.classes;
  }

  static get classes() {
    return {
      widget: 'time-line-widget',
      posts: 'posts',
      video: 'video',
      form: 'form',
      input: 'text',
      textButtons: 'text-buttons',
      recordButtons: 'record-buttons',
      buttonAudio: 'button-audio',
      buttonVideo: 'button-video',
      buttonOk: 'button-ok',
      buttonCancel: 'button-cancel',
      timer: 'timer',
    };
  }

  static get markup() {
    return `
      <div class="${this.classes.posts}">
      </div>
      <video class="${this.classes.video} hidden" muted></video>
      <form class="${this.classes.form}">
        <input class="${this.classes.input}" name="${this.classes.input}" placeholder="Введите текст и нажмите Enter">
        <div class="${this.classes.textButtons}">
          <button class="${this.classes.buttonAudio}" type="button">
            <img src="img/audio.png" alt="record audio">
          </button>
          <button class="${this.classes.buttonVideo}" type="button">
            <img src="img/video.png" alt="record audio">
          </button>
        </div>
        <div class="${this.classes.recordButtons} hidden">
          <button class="${this.classes.buttonOk}" type="button">
            &#x2714;
          </button>
          <p class="timer">
          </p>
          <button class="${this.classes.buttonCancel}" type="button">
            &#x2613;
          </button>
        </div>
      </form>
    `;
  }

  bindToDOM() {
    this.widget = document.createElement('div');
    this.widget.className = this.classes.widget;
    this.widget.innerHTML = this.constructor.markup;

    this.posts = this.widget.querySelector(`.${this.classes.posts}`);
    this.video = this.widget.querySelector(`.${this.classes.video}`);
    this.form = this.widget.querySelector(`.${this.classes.form}`);

    this.text = this.form.querySelector(`.${this.classes.input}`);
    this.textButtons = this.form.querySelector(`.${this.classes.textButtons}`);
    this.recordButtons = this.form.querySelector(`.${this.classes.recordButtons}`);

    this.buttonAudio = this.form.querySelector(`.${this.classes.buttonAudio}`);
    this.buttonVideo = this.form.querySelector(`.${this.classes.buttonVideo}`);
    this.buttonOk = this.form.querySelector(`.${this.classes.buttonOk}`);
    this.buttonCancel = this.form.querySelector(`.${this.classes.buttonCancel}`);

    this.timer = this.form.querySelector(`.${this.classes.timer}`);

    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();

      const text = this.text.value.trim();
      this.text.value = '';
      if (!text) {
        return;
      }

      this.newPostType = textType;
      this.newPostContent = text;
      this.getPosition();
    });

    this.buttonAudio.addEventListener('click', () => this.startRecord(audioType));
    this.buttonVideo.addEventListener('click', () => this.startRecord(videoType));
    this.buttonOk.addEventListener('click', () => this.saveRecord());
    this.buttonCancel.addEventListener('click', () => this.cancelRecord());

    this.parentEl.append(this.widget);

    this.geolocationPopup = new GeolocationErrorPopup(
      this.parentPopupEl,
      (position) => this.addPost(position),
    );
    this.geolocationPopup.bindToDOM();

    this.audioVideoPopup = new AudioVideoErrorPopup(this.parentPopupEl);
    this.audioVideoPopup.bindToDOM();
  }

  getPosition() {
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => this.addPost(position),
        () => this.geolocationPopup.show(),
      );
    } catch (e) {
      this.geolocationPopup.show();
    }
  }

  addPost(position) {
    const post = new PostWidget(this.posts, position, this.newPostType, this.newPostContent);
    post.bindToDOM();
    this.posts.scrollTop = 0;
  }

  async startRecord(mode) {
    this.text.value = '';
    this.newPostType = mode;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: mode === videoType,
      });

      this.recorder = new MediaRecorder(stream);
      if (mode === videoType) {
        this.video.classList.remove('hidden');
        this.video.srcObject = stream;
        this.video.play();
      }
      const chunks = [];

      this.recorder.addEventListener('start', () => {
        this.showRecorder();
        const begin = Date.now();
        this.timerId = setInterval(
          () => {
            const time = timer(begin);
            if (this.timer.innerText !== time) {
              this.timer.innerText = time;
            }

            if (this.timer.innerText === (mode === videoType ? '00:10' : '02:00')) {
              this.saveRecord();
            }
          },
          100,
        );
      });

      this.recorder.addEventListener('dataavailable', (evt) => {
        chunks.push(evt.data);
      });

      this.recorder.addEventListener('stop', () => {
        clearInterval(this.timerId);
        stream.getTracks().forEach((track) => track.stop());
        this.video.srcObject = null;
        this.video.classList.add('hidden');
        delete this.recorder;

        if (!this.save) {
          return;
        }
        this.newPostContent = new Blob(chunks);
        this.getPosition();
      });

      this.recorder.start();
    } catch (e) {
      this.audioVideoPopup.show(mode === videoType);
    }
  }

  saveRecord() {
    this.hideRecorder();
    this.save = true;
    this.recorder.stop();
  }

  cancelRecord() {
    this.hideRecorder();
    this.save = false;
    this.recorder.stop();
  }

  showRecorder() {
    this.textButtons.classList.add('hidden');
    this.timer.innerText = '00:00';
    this.recordButtons.classList.remove('hidden');
  }

  hideRecorder() {
    this.recordButtons.classList.add('hidden');
    this.textButtons.classList.remove('hidden');
  }
}
