import Phaser from './phaser.js';

export default class ClawSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(...args) {
    super(...args, 'sprites', 'claw');
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.add.collider(this, this.scene.fg, () => {
      if (this.grabbed && this.grabbed.bot.constructor.name === 'Crabot') {
        return;
      }
      if (this.body.blocked.left || this.body.blocked.right) {
        this.crane.setVelocityX(0);
        this.crane.body.x = this.body.x;
      }
    });
    this.scene.physics.add.collider(this, this.scene.cranes);
    this.scene.physics.add.overlap(this, this.scene.player, (claw, bot) => {
      if (!this.grabbed && this.released !== bot) {
        this.grabbed = bot;
      }
    });
    this.scene.physics.add.overlap(this, this.scene.bots, (claw, bot) => {
      if (!this.grabbed && this.released !== bot) {
        this.grabbed = bot;
      }
    });
    this.x += 32;
    this.y -= 64;
    this.counter = 0;
  }
  update() {
    this.counter -= 1;
    if (this.counter < 0) {
      this.released = null;
    }
    this.body.x = this.crane.body.x;
    if (this.grabbed) { 
      if (this.grabbed.body) {
        this.grabbed.body.x = this.body.x + 16;
        this.grabbed.body.y = this.body.y + 32;
        this.grabbed.setGravity(0, 0);
        if (this.grabbed.bot.stateMachine.isCurrentState('ride')) {
          this.grabbed.play('jump');
        } else if (!this.grabbed.bot.stateMachine.isCurrentState('dead')) {
          if (this.grabbed.bot.stateMachine.isCurrentState('core')) {
            this.release();
          } else if (this.grabbed === this.scene.player) {
            this.grabbed.play('jump');
          } else {
            this.grabbed.bot.stateMachine.setState('jump');
          }
        }
      } else {
        this.grabbed = null;
      }
    }
    this.rope.x = this.body.x + 32;
    this.rope.y = this.y - 64;
    this.rope.height = this.y - this.crane.y - 96;
  }
  release() {
    this.counter = 50;
    if (!this.grabbed) {
      return;
    }
    this.setVelocityY(-350);
    this.released = this.grabbed;
    this.grabbed = null;
    this.released.setGravity(0, 2100);
  }
}