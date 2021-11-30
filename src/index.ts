import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import santa from './santaURI';
import './santa-present';
import { SantaPresent } from './santa-present';

function rangeMap(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

@customElement('flying-santa')
export class FlyingSanta extends LitElement {
  static get styles() {
    return css`
      :host {
        position: absolute;
        display: block;
        --scale-x: 1;
        --santa-rotate: 10deg;
        z-index: 999999;
        transform: rotate(var(--santa-rotate));
      }

      :host([x-direction="left"]) {
        --scale-x: -1;
        transform: rotate(calc(var(--santa-rotate) * -1));
      }

      img {
        width: 250px;
        transform: scaleX(var(--scale-x));
      }
    `;
  }

  @property({ type: 'String', reflect: true, attribute: 'x-direction' })
  xDirection = 'right';

  @property({ type: 'Number', reflect: true, attribute: 'change-speed' })
  changeSpeed = 5000;

  @property({ type: 'Number', reflect: true })
  speed = 1;

  @property({ type: 'Number', reflect: true, attribute: 'presents-distance' })
  presentsDistance = 100;

  @property({ type: 'Number', reflect: true, attribute: 'presents-interval' })
  presentsInterval = 100;

  @property({ type: 'Number', reflect: true, attribute: 'presents-drop-speed' })
  presentsDropSpeed = 0.5;

  debounceTimeStamp = 0;
  rotate: 'clockwise' | 'counter-clockwise' = 'clockwise';

  mouseX: number;
  mouseY: number;
  velocity = { x: 0, y: 0 };
  velocityInterval: ReturnType<typeof setInterval>;
  moveInterval: ReturnType<typeof setInterval>;
  _rotation = 5;

  connectedCallback() {
    super.connectedCallback();
    if (this.parentElement !== document.documentElement) {
      document.documentElement.prepend(this);
    } else {
      this.init();
    }
  }

  render() {
    return html`
      <img src="data:image/gif;base64,${santa}" />
    `;
  }

  get frameWidth() {
    return document.documentElement.getBoundingClientRect().width;
  }

  get frameHeight() {
    return document.documentElement.getBoundingClientRect().height;
  }

  get x() {
    return parseFloat(
      getComputedStyle(this).getPropertyValue('left').replace('px', '')
    );
  }

  set x(value) {
    this.style.setProperty('left', `${value}px`);

    if (value > this.frameWidth - this.getBoundingClientRect().width) {
      this.boundaryHit('right');
    }

    if (value < 0) {
      this.boundaryHit('left');
    }
  }

  get y() {
    return parseFloat(
      getComputedStyle(this).getPropertyValue('top').replace('px', '')
    );
  }

  set y(value) {
    this.style.setProperty('top', `${value}px`);

    if (
      value >
      this.frameHeight - this.getBoundingClientRect().height
    ) {
      this.boundaryHit('bottom');
    }

    if (value < 0) {
      this.boundaryHit('top');
    }
  }

  get rotation() {
    return this._rotation;
  }

  set rotation(value) {
    this.style.setProperty('--santa-rotate', `${value}deg`);
    this._rotation = value;
  }

  init() {
    const xMiddle = this.frameWidth / 2;
    const yMiddle = document.documentElement.clientHeight / 2;

    this.x = xMiddle;
    this.y = yMiddle;
    this.randomizeVelocity();
    this.startVelocityInterval();
    requestAnimationFrame(() => {
      this.move();
    });

    setInterval(() => {
      this.debounceTimeStamp++;
    });

    document.documentElement.addEventListener('mousemove', (ev) => {
      this.checkDistance({ x: ev.pageX, y: ev.pageY });
    });
  }

  move() {
    if (this.rotation > 25) {
      this.rotate = 'counter-clockwise';
    } else if (this.rotation < 5) {
      this.rotate = 'clockwise';
    }
    this.rotation += this.rotate === 'clockwise' ? 0.1 : -0.1;
    this.x = this.x + this.velocity.x * this.speed;
    this.y = this.y + this.velocity.y * this.speed;
    requestAnimationFrame(this.move.bind(this));
  }

  randomizeVelocity(forced: { x?: number, y?: number} = {}) {
    const { x: _x, y: _y } = forced;
    const x = _x || rangeMap(Math.random(), 0, 1, -1, 1);
    const y = _y || rangeMap(Math.random(), 0, 1, -1, 1);
    this.velocity = { x, y };
    this.xDirection = x > 0 ? 'right' : 'left';
  }

  throwPresents() {
    if (this.debounceTimeStamp > this.presentsInterval) { // debounce
      this.throwPresent();
      this.debounceTimeStamp = 0;
    }
  }

  throwPresent() {
    const el = document.createElement('santa-present') as SantaPresent;
    const santaOffsetX = this.xDirection === 'left' ? 180 : 70;
    const santaOffsetY = 80;
    el.x = this.x + santaOffsetX;
    el.y = this.y + santaOffsetY;
    el.dropSpeed = this.presentsDropSpeed;
    el.velocity = {
      x: rangeMap(Math.random(), 0, 1, -2, 2),
      y: rangeMap(Math.random(), 0, 1, -2, -7),
    };
    document.documentElement.prepend(el);
  }

  startVelocityInterval() {
    this.velocityInterval = setInterval(() => this.randomizeVelocity(), this.changeSpeed);
  }

  boundaryHit(side) {
    clearInterval(this.velocityInterval);

    switch (side) {
      case 'right':
        this.randomizeVelocity({ x: rangeMap(Math.random(), 0, 1, -0.75, -1) });
        break;
      case 'left':
        this.randomizeVelocity({ x: rangeMap(Math.random(), 0, 1, 0.75, 1) });
        break;
      case 'top':
        this.randomizeVelocity({ y: rangeMap(Math.random(), 0, 1, 0.75, 1) });
        break;
      case 'bottom':
        this.randomizeVelocity({ y: rangeMap(Math.random(), 0, 1, -0.75, -1) });
        break;
    }

    this.startVelocityInterval();
  }

  checkDistance(coords: { x: number, y: number }) {
    const xDistance = Math.abs(
      this.x + this.getBoundingClientRect().width / 2 - coords.x
    );
    const yDistance = Math.abs(
      this.y + this.getBoundingClientRect().height / 2 - coords.y
    );

    const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2);

    if (distance < this.presentsDistance) {
      this.throwPresents();
    }
  }
}

export const cleanup = (tagName = 'flying-santa') => {
  Array.from(document.querySelectorAll(tagName)).forEach(santaEl => santaEl.remove());
}
