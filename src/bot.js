import StateMachine from './stateMachine.js';

export default class Bot {
  constructor(sprite) {
    this.sprite = sprite;
    this.sprite.bot = this;
    this.frame = this.sprite.frame.name;
    this.createAnimations();
    this.stateMachine = new StateMachine(this, this.constructor.name);
    this.stateMachine.addState('idle', {
      onEnter: this.idleOnEnter,
      onUpdate: this.idleOnUpdate,
      onExit: this.idleOnExit,
    }).addState('forward', {
      onEnter: this.forwardOnEnter,
      onUpdate: this.forwardOnUpdate,
      onExit: this.forwardOnExit,
    }).addState('backward', {
      onEnter: this.backwardOnEnter,
      onUpdate: this.backwardOnUpdate,
      onExit: this.backwardOnExit,
    }).addState('jump', {
      onEnter: this.jumpOnEnter,
      onUpdate: this.jumpOnUpdate,
    }).addState('core', {
      onEnter: this.coreOnEnter,
      onUpdate: this.coreOnUpdate,
    }).addState('dead').setState('idle');
  }
  damage(amount) {
    this.health -= amount;
    if (this.health < 1) {
      if (this.cores.length) {
        this.stateMachine.setState('core');
      } else {
        this.stateMachine.setState('dead');
        this.sprite.destroy();
      }
    }
  }
  update(dt) {
    this.stateMachine.update(dt);
    this.currentCooldown -= 1;
  }
  fall() {
    if (!this.sprite.body.blocked.down) {
      this.stateMachine.setState('jump'); 
    }
  }
  idleOnEnter() {
    this.sprite.play('idle');
    this.sprite.setVelocityX(0);
  }
  idleOnUpdate() {
    this.fall();
    this.sprite.setVelocityX(0);
  }
  idleOnExit() {
		this.sprite.stop();
  }
  forwardOnEnter()	{
    this.sprite.play('walk');
	}
	forwardOnUpdate() {
    this.fall();
  }
	forwardOnExit() {
		this.sprite.stop();
  }
  backwardOnEnter()	{
		this.sprite.playReverse('walk');
	}
	backwardOnUpdate() {
    this.fall();
  }
	backwardOnExit() {
		this.sprite.stop();
  }
  jumpOnEnter() {
    this.sprite.play('jump');
  }
  jumpOnUpdate() {
    if (this.sprite.body.blocked.down) {
      this.stateMachine.setState('idle');
    }
  }
  coreOnEnter() {
    this.sprite.stop();
    this.sprite.setTexture('sprites', this.cores.shift());
    this.sprite.setVelocityY(-600);
    this.sprite.setSize(24, 24);
    this.sprite.setDragX(60);
    this.regenerationTime = 500;
  }
  coreOnUpdate() {
    if (--this.regenerationTime < 0) {
      this.sprite.setVelocityY(-900);
      let bots = {
        'greenCore': {
          frame: 182,          
          speed: 160,
          maxCooldown: 30,
          currentCooldown: 30,
          canJump: true,
          canRide: false,
        },
        'yellowCore': {
          frame: 208,          
          speed: 80,
          maxCooldown: 60,
          currentCooldown: 60,
          canJump: false,
          canRide: true,
        },
      }
      this.frame = bots[this.sprite.frame.name].frame;
      this.speed = bots[this.sprite.frame.name].speed;
      this.maxCooldown = bots[this.sprite.frame.name].maxCooldown;
      this.currentCooldown = bots[this.sprite.frame.name].currentCooldown;
      this.canJump = bots[this.sprite.frame.name].canJump;
      this.canRide = bots[this.sprite.frame.name].canRide;
      this.sprite.setTexture('bots', this.frame);
      this.createAnimations();
      this.sprite.setSize(32, 100);
      this.sprite.setOffset(16, 28);
      this.sprite.setDragX(0);
      this.health = 100;
      this.stateMachine.setState('idle');
    }
  }
  createAnimations() {
    this.sprite.anims.remove('idle');
    this.sprite.anims.create({
      key: 'idle',
      frames: this.sprite.anims.generateFrameNumbers('bots', {
        start: this.frame,
        end: this.frame + 3,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.sprite.anims.remove('walk');
    this.sprite.anims.create({
      key: 'walk',
      frames: this.sprite.anims.generateFrameNumbers('bots', {
        start: this.frame + 4,
        end: this.frame + 11,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.sprite.anims.remove('jump');
    this.sprite.anims.create({
      key: 'jump',
      frames: this.sprite.anims.generateFrameNumbers('bots', {
        frames: [this.frame + 7],
      }),
      frameRate: 8,
      repeat: -1
    });
  }
}