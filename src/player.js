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
    this.stateMachine.addState('toOperate', {
      onEnter: this.toOperateOnEnter,
      onUpdate: this.toOperateOnUpdate,
    });
    this.stateMachine.addState('operate', {
      onEnter: this.operateOnEnter,
      onUpdate: this.operateOnUpdate,
    });
    this.stateMachine.addState('fromOperate', {
      onEnter: this.fromOperateOnEnter,
      onUpdate: this.fromOperateOnUpdate,
    });
    this.keys = this.sprite.scene.input.keyboard.addKeys('UP,LEFT,DOWN,RIGHT, W,A,S,D,R,SPACE');    
    this.stickKeys = this.sprite.scene.moveStick.createCursorKeys();
    this.keys.R.on('up', () => {
      if (this.stateMachine.isCurrentState('core')
        || this.stateMachine.isCurrentState('dead')) {
        return;
      }
      this.health = 0;
      this.stateMachine.setState('core');
    })
    this.pointer = this.sprite.scene.input.activePointer;    
    this.cross = this.sprite.scene.cross;
    this.health = 100;
    this.speed = 160;
    this.maxCooldown = 30;
    this.currentCooldown = 30;
    this.canJump = true;
    this.canRide = false;
    this.canClimb = false;
    this.canOperate = false;
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
    if ((this.isUpDown || this.keys.SPACE.isDown) && this.canRide) {
      let sound = this.sprite.scene.elevatorUpSound;
      sound.volume = 0.30;
      sound.play();
      closestElevator.setVelocityY(-350);
    }
    if (this.isDownDown && this.canRide) {
      closestElevator.setVelocityY(350);
      let sound = this.sprite.scene.elevatorDownSound;
      sound.volume = 0.30;
      sound.play();
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
      this.currentCooldown = this.maxCooldown;
      this.sprite.scene.lasers.fire(
        this.sprite.x,
        this.stateMachine.isCurrentState('crouch') ? this.sprite.y + 20 : this.sprite.y - 12,
        this.cross.x,
        this.cross.y,
        this.laser,
        true,
      );
    }
  }
  get isNoneDown() {
    return Object.values(this.keys).every(key => key.isUp) && Object.values(this.stickKeys).every(key => key.isUp);
  }
  get isLeftDown() {
    return this.keys.LEFT.isDown || this.keys.A.isDown || this.stickKeys.left.isDown;
  }
  get isRightDown() {
    return this.keys.RIGHT.isDown || this.keys.D.isDown || this.stickKeys.right.isDown;
  }
  get isUpDown() {
    return this.keys.UP.isDown || this.keys.W.isDown || this.keys.SPACE.isDown || this.stickKeys.up.isDown;
  }
  get isDownDown() {
    return this.keys.DOWN.isDown || this.keys.S.isDown || this.stickKeys.down.isDown;
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
      this.sprite.setGravity(0, 0);
      this.stateMachine.setState('idleOnDown');
      return;
    }
    super.idleOnUpdate();
    if (this.cross.x <= this.sprite.x) {
      this.sprite.flipX = true;
      if (this.isLeftDown) {
        this.stateMachine.setState('forward');
      }
      if (this.isRightDown) {
        this.stateMachine.setState('backward');
      }
    }
    if (this.cross.x > this.sprite.x) {
      this.sprite.flipX = false;
      if (this.isRightDown) {
        this.stateMachine.setState('forward');
      }
      if (this.isLeftDown) {
        this.stateMachine.setState('backward');
      }
    }
    if (this.isDownDown && this.canJump) {
      this.stateMachine.setState('crouch');
    }
    if (this.isUpDown && this.canJump) {
      this.sprite.setVelocityY(-600);  
      this.stateMachine.setState('jump');   
    }
    if (this.canOperate) {
      this.closestClaw = this.sprite.scene.physics.closest(this.sprite, this.sprite.scene.claws);
      if (this.closestClaw && this.keys.SPACE.isDown) {
        this.stateMachine.setState('toOperate');
      }
    }
  }
	forwardOnUpdate() {
    if (this.cross.x <= this.sprite.x) {
      this.sprite.flipX = true;
      if (this.isLeftDown) {
        this.sprite.setVelocityX(-this.speed);
      }
      if (this.isRightDown) {
        this.stateMachine.setState('backward');
      }
    }
    if (this.cross.x > this.sprite.x) {
      this.sprite.flipX = false;
      if (this.isRightDown) {
        this.sprite.setVelocityX(this.speed);
      }
      if (this.isLeftDown) {
        this.stateMachine.setState('backward');
      }
    }
    if (this.isDownDown && this.canJump) {
      this.stateMachine.setState('crouch');
    }
    if (this.isUpDown && this.canJump) {
      this.sprite.setVelocityY(-600);
      this.stateMachine.setState('jump');      
    }
    if (!this.sprite.body.blocked.down) {
      this.stateMachine.setState('jump'); 
    }
    if (this.isNoneDown) {
      this.sprite.setVelocityX(0);
      this.stateMachine.setState('idle');
    }
    if (this.canOperate) {
      this.closestClaw = this.sprite.scene.physics.closest(this.sprite, this.sprite.scene.claws);
      if (this.closestClaw && this.keys.SPACE.isDown) {
        this.stateMachine.setState('toOperate');
      }
    }
  }
	backwardOnUpdate() {
    if (this.cross.x <= this.sprite.x) {
      this.sprite.flipX = true;
      if (this.isRightDown) {
        this.sprite.setVelocityX(this.speed);
      }
      if (this.isLeftDown) {
        this.stateMachine.setState('forward');
      }
    }
    if (this.cross.x > this.sprite.x) {
      this.sprite.flipX = false;
      if (this.isLeftDown) {
        this.sprite.setVelocityX(-this.speed);
      }
      if (this.isRightDown) {
        this.stateMachine.setState('forward');
      }
    }
    if (this.isDownDown && this.canJump) {
      this.stateMachine.setState('crouch');
    }
    if (this.isUpDown && this.canJump) {
      this.sprite.setVelocityY(-600);
      this.stateMachine.setState('jump');      
    }
    if (!this.sprite.body.blocked.down) {
      this.stateMachine.setState('jump'); 
    }
    if (this.isNoneDown) {
      this.stateMachine.setState('idle');
    }
    if (this.canOperate) {
      this.closestClaw = this.sprite.scene.physics.closest(this.sprite, this.sprite.scene.claws);
      if (this.closestClaw && this.keys.SPACE.isDown) {
        this.stateMachine.setState('toOperate');
      }
    }
  }
  jumpOnUpdate() {
    super.jumpOnUpdate();
    if (this.cross.x <= this.sprite.x) {
      this.sprite.flipX = true;
    }
    if (this.cross.x > this.sprite.x) {
      this.sprite.flipX = false;
    }
    if (this.isRightDown) {
      this.sprite.setVelocityX(this.speed);
    }
    if (this.isLeftDown) {
      this.sprite.setVelocityX(-this.speed);
    }
    if (this.canOperate) {
      this.closestClaw = this.sprite.scene.physics.closest(this.sprite, this.sprite.scene.claws);
      if (this.closestClaw && this.keys.SPACE.isDown) {
        this.stateMachine.setState('toOperate');
      }
    }
  }
  crouchOnEnter() {
    let sound = this.sprite.scene.jumpSound;
    sound.volume = 0.30;
    sound.play();
    this.sprite.play('crouch');
    this.sprite.setVelocityX(0);
    this.sprite.setSize(32, 64);
    this.sprite.setOffset(16, 64);
  }
  crouchOnUpdate() {
    if (this.cross.x <= this.sprite.x) {
      this.sprite.flipX = true;
    }
    if (this.cross.x > this.sprite.x) {
      this.sprite.flipX = false;
    }
    if (this.isUpDown && this.canJump) {
      this.sprite.setVelocityY(-600);
      this.stateMachine.setState('jump');      
    }
    if (!this.isDownDown) {
      this.stateMachine.setState('idle');
    }
    if (!this.sprite.body.blocked.down) {
      this.stateMachine.setState('jump'); 
    } 
  }
  crouchOnExit() {    
    let sound = this.sprite.scene.jumpSound;
    sound.volume = 0.30;
    sound.play();
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
    this.sprite.setGravity(0, 0); 
  }
  idleOnDownOnUpdate() {
    if (this.isLeftDown) {
      this.stateMachine.setState('onDownToLeft');
    }
    if (this.isRightDown) {
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
    this.sprite.setGravity(0, 0); 
  }
  idleOnUpOnUpdate() {
    if (this.isLeftDown) {
      this.stateMachine.setState('onUpToLeft');
    }
    if (this.isRightDown) {
      this.stateMachine.setState('onUpToRight');
    }
    if (this.isDownDown) {
      this.stateMachine.setState('jump');     
      this.sprite.setGravity(0, 2100); 
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
    this.sprite.setGravity(0, 0); 
  }
  idleOnLeftOnUpdate() {
    if (this.isUpDown) {
      this.stateMachine.setState('onLeftToUp');
    }
    if (this.isDownDown) {
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
    this.sprite.setGravity(0, 0); 
  }
  idleOnRightOnUpdate() {
    if (this.isUpDown) {
      this.stateMachine.setState('onRightToUp');
    }
    if (this.isDownDown) {
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
    } else if (!this.isLeftDown) {
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
    } else if (!this.isRightDown) {
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
    } else if (!this.isLeftDown) {
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
    } else if (!this.isRightDown) {
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
    } else if (!this.isDownDown) {
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
    } else if (!this.isUpDown) {
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
    } else if (!this.isDownDown) {
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
    } else if (!this.isUpDown) {
      this.stateMachine.setState('idleOnRight');
    }
  }
  toOperateOnEnter()	{
		this.sprite.play('idle');
    this.sprite.setVelocityX(0);
	}
  toOperateOnUpdate()	{
    if (this.keys.SPACE.isUp) {
		  this.stateMachine.setState('operate');
    }
	}
  operateOnEnter()	{
	}
  operateOnUpdate() {
    if (this.keys.SPACE.isDown) {
      this.closestClaw.release();
      this.stateMachine.setState('fromOperate');
    } else if (this.isUpDown) {
      this.closestClaw.setVelocityY(-350); 
    } else if (this.isDownDown) {
      this.closestClaw.setVelocityY(350);
    } else if (this.isLeftDown) {
      this.closestClaw.setVelocityX(-350);
      this.closestClaw.crane.setVelocityX(-350);
    } else if (this.isRightDown) { 
      this.closestClaw.setVelocityX(350); 
      this.closestClaw.crane.setVelocityX(350); 
    }
  }
  fromOperateOnEnter()	{
	}
  fromOperateOnUpdate()	{
    if (this.keys.SPACE.isUp) {
		  this.stateMachine.setState('idle');
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