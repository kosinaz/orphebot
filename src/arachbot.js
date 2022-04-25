import Bot from './bot.js';

export default class Arachbot extends Bot {
  constructor(sprite) {
    super(sprite);
    this.stateMachine.addState('onDownToLeft', {
      onEnter: this.onDownToLeftOnEnter,
      onUpdate: this.onDownToLeftOnUpdate,
    });
    this.stateMachine.addState('onDownToRight', {
      onEnter: this.onDownToRightOnEnter,
      onUpdate: this.onDownToRightOnUpdate,
    });
    this.stateMachine.addState('onUpToLeft', {
      onEnter: this.onUpToLeftOnEnter,
      onUpdate: this.onUpToLeftOnUpdate,
    });
    this.stateMachine.addState('onUpToRight', {
      onEnter: this.onUpToRightOnEnter,
      onUpdate: this.onUpToRightOnUpdate,
    });
    this.stateMachine.addState('onLeftToDown', {
      onEnter: this.onLeftToDownOnEnter,
      onUpdate: this.onLeftToDownOnUpdate,
    });
    this.stateMachine.addState('onLeftToUp', {
      onEnter: this.onLeftToUpOnEnter,
      onUpdate: this.onLeftToUpOnUpdate,
    });
    this.stateMachine.addState('onRightToDown', {
      onEnter: this.onRightToDownOnEnter,
      onUpdate: this.onRightToDownOnUpdate,
    });
    this.stateMachine.addState('onRightToUp', {
      onEnter: this.onRightToUpOnEnter,
      onUpdate: this.onRightToUpOnUpdate,
    });
    this.health = 100;
    this.speed = 80;
    this.maxCooldown = 60;
    this.currentCooldown = 60;
    this.laser = 'blueLaser';
    this.cores = ['blueCore', 'blueCore', 'blueCore'];
    this.sprite.setGravity(0, 0);
    // this.dotleft = this.sprite.scene.add.image(this.sprite.x - 96, this.sprite.y, 'sprites', 'blueCore');
    // this.dotright = this.sprite.scene.add.image(this.sprite.x + 96, this.sprite.y, 'sprites', 'blueCore');
    // this.dotup = this.sprite.scene.add.image(this.sprite.x, this.sprite.y - 96, 'sprites', 'blueCore');
    // this.dotdown = this.sprite.scene.add.image(this.sprite.x, this.sprite.y + 96, 'sprites', 'blueCore');
  }
  // update(dt) {
  //   super.update(dt);
  //   this.dotleft.setPosition(this.sprite.x - 96, this.sprite.y);
  //   this.dotright.setPosition(this.sprite.x + 96, this.sprite.y);
  //   this.dotup.setPosition(this.sprite.x, this.sprite.y - 96);
  //   this.dotdown.setPosition(this.sprite.x, this.sprite.y + 96);
  
