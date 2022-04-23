import Bot from './bot.js';

export default class Player extends Bot {
  constructor(sprite) {
    super(sprite);
    this.stateMachine.addState('crouch', {
      onEnter: this.crouchOnEnter,
      onUpdate: this.crouchOnUpdate,
      onExit: this.crouchOnExit,
    });
    this.keys = this.sprite.scene.input.keyboard.addKeys('W,A,S,D,SPACE');
    this.pointer = this.sprite.scene.input.activePointer;
    this.health = 100;
    this.speed = 160;
    this.maxCooldown = 30;
    this.currentCooldown = 30;
  } 
  update(dt) {
    super.update(dt);
    if (this.pointer.isDown && !this.stateMachine.isCurrentState('core')) {
      this.shoot();
    }
  }
  shoot() {
    if (this.currentCooldown < 0) {
      this.currentCooldown = this.maxCooldown;
      this.sprite.scene.lasers.fire(
        this.sprite.x,
        this.stateMachine.isCurrentState('crouch') ? this.sprite.y + 20 : this.sprite.y - 12,
        this.pointer.worldX,
        this.pointer.worldY,
        'greenLaser',
        true,
      );
    }
  }
  noneIsDown() {
    return Object.values(this.keys).every(key => !key.isDown);
  }
  idleOnUpdate() {
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
    if (this.keys.S.isDown) {
      this.stateMachine.setState('crouch');
    }
    if (this.keys.SPACE.isDown) {
      this.sprite.setVelocityY(-600);  
      this.stateMachine.setState('jump');   
    }
  }
  coreOnEnter() {
    this.sprite.setTexture('sprites', 'greenCore');
    super.coreOnEnter();
  }
  forwardOnEnter()	{
		this.sprite.play('run');
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
    if (this.keys.S.isDown) {
      this.stateMachine.setState('crouch');
    }
    if (this.keys.SPACE.isDown) {
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
  backwardOnEnter()	{
		this.sprite.playReverse('run');
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
    if (this.keys.S.isDown) {
      this.stateMachine.setState('crouch');
    }
    if (this.keys.SPACE.isDown) {
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
    if (this.keys.SPACE.isDown) {
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
  createAnimations() {
    super.createAnimations();
    this.sprite.anims.create({
      key: 'crouch',
      frames: this.sprite.anims.generateFrameNumbers('bots', {
        frames: [this.frame + 24],
      }),
      frameRate: 8,
      repeat: -1
    });
    this.sprite.anims.create({
      key: 'run',
      frames: this.sprite.anims.generateFrameNumbers('bots', {
        start: this.frame + 4,
        end: this.frame + 11,
      }),
      frameRate: 16,
      repeat: -1,
    });
  }
}