import Phaser from './phaser.js';

export default class Bar extends Phaser.GameObjects.Graphics {
  constructor(scene, target, valueCallback) {
    super(scene);
    this.target = target;
    this.valueCallback = valueCallback;
  }
  update() {
    this.x = this.target.x;
    this.y = this.target.y;
    const value = this.valueCallback();
    this.clear();
    this.fillStyle(0x555555);
    this.fillRect(-32, -64, 64, 12);
    this.fillStyle(0x777777);
    this.fillRect(-30, -62, 60, 8);
    this.fillStyle(value < 30 ? 0xcc0000 : 0x00cc00);
    this.fillRect(-30, -62, value * 60 / 100, 8);
  }
}