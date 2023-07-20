import { Physics, Scene, type Types } from "phaser"

type PlayerType = {
  scene: Scene,
  x: number,
  y: number,
}

export class Player extends Physics.Arcade.Sprite {

  constructor(data: PlayerType) {
    let {scene, x, y} = data

    super(scene,x,y, 'moi')
    scene.add.existing(this)

    scene.physics.world.enable(this);
    this.setSize(this.width * 0.3, this.height * 0.3)

    this.create()
  }

  create() {
    this.scene.anims.create({
      key: 'moi-idle',
      frames: this.scene.anims.generateFrameNames('moi', {
        start: 1,
        end: 6,
        prefix: 'idle',
        suffix: '.png'
      }),
      repeat: -1,
      frameRate: 10
    })

    this.scene.anims.create({
      key: 'moi-attack1',
      frames: this.scene.anims.generateFrameNames('moi', {
        start: 1,
        end: 5,
        prefix: 'attack1',
        suffix: '.png'
      }),
      repeat: -1,
      frameRate: 10
    })

    this.scene.anims.create({
      key: 'moi-run',
      frames: this.scene.anims.generateFrameNames('moi', {
        start: 1,
        end: 6,
        prefix: 'run',
        suffix: '.png'
      }),
      repeat: -1,
      frameRate: 10
    })

    this.anims.play('moi-idle')
  }

  static preload(scene: Scene) {
    scene.load.atlas('moi', 'characters/moi.png', 'characters/moi.json')
  }

  update(cursors: any) {
    const speed = 100

    if (cursors.left.isDown) {
      this.anims.play('moi-run', true)
      this.setVelocity(-speed, 0)

      this.scaleX = -1
      this.body!.offset.x = 31
    }
    else if (cursors.right.isDown) {
      this.anims.play('moi-run', true)
      this.setVelocity(speed, 0)

      this.scaleX = 1
      this.body!.offset.x = 17
    }
    else if (cursors.up.isDown) {
      this.anims.play('moi-run', true)
      this.setVelocity(0, -speed)
    }
    else if (cursors.down.isDown) {
      this.anims.play('moi-run', true)
      this.setVelocity(0, speed)
    }
    else {
      this.anims.play('moi-idle', true)
      // const parts = this.anims.currentAnim?.key.split('run')
      // this.anims.stop()
      this.setVelocity(0, 0)
    }
  }
}