import { Animations, Physics, Scene, type Types } from "phaser"
import type { Enemy } from "./enemy"

type PlayerType = {
  scene: Scene,
  x: number,
  y: number,
}

export class Player extends Physics.Arcade.Sprite {
  private currentWidth = 0
  private currentHeight = 0
  private isAttacking = false
  private isHurt = false

  private playerNameText!: Phaser.GameObjects.Text;

  swordHitBox: Phaser.GameObjects.Rectangle
  status: 'idle' | 'death' = 'idle'

  constructor(data: PlayerType) {
    let {scene, x, y} = data

    super(scene,x,y, 'moi')
    scene.add.existing(this)

    scene.physics.world.enable(this);
    this.currentWidth = this.width * 0.3
    this.currentHeight = this.height * 0.3
    this.setSize(this.currentWidth, this.currentHeight)

    this.swordHitBox = scene.add.rectangle(0, 0, this.currentWidth, this.currentHeight + 5 , 0xfff, 0)
    scene.physics.add.existing(this.swordHitBox)
    if (this.swordHitBox.body instanceof Physics.Arcade.Body 
      || this.swordHitBox.body instanceof Physics.Arcade.StaticBody) {
      this.swordHitBox.body.enable = false
      scene.physics.world.remove(this.swordHitBox.body)
    }

    this.createAnimations()
    this.play('moi-idle')

    // name status
    this.playerNameText = scene.add.text(0, 0, 'Việt Hùng', {
      fontSize: '10px',
      color: '#ffffff',
      
    })
  }

  createAnimations() {
    this.scene.anims.create({
      key: 'moi-idle',
      frames: this.scene.anims.generateFrameNames('moi', {
        start: 1,
        end: 6,
        prefix: 'idle',
        suffix: '.png'
      }),
      // repeat: -1,
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
      // repeat: -1,
      frameRate: 10
    })

    this.scene.anims.create({
      key: 'moi-hurt',
      frames: this.scene.anims.generateFrameNames('moi', {
        start: 1,
        end: 6,
        prefix: 'hurt',
        suffix: '.png'
      }),
      // repeat: -1,
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
      // repeat: -1,
      frameRate: 10
    })
  }

  static preload(scene: Scene) {
    scene.load.atlas('moi', 'characters/moi.png', 'characters/moi.json')
  }

  update(cursors: Types.Input.Keyboard.CursorKeys) {
    // status name
    this.playerNameText.x = this.x - this.playerNameText.width / 2
    this.playerNameText.y = this.y - 24

    if (this.isHurt) {
      this.play('moi-hurt')
      return
    }

    const speed = 100

    let x = 0, y = 0
    let attack = false

    if (cursors.left.isDown) {
      x -= 1
      this.playerAttackStop()
    }
    if (cursors.right.isDown) {
      x += 1
      this.playerAttackStop()
    }
    if (cursors.up.isDown) {
      y -= 1
      this.playerAttackStop()
    }
    if (cursors.down.isDown) {
      y += 1
      this.playerAttackStop()
    }
    if (cursors.space.isDown) {
      attack = true
    }

    if (!this.isAttacking) {
      if (attack) {
        x = y = 0
        this.playerAttackEnter(cursors)
      }
      else if (x != 0 || y != 0) {
        this.setFlipX(x < 0)
        
        this.play('moi-run', true)
        this.setVelocity(x * speed, y * speed)
      }
      else {
        this.play('moi-idle', true)
        // const parts = this.currentAnim?.key.split('run')
        // this.stop()
        this.setVelocity(0, 0)
      } 
    }
  }

  startHit (anim: Animations.Animation, frame: Animations.AnimationFrame) {
    if (frame.index < anim.frames.length - 1) {
      return
    }

    this.off('animationupdate', this.startHit)

    this.swordHitBox.x = this.flipX
      ? this.x - (this.currentWidth - 3)
      : this.x + (this.currentWidth - 3)
    this.swordHitBox.y = this.y

    if (this.swordHitBox.body instanceof Physics.Arcade.Body 
      || this.swordHitBox.body instanceof Physics.Arcade.StaticBody) {
      this.swordHitBox.body.enable = true
      this.scene.physics.world.add(this.swordHitBox.body)
    }
  }

  playerAttackEnter(cursors: Types.Input.Keyboard.CursorKeys) {
    cursors.left.reset()
    cursors.right.reset()
    cursors.up.reset()
    cursors.down.reset()

    this.isAttacking = true
    this.setVelocity(0,0)

    this.on('animationupdate', this.startHit)

    this.anims.play('moi-attack1').once('animationcomplete', () => {
      this.isAttacking = false

      if (this.swordHitBox.body instanceof Physics.Arcade.Body 
        || this.swordHitBox.body instanceof Physics.Arcade.StaticBody) {
        this.swordHitBox.body.enable = false
        this.scene.physics.world.remove(this.swordHitBox.body)
      }
    })
  }

  playerAttackStop() {
    this.off('animationupdate', this.startHit)

    this.isAttacking = false

    if (this.swordHitBox.body instanceof Physics.Arcade.Body 
      || this.swordHitBox.body instanceof Physics.Arcade.StaticBody) {
      this.swordHitBox.body.enable = false
      this.scene.physics.world.remove(this.swordHitBox.body)
    }
  }

  playerHurt = (obj1: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody, obj2: Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody, enemy: Enemy) => {
    if (this.isHurt) return

    this.playerAttackStop()

    const pushBackSpeed = 100
    const pushBackDuration = 300

    const direction = enemy.getCenter().x! < this.getCenter().x! ? 1 : -1
    this.setVelocityX(pushBackSpeed * direction) 

    this.scene.time.delayedCall(pushBackDuration, () => {
      this.setVelocityX(0)
      this.isHurt = false
    }, [], this)

    this.isHurt = true
  }
}