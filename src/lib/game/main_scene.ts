import { Display, GameObjects, Physics, Scene, type Types } from "phaser";
// import { Player } from "./player";


export class MainScene extends Scene {
  private cursors?: Types.Input.Keyboard.CursorKeys
  private moi?: Physics.Arcade.Sprite

  constructor ()
  {
    super('main-scene');
  }

  preload ()
  {
    this.load.image('tiles', 'tiles/dungeon/Tiles.png');
    this.load.tilemapTiledJSON('dungeon', 'tiles/dungeon/map.json')
    this.load.atlas('moi', 'characters/moi.png', 'characters/moi.json')

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

    this.moi = this.physics.add.sprite(128, 128, 'moi', 'idle1.png')
    this.moi.body?.setSize(this.moi.width * .3, this.moi.height * .4)

    this.anims.create({
      key: 'moi-idle',
      frames: this.anims.generateFrameNames('moi', {
        start: 1,
        end: 6,
        prefix: 'idle',
        suffix: '.png'
      }),
      repeat: -1,
      frameRate: 10
    })

    this.anims.create({
      key: 'moi-attack1',
      frames: this.anims.generateFrameNames('moi', {
        start: 1,
        end: 5,
        prefix: 'attack1',
        suffix: '.png'
      }),
      repeat: -1,
      frameRate: 10
    })

    this.anims.create({
      key: 'moi-run',
      frames: this.anims.generateFrameNames('moi', {
        start: 1,
        end: 6,
        prefix: 'run',
        suffix: '.png'
      }),
      repeat: -1,
      frameRate: 10
    })

    this.moi.anims.play('moi-idle')

    this.physics.add.collider(this.moi, wallsLayer!)

    this.cameras.main.startFollow(this.moi, true)
  }

  update(time: number, delta: number): void {
    if (!this.cursors || !this.moi) {
      return
    }

    const speed = 100

    let x = 0,
        y = 0

    if (this.cursors.left.isDown) {
      x -= 1
      // this.moi.anims.play('moi-run', true)
      // this.moi.setVelocity(-speed, 0)

      // this.moi.scaleX = -1
      // this.moi.body!.offset.x = 20
    }
    if (this.cursors.right.isDown) {
      x += 1
      // this.moi.anims.play('moi-run', true)
      // this.moi.setVelocity(speed, 0)

      // this.moi.scaleX = 1
      // this.moi.body!.offset.x = 0
    }
    if (this.cursors.up.isDown) {
      y -= 1
      // this.moi.anims.play('moi-run', true)
      // this.moi.setVelocity(0, -speed)
    }
    if (this.cursors.down.isDown) {
      y += 1
      // this.moi.anims.play('moi-run', true)
      // this.moi.setVelocity(0, speed)
    }
    if (x !=0 || y != 0) {
      this.moi.anims.play('moi-run', true)
      this.moi.setVelocity(x * speed, y * speed)
    }
    else {
      this.moi.anims.play('moi-idle', true)
      // const parts = this.moi.anims.currentAnim?.key.split('run')
      // this.moi.anims.stop()
      this.moi.setVelocity(0, 0)
    }
  }
}