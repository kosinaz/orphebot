import Bot from './bot.js';

export default class Felibot extends Bot {
  constructor(sprite) {
    super(sprite);
    this.stateMachine.addState('crouch', {
      onEnter: this.crouchOnEnter,
      onUpdate: this.crouchOnUpdate,
      onExit: this.crouchOnExit,
    });
    this.health = 100;
    this.speed = 160;
    this.maxCooldown = 30;
    this.currentCooldown = 30;
    this.laser = 'greenLaser';
    this.cores = ['greenCore', 'greenCore', 'greenCore'];
  }
  shoot() {
    if (this.currentCooldown < 0) {
      this.currentCooldown = this.maxCooldown;
      this.sprite.scene.lasers.fire(
        this.sprite.x,
        this.sprite.y - 12,
        this.target.x,
        this.target.bot.stateMachine.isCurrentState('crouch') ? this.target.y + 20 : this.target.y - 12,
        'greenLaser',
        false,
      );
    }
  }
  targetIsOnLeft() {
    return this.target.x < this.sprite.x;
  }
  targetIsOnRight() {
    return this.target.x > this.sprite.x;
  }
  isBlockedOnLeft() {
    return this.sprite.body.blocked.left
      || !this.sprite.scene.fg.getTileAtWorldXY(this.sprite.x - 16, this.sprite.y + 64);
  }
  isBlockedOnRight() {
    return this.sprite.body.blocked.right
      || !this.sprite.scene.fg.getTileAtWorldXY(this.sprite.x + 16, this.sprite.y + 64);
  }
  idleOnUpdate() {
    super.idleOnUpdate();
    this.target = this.sprite.scene.player;
    if (!this.target) {
      return;
    }
    if (this.target.bot.stateMachine.isCurrentState('core')) { 
      return;
    }
    if (Phaser.Math.Distance.BetweenPoints(this.sprite, this.target) > 1000) {
      return;
    }
    this.shoot();
    if (this.target.y < this.sprite.y) {
      this.sprite.setVelocityY(-600);  
      this.stateMachine.setState('jump');
    } else if (this.isBlockedOnRight()) {
      this.stateMachine.setState(this.targetIsOnLeft() ? 'forward' : 'backward');
    } else if (this.isBlockedOnLeft()) {
      this.stateMachine.setState(this.targetIsOnLeft() ? 'backward' : 'forward');
    } else {
      this.stateMachine.setState(Phaser.Math.RND.pick(['forward', 'backward']));
    }
  }
  forwardOnUpdate() {
    super.forwardOnUpdate();
    this.sprite.flipX = this.targetIsOnLeft();
    if (this.target.y < this.sprite.y) {
      this.sprite.setVelocityY(-600);  
      this.stateMachine.setState('jump');
    } else if (this.targetIsOnLeft()) {
      if (this.isBlockedOnLeft()) {
        this.stateMachine.setState('backward');
      } else {
        this.sprite.setVelocityX(-this.speed);
      }
    } else {
      if (this.isBlockedOnRight()) {
        this.stateMachine.setState('backward');
      } else {
        this.sprite.setVelocityX(this.speed);
      }
    }
    if (this.currentCooldown < 1) {
      this.stateMachine.setState('idle');
    }
  }
  backwardOnUpdate() {
    super.backwardOnUpdate();
    this.sprite.flipX = this.targetIsOnLeft();
    if (this.target.y < this.sprite.y) {
      this.sprite.setVelocityY(-600);  
      this.stateMachine.setState('jump');
    } else if (this.targetIsOnLeft()) {
      if (this.isBlockedOnRight()) {
        this.stateMachine.setState('forward');
      } else {
        this.sprite.setVelocityX(this.speed);
      }
    } else {
      if (this.isBlockedOnLeft()) {
        this.stateMachine.setState('forward');
      } else {
        this.sprite.setVelocityX(-this.speed);
      }
    }
    if (this.currentCooldown < 1) {
      this.stateMachine.setState('idle');
    }
  }
  jumpOnEnter() {
    super.jumpOnEnter();
    let dirs = [];
    if (!this.isBlockedOnRight()) {
      dirs.push(this.speed);
    } 
    if (!this.isBlockedOnLeft()) {
      dirs.push(-this.speed);
    }
    if (dirs.length) {
      this.sprite.setVelocityX(Phaser.Math.RND.pick(dirs));
    }
  }
  jumpOnUpdate() {
    super.jumpOnUpdate();
    this.sprite.flipX = this.targetIsOnLeft();
  }
}