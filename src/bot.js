import Bar from './bar.js';
import Phaser from './phaser.js';

export default class Bot extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, 0, 0, 'bots', 0);
    this.scene.physics.world.enable(this);
    this.setSize(config.sizeX, config.sizeY);
    this.setOffset(0, config.offsetY);
    this.speed = config.speed;
    this.life = config.life;
    this.bar = this.scene.add.existing(new Bar(this.scene, this, () => {
      return this.life;
    }));
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('bots', {
        start: config.frame + 4,
        end: config.frame + 11,
      }),
      frameRate: this.speed / 10,
      repeat: -1
    });
    this.anims.create({
      key: 'walkBack',
      frames: this.anims.generateFrameNumbers('bots', {
        start: config.frame + 16,
        end: config.frame + 23,
      }),
      frameRate: this.speed / 10,
      repeat: -1
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('bots', {
        start: config.frame,
        end: config.frame + 3,
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'idleBack',
      frames: this.anims.generateFrameNumbers('bots', {
        start: config.frame + 12,
        end: config.frame + 15,
      }),
      frameRate: 8,
      repeat: -1
    });
  }
  damage(amount) {
    this.life -= amount;
    if (this.life < 1) {
      this.destroy();
      this.bar.destroy();
    }
  }
}