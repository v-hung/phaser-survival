import type * as MatterType from "matter-js";

// @ts-ignore: Property 'Matter' does not exist on type 'typeof Matter'.
const MatterJS: typeof MatterType = Phaser.Physics.Matter.Matter;
export class Player extends Phaser.Physics.Matter.Sprite {
  move_x: null | 'left' | 'right'
  move_y: null | 'top' | 'bot'  = null

  constructor(data: any) {
    let {scene,x,y,texture, frame} = data
    super(scene.matter.world,x,y,texture,frame)
    this.scene.add.existing(this)

    const {Body, Bodies} = MatterJS
    var player_collider = Bodies.circle(this.x, this.y, 9, {isSensor:false, label: 'player_collider'})
    var player_sensor = Bodies.circle(this.x, this.y, 24, {isSensor:true, label: 'player_sensor'})
    const compoundBody = Body.create({
      parts: [player_collider, player_sensor],
      frictionAir: 0.35,
    })

    this.setExistingBody(compoundBody)
    this.setFixedRotation()
    console.log('constructor')
  }

  static preload(scene: any) {
    console.log('preload')
    scene.load.atlas('walk_anim_sheet', 'images/walk_anim_sheet.png', 'images/walk_anim_sheet_atlas.json')
    scene.load.animation('walk_anim_sheet_anim', 'images/walk_anim_sheet_anim.json')
  }

  update(input_keys: any) {
    const speed = 2.5
    let player_velocity = new Phaser.Math.Vector2()
    
    if (input_keys.left.isDown) {
      player_velocity.x = -1
      this.move_x = 'left'
    } 
    else if (input_keys.right.isDown) {
      player_velocity.x = 1
      this.move_x = 'right'
    }

    if (input_keys.up.isDown) {
      player_velocity.y = -1
      this.move_y = 'top'
    } 
    else if (input_keys.down.isDown) {
      player_velocity.y = 1
      this.move_y = 'bot'
    }

    // set animation
    if (this.move_x == 'left' && !this.move_y) {
      this.anims.play('walk_left', true)
    }
    else if (this.move_x == 'left' && this.move_y == 'top') {
      this.anims.play('walk_top_left', true)
    }
    else if (this.move_x == 'left' && this.move_y == 'bot') {
      this.anims.play('walk_bot_left', true)
    }
    else if (this.move_x == 'right' && !this.move_y) {
      this.anims.play('walk_right', true)
    }
    else if (this.move_x == 'right' && this.move_y == 'top') {
      this.anims.play('walk_top_right', true)
    }
    else if (this.move_x == 'right' && this.move_y == 'bot') {
      this.anims.play('walk_bot_right', true)
    }
    else if (!this.move_x && this.move_y == 'top') {
      this.anims.play('walk_top', true)
    }
    else if (!this.move_x && this.move_y == 'bot') {
      this.anims.play('walk_bot', true)
    }

    player_velocity.normalize()
    player_velocity.scale(speed)
    this.setVelocity(player_velocity.x, player_velocity.y)

    if (Math.abs(this.body.velocity.x) < 0.1 && Math.abs(this.body.velocity.y) < 0.1) {
      this.anims.stop()
    }
  }
}