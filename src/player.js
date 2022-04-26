import Bot from './bot.js';

export default class Player extends Bot {
  constructor(sprite) {
    super(sprite);
    this.stateMachine.addState('crouch', {
      onEnter: this.crouchOnEnter,
      onUpdate: this.crouchOnUpdate,
      onExit: this.crouchOnExit,
    });
    this.stateMachine.addState('idleOnDown', {
      onEnter: this.idleOnDownOnEnter,
      onUpdate: this.idleOnDownOnUpdate,
    });
    this.stateMachine.addState('idleOnUp', {
      onEnter: this.idleOnUpOnEnter,
      onUpdate: this.idleOnUpOnUpdate,
    });
    this.stateMachine.addState('idleOnLeft', {
      onEnter: this.idleOnLeftOnEnter,
      onUpdate: this.idleOnLeftOnUpdate,
    });
    this.stateMachine.addState('idleOnRight', {
      onEnter: this.idleOnRightOnEnter,
      onUpdate: this.idleOnRightOnUpdate,
    });
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
    this.keys = this.sprite.scene.input.keyboard.addKeys('W,A,S,D,R,SPACE');
    this.keys.R.on('up', () => {
      if (this.stateMachine.isCurrentState('core')
        || this.stateMachine.isCurrentState('dead')) {
        return;
      }
      this.health = 0;
      this.stateMachine.setState('core');
    })
    this.pointer = this.sprite.scene.input.activePointer;
    this.health = 100;
    this.speed = 160;
    this.maxCooldown = 30;
    this.currentCooldown = 30;
    this.canJump = true;
    this.canRide = false;
    this.canClimb = false;
    this.laser = 'greenLaser';
    this.cores = ['greenCore', 'greenCore', 'greenCore'];
    this.coreCounter = this.sprite.scene.add.group();
    this.updateCounter();
  } 
  update(dt) {
    super.update(dt);
    if (this.stateMachine.isCurrentState('core')
      || this.stateMachine.isCurrentState('dead')) {
      return;
    }
    if (this.pointer.isDown) {
      this.shoot();
    }
    let closestElevator = this.sprite.scene.physics.closest(this.sprite, this.sprite.scene.elevators);
    if ((this.keys.W.isDown || this.keys.SPACE.isDown) && this.canRide) {
      closestElevator.setVelocityY(-350);
    }
    if (this.keys.S.isDown && this.canRide) {
      closestElevator.setVelocityY(350);
    }
  }
  updateCounter() {
    this.coreCounter.clear(true);
    this.coreCounter.createFromConfig({
      classType: Phaser.GameObjects.Image,
      key: 'sprites',
      frame: this.cores,
      setXY: {
        x: 32,
        y: 32,
        stepX: 32,
      },
      setScrollFactor: {
        x: 0,
        y: 0,
      }
    });
    this.coreCounter.propertyValueSet('depth', 1);
  }
  shoot() {
    if (this.currentCooldown < 0) {
      let sound = Phaser.Math.RND.pick(this.sprite.scene.laserSounds);
      sound.volume = 0.25;
      sound.play();
      this.currentCooldown = this.maxCooldown;
      this.sprite.scene.lasers.fire(
        this.sprite.x,
        this.stateMachine.isCurrentState('crouch') ? this.sprite.y + 20 : this.sprite.y - 12,
        this.pointer.worldX,
        this.pointer.worldY,
        this.laser,
        true,
      );
    }
  }
  noneIsDown() {
    return Object.values(this.keys).every(key => key.isUp);
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
  idleOnUpdate() {
    if (this.canClimb) {
      this.stateMachine.setState('idleOnDown');
      return;
    }
    super.idleOnUpdate();
    if (this.pointer.x <= 960) {
      this.sprite.flipX = true;
      if (this.keys.A.isDown) {
        this.stateMachine.setState('forward');
      }
      if (this.keys.D.isDown) {
        this.stateMachine.setState('backward');
      }
    }
    if (this.pointer.x > 960) {
      this.sprite.flipX = false;
      if (this.keys.D.isDown) {
        this.stateMachine.setState('forward');
      }
      if (this.keys.A.isDown) {
        this.stateMachine.setState('backward');
      }
    }
    if (this.keys.S.isDown && this.canJump) {
      this.stateMachine.setState('crouch');
    }
    if ((this.keys.SPACE.isDown || this.keys.W.isDown ) && this.canJump) {
      this.sprite.setVelocityY(-600);  
      this.stateMachine.setState('jump');   
    }
  }
	forwardOnUpdate() {
    if (this.pointer.x <= 960) {
      this.sprite.flipX = true;
      if (this.keys.A.isDown) {
        this.sprite.setVelocityX(-this.speed);
      }
      if (this.keys.D.isDown) {
        this.stateMachine.setState('backward');
      }
    }
    if (this.pointer.x > 960) {
      this.sprite.flipX = false;
      if (this.keys.D.isDown) {
        this.sprite.setVelocityX(this.speed);
      }
      if (this.keys.A.isDown) {
        this.stateMachine.setState('backward');
      }
    }
    if (this.keys.S.isDown && this.canJump) {
      this.stateMachine.setState('crouch');
    }
    if ((this.keys.SPACE.isDown || this.keys.W.isDown ) && this.canJump) {
      this.sprite.setVelocityY(-600);
      this.stateMachine.setState('jump');      
    }
    if (!this.sprite.body.blocked.down) {
      this.stateMachine.setState('jump'); 
    }
    if (this.noneIsDown()) {
      this.sprite.setVelocityX(0);
      this.stateMachine.setState('idle');
    }
  }
	backwardOnUpdate() {
    if (this.pointer.x <= 960) {
      this.sprite.flipX = true;
      if (this.keys.D.isDown) {
        this.sprite.setVelocityX(this.speed);
      }
      if (this.keys.A.isDown) {
        this.stateMachine.setState('forward');
      }
    }
    if (this.pointer.x > 960) {
      this.sprite.flipX = false;
      if (this.keys.A.isDown) {
        this.sprite.setVelocityX(-this.speed);
      }
      if (this.keys.D.isDown) {
        this.stateMachine.setState('forward');
      }
    }
    if (this.keys.S.isDown && this.canJump) {
      this.stateMachine.setState('crouch');
    }
    if ((this.keys.SPACE.isDown || this.keys.W.isDown ) && this.canJump) {
      this.sprite.setVelocityY(-600);
      this.stateMachine.setState('jump');      
    }
    if (!this.sprite.body.blocked.down) {
      this.stateMachine.setState('jump'); 
    }
    if (this.noneIsDown()) {
      this.stateMachine.setState('idle');
    }
  }
  jumpOnUpdate() {
    super.jumpOnUpdate();
    if (this.pointer.x <= 960) {
      this.sprite.flipX = true;
    }
    if (this.pointer.x > 960) {
      this.sprite.flipX = false;
    }
    if (this.keys.D.isDown) {
      this.sprite.setVelocityX(this.speed);
    }
    if (this.keys.A.isDown) {
      this.sprite.setVelocityX(-this.speed);
    }
  }
  crouchOnEnter() {
    this.sprite.play('crouch');
    this.sprite.setVelocityX(0);
    this.sprite.setSize(32, 64);
    this.sprite.setOffset(16, 64);
  }
  crouchOnUpdate() {
    if (this.pointer.x <= 960) {
      this.sprite.flipX = true;
    }
    if (this.pointer.x > 960) {
      this.sprite.flipX = false;
    }
    if ((this.keys.SPACE.isDown || this.keys.W.isDown ) && this.canJump) {
      this.sprite.setVelocityY(-600);
      this.stateMachine.setState('jump');      
    }
    if (!this.keys.S.isDown) {
      this.stateMachine.setState('idle');
    }
    if (!this.sprite.body.blocked.down) {
      this.stateMachine.setState('jump'); 
    } 
  }
  crouchOnExit() {    
    this.sprite.setSize(32, 100);
    this.sprite.setOffset(16, 28);
  }
  idleOnDownOnEnter() {
		this.sprite.play('idle');
    this.sprite.flipY = false;
    this.sprite.angle = 0;
    this.sprite.setSize(32, 100);
    this.sprite.setOffset(16, 28);
    this.sprite.body.reset(this.sprite.x, this.sprite.y);
    this.sprite.setVelocityX(0);
    this.sprite.setVelocityY(100); 
  }
  idleOnDownOnUpdate() {
    if (this.keys.A.isDown) {
      this.stateMachine.setState('onDownToLeft');
    }
    if (this.keys.D.isDown) {
      this.stateMachine.setState('onDownToRight');
    }
  }
  idleOnUpOnEnter() {
		this.sprite.play('idle');
    this.sprite.flipY = true;
    this.sprite.angle = 0;
    this.sprite.setSize(32, 100);
    this.sprite.setOffset(16, 0);
    this.sprite.body.reset(this.sprite.x, this.sprite.y);
    this.sprite.setVelocityX(0);
    this.sprite.setVelocityY(-100); 
  }
  idleOnUpOnUpdate() {
    if (this.keys.A.isDown) {
      this.stateMachine.setState('onUpToLeft');
    }
    if (this.keys.D.isDown) {
      this.stateMachine.setState('onUpToRight');
    }
  }
  idleOnLeftOnEnter() {
		this.sprite.play('idle');
    this.sprite.flipY = false;
    this.sprite.angle = 90;
    this.sprite.setSize(100, 32);
    this.sprite.setOffset(-32, 48);
    this.sprite.body.reset(this.sprite.x, this.sprite.y);
    this.sprite.setVelocityX(-100);
    this.sprite.setVelocityY(0); 
  }
  idleOnLeftOnUpdate() {
    if (this.keys.W.isDown) {
      this.stateMachine.setState('onLeftToUp');
    }
    if (this.keys.S.isDown) {
      this.stateMachine.setState('onLeftToDown');
    }
  }
  idleOnRightOnEnter() {
		this.sprite.play('idle');
    this.sprite.flipY = true;
    this.sprite.angle = 90;
    this.sprite.setSize(100, 32);
    this.sprite.setOffset(-4, 48);
    this.sprite.body.reset(this.sprite.x, this.sprite.y);
    this.sprite.setVelocityX(100);
    this.sprite.setVelocityY(0); 
  }
  idleOnRightOnUpdate() {
    if (this.keys.W.isDown) {
      this.stateMachine.setState('onRightToUp');
    }
    if (this.keys.S.isDown) {
      this.stateMachine.setState('onRightToDown');
    }
  }
  onDownToLeftOnEnter()	{
		this.sprite.play('walk');
    this.sprite.flipX = true;
    this.sprite.setVelocityX(-this.speed);
	}
  onDownToLeftOnUpdate() {
    if (!this.isBlockedOnDown()) {
      this.sprite.body.reset(this.sprite.x - 64, this.sprite.y + 72);
      this.stateMachine.setState('idleOnRight');
    } else if (this.isBlockedOnLeft()) {
      this.stateMachine.setState('idleOnLeft');
    } else if (!this.keys.A.isDown) {
      this.stateMachine.setState('idleOnDown');
    }
  }
  onDownToRightOnEnter()	{
		this.sprite.play('walk');
    this.sprite.flipX = false;
    this.sprite.setVelocityX(this.speed);
	}
  onDownToRightOnUpdate() { 
    if (!this.isBlockedOnDown()) {
      this.sprite.body.reset(this.sprite.x + 64, this.sprite.y + 72);
      this.stateMachine.setState('idleOnLeft');
    } else if (this.isBlockedOnRight()) {
      this.stateMachine.setState('idleOnRight');
    } else if (!this.keys.D.isDown) {
      this.stateMachine.setState('idleOnDown');
    }
  }
  onUpToLeftOnEnter()	{
		this.sprite.play('walk');
    this.sprite.flipX = true;
    this.sprite.setVelocityX(-this.speed);
	}
  onUpToLeftOnUpdate() {
    if (!this.isBlockedOnUp()) {      
      this.sprite.body.reset(this.sprite.x - 64, this.sprite.y - 72);
      this.stateMachine.setState('idleOnRight');
    } else if (this.isBlockedOnLeft()) {
      this.stateMachine.setState('idleOnLeft');
    } else if (!this.keys.A.isDown) {
      this.stateMachine.setState('idleOnUp');
    }
  }
  onUpToRightOnEnter()	{
		this.sprite.play('walk');
    this.sprite.flipX = false;
    this.sprite.setVelocityX(this.speed);
	}
  onUpToRightOnUpdate() {
    if (!this.isBlockedOnUp()) {
      this.sprite.body.reset(this.sprite.x + 64, this.sprite.y - 72);
      this.stateMachine.setState('idleOnLeft');
    } else if (this.isBlockedOnRight()) {
      this.stateMachine.setState('idleOnRight');
    } else if (!this.keys.D.isDown) {
      this.stateMachine.setState('idleOnUp');
    }
  }
  onLeftToDownOnEnter()	{
		this.sprite.play('walk');
    this.sprite.flipX = false;
    this.sprite.setVelocityY(this.speed);
	}
  onLeftToDownOnUpdate() {
    if (!this.isBlockedOnLeft()) {
      this.sprite.body.reset(this.sprite.x - 72, this.sprite.y + 64);
      this.stateMachine.setState('idleOnUp');
    } else if (this.isBlockedOnDown()) {
      this.stateMachine.setState('idleOnDown');
    } else if (!this.keys.S.isDown) {
      this.stateMachine.setState('idleOnLeft');
    }
  }
  onLeftToUpOnEnter()	{
		this.sprite.play('walk');
    this.sprite.flipX = true;
    this.sprite.setVelocityY(-this.speed);
	}
  onLeftToUpOnUpdate() {
    if (!this.isBlockedOnLeft()) {      
      this.sprite.body.reset(this.sprite.x - 72, this.sprite.y - 64);
      this.stateMachine.setState('idleOnDown');
    } else if (this.isBlockedOnUp()) {
      this.stateMachine.setState('idleOnUp');
    } else if (!this.keys.W.isDown) {
      this.stateMachine.setState('idleOnLeft');
    }
  }
  onRightToDownOnEnter()	{
		this.sprite.play('walk');
    this.sprite.flipX = false;
    this.sprite.setVelocityY(this.speed);
	}
  onRightToDownOnUpdate() {
    if (!this.isBlockedOnRight()) {
      this.sprite.body.reset(this.sprite.x + 72, this.sprite.y + 64);
      this.stateMachine.setState('idleOnUp');
    } else if (this.isBlockedOnDown()) {
      this.stateMachine.setState('idleOnDown');
    } else if (!this.keys.S.isDown) {
      this.stateMachine.setState('idleOnRight');
    }
  }
  onRightToUpOnEnter()	{
		this.sprite.play('walk');
    this.sprite.flipX = true;
    this.sprite.setVelocityY(-this.speed);
	}
  onRightToUpOnUpdate() {
    if (!this.isBlockedOnRight()) {
      this.sprite.body.reset(this.sprite.x + 72, this.sprite.y - 64);
      this.stateMachine.setState('idleOnDown');
    } else if (this.isBlockedOnUp()) {
      this.stateMachine.setState('idleOnUp');
    } else if (!this.keys.W.isDown) {
      this.stateMachine.setState('idleOnRight');
    }
  }
  createAnimations() {
    super.createAnimations();
    this.sprite.anims.remove('crouch');
    this.sprite.anims.create({
      key: 'crouch',
      frames: this.sprite.anims.generateFrameNumbers('bots', {
        frames: [this.frame + 24],
      }),
      frameRate: 8,
      repeat: -1
    });
  }
}