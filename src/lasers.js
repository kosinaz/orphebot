import Laser from './laser.js';
import Phaser from './phaser.js';

export default class Lasers extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene, {
      gravityY: -2100,
    });
    this.createMultiple({
      frameQuantity: 1,
      key: 'sprites',
      frame: 'greenLaser',
      active: false,
      visible: false,
      classType: Laser,
    });
  }
  fire(fromX, fromY, toX, toY, frame, friendly) {
    let laser = this.getFirstDead() || this.create(0, 0, 'sprites', frame, false, false);
    laser.friendly = friendly;
    laser.setFrame(frame);
    laser.fire(fromX, fromY, toX, toY);
  }
}