import Elevabot from './elevabot.js';
import Lasers from './lasers.js';
import Phaser from './phaser.js';
import Player from './player.js';
import BotSprite from './botSprite.js';
import ElevatorSprite from './elevatorSprite.js';

export default class LevelScene extends Phaser.Scene {
  preload() {
    this.load.tilemapTiledJSON('level1', 'data/level1.json');
  }
  create() {
    const map = this.make.tilemap({key: 'level1'});
    const tileset = map.addTilesetImage('tileset', 'tileset');
    this.bg = map.createLayer('bg', tileset);
    this.bg.setCollisionByExclusion([115, 116, 126]);
    this.fg = map.createLayer('fg', tileset);
    this.fg.setCollisionBetween(0, 200);
    this.player = null;
    this.bots = [];
    this.elevators = [];
    map.getObjectLayer('obj').objects.forEach(obj => {
      switch (obj.name) {
        case 'player': {
          this.player = new BotSprite(this, obj.x, obj.y, 'bots', 182);
          new Player(this.player);
					this.cameras.main.startFollow(this.player, true);
          break;
        }
        case 'elevabot': {
          let bot = new BotSprite(this, obj.x, obj.y, 'bots', 208);
          this.bots.push(bot); 
          new Elevabot(bot);
          break;
        }
        case 'elevator': {
          this.elevators.push(new ElevatorSprite(this, obj.x, obj.y));
          break;
        }
      }
    });
    this.lasers = this.add.existing(new Lasers(this));
  }
  update(t, dt) {
    this.player.bot.update(dt);
    this.bots.forEach(bot => {
      bot.bot.update(dt);
    });
  }
}