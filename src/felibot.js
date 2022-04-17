import Bot from './bot.js';

export default class Felibot extends Bot {
  constructor(scene) {
    super({
      frame: 182, 
      life: 100,
      offsetX: 16,
      offsetY: 28,
      scene: scene,
      sizeX: 32,
      sizeY: 100,
      speed: 160,
    });
    this.startFrame = 182;
    this.maxCooldown = 30;
    this.currentCooldown = 30;
  }
  update() {
    this.bar.update();
  }
  damage(amount) {
    super.damage(amount);
    if (this.life < 1) {
      this.core.setFrame('greenCore');
      this.core.scene.time.addEvent({
        delay: 5000,
        callback: () => {
          this.core.scene.player = this.core.scene.add.existing(new Felibot(this.core.scene));
          this.core.scene.players.add(this.core.scene.player);
          this.core.scene.player.setTexture('bots', 182);
          this.core.scene.player.setPosition(this.x, this.y);
          this.core.scene.player.setVelocityY(-600);
          this.core.scene.cameras.main.startFollow(this.core.scene.player);
          this.core.destroy();
        }
      })
    }
  }  
}