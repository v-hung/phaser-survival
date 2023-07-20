import { Display, GameObjects, Physics, Scene, type Types } from "phaser";
import { Player } from "./player";
import { Enemy } from "./enemy";
// import { Player } from "./player";


export class MainScene extends Scene {
  private cursors?: Types.Input.Keyboard.CursorKeys
  private moi?: Physics.Arcade.Sprite
  private enemy?: Physics.Arcade.Sprite

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

    const debugGraphics = this.add.graphics().setAlpha(.7)
    wallsLayer?.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Display.Color(243,243,48,255),
      faceColor: new Display.Color(40,39,37,255)
    })

    this.moi = new Player({scene: this, x:300, y:128})
    this.physics.add.collider(this.moi, wallsLayer!)

    this.enemy = new Enemy({scene: this, x:200, y:128})
    this.physics.add.collider(this.enemy, wallsLayer!)

    // this.physics.add.collider(this.moi, this.enemy)

    this.cameras.main.startFollow(this.moi, true)
  }

  update(time: number, delta: number): void {
    if (this.cursors && this.moi) {
      this.moi.update(this.cursors)
    }

    this.enemy?.update(this.moi)

  }
}