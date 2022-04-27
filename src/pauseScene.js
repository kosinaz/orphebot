import Phaser from './phaser.js';

export default class PauseScene extends Phaser.Scene {
  create() {
    const bg = this.add.graphics();
    bg.fillStyle(0x000000);
    bg.fillRect(0, 0, 1920, 1080);
    bg.setAlpha(0.75);
    this.add.image(960, 440, 'sprites', 'paused');
    this.input.keyboard.on('keyup', () => {
      this.scene.resume('LevelScene');
      this.scene.stop('PauseScene');
    });
    this.input.on('pointerup', () => {
      this.scene.resume('LevelScene');
      this.scene.stop('PauseScene');
    });
  }
} 
    