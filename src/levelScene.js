import Elevabot from './elevabot.js';
import Felibot from './felibot.js';
import Phaser from './phaser.js';

export default class LevelScene extends Phaser.Scene {
  preload() {
    this.load.tilemapTiledJSON('level1', 'data/level1.json');
  }
  create() {
    const map = this.make.tilemap({
      key: 'level1',
    });
    const tileset = map.addTilesetImage('tileset', 'tileset');
    const fg = map.createLayer('fg', tileset);
    fg.setCollisionBetween(0, 200);
    this.player = map.createFromObjects('obj', {
      classType: Felibot,
      frame: 84,
      gid: 253,
      key: 'bots',
    })[0];
    this.physics.add.collider(this.player, fg);
    this.elevabots = map.createFromObjects('obj', {
      classType: Elevabot,
      frame: 96,
      gid: 265,
      key: 'bots',
    });
    this.physics.add.collider(this.elevabots, fg);
    this.keys =
      this.input.keyboard.addKeys('W,A,S,D,UP,LEFT,DOWN,RIGHT,SPACE,ENTER');
    this.input.keyboard.on('keydown', (event) => {
      //event.preventDefault();
    });
    this.cameras.main.startFollow(this.player);
  }
  update() {
    this.player.update();
    this.elevabots.forEach(bot => bot.update());
  }
}