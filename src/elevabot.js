import Bot from './bot.js';

export default class Elevabot extends Bot {
  constructor(scene) {
    super({
      frame: 192, 
      life: 100,
      offsetY: 40,
      scene: scene,
      sizeX: 64,
      sizeY: 88,
      speed: 160,
    });
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