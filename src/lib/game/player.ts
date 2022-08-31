export class Player extends Phaser.Physics.Matter.Sprite {
  constructor(data: any) {
    let {scene,x,y,texture, frame} = data
    super(scene.matter.world,x,y,texture,frame)
    this.scene.add.existing(this)
  }

  static preload(scene: any) {
    scene.load.atlas('male', 'images/walk_anim_sheet.png', 'images/walk_anim_sheet_atlas.json')
    scene.load.animation('male_anim', 'images/walk_anim_sheet_anim.json')
  }

  update(time: number, delta: number): void {
    // console.log('update')
    const speed = 2.5
    let player_velocity = new Phaser.Math.Vector2()

    if (this.input_keys.left.isDown) {
      player_velocity.x = -1
    } 
    else if (this.input_keys.right.isDown) {
      player_velocity.x = 1
    }

    if (this.input_keys.up.isDown) {
      player_velocity.y = -1
    } 
    else if (this.input_keys.down.isDown) {
      player_velocity.y = 1
    }

    player_velocity.normalize()
    player_velocity.scale(speed)
    this.setVelocity(player_velocity.x, player_velocity.y)
  }
}