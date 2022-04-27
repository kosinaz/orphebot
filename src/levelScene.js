import Elevabot from './elevabot.js';
import Felibot from './felibot.js';
import Lasers from './lasers.js';
import Phaser from './phaser.js';
import Player from './player.js';
import BotSprite from './botSprite.js';
import ElevatorSprite from './elevatorSprite.js';
import Arachbot from './arachbot.js';

export default class LevelScene extends Phaser.Scene {
  preload() {
    this.load.tilemapTiledJSON('level1', 'data/level1.json');
    this.load.tilemapTiledJSON('level2', 'data/level2.json');
    this.load.audio('slowRider', 'audio/music_zapsplat_slow_rider.mp3');
    this.load.audio('techRise', 'audio/music_zapsplat_tech_rise.mp3');
    this.load.audio('laser1', 'audio/laser_1.mp3');
    this.load.audio('laser2', 'audio/laser_2.mp3');
    this.load.audio('laser3', 'audio/laser_3.mp3');
    this.load.audio('core', 'audio/glitchedtones_Robot Impact.mp3');
  }
  create(args) {
    const level = args.level || 1;
    this.music = this.sound.add(['slowRider', 'techRise'][level - 1], {
      loop: true,
    });
    this.music.play();
    this.laserSounds = [
      this.sound.add('laser1'), 
      this.sound.add('laser2'),
      this.sound.add('laser3'),
    ];
    this.coreSound = this.sound.add('core');
    this.sys.canvas.style.cursor = 'none';
    this.cross = this.add.sprite(0, 0, 'sprites', 'cross');
    this.cross.setDepth(1);
    const map = this.make.tilemap({key: `level${level}`});
    const tileset = map.addTilesetImage('tileset', 'tileset');
    this.bg = map.createLayer('bg', tileset);
    this.bg.setCollisionByExclusion([115, 116, 126]);
    this.fg = map.createLayer('fg', tileset);
    this.fg.setCollisionBetween(0, 200);
    this.player = null;
    this.bots = [];
    this.elevators = [];
    this.portal = null;
    map.getObjectLayer('obj').objects.forEach(obj => {
      switch (obj.name) {
        case 'player': {
          this.player = new BotSprite(this, obj.x, obj.y, 'bots', 182);
          new Player(this.player);
					this.cameras.main.startFollow(this.player, true);
          if (args.cores) {
            this.player.bot.cores = args.cores;
            this.player.bot.updateCounter();
          }
          break;
        }
        case 'elevabot': {
          let bot = new BotSprite(this, obj.x, obj.y, 'bots', 208);
          this.bots.push(bot); 
          new Elevabot(bot);
          break;
        }
        case 'felibot': {
          let bot = new BotSprite(this, obj.x, obj.y, 'bots', 182);
          this.bots.push(bot); 
          new Felibot(bot);
          break;
        }
        case 'arachbot': {
          obj.x += obj.rotation === 90 ? 32 : 0;
          obj.x += obj.rotation === 180 ? -96 : 0;
          obj.y += obj.rotation === 180 ? 128 : 0;
          obj.x += obj.rotation === 270 ? -96 : 0;
          let bot = new BotSprite(this, obj.x, obj.y, 'bots', 78);
          this.bots.push(bot); 
          new Arachbot(bot);
          break;
        }
        case 'elevator': {
          this.elevators.push(new ElevatorSprite(this, obj.x, obj.y));
          break;
        }
        case 'portal': {
          this.portal = this.physics.add.image(obj.x + 32, obj.y - 32, 'sprites', 'portal');
          this.physics.add.overlap(this.player, this.portal, () => {    
            this.sound.stopAll();
            this.scene.restart({
              level: level % 2 + 1,
              cores: this.player.bot.cores,
            });
          });
          break;
        }
      }
    });
    this.lasers = this.add.existing(new Lasers(this));
    this.cross.setPosition(this.player.x, this.player.y);
  }
  update(t, dt) {
    this.input.activePointer.updateWorldPoint(this.cameras.main);
    this.cross.x = this.input.activePointer.worldX;
    this.cross.y = this.input.activePointer.worldY;
    this.player.bot.update(dt);
    this.bots.forEach(bot => {
      bot.bot.update(dt);
    });
  }
}