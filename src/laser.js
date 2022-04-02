import Phaser from './phaser.js';

export default class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(...args) {
    super(...args);
  }
  fire (fromX, fromY, toX, toY) {
    this.body.reset(fromX, fromY);
    this.setActive(true);
    this.setVisible(true);
    this.scene.physics.moveTo(this, toX, toY, 500);
  }
}