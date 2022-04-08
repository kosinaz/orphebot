import Bot from './bot.js';

export default class Felibot extends Bot {
  constructor(scene) {
    super({
      frame: 168, 
      life: 100,
      offsetY: 40,
      scene: scene,
      sizeX: 64,
      sizeY: 92,
      speed: 320,
    });
    this.maxCooldown = 10;
    this.currentCooldown = 10;
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('bots', {
        frames: [175],
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'jumpBack',
      frames: this.anims.generateFrameNumbers('bots', {
        frames: [187],
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'shoot',
      frames: this.anims.generateFrameNumbers('bots', {
        frames: [168],
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'shootBack',
      frames: this.anims.generateFrameNumbers('bots', {
        frames: [180],
      }),
      frameRate: 8,
      repeat: -1
    });
  }
  update() {
    this.bar.update();
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
        if (this.scene.input.activePointer.x > 960 == this.flipX) {
          this.anims.play('walkBack', true);
        } else {
          this.anims.play('walk', true);
        }
      } else {
        if (this.scene.input.activePointer.leftButtonDown()) {
          if (this.scene.input.activePointer.x > 960 == this.flipX) {
            this.anims.play('shootBack', true);
          } else {
            this.anims.play('shoot', true);
          }
        } else {
          if (this.scene.input.activePointer.x > 960 == this.flipX) {
            this.anims.play('idleBack', true);
          } else {
            this.anims.play('idle', true);
          }
        }
      }
    } else {
      if (this.scene.input.activePointer.x > 960 == this.flipX) {
        this.anims.play('jumpBack', true);
      } else {
        this.anims.play('jump', true);
      }
    }
    this.currentCooldown -= 1;
    if (this.scene.input.activePointer.leftButtonDown() && this.currentCooldown < 0) {
      this.currentCooldown = this.maxCooldown;
      this.scene.lasers.fire(
        this.x + (this.scene.input.activePointer.x > 960 ? 8 : -8),
        this.y - 4,
        this.scene.input.activePointer.worldX,
        this.scene.input.activePointer.worldY,
        'greenLaser',
        true,
      );
    }     
  }
}