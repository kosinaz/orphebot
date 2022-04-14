import Phaser from './phaser.js';

export default class Elevator extends Phaser.Physics.Arcade.Image {
  constructor(scene) {
    super(scene, 0, 0, 'sprites', 'elevator');
    this.scene.physics.world.enable(this);
    this.setSize(192, 64);
    this.setOffset(0, 64);
    this.setImmovable(true);
    this.body.setBoundsRectangle(new Phaser.Geom.Rectangle(200, 150, 400, 300));
    this.speed = 100;   
  }
  update() {
    if (this.scene.keys.S.isDown) {
      this.setVelocityY(250);
    } else if (this.scene.keys.W.isDown) {
      this.setVelocityY(-250);
    }
  }
}