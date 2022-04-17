import StateMachine from './stateMachine.js';

export default class BotController {
  constructor(bot) {
    this.bot = bot;
    this.createAnimations();
    this.stateMachine = new StateMachine(this);
    this.stateMachine.addState('idle', {
      onEnter: this.idleOnEnter,
      onUpdate: this.idleOnUpdate,
      onExit: this.idleOnExit,
    }).addState('walk', {
      onEnter: this.walkOnEnter,
      onUpdate: this.walkOnUpdate,
      onExit: this.walkOnExit,
    }).addState('back', {
      onEnter: this.backOnEnter,
      onUpdate: this.backOnUpdate,
      onExit: this.backOnExit,
    }).setState('idle');
  }
  shoot(target) {
    if (this.bot.currentCooldown < 0) {
      this.bot.currentCooldown = this.bot.maxCooldown;
      this.bot.scene.lasers.fire(
        this.bot.x + (target.x > 960 ? 8 : -8),
        this.stateMachine.isCurrentState('crouch') ? this.bot.y + 20 : this.bot.y - 12,
        target.worldX,
        target.worldY,
        'greenLaser',
        true,
      );
    }     
  }
  update(dt) {
    this.stateMachine.update(dt);
    this.bot.currentCooldown -= 1;
  }
  idleOnEnter() {
    this.bot.play('idle');
    this.bot.setVelocityX(0);
  }
  idleOnUpdate() {}
  idleOnExit() {
		this.bot.stop();
  }
  walkOnEnter()	{
		this.bot.play('walk');
	}
	walkOnUpdate() {}
	walkOnExit() {
		this.bot.stop();
  }
  backOnEnter()	{
		this.bot.play('back');
	}
	backOnUpdate() {}
	backOnExit() {
		this.bot.stop();
  }
  createAnimations() {
    this.bot.anims.create({
      key: 'idle',
      frames: this.bot.anims.generateFrameNumbers('bots', {
        start: this.bot.startFrame,
        end: this.bot.startFrame + 3,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.bot.anims.create({
      key: 'walk',
      frames: this.bot.anims.generateFrameNumbers('bots', {
        start: this.bot.startFrame + 4,
        end: this.bot.startFrame + 11,
      }),
      frameRate: this.bot.speed / 10,
      repeat: -1,
    });
    this.bot.anims.create({
      key: 'back',
      frames: this.bot.anims.generateFrameNumbers('bots', {
        start: this.bot.startFrame + 11,
        end: this.bot.startFrame + 4,
      }),
      frameRate: this.bot.speed / 10,
      repeat: -1,
    });
    this.bot.anims.create({
      key: 'shoot',
      frames: this.bot.anims.generateFrameNumbers('bots', {
        frames: [this.bot.startFrame],
      }),
      frameRate: 8,
    });
  }
}