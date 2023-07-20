import { Physics, Scene, type Types } from "phaser"

type EnemyType = {
  scene: Scene,
  x: number,
  y: number,
}

export class Enemy extends Physics.Arcade.Sprite {
  private posX!: number;
  private posY!: number;
  private direction: 'left' | 'right' = 'left'
  private speed: number = 50
  private detectionDistance = 50
  private maxDetectionDistance = 200
  private follow: boolean | null = null

  constructor(data: EnemyType) {
    let {scene, x, y} = data

    super(scene,x,y, 'pig-small')
    scene.add.existing(this)

    scene.physics.world.enable(this);
    this.setSize(this.width * 0.25, this.height * 0.6)
    this.setOffset(25,12)

    this.posX = x;
    this.posY = y;

    this.create()
  }

  create() {
    this.scene.anims.create({
      key: 'pig-small-idle',
      frames: this.scene.anims.generateFrameNames('pig-small', {
        start: 3,
        end: 6,
        prefix: 'idle',
        suffix: '.png'
      }),
      repeat: -1,
      frameRate: 20
    })

    this.scene.anims.create({
      key: 'pig-small-attack',
      frames: this.scene.anims.generateFrameNames('pig-small', {
        start: 1,
        end: 6,
        prefix: 'attack',
        suffix: '.png'
      }),
      repeat: -1,
      frameRate: 20
    })

    this.scene.anims.create({
      key: 'pig-small-run',
      frames: this.scene.anims.generateFrameNames('pig-small', {
        start: 1,
        end: 6,
        prefix: 'run',
        suffix: '.png'
      }),
      repeat: -1,
      frameRate: 20
    })

    this.scene.anims.create({
      key: 'pig-small-hurt',
      frames: this.scene.anims.generateFrameNames('pig-small', {
        start: 1,
        end: 6,
        prefix: 'hurt',
        suffix: '.png'
      }),
      repeat: -1,
      frameRate: 20
    })

    this.anims.play('pig-small-idle')
  }

  static preload(scene: Scene) {
    scene.load.atlas('pig-small', 'enemy/pig-small.png', 'enemy/pig-small.json')
  }

  update(player: Physics.Arcade.Sprite) {
    const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

    if ( distanceToPlayer > this.maxDetectionDistance 
      || this.x > this.posX + 100 || this.y > this.posY + 100 ) {
      this.follow = false
    }
    else if (distanceToPlayer <= this.detectionDistance && this.follow == null) {
      this.follow = true
    }

    if (this.follow) {
      if (distanceToPlayer <= 10) {
        this.anims.play('pig-small-attack', true)
        return
      }
      // Tính toán hướng di chuyển từ quái vật đến nhân vật
      const angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y)

      // Cập nhật vận tốc của quái vật theo hướng của nhân vật
      const velocityX = (this.speed + 20) * Math.cos(angleToPlayer)

      if (velocityX < 0) {
        this.anims.play('pig-small-run', true)
        this.scaleX = -1
        this.body!.offset.x = 40
      }
      else {
        this.anims.play('pig-small-run', true)
        this.scaleX = 1
        this.body!.offset.x = 24
      }

      this.setVelocityX(velocityX)
      this.setVelocityY((this.speed + 20) * Math.sin(angleToPlayer))
    }
    else {
      if (Math.abs(this.x - this.posX) <= 10 && Math.abs(this.y - this.posY) <= 10) {
        console.log('aaaaaaaaaaaaaa')
        this.anims.play('pig-small-idle', true)
        this.setVelocity(0,0)
        this.follow = null
      }
      else {
        const angleToPos = Phaser.Math.Angle.Between(this.x, this.y, this.posX, this.posY)

        // Cập nhật vận tốc của quái vật theo hướng của nhân vật
        const velocityX = (this.speed + 20) * Math.cos(angleToPos)

        if (velocityX < 0) {
          this.anims.play('pig-small-run', true)
          this.scaleX = -1
          this.body!.offset.x = 40
        }
        else {
          this.anims.play('pig-small-run', true)
          this.scaleX = 1
          this.body!.offset.x = 24
        }

        this.setVelocityX(velocityX)
        this.setVelocityY((this.speed + 20) * Math.sin(angleToPos))
      }
    }
  }
}