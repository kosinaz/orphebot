import Elevabot from './elevabot.js';
import Felibot from './felibot.js';
import Lasers from './lasers.js';
import Phaser from './phaser.js';
import Player from './player.js';
import BotSprite from './botSprite.js';
import ElevatorSprite from './elevatorSprite.js';
import Arachbot from './arachbot.js';
import ClawSprite from './clawSprite.js';
import CraneSprite from './craneSprite.js';
import Crabot from './crabot.js';


export default class LevelScene extends Phaser.Scene {
  preload() {
    this.load.tilemapTiledJSON('level1', 'data/level1.json');
    this.load.tilemapTiledJSON('level2', 'data/level2.json');
    this.load.tilemapTiledJSON('level3', 'data/level3.json');
    this.load.audio('slowRider', 'audio/music_zapsplat_slow_rider.mp3');
    this.load.audio('techRise', 'audio/music_zapsplat_tech_rise.mp3');
    this.load.audio('rapidTurnaround', 'audio/music_zapsplat_rapid_turnaround.mp3');
    this.load.audio('chatter1', 'audio/chatter_1.mp3');
    this.load.audio('chatter2', 'audio/chatter_2.mp3');
    this.load.audio('chatter3', 'audio/chatter_3.mp3');
    this.load.audio('core', 'audio/core.mp3');    
    this.load.audio('elevator1', 'audio/elevator_1.mp3');
    this.load.audio('elevator2', 'audio/elevator_2.mp3');
    this.load.audio('grab', 'audio/grab.mp3');
    this.load.audio('hit1', 'audio/hit_1.mp3');
    this.load.audio('hit2', 'audio/hit_2.mp3');
    this.load.audio('hit3', 'audio/hit_3.mp3');
    this.load.audio('hit4', 'audio/hit_4.mp3');
    this.load.audio('jump', 'audio/jump.mp3');
    this.load.audio('laser1', 'audio/laser_1.mp3');
    this.load.audio('laser2', 'audio/laser_2.mp3');
    this.load.audio('laser3', 'audio/laser_3.mp3');
    this.load.audio('portal', 'audio/portal.mp3');
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
  }
  create(args) {
    this.input.addPointer(1);
    const pause = this.add.image(1880, 40, 'sprites', 'pause');
    pause.setScrollFactor(0);
    pause.setDepth(2);
    pause.setInteractive();
    pause.on('pointerup', () => {
      this.scene.pause();
      this.scene.run('PauseScene');
    }, this);
    const core = this.add.image(1800, 40, 'sprites', 'core');
    core.setScrollFactor(0);
    core.setDepth(2);
    core.setInteractive();
    core.on('pointerup', () => {
      if (this.player.bot.stateMachine.isCurrentState('core')
        || this.player.bot.stateMachine.isCurrentState('dead')) {
        return;
      }
      this.player.bot.health = 0;
      this.player.bot.stateMachine.setState('core');
    }, this);
    const stick = this.add.image(1720, 40, 'sprites', 'stick');
    stick.setScrollFactor(0);
    stick.setDepth(2);
    stick.setInteractive();
    stick.on('pointerup', () => {
      this.moveStick.visible = !this.moveStick.visible;
      this.aimStick.visible = !this.aimStick.visible;
    }, this);
    const restart = this.add.image(1640, 40, 'sprites', 'restart');
    restart.setScrollFactor(0);
    restart.setDepth(2);
    restart.setInteractive();
    restart.on('pointerup', () => {
      this.sound.stopAll();
      this.scene.restart({
        level: level % 3,
        cores: args.cores,
      });
    }, this);
    this.operate = this.add.image(340, 910, 'sprites', 'operate');
    this.operate.setScrollFactor(0);
    this.operate.setDepth(2);
    this.operate.setInteractive();
    this.operate.on('pointerup', () => {
      if (this.player.bot.canOperate) {
        let closestClaw = this.physics.closest(this.player, this.claws);
        if (closestClaw) {
          if (this.player.bot.stateMachine.isCurrentState('operate')) {
            closestClaw.release();
            this.player.bot.stateMachine.setState('fromOperate');
          } else {
            this.player.bot.stateMachine.setState('toOperate');
          }
        }
      }
    }, this);
    this.canOperate = false;
    this.keys = this.input.keyboard.addKeys('ESC');
    this.keys.ESC.on('up', () => {
      this.scene.pause();
      this.scene.run('PauseScene');
    }, this);
    const stickPlugin = this.plugins.get('rexvirtualjoystickplugin');
    this.moveStick = stickPlugin.add(this, {
      x: 170, 
      y: 910,
      radius: 100,
    });
    this.moveStick.base.setDepth(3);
    this.moveStick.thumb.setDepth(3);
    this.moveStick.visible = false;
    this.aimStick = stickPlugin.add(this, {
      x: 1750, 
      y: 910,
      radius: 100,
    });
    this.aimStick.base.setDepth(3);
    this.aimStick.thumb.setDepth(3);
    this.aimStick.visible = false;
    const level = args.level || 1;
    this.music = this.sound.add(['slowRider', 'techRise', 'rapidTurnaround'][level - 1], {
      loop: true,
    });
    this.music.play();
    this.laserSounds = [
      this.sound.add('laser1'), 
      this.sound.add('laser2'),
      this.sound.add('laser3'),
    ];
    this.hitSounds = [
      this.sound.add('hit1'), 
      this.sound.add('hit2'),
      this.sound.add('hit3'),
      this.sound.add('hit4'),
    ];
    this.chatterSounds = [
      this.sound.add('chatter1'), 
      this.sound.add('chatter2'),
      this.sound.add('chatter3'),
    ];
    this.elevatorUpSound = this.sound.add('elevator1',);
    this.elevatorDownSound = this.sound.add('elevator2');
    this.portalSound = this.sound.add('portal');
    this.jumpSound = this.sound.add('jump');
    this.grabSound = this.sound.add('grab');
    this.coreSound = this.sound.add('core', {
      loop: true,
    });
    this.cross = this.add.sprite(0, 0, 'sprites', 'cross');
    this.cross.setDepth(1);
    const map = this.make.tilemap({key: `level${level}`});
    const tileset = map.addTilesetImage('tileset', 'tileset');
    this.bg = map.createLayer('bg', tileset);
    this.bg.setCollisionByExclusion([115, 116, 117, 118, 119, 126]);
    this.fg = map.createLayer('fg', tileset);
    this.fg.setCollisionBetween(0, 200);
    this.player = null;
    this.bots = [];
    this.elevators = [];
    this.claws = [];
    this.cranes = [];
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
        case 'crabot': {
          let bot = new BotSprite(this, obj.x, obj.y, 'bots', 0);
          this.bots.push(bot); 
          new Crabot(bot)
          break;
        }
        case 'elevator': {
          this.elevators.push(new ElevatorSprite(this, obj.x, obj.y));
          break;
        }
        case 'claw': {
          this.claws.push(new ClawSprite(this, obj.x, obj.y));
          break;
        }
        case 'crane': {
          this.cranes.push(new CraneSprite(this, obj.x, obj.y));
          break;
        }
        case 'portal': {
          this.portal = this.physics.add.image(obj.x + 32, obj.y - 32, 'sprites', 'portal');
          this.physics.add.overlap(this.player, this.portal, () => {    
            this.sound.stopAll();            
            this.portalSound = this.sound.add('portal');
            this.portalSound.play();
            this.scene.restart({
              level: level % 3 + 1,
              cores: this.player.bot.cores,
            });
          });
          break;
        }
      }
    });
    this.lasers = this.add.existing(new Lasers(this));
    this.claws.forEach(claw => {
      claw.crane = this.physics.closest(claw, this.cranes);
      claw.crane.claw = claw;
      claw.rope = this.add.tileSprite(claw.crane.x, claw.y - 32, 16, claw.y - claw.crane.y - 64, 'sprites', 'rope');
      claw.rope.setOrigin(0.5, 1);
    });
    this.cross.setPosition(this.player.x, this.player.y);
  }
  update(t, dt) {
    this.sys.canvas.style.cursor = 'none';
    this.input.activePointer.updateWorldPoint(this.cameras.main);
    if (this.aimStick.angle) {
      Phaser.Math.RotateTo(this.cross, this.player.x, this.player.y, Phaser.Math.DEG_TO_RAD * this.aimStick.angle, 256);
    } else {
      this.cross.x = this.input.activePointer.worldX;
      this.cross.y = this.input.activePointer.worldY;
    }
    this.player.bot.update(dt); 
    this.bots.forEach(bot => {
      bot.bot.update(dt);
    });
    this.claws.forEach(claw => {
      claw.update();
    });
    this.operate.visible = this.player.bot.canOperate && this.moveStick.visible;
  }
}