  // }
  shoot() {
    if (this.currentCooldown < 0) {
      this.currentCooldown = this.maxCooldown;
      this.sprite.scene.lasers.fire(
        this.sprite.x,
        this.sprite.y - 12,
        this.target.x,
        this.target.bot.stateMachine.isCurrentState('crouch') ? this.target.y + 20 : this.target.y - 12,
        'blueLaser',
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
    return !!(this.sprite.scene.fg.getTileAtWorldXY(this.sprite.x - 96, this.sprite.y));
  }
  isBlockedOnRight() {
    return !!(this.sprite.scene.fg.getTileAtWorldXY(this.sprite.x + 96, this.sprite.y));
  }
  isBlockedOnUp() {
    return !!(this.sprite.scene.fg.getTileAtWorldXY(this.sprite.x, this.sprite.y - 96));
  }
  isBlockedOnDown() {
    return !!(this.sprite.scene.fg.getTileAtWorldXY(this.sprite.x, this.sprite.y + 96));
  }
  idleOnEnter() {    
		this.sprite.play('idle');
    this.sprite.setVelocityX(0);
    this.sprite.setVelocityY(0);
  }
  idleOnUpdate() {
    this.target = this.sprite.scene.player;
    if (this.target
      && !this.target.bot.stateMachine.isCurrentState('core')
      && Phaser.Math.Distance.BetweenPoints(this.sprite, this.target) < 1000) {
      this.shoot();
    }
    let dirs = [];
    if (this.isBlockedOnDown() && !this.isBlockedOnLeft()) {
      dirs.push('onDownToLeft');
    }
    if (this.isBlockedOnDown() && !this.isBlockedOnRight()) {
      dirs.push('onDownToRight');
    }
    if (this.isBlockedOnUp() && !this.isBlockedOnLeft()) {
      dirs.push('onUpToLeft');
    }
    if (this.isBlockedOnUp() && !this.isBlockedOnRight()) {
      dirs.push('onUpToRight');
    }
    if (this.isBlockedOnLeft() && !this.isBlockedOnDown()) {
      dirs.push('onLeftToDown');
    }
    if (this.isBlockedOnLeft() && !this.isBlockedOnUp()) {
      dirs.push('onLeftToUp');
    }
    if (this.isBlockedOnRight() && !this.isBlockedOnDown()) {
      dirs.push('onRightToDown');
    }
    if (this.isBlockedOnRight() && !this.isBlockedOnUp()) {
      dirs.push('onRightToUp');
    }
    if (dirs.length) {
      this.stateMachine.setState(Phaser.Math.RND.pick(dirs));
    }
  }
  onDownToLeftOnEnter()	{
		this.sprite.play('walk');
    this.sprite.flipX = true;
    this.sprite.flipY = false;
    this.sprite.angle = 0;
    this.sprite.setSize(32, 100);
    this.sprite.setOffset(16, 28);
    this.sprite.body.reset(this.sprite.x, this.sprite.y);
    this.sprite.setVelocityX(-this.speed);
    this.sprite.setVelocityY(100); 
	}
  onDownToLeftOnUpdate() {
    if (!this.isBlockedOnDown()) {
      this.sprite.body.reset(this.sprite.x - 64, this.sprite.y + 72);
      this.stateMachine.setState('onRightToDown');
    } else if (this.isBlockedOnLeft() || this.currentCooldown < 1) {
      this.stateMachine.setState('idle');
    }
  }
  onDownToRightOnEnter()	{
		this.sprite.play('walk');
    this.sprite.flipX = false;
    this.sprite.flipY = false;
    this.sprite.angle = 0;
    this.sprite.setSize(32, 100);
    this.sprite.setOffset(16, 28);
    this.sprite.body.reset(this.sprite.x, this.sprite.y);
    this.sprite.setVelocityX(this.speed);
    this.sprite.setVelocityY(100);
	}
  onDownToRightOnUpdate() { 
    if (!this.isBlockedOnDown()) {
      this.sprite.body.reset(this.sprite.x + 64, this.sprite.y + 72);
      this.stateMachine.setState('onLeftToDown');
    } else if (this.isBlockedOnRight() || this.currentCooldown < 1) {
      this.stateMachine.setState('idle');
    }
  }
  onUpToLeftOnEnter()	{
		this.sprite.play('walk');
    this.sprite.flipX = true;
    this.sprite.flipY = true;
    this.sprite.angle = 0;
    this.sprite.setSize(32, 100);
    this.sprite.setOffset(16, 0);
    this.sprite.body.reset(this.sprite.x, this.sprite.y);
    this.sprite.setVelocityX(-this.speed);
    this.sprite.setVelocityY(-100);
	}
  onUpToLeftOnUpdate() {
    if (!this.isBlockedOnUp()) {      
      this.sprite.body.reset(this.sprite.x - 64, this.sprite.y - 72);
      this.stateMachine.setState('onRightToUp');
    } else if (this.isBlockedOnLeft() || this.currentCooldown < 1) {
      this.stateMachine.setState('idle');
    }
  }
  onUpToRightOnEnter()	{
		this.sprite.play('walk');
    this.sprite.flipX = false;
    this.sprite.flipY = true;
    this.sprite.angle = 0;
    this.sprite.setSize(32, 100);
    this.sprite.setOffset(16, 0);
    this.sprite.body.reset(this.sprite.x, this.sprite.y);
    this.sprite.setVelocityX(this.speed);
    this.sprite.setVelocityY(-100);
	}
  onUpToRightOnUpdate() {
    if (!this.isBlockedOnUp()) {
      this.sprite.body.reset(this.sprite.x + 64, this.sprite.y - 72);
      this.stateMachine.setState('onLeftToUp');
    } else if (this.isBlockedOnRight() || this.currentCooldown < 1) {
      this.stateMachine.setState('idle');
    }
  }
  onLeftToDownOnEnter()	{
		this.sprite.play('walk');
    this.sprite.flipX = false;
    this.sprite.flipY = false;
    this.sprite.angle = 90;
    this.sprite.setSize(100, 32);
    this.sprite.setOffset(-32, 48);
    this.sprite.body.reset(this.sprite.x, this.sprite.y);
    this.sprite.setVelocityX(-100);
    this.sprite.setVelocityY(this.speed);
	}
  onLeftToDownOnUpdate() {
    if (!this.isBlockedOnLeft()) {
      this.sprite.body.reset(this.sprite.x - 72, this.sprite.y + 64);
      this.stateMachine.setState('onUpToLeft');
    } else if (this.isBlockedOnDown() || this.currentCooldown < 1) {
      this.stateMachine.setState('idle');
    } 
  }
  onLeftToUpOnEnter()	{
		this.sprite.play('walk');
    this.sprite.flipX = true;
    this.sprite.flipY = false;
    this.sprite.angle = 90;
    this.sprite.setSize(100, 32);
    this.sprite.setOffset(-32, 48);
    this.sprite.body.reset(this.sprite.x, this.sprite.y);
    this.sprite.setVelocityX(-100);
    this.sprite.setVelocityY(-this.speed);
	}
  onLeftToUpOnUpdate() {
    if (!this.isBlockedOnLeft()) {      
      this.sprite.body.reset(this.sprite.x - 72, this.sprite.y - 64);
      this.stateMachine.setState('onDownToLeft');
    } else if (this.isBlockedOnUp() || this.currentCooldown < 1) {
      this.stateMachine.setState('idle');
    }
  }
  onRightToDownOnEnter()	{
		this.sprite.play('walk');
    this.sprite.flipX = false;
    this.sprite.flipY = true;
    this.sprite.angle = 90;
    this.sprite.setSize(100, 32);
    this.sprite.setOffset(-4, 48);
    this.sprite.body.reset(this.sprite.x, this.sprite.y);
    this.sprite.setVelocityX(100);
    this.sprite.setVelocityY(this.speed);
	}
  onRightToDownOnUpdate() {
    if (!this.isBlockedOnRight()) {
      this.sprite.body.reset(this.sprite.x + 72, this.sprite.y + 64);
      this.stateMachine.setState('onUpToRight');
    } else if (this.isBlockedOnDown() || this.currentCooldown < 1) {
      this.stateMachine.setState('idle');
    } 
  }
  onRightToUpOnEnter()	{
		this.sprite.play('walk');
    this.sprite.flipX = true;
    this.sprite.flipY = true;
    this.sprite.angle = 90;
    this.sprite.setSize(100, 32);
    this.sprite.setOffset(-4, 48);
    this.sprite.body.reset(this.sprite.x, this.sprite.y);
    this.sprite.setVelocityX(100);
    this.sprite.setVelocityY(-this.speed);
	}
  onRightToUpOnUpdate() {
    if (!this.isBlockedOnRight()) {
      this.sprite.body.reset(this.sprite.x + 72, this.sprite.y - 64);
      this.stateMachine.setState('onDownToRight');
    } else if (this.isBlockedOnUp() || this.currentCooldown < 1) {
      this.stateMachine.setState('idle');
    } 
  }  
}