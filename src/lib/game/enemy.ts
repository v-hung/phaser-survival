import { Animations, Math as PhaserMath, Physics, Scene, type Types } from "phaser"
import type { Player } from "./player";
import type { MainScene } from "./main_scene";

type EnemyType = {
  scene: MainScene,
  x: number,
  y: number,
}

export class Enemy extends Physics.Arcade.Sprite {
  private mainScene!: MainScene

  private currentWidth = 0
  private currentHeight = 0
  private posX!: number;
  private posY!: number;
  private speed: number = 50
  private detectionDistance = 50
  private maxDetectionDistance = 200
  private follow: boolean | null = null
  private isAttacking = false
  private isHurt = false
  private hp = 90

  swordHitBox: Phaser.GameObjects.Rectangle

  constructor(data: EnemyType) {
    let {scene, x, y} = data

    super(scene,x,y, 'pig-small')
    scene.add.existing(this)

    scene.physics.world.enable(this)
    this.mainScene = scene

    this.currentWidth = this.width * 0.18
    this.currentHeight = this.height * 0.6
    this.setSize(this.currentWidth, this.currentHeight)
    this.setOffset(27,12)

    this.posX = x;
    this.posY = y;

    this.swordHitBox = scene.add.rectangle(0, 0, 18, this.currentHeight + 5 , 0xfff, 0)
    scene.physics.add.existing(this.swordHitBox)
    if (this.swordHitBox.body instanceof Physics.Arcade.Body 
      || this.swordHitBox.body instanceof Physics.Arcade.StaticBody) {
      this.swordHitBox.body.enable = false
      scene.physics.world.remove(this.swordHitBox.body)
    }


    this.createAnimations()

    this.anims.play('pig-small-idle')
  }

  createAnimations() {
    if (!this.scene.anims.exists('pig-small-idle')) {
      this.scene.anims.create({
        key: 'pig-small-idle',
        frames: this.scene.anims.generateFrameNames('pig-small', {
          start: 3,
          end: 6,
          prefix: 'idle',
          suffix: '.png'
        }),
        // repeat: -1,
        frameRate: 10
      })
    }

    if (!this.scene.anims.exists('pig-small-attack')) {
      this.scene.anims.create({
        key: 'pig-small-attack',
        frames: this.scene.anims.generateFrameNames('pig-small', {
          start: 1,
          end: 5,
          prefix: 'attack',
          suffix: '.png'
        }),
        // repeat: -1,
        frameRate: 10
      })
    }

    if (!this.scene.anims.exists('pig-small-run')) {
      this.scene.anims.create({
        key: 'pig-small-run',
        frames: this.scene.anims.generateFrameNames('pig-small', {
          start: 1,
          end: 6,
          prefix: 'run',
          suffix: '.png'
        }),
        // repeat: -1,
        frameRate: 20
      })
    }

    if (!this.scene.anims.exists('pig-small-hurt')) {
      this.scene.anims.create({
        key: 'pig-small-hurt',
        frames: this.scene.anims.generateFrameNames('pig-small', {
          start: 1,
          end: 6,
          prefix: 'hurt',
          suffix: '.png'
        }),
        // repeat: -1,
        frameRate: 20
      })
    }
  }

  static preload(scene: MainScene) {
    scene.load.atlas('pig-small', 'enemy/pig-small.png', 'enemy/pig-small.json')
  }

  update(player: Physics.Arcade.Sprite) {
    if (!this.scene || !this.active || !this.visible) {
      return;
    }

    if (this.isHurt) {
      this.play('pig-small-hurt', true)
      return
    }

    if (this.isAttacking) return

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
        this.enemyAttackEnter();
      }
      else {
        // Tính toán hướng di chuyển từ quái vật đến nhân vật
        const angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y)

        // Cập nhật vận tốc của quái vật theo hướng của nhân vật
        const velocityX = (this.speed + 20) * Math.cos(angleToPlayer)

        this.anims.play('pig-small-run', true)
        this.setFlipX(velocityX < 0)

        this.setVelocityX(velocityX)
        this.setVelocityY((this.speed + 20) * Math.sin(angleToPlayer))
      }
    }
    else {
      if (Math.abs(this.x - this.posX) <= 10 && Math.abs(this.y - this.posY) <= 10) {
        this.anims.play('pig-small-idle', true)
        this.setVelocity(0,0)
        this.follow = null
      }
      else {
        const angleToPos = Phaser.Math.Angle.Between(this.x, this.y, this.posX, this.posY)

        // Cập nhật vận tốc của quái vật theo hướng của nhân vật
        const velocityX = (this.speed + 20) * Math.cos(angleToPos)

        this.setFlipX(velocityX < 0)
        this.anims.play('pig-small-run', true)

        this.setVelocityX(velocityX)
        this.setVelocityY((this.speed + 20) * Math.sin(angleToPos))
      }
    }
  }

  startHit (anim: Animations.Animation, frame: Animations.AnimationFrame) {
    if (frame.index < anim.frames.length - 1) {
      return
    }

    this.off('animationupdate', this.startHit)

    this.swordHitBox.x = this.flipX
      ? this.x - (this.currentWidth - 0)
      : this.x + (this.currentWidth - 0)
    this.swordHitBox.y = this.y + 6

    if (this.swordHitBox.body instanceof Physics.Arcade.Body 
      || this.swordHitBox.body instanceof Physics.Arcade.StaticBody) {
      this.swordHitBox.body.enable = true
      this.scene.physics.world.add(this.swordHitBox.body)
    }
  }

  enemyAttackEnter() {
    this.isAttacking = true
    this.setVelocity(0,0)

    this.on('animationupdate', this.startHit)

    this.play('pig-small-attack').once('animationcomplete', () => {
      this.isAttacking = false

      if (this.swordHitBox.body instanceof Physics.Arcade.Body 
        || this.swordHitBox.body instanceof Physics.Arcade.StaticBody) {
        this.swordHitBox.body.enable = false
        this.scene.physics.world.remove(this.swordHitBox.body)
      }
    });
  }

  enemyAttackStop() {
    this.off('animationupdate', this.startHit)

    this.isAttacking = false

    if (this.swordHitBox.body instanceof Physics.Arcade.Body 
      || this.swordHitBox.body instanceof Physics.Arcade.StaticBody) {
      this.swordHitBox.body.enable = false
      this.scene.physics.world.remove(this.swordHitBox.body)
    }
  }

  enemyHurt = (obj1: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody, obj2: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody, player: Player) => {
    if (this.isHurt) return

    this.hp -= Math.floor(Math.random() * (60 - 30 + 1) + 30)
    this.enemyAttackStop()

    const pushBackSpeed = 100; 
    const pushBackDuration = 300;

    const direction = player.getCenter().x! < this.getCenter().x! ? 1 : -1;
    this.setVelocityX(pushBackSpeed * direction); 

    this.scene.time.delayedCall(pushBackDuration, () => {
      this.setVelocityX(0)
      this.isHurt = false
      
      if (this.hp <= 0) {
        this.destroy()
        setTimeout(() => {
          this.mainScene.createEnemy(this.posX, this.posY)
        }, 60000);
      }
    }, [], this);

    this.isHurt = true
  }
}