import Phaser from './phaser.js';
import MenuScene from './menuScene.js';

export default class LoadScene extends Phaser.Scene {
  preload() {
    
  }
  create() {
    this.scene.add('MenuScene', MenuScene);
    this.scene.start('MenuScene');
  }
}