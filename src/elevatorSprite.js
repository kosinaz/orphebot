import Phaser from './phaser.js';

export default class ElevatorSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(...args) {
    super(...args, 'sprites', 'elevator');
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.add.collider(this, this.scene.bg);
    this.x += 96;
    this.y -= 64;
    this.setSize(192, 64);
    this.setOffset(0, 64);
    this.setImmovable(true);
  }
}