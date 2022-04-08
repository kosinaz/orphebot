import Bot from './bot.js';

export default class Elevabot extends Bot {
  constructor(scene) {
    super({
      frame: 192, 
      life: 100,
      offsetY: 28,
      scene: scene,
      sizeX: 64,
      sizeY: 100,
      speed: 80,
    });
    this.maxCooldown = 20;
    this.currentCooldown = 20;
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
    this.currentCooldown -= 1;
    if (this.currentCooldown < 0) {
      this.currentCooldown = this.maxCooldown;
      this.scene.lasers.fire(
        this.x + (this.scene.player.x > this.x ? 20 : -20),
        this.y - 16,
        this.scene.player.x,
        this.scene.player.y - 16,
        'yellowLaser',
      );
    }     
  }
}