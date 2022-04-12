import Bot from './bot.js';

export default class Elevabot extends Bot {
  constructor(scene) {
    super({
      frame: 208, 
      life: 100,
      offsetX: 8,
      offsetY: 28,
      scene: scene,
      sizeX: 48,
      sizeY: 100,
      speed: 80,
    });
    this.maxCooldown = 60;
    this.currentCooldown = 60;
    this.direction = 1;
  }
  update() {
    this.bar.update();
    if (this.direction === -1) {
      this.setVelocityX(-this.speed);
      if (this.body.blocked.left || !this.scene.fg.getTileAtWorldXY(this.x - 16, this.y + 64)) {
        this.direction = 0;
        this.setVelocityX(0);
      }
      if (this.scene.player.x > this.x) {
        this.setFlipX(false);
        this.anims.play('walkBack', true);
      } else {
        this.setFlipX(true);
        this.anims.play('walk', true);
      }
    } else if (this.direction === 1) {
      this.setVelocityX(this.speed);
      if (this.body.blocked.right || !this.scene.fg.getTileAtWorldXY(this.x + 16, this.y + 64)) {
        this.direction = 0;
        this.setVelocityX(0);
      }
      if (this.scene.player.x > this.x) {
        this.anims.play('walk', true);
        this.setFlipX(false);
      } else {
        this.anims.play('walkBack', true);
        this.setFlipX(true);
      }
    } else {
      this.setVelocityX(0);
      this.anims.play('idle', true);
      if (this.scene.player.x > this.x) {
        this.setFlipX(false);
      } else {
        this.setFlipX(true);
      }
    }
    this.currentCooldown -= 1;
    if (this.currentCooldown < 0) {
      this.direction = ~~(Math.random() * 3) - 1;
      this.currentCooldown = this.maxCooldown;
      if (Phaser.Math.Distance.BetweenPoints(this, this.scene.player) < 1000) {
        this.scene.lasers.fire(
          this.x + (this.scene.player.x > this.x ? 20 : -20),
          this.y - 16,
          this.scene.player.x,
          this.scene.keys.S.isDown ? this.scene.player.y + 16 : this.scene.player.y - 16,
          'yellowLaser',
        );
      }
    }     
  }
}