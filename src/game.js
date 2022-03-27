import Phaser from './phaser.js';
import LoadScene from './loadScene.js';

new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: '#777',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 2100},
      // debug: true,
    },
  },
  scale: {
    parent: 'game-container',
    mode: Phaser.Scale.FIT,
    width: 1920,
    height: 1080,
  },
  scene: [LoadScene],
});