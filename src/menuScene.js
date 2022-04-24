import LevelScene from './levelScene.js';
import Phaser from './phaser.js';

export default class MenuScene extends Phaser.Scene {
  create() {
    this.add.image(0, 0, 'title').setOrigin(0).setInteractive().on('pointerup', () => {
      this.scene.add('LevelScene', LevelScene);
      this.scene.start('LevelScene');
    });
  }
}