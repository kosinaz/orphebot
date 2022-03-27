import Phaser from './phaser.js';

export default class Felibot extends Phaser.Physics.Arcade.Sprite {
  constructor(...args) {
    super(...args);
    this.scene.physics.world.enable(this);
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('bots', {
        start: 88,
        end: 95,
      }),
      frameRate: 32,
      repeat: -1
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('bots', {
        frames: [91],
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('bots', {
        start: 84,
        end: 87,
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.play('idle');
    this.speed = 320;
    this.setSize(64, 92);
    this.setOffset(0, 36);
  }
  update() {
    if (this.body.blocked.down) {
      this.setVelocityX(0);
      if (this.scene.keys.SPACE.isDown) {
        this.setVelocityY(-600);
      }
    }
    if (this.scene.keys.A.isDown) {
      this.setVelocityX(-this.speed);
      this.setFlipX(true);
    } else if (this.scene.keys.D.isDown) {
      this.setVelocityX(this.speed);
      this.setFlipX(false);
    } 
    if (this.body.blocked.down) {
      if (this.body.velocity.x) {
        this.anims.play('walk', true);
      } else {
        this.anims.play('idle', true);
      }
    } else {
      this.anims.play('jump', true);
    }    
  }
}