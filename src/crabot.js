import Bot from './bot.js';

export default class Crabot extends Bot {
  constructor(sprite) {
    super(sprite);
    this.stateMachine.addState('call', {
      onEnter: this.callOnEnter,
      onUpdate: this.callOnUpdate,
    });
    this.stateMachine.addState('ride', {
      onEnter: this.rideOnEnter,
      onUpdate: this.rideOnUpdate,
    });
    this.health = 100;
    this.speed = 80;
    this.maxCooldown = 60;
    this.currentCooldown = 60;
    this.cores = ['orangeCore', 'orangeCore', 'orangeCore'];
    this.closestClaw = this.sprite.scene.physics.closest(this.sprite, this.sprite.scene.claws);
  }
  shoot() {
    if (this.currentCooldown < 0) {
      this.currentCooldown = this.maxCooldown;
      this.sprite.scene.lasers.fire(
        this.sprite.x,
        this.sprite.y - 12,
        this.target.x,
        this.target.bot.stateMachine.isCurrentState('crouch') ? this.target.y + 20 : this.target.y - 12,
        'orangeLaser',
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
    if (!this.isVisible()) {
      return;
    }
    this.shoot();
    if (this.target.y < this.sprite.y) {
      this.stateMachine.setState('call');
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
      this.stateMachine.setState('call');
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
      this.stateMachine.setState('call');
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
  jumpOnUpdate() {
    super.jumpOnUpdate();
    this.shoot();
    if (this.closestClaw.grabbed === this.sprite) {
      this.stateMachine.setState('ride')
    }
  }
  callOnEnter() {
    this.sprite.setVelocityX(0);
    this.closestClaw.setVelocityY(350);
    if (this.sprite.x > this.closestClaw.x) {
      this.closestClaw.crane.setVelocityX(350);
      this.sprite.setVelocityX(-this.speed);
      this.sprite.playReverse('walk');
    } else {
      this.closestClaw.crane.setVelocityX(-350);
      this.sprite.setVelocityX(this.speed);
      this.sprite.play('walk');
    }
  }
  callOnUpdate() {
    if (this.target.bot.stateMachine.isCurrentState('core')) { 
      return;
    }
    if (!this.isVisible()) {
      return;
    }
    this.shoot();
    if (this.closestClaw.grabbed === this.sprite) {
      this.stateMachine.setState('ride')
    }
    if (this.sprite.x > this.closestClaw.x) {
      this.closestClaw.crane.setVelocityX(350);
      this.sprite.setVelocityX(-this.speed);
      this.sprite.playReverse('walk', true);
    } else {
      this.closestClaw.crane.setVelocityX(-350);
      this.sprite.setVelocityX(this.speed);
      this.sprite.play('walk', true);
    }
  }
  rideOnEnter() {
    this.closestClaw.crane.setVelocityX(Phaser.Math.RND.pick([350, -350]));
    this.closestClaw.setVelocityY(-350);
  }
  rideOnUpdate() {
    if (this.target.bot.stateMachine.isCurrentState('core')) { 
      return;
    }    
    if (!this.isVisible()) {
      return;
    }
    this.shoot();
    if (this.closestClaw.body.blocked.left) {
      this.closestClaw.crane.setVelocityX(350);      
    }
    if (this.closestClaw.body.blocked.right) {
      this.closestClaw.crane.setVelocityX(-350);      
    }
    if (this.closestClaw.body.blocked.up) {
      this.closestClaw.setVelocityY(350);      
    }
    if (this.closestClaw.body.blocked.down) {
      this.closestClaw.setVelocityY(-350);      
    }
    if (this.closestClaw.crane.body.blocked.left) {
      this.closestClaw.crane.setVelocityX(350);      
    }
    if (this.closestClaw.crane.body.blocked.right) {
      this.closestClaw.crane.setVelocityX(-350);      
    }
  }
}