import Phaser from './phaser.js';

export default class BotSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(...args) {
    super(...args);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.add.collider(this, this.scene.fg);
    this.scene.physics.add.collider(this, this.scene.elevators, null, (bot, elevator) => {
      return elevator.y > bot.y;
    });
    this.scene.physics.add.overlap(this, this.scene.bots, (player, bot) => {
      if (bot.bot.stateMachine.isCurrentState('core')) {
        player.bot.cores.unshift(bot.bot.cores[0]);
        bot.destroy();
        bot.bot.bar.destroy();
        bot.bot.stateMachine.setState('dead');
        let sound = this.scene.grabSound;
        sound.volume = 0.30;
        sound.play();
        if (player.bot.updateCounter) {
          player.bot.updateCounter();
        }
      }
    });
    this.x += 32;
    this.y -= 64;
    this.setPushable(false);
    this.setGravity(0, 2100);
    this.setSize(32, 100);
    this.setOffset(16, 28);
  }
}