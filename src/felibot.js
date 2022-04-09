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
    const frame = 182;
    this.maxCooldown = 30;
    this.currentCooldown = 30;
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('bots', {
        frames: [frame + 7],
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'jumpBack',
      frames: this.anims.generateFrameNumbers('bots', {
        frames: [frame + 19],
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'shoot',
      frames: this.anims.generateFrameNumbers('bots', {
        frames: [frame],
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'shootBack',
      frames: this.anims.generateFrameNumbers('bots', {
        frames: [frame + 12],
      }),
      frameRate: 8,
      repeat: -1
    });
  }
  update() {
    this.bar.update();
    this.setSize(32, 100);
    this.setOffset(16, 28);
    if (this.body.blocked.down) {
      this.setVelocityX(0);
      if (this.scene.keys.SPACE.isDown) {
        this.setVelocityY(-600);
      }
    }
    if (this.scene.keys.S.isDown) {
      if (this.body.blocked.down) {
        this.setVelocityX(0);
        this.setSize(32, 64);
        this.setOffset(16, 64);
      }
    } else if (this.scene.keys.A.isDown) {
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
      } else if (this.scene.keys.S.isDown) {
        if (this.scene.input.activePointer.x > 960 == this.flipX) {
          this.anims.play('crouchBack', true);
        } else {
          this.anims.play('crouch', true);
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
        this.scene.keys.S.isDown ? this.y + 20 : this.y - 12,
        this.scene.input.activePointer.worldX,
        this.scene.input.activePointer.worldY,
        'greenLaser',
        true,
      );
    }     
  }
}