import Phaser from './phaser.js';

export default class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(...args) {
    super(...args);
    this.scene.physics.add.collider(this, this.scene.fg, (laser) => {
      laser.setActive(false);
      laser.setVisible(false);
      laser.body.reset(0, 0);
    });
    this.scene.physics.add.collider(this, this.scene.elevators, (laser) => {
      laser.setActive(false);
      laser.setVisible(false);
      laser.body.reset(0, 0);
    });
    this.scene.physics.add.collider(this, this.scene.bots, (laser, bot) => {
      if (!bot.bot.stateMachine.isCurrentState('core') && laser.friendly) {
        bot.bot.damage(10);
      }
      laser.setActive(false);
      laser.setVisible(false);
      laser.body.reset(0, 0);
    });
    this.scene.physics.add.collider(this, this.scene.player, (laser, player) => {
      if (!player.bot.stateMachine.isCurrentState('core') && !laser.friendly) {  
        player.bot.damage(10);
      }
      laser.setActive(false);
      laser.setVisible(false);
      laser.body.reset(0, 0);
    });
  }
  fire (fromX, fromY, toX, toY) {
    this.body.reset(fromX, fromY);
    this.setActive(true);
    this.setVisible(true);
    this.scene.physics.moveTo(this, toX, toY, 500);
  }
}