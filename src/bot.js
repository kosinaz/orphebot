import Bar from './bar.js';
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
      onExit: this.coreOnExit,
    }).addState('dead').setState('idle');
    this.bar = this.sprite.scene.add.existing(new Bar(this.sprite.scene, this.sprite, () => {
      return this.health;
    }))
  }
  damage(amount) {
    this.health -= amount;
    if (this.health < 1) {
      if (this.cores.length) {
        this.stateMachine.setState('core');
      } else {
        this.stateMachine.setState('dead');
        this.sprite.destroy();
        this.bar.destroy();
      }
    }
  }
  update(dt) {
    this.bar.update();
    this.stateMachine.update(dt);
    this.currentCooldown -= 1;
  }
  isVisible() {
    let view = this.sprite.scene.cameras.main.worldView;
    view.setSize(view.width + 4, view.height + 4);
    view.setPosition(view.x - 2, view.y - 2);
    return view.contains(this.sprite.x, this.sprite.y);
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
    if (!Phaser.Math.RND.integerInRange(0, 10)) {
      const sound = Phaser.Math.RND.pick(this.sprite.scene.chatterSounds);
      sound.volume = 0.20;
      sound.play();
    }
    this.sprite.play('walk');
	}
	forwardOnUpdate() {
    this.fall();
  }
	forwardOnExit() {
		this.sprite.stop();
  }
  backwardOnEnter()	{
    if (!Phaser.Math.RND.integerInRange(0, 10)) {
      const sound = Phaser.Math.RND.pick(this.sprite.scene.chatterSounds);
      sound.volume = 0.20;
      sound.play();
    }
		this.sprite.playReverse('walk');
	}
	backwardOnUpdate() {
    this.fall();
  }
	backwardOnExit() {
		this.sprite.stop();
  }
  jumpOnEnter() {
    let sound = this.sprite.scene.jumpSound;
    sound.volume = 0.30;
    sound.play();
    this.sprite.play('jump');
  }
  jumpOnUpdate() {
    if (this.sprite.body.blocked.down) {
      this.stateMachine.setState('idle');
    }
  }
  coreOnEnter() {
    this.coreSound = this.sprite.scene.coreSound;
    this.coreSound.volume = 0.10;
    this.coreSound.play();
    this.sprite.stop();
    this.sprite.setTexture('sprites', this.cores.shift());
    if (this.updateCounter) {
      this.updateCounter();
    }
    this.sprite.setGravity(0, 2100);
    this.sprite.setVelocityY(-600);
    this.sprite.setSize(24, 24);
    this.sprite.setDragX(60);    
  }
  coreOnUpdate() {
    this.health += 0.2;
    if (this.health > 100) {
      this.health = 100;
      let bots = {
        'greenCore': {
          frame: 182,          
          speed: 160,
          maxCooldown: 30,
          currentCooldown: 30,
          canJump: true,
          canRide: false,
          canClimb: false,
          canOperate: false,
          laser: 'greenLaser',
        },
        'yellowCore': {
          frame: 208,          
          speed: 80,
          maxCooldown: 60,
          currentCooldown: 60,
          canJump: false,
          canRide: true,
          canClimb: false,
          canOperate: false,
          laser: 'yellowLaser',
        },
        'blueCore': {
          frame: 78,          
          speed: 80,
          maxCooldown: 60,
          currentCooldown: 60,
          canJump: false,
          canRide: false,
          canClimb: true,
          canOperate: false,
          laser: 'blueLaser',
        },
        'orangeCore': {
          frame: 0,          
          speed: 80,
          maxCooldown: 60,
          currentCooldown: 60,
          canJump: false,
          canRide: false,
          canClimb: false,
          canOperate: true,
          laser: 'orangeLaser',
        },
      }
      this.frame = bots[this.sprite.frame.name].frame;
      this.speed = bots[this.sprite.frame.name].speed;
      this.maxCooldown = bots[this.sprite.frame.name].maxCooldown;
      this.currentCooldown = bots[this.sprite.frame.name].currentCooldown;
      this.canJump = bots[this.sprite.frame.name].canJump;
      this.canRide = bots[this.sprite.frame.name].canRide;
      this.canClimb = bots[this.sprite.frame.name].canClimb;
      this.canOperate = bots[this.sprite.frame.name].canOperate;
      this.laser = bots[this.sprite.frame.name].laser;
      this.sprite.setTexture('bots', this.frame);
      this.createAnimations();
      this.sprite.setSize(32, 100);
      this.sprite.setOffset(16, 28);
      this.sprite.setDragX(0);      
      this.sprite.setGravity(0, this.canClimb ? 0 : 2100);      
      this.sprite.flipX = false;
      this.sprite.flipY = false;
      this.sprite.angle = 0;
      this.sprite.body.reset(this.sprite.x, this.sprite.y - 64);
      this.health = 100;
      this.stateMachine.setState('idle');
    }
  }
  coreOnExit() {
    this.coreSound.stop();
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
      frameRate: 16,
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