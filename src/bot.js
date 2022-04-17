import Bar from './bar.js';
import Phaser from './phaser.js';

export default class Bot extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, 0, 0, 'bots', 0);
    this.scene.physics.world.enable(this);
    this.setSize(config.sizeX, config.sizeY);
    this.setOffset(config.offsetX, config.offsetY);
    this.setPushable(false);
    this.setGravity(0, 2100);
    this.speed = config.speed;
    this.life = config.life;
    this.bar = this.scene.add.existing(new Bar(this.scene, this, () => {
      return this.life;
    }));
    this.startFrame = config.frame;
  }
  damage(amount) {
    this.life -= amount;
    if (this.life < 1) {
      this.core = this.scene.physics.add.image(this.x, this.y, 'sprites', 'yellowCore');
      this.core.setVelocityY(-500);
      this.core.setGravityY(2100);
      this.scene.physics.add.collider(this.core, this.scene.fg);
      this.scene.physics.add.overlap(this.core, this.scene.player, (core, player) => {
        core.destroy();
      });
      this.destroy();
      this.bar.destroy();
    }
  }
}