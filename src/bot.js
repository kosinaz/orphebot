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
      this.stateMachine.setState('core');
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
    this.sprite.setVelocityY(-600);
    this.sprite.setSize(24, 24);
    this.sprite.setDragX(60);
    this.regenerationTime = 500;
  }
  coreOnUpdate() {
    if (--this.regenerationTime < 0) {
      this.sprite.setVelocityY(-900);
      this.sprite.setTexture('bots', 208);
      this.sprite.setSize(32, 100);
      this.sprite.setOffset(16, 28);
      this.sprite.setDragX(0);
      this.health = 100;
      this.stateMachine.setState('idle');
    }
  }
  createAnimations() {
    this.sprite.anims.create({
      key: 'idle',
      frames: this.sprite.anims.generateFrameNumbers('bots', {
        start: this.frame,
        end: this.frame + 3,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.sprite.anims.create({
      key: 'walk',
      frames: this.sprite.anims.generateFrameNumbers('bots', {
        start: this.frame + 4,
        end: this.frame + 11,
      }),
      frameRate: 8,
      repeat: -1,
    });
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