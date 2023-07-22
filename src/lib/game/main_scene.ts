import { Display, GameObjects, Physics, Scene, Tilemaps, type Types } from "phaser";
import { Player } from "./player";
import { Enemy } from "./enemy";
// import { Player } from "./player";


export class MainScene extends Scene {
  private cursors?: Types.Input.Keyboard.CursorKeys
  private player?: Player
  private enemies: Enemy[] = []
  private wallsLayer!: Tilemaps.TilemapLayer | null

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

    map.createLayer('Ground', tileset)
    this.wallsLayer = map.createLayer('Walls', tileset)

    this.wallsLayer?.setCollisionByProperty({ collides: true })

    // const debugGraphics = this.add.graphics().setAlpha(.7)
    // wallsLayer?.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Display.Color(243,243,48,255),
    //   faceColor: new Display.Color(40,39,37,255)
    // })

    this.player = new Player({scene: this, x:120, y:128})
    // this.matter.add.collider(this.player, this.wallsLayer!)

    // this.createEnemy(200, 128)
    // this.createEnemy(220, 128)
    // this.createEnemy(200, 100)
    // this.createEnemy(220, 100)

    this.cameras.main.startFollow(this.player, true)
    // this.cameras.main;
  }

  createEnemy = (x: number, y: number) => {
    const currentEnemy = new Enemy({scene: this, x:x, y:y})
    this.enemies.push(currentEnemy)
    this.physics.add.collider(currentEnemy, this.wallsLayer!)

    this.physics.add.overlap(this.player!.swordHitBox, currentEnemy, 
      (swordHitBox, enemy) => currentEnemy?.enemyHurt(swordHitBox, enemy, this.player!), undefined, this)
    
    this.physics.add.overlap(currentEnemy.swordHitBox, this.player!, 
      (swordHitBox, player) => this.player?.playerHurt(swordHitBox, player, currentEnemy!), undefined, this)
  }

  update(time: number, delta: number): void {
    if (this.cursors && this.player) {
      this.player.update(this.cursors, delta)
    }

    // const enemiesArray = this.enemies;
    // if (enemiesArray) {
    //   for (const enemy of enemiesArray) {
    //     if (enemy instanceof Enemy) {
    //       enemy.update(this.player!);
    //     }
    //   }
    // }
  }
}