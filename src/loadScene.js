import Phaser from './phaser.js';
import LevelScene from './levelScene.js';

export default class LoadScene extends Phaser.Scene {
  preload() {    
    this.load.image('tileset', 'image/tileset.png');
    this.load.spritesheet('bots', 'image/bots.png', { 
      frameWidth: 64, 
      frameHeight: 128,
    });
    this.load.atlas('sprites', 'image/sprites.png', 'image/sprites.json');
  }
  create() {
    this.scene.add('LevelScene', LevelScene);
    this.scene.start('LevelScene');
  }
} 