import Bar from './bar.js';
import Phaser from './phaser.js';

export default class Elevabot extends Phaser.Physics.Arcade.Sprite {
  constructor(...args) {
    super(...args);
    this.scene.physics.world.enable(this);
    this.bar = this.scene.add.existing(new Bar(this.scene, this, () => {
      return this.life;
    }));
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('bots', {
        start: 196,
        end: 203,
      }),
      frameRate: 16,
      repeat: -1
    });
    this.anims.create({
      key: 'walkBack',
      frames: this.anims.generateFrameNumbers('bots', {
        start: 208,
        end: 215,
      }),
      frameRate: 16,
      repeat: -1
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('bots', {
        start: 192,
        end: 195,
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'idleBack',
      frames: this.anims.generateFrameNumbers('bots', {
        start: 204,
        end: 207,
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.play('idle');
    this.speed = 160;
    this.life = 100;
    this.setSize(64, 88);
    this.setOffset(0, 40);
  }
  update() {
    this.bar.update();
    if (this.flipX) {
      this.setVelocityX(-this.speed);
      if (this.body.blocked.left) {
        this.setFlipX(false);
      }
      if (this.scene.player.x > this.x) {
        this.anims.play('walkBack', true);
      } else {
        this.anims.play('walk', true);
      }
    } else {
      this.setVelocityX(this.speed);
      if (this.body.blocked.right) {
        this.setFlipX(true);
      }
      if (this.scene.player.x > this.x) {
        this.anims.play('walk', true);
      } else {
        this.anims.play('walkBack', true);
      }
    }
  }
  damage(amount) {
    this.life -= amount;
    if (this.life < 1) {
      this.disableBody(true, true);
      this.bar.destroy();
    }
  }
}