import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import present from './presentURI';

@customElement('santa-present')
export class SantaPresent extends LitElement {
  static get styles() {
    return css`
      :host {
        --present-rotation: 0deg;
        display: block;
        position: absolute;
        transform: translate(-50%, -50%) rotate(var(--present-rotation));
      }

      img {
        display: block;
        height: 50px;
      }
    `;
  }

  @property({ type: 'Number', attribute: false })
  velocity = { x: 0, y: 0 };

  @property({ type: 'Number', attribute: false })
  dropSpeed = 0.5;
  
  _rotation = 0;
  rotateDirection: string;

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

    if (value > this.frameWidth - this.getBoundingClientRect().width || value < 0) {
      this.remove();
    }
  }

  get y() {
    return parseFloat(
      getComputedStyle(this).getPropertyValue('top').replace('px', '')
    );
  }

  set y(value) {
    this.style.setProperty('top', `${value}px`);
    if (value > this.frameHeight - 30) {
      this.remove();
    }
  }

  get rotation() {
    return this._rotation;
  }

  set rotation(value) {
    this.style.setProperty('--present-rotation', `${value}deg`);
    this._rotation = value;
  }

  connectedCallback() {
    super.connectedCallback();
    this.rotation = Math.random() * 360;
    this.rotateDirection = Math.random() > 0.5 ? 'clockwise':'counter-clockwise';
    requestAnimationFrame(() => {
      this.move();
    });
  }

  move() {
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    // gravity acc / expected framerate * dropSpeed
    this.velocity.y = this.velocity.y + (9.81 / 60 * this.dropSpeed);
    this.rotation += this.rotateDirection === 'clockwise' ? 1 : -1;
    requestAnimationFrame(this.move.bind(this));
  }

  render() {
    return html`
      <img src="data:image/gif;base64,${present}" />
    `;
  }
}