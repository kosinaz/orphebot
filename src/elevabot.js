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
        if (this.scene.player.life > 0) {
          const x1 = this.x + (this.scene.player.x > this.x ? 20 : -20);
          const y1 = this.y - 16;
          const x2 = this.scene.player.x;
          const y2 = this.scene.keys.S.isDown ? this.scene.player.y + 16 : this.scene.player.y - 16;
          const line = new Phaser.Geom.Line(x1, y1 + 16, x2, y2 + 16);
          const overlappingTiles = this.scene.fg.getTilesWithinShape(line, {
            isColliding: true,
          });
          if (!overlappingTiles.length) {
            this.scene.lasers.fire(x1, y1, x2, y2, 'yellowLaser');
          } else if (~~(Math.random() * 2) > 0) {
            this.scene.lasers.fire(x1, y1, x2, y2 - 48, 'yellowLaser');
          }
        }
      }
    }     
  }
}