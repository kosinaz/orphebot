import Elevabot from './elevabot.js';
import Felibot from './felibot.js';
import Bot from './bot.js';
import Lasers from './lasers.js';
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
    this.fg = map.createLayer('fg', tileset);
    this.fg.setCollisionBetween(0, 200);
    this.player = map.createFromObjects('obj', {
      classType: Felibot,
      frame: 168,
      name: 'Felibot',
      key: 'bots',
    })[0];
    this.physics.add.collider(this.player, this.fg);
    this.elevabots = map.createFromObjects('obj', {
      classType: Elevabot,
      frame: 192,
      name: 'Elevabot',
      key: 'bots',
    });
    this.physics.add.collider(this.elevabots, this.fg);
    this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,LEFT,DOWN,RIGHT,SPACE,ENTER');
    this.lasers = new Lasers(this);
    this.physics.add.collider(this.lasers, this.fg, (laser) => {
      laser.setActive(false);
      laser.setVisible(false);
      laser.body.reset(0, 0);
    });
    this.physics.add.collider(this.lasers, this.elevabots, (elevabot, laser) => {
      if (laser.friendly) {  
        elevabot.damage(10);
      }
      laser.setActive(false);
      laser.setVisible(false);
      laser.body.reset(0, 0);
    });
    this.physics.add.collider(this.lasers, this.player, (player, laser) => {
      if (!laser.friendly) {  
        player.damage(1);
      }
      laser.setActive(false);
      laser.setVisible(false);
      laser.body.reset(0, 0);
    });
    this.cameras.main.startFollow(this.player);
  }
  update() {
    this.children.list.forEach(gameObject => {
      gameObject.update();
    });
  }
}