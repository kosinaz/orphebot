import Phaser from './phaser.js';

export default class Felibot extends Phaser.Physics.Arcade.Sprite {
  constructor(...args) {
    super(...args);
    this.scene.physics.world.enable(this);
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('bots', {
        start: 172,
        end: 179,
      }),
      frameRate: 32,
      repeat: -1
    });
    this.anims.create({
      key: 'walkBack',
      frames: this.anims.generateFrameNumbers('bots', {
        start: 184,
        end: 191,
      }),
      frameRate: 32,
      repeat: -1
    });
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
      key: 'idle',
      frames: this.anims.generateFrameNumbers('bots', {
        start: 168,
        end: 171,
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'idleBack',
      frames: this.anims.generateFrameNumbers('bots', {
        start: 180,
        end: 183,
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.play('idle');
    this.speed = 320;
    this.cooldown = 0;
    this.setSize(64, 92);
    this.setOffset(0, 36);
  }
  update() {
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
        if (this.scene.input.activePointer.x > 960 == this.flipX) {
          this.anims.play('idleBack', true);
        } else {
          this.anims.play('idle', true);
        }
      }
    } else {
      if (this.scene.input.activePointer.x > 960 == this.flipX) {
        this.anims.play('jumpBack', true);
      } else {
        this.anims.play('jump', true);
      }
    }
    this.cooldown += 1;
    if (this.scene.input.activePointer.leftButtonDown() && this.cooldown > 30) {
      this.cooldown = 0;
      const projectile = this.scene.physics.add.sprite(this.x, this.y, 'sprites', 'projectileGreen');
      projectile.setGravityY(-2100);
      this.scene.physics.moveTo(projectile, this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY, 1000);
    }     
  }
}