import { Display, GameObjects, Physics, Scene, type Types } from "phaser";
import { Player } from "./player";
import { Enemy } from "./enemy";
// import { Player } from "./player";


export class MainScene extends Scene {
  private cursors?: Types.Input.Keyboard.CursorKeys
  private player?: Player
  private enemy?: Enemy

  constructor ()
  {
    super('main-scene');
  }

  preload ()
  {
    this.load.image('tiles', 'tiles/dungeon/Tiles.png');
    this.load.tilemapTiledJSON('dungeon', 'tiles/dungeon/map.json')
    // this.load.atlas('moi', 'characters/moi.png', 'characters/moi.json')
    Player.preload(this)
    Enemy.preload(this)

    this.cursors = this.input.keyboard?.createCursorKeys()
  }

  create ()
  {
    const map = this.make.tilemap({ key: 'dungeon' })
    const tileset = map.addTilesetImage('Tiles', 'tiles', 16, 16)

    if (!tileset) return

    map?.createLayer('Ground', tileset)
    const wallsLayer = map.createLayer('Walls', tileset)

    wallsLayer?.setCollisionByProperty({ collides: true })

    // const debugGraphics = this.add.graphics().setAlpha(.7)
    // wallsLayer?.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Display.Color(243,243,48,255),
    //   faceColor: new Display.Color(40,39,37,255)
    // })

    this.player = new Player({scene: this, x:120, y:128})
    this.physics.add.collider(this.player, wallsLayer!)

    this.enemy = new Enemy({scene: this, x:200, y:128})
    this.physics.add.collider(this.enemy, wallsLayer!)

    this.physics.add.overlap(this.player.swordHitBox, this.enemy, 
      (swordHitBox, enemy) => this.enemy?.enemyHurt(swordHitBox, enemy, this.player!), undefined, this)
    
    this.physics.add.overlap(this.enemy.swordHitBox, this.player, 
      (swordHitBox, player) => this.player?.playerHurt(swordHitBox, player, this.enemy!), undefined, this)

    this.cameras.main.startFollow(this.player, true)
  }

  update(time: number, delta: number): void {
    if (this.cursors && this.player) {
      this.player.update(this.cursors)
    }

    if (this.enemy) {
      this.enemy.update(this.player!)
    }

  }
}