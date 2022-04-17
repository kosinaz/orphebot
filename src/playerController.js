import BotController from './botController.js';

export default class PlayerController extends BotController {
  constructor(bot) {
    super(bot);
    this.stateMachine.addState('crouch', {
      onEnter: this.crouchOnEnter,
      onUpdate: this.crouchOnUpdate,
      onExit: this.crouchOnExit,
    }).addState('jump', {
      onEnter: this.jumpOnEnter,
      onUpdate: this.jumpOnUpdate,
    });
    this.keys = this.bot.scene.input.keyboard.addKeys('W,A,S,D,UP,LEFT,DOWN,RIGHT,SPACE,ENTER');
    this.pointer = this.bot.scene.input.activePointer;
  }
  update(dt) {
    super.update(dt);
    if (this.pointer.isDown) {
      this.shoot(this.pointer);
    }
  }
  noneIsDown() {
    return Object.values(this.keys).every(key => !key.isDown);
  }
  idleOnUpdate() {
    if (this.pointer.x <= 960) {
      this.bot.flipX = true;
      if (this.keys.A.isDown) {
        this.stateMachine.setState('walk');
      }
      if (this.keys.D.isDown) {
        this.stateMachine.setState('back');
      }
    }
    if (this.pointer.x > 960) {
      this.bot.flipX = false;
      if (this.keys.D.isDown) {
        this.stateMachine.setState('walk');
      }
      if (this.keys.A.isDown) {
        this.stateMachine.setState('back');
      }
    }
    if (this.keys.S.isDown) {
      this.stateMachine.setState('crouch');
    }
    if (this.keys.SPACE.isDown) {
      this.stateMachine.setState('jump');      
    }
  }
	walkOnUpdate() {
    if (this.pointer.x <= 960) {
      this.bot.flipX = true;
      if (this.keys.A.isDown) {
        this.bot.setVelocityX(-this.bot.speed);
      }
      if (this.keys.D.isDown) {
        this.stateMachine.setState('back');
      }
    }
    if (this.pointer.x > 960) {
      this.bot.flipX = false;
      if (this.keys.D.isDown) {
        this.bot.setVelocityX(this.bot.speed);
      }
      if (this.keys.A.isDown) {
        this.stateMachine.setState('back');
      }
    }
    if (this.keys.S.isDown) {
      this.stateMachine.setState('crouch');
    }
    if (this.keys.SPACE.isDown) {
      this.stateMachine.setState('jump');      
    }
    if (this.noneIsDown()) {
      this.bot.setVelocityX(0);
      this.stateMachine.setState('idle');
    }
  }
	backOnUpdate() {
    if (this.pointer.x <= 960) {
      this.bot.flipX = true;
      if (this.keys.D.isDown) {
        this.bot.setVelocityX(this.bot.speed);
      }
      if (this.keys.A.isDown) {
        this.stateMachine.setState('walk');
      }
    }
    if (this.pointer.x > 960) {
      this.bot.flipX = false;
      if (this.keys.A.isDown) {
        this.bot.setVelocityX(-this.bot.speed);
      }
      if (this.keys.D.isDown) {
        this.stateMachine.setState('walk');
      }
    }
    if (this.keys.S.isDown) {
      this.stateMachine.setState('crouch');
    }
    if (this.keys.SPACE.isDown) {
      this.stateMachine.setState('jump');      
    }
    if (this.noneIsDown()) {
      this.stateMachine.setState('idle');
    }
  }
  crouchOnEnter() {
    this.bot.play('crouch');
    this.bot.setVelocityX(0);
    this.bot.setSize(32, 64);
    this.bot.setOffset(16, 64);
  }
  crouchOnUpdate() {
    if (this.pointer.x <= 960) {
      this.bot.flipX = true;
    }
    if (this.pointer.x > 960) {
      this.bot.flipX = false;
    }
    if (!this.keys.S.isDown) {
      this.stateMachine.setState('idle');
    }
  }
  crouchOnExit() {    
    this.bot.setSize(32, 100);
    this.bot.setOffset(16, 28);
  }
  jumpOnEnter() {
    this.bot.play('jump');
    this.bot.setVelocityY(-600);
  }
  jumpOnUpdate() {
    if (this.pointer.x <= 960) {
      this.bot.flipX = true;
    }
    if (this.pointer.x > 960) {
      this.bot.flipX = false;
    }
    if (this.keys.D.isDown) {
      this.bot.setVelocityX(this.bot.speed);
    }
    if (this.keys.A.isDown) {
      this.bot.setVelocityX(-this.bot.speed);
    }
    if (this.bot.body.blocked.down) {
      this.stateMachine.setState('idle');
    }
  }
  createAnimations() {
    super.createAnimations();
    this.bot.anims.create({
      key: 'jump',
      frames: this.bot.anims.generateFrameNumbers('bots', {
        frames: [this.bot.startFrame + 7],
      }),
      frameRate: 8,
      repeat: -1
    });
    this.bot.anims.create({
      key: 'crouch',
      frames: this.bot.anims.generateFrameNumbers('bots', {
        frames: [this.bot.startFrame + 24],
      }),
      frameRate: 8,
      repeat: -1
    });
  }
}