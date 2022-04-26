import Bot from './bot.js';

export default class Elevabot extends Bot {
  constructor(sprite) {
    super(sprite);
    this.stateMachine.addState('approachForward', {
      onEnter: this.approachForwardOnEnter,
      onUpdate: this.approachForwardOnUpdate,
      onExit: this.approachForwardOnExit,
    }).addState('approachBackward', {
      onEnter: this.approachBackwardOnEnter,
      onUpdate: this.approachBackwardOnUpdate,
      onExit: this.approachBackwardOnExit,
    }).addState('call', {
      onEnter: this.callOnEnter,
      onUpdate: this.callOnUpdate,
    }).addState('ride', {
      onEnter: this.rideOnEnter,
      onUpdate: this.rideOnUpdate,
    });
    this.health = 100;
    this.speed = 80;
    this.maxCooldown = 60;
    this.currentCooldown = 60;
    this.cores = ['yellowCore', 'yellowCore', 'yellowCore'];
  }
  shoot() {
    if (this.currentCooldown < 0) {
      let sound = Phaser.Math.RND.pick(this.sprite.scene.laserSounds);
      sound.volume = 0.10;
      sound.play();
      this.currentCooldown = this.maxCooldown;
      this.sprite.scene.lasers.fire(
        this.sprite.x,
        this.sprite.y - 12,
        this.target.x,
        this.target.bot.stateMachine.isCurrentState('crouch') ? this.target.y + 20 : this.target.y - 12,
        'yellowLaser',
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
  callOnEnter() {
    this.sprite.play('idle');    
    this.sprite.setVelocityX(0);
    this.closestElevator = this.sprite.scene.physics.closest(this.sprite, this.sprite.scene.elevators);
    this.closestElevator.setVelocityY(350);
  }
  callOnUpdate() {
    if (this.target.bot.stateMachine.isCurrentState('core')) { 
      return;
    }
    if (Phaser.Math.Distance.BetweenPoints(this.sprite, this.target) > 1000) {
      return;
    }
    this.shoot();
    if (this.closestElevator.y > this.sprite.y) {
      if (this.closestElevator.x < this.sprite.x) {
        if (this.targetIsOnLeft()) {
          this.stateMachine.setState('approachForward');
        } else {
          this.stateMachine.setState('approachBackward');
        }
      } else {
        if (this.targetIsOnLeft()) {
          this.stateMachine.setState('approachBackward');
        } else {
          this.stateMachine.setState('approachForward');
        }
      }      
    }
  }
  approachForwardOnEnter() {
    super.forwardOnEnter();
  }
  approachForwardOnUpdate() {
    this.sprite.flipX = this.targetIsOnLeft();
    if (this.sprite.y - 64 < this.target.y) {
      this.stateMachine.setState('idle');
    }
    if (Phaser.Math.Distance.BetweenPoints(this.sprite, this.closestElevator) < 80) {
      this.stateMachine.setState('ride');
      return;
    }
    if (this.closestElevator.x < this.sprite.x) {
      this.sprite.setVelocityX(-this.speed);
      if (!this.targetIsOnLeft()) {
        this.stateMachine.setState('approachBackward');
      }
    } else {
      this.sprite.setVelocityX(this.speed);
      if (this.targetIsOnLeft()) {
        this.stateMachine.setState('approachBackward');
      }
    }      
  }
  approachForwardOnExit() { 
    super.forwardOnExit();   
  }
  approachBackwardOnEnter() {
    super.backwardOnEnter();
  }
  approachBackwardOnUpdate() {
    this.sprite.flipX = this.targetIsOnLeft();
    if (this.sprite.y - 64 < this.target.y) {
      this.stateMachine.setState('idle');
    }
    if (Phaser.Math.Distance.BetweenPoints(this.sprite, this.closestElevator) < 80) {
      this.stateMachine.setState('ride');
      return;
    }
    if (this.closestElevator.x < this.sprite.x) {
      this.sprite.setVelocityX(-this.speed);
      if (this.targetIsOnLeft()) {
        this.stateMachine.setState('approachForward');
      }
    } else {
      this.sprite.setVelocityX(this.speed);
      if (!this.targetIsOnLeft()) {
        this.stateMachine.setState('approachForward');
      }
    }      
  }
  approachBackwardOnExit() {    
    super.backwardOnExit();
  }
  rideOnEnter() {
    this.sprite.play('idle');
    this.sprite.setVelocityX(0);
    this.closestElevator.setVelocityY(-350);
  }
  rideOnUpdate() {
    if (this.target.bot.stateMachine.isCurrentState('core')) { 
      return;
    }
    if (Phaser.Math.Distance.BetweenPoints(this.sprite, this.target) > 1000) {
      return;
    }
    this.shoot();
    if (this.sprite.y + 256 < this.target.y) {
      this.closestElevator.setVelocityY(350);
      this.stateMachine.setState('jump');
    }
  }
}