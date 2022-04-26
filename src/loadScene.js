import Phaser from './phaser.js';
import MenuScene from './menuScene.js';

export default class LoadScene extends Phaser.Scene {
  preload() {    
    this.load.image('title', 'image/title.png');
    this.load.image('tileset', 'image/tileset.png');
    this.load.spritesheet('bots', 'image/bots.png', { 
      frameWidth: 64, 
      frameHeight: 128,
    });
    this.load.atlas('sprites', 'image/sprites.png', 'image/sprites.json');
  }
  create() {
    this.scene.add('MenuScene', MenuScene);
    this.scene.start('MenuScene');
  }
} 