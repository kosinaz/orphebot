import Phaser from './phaser.js';

export default class Elevabot extends Phaser.Physics.Arcade.Sprite {
  constructor(...args) {
    super(...args);
    this.scene.physics.world.enable(this);
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('bots', {
        start: 100,
        end: 107,
      }),
      frameRate: 16,
      repeat: -1
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('bots', {
        start: 96,
        end: 99,
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.play('idle');
    this.speed = 160;
    this.setSize(64, 88);
    this.setOffset(0, 40);
  }
  update() {
    if (this.flipX) {
      this.setVelocityX(-this.speed);
      if (this.body.blocked.left) {
        this.setFlipX(false);
      }
    } else {
      this.setVelocityX(this.speed);
      if (this.body.blocked.right) {
        this.setFlipX(true);
      }
    }
    this.anims.play('walk', true);
  }
}