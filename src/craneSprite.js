import Phaser from './phaser.js';

export default class CraneSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(...args) {
    super(...args, 'sprites', 'crane');
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.add.collider(this, this.scene.bg, () => {
      this.claw.setVelocityX(0);
      this.claw.body.x = this.body.x;
    });
    this.x += 32;
    this.y -= 32;
    this.setDepth(2);
    this.setImmovable(true);
  }
}