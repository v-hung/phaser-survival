import Phaser from "phaser";
import { Player } from "./player";

export class MainScene extends Phaser.Scene {
  private player: Phaser.Physics.Matter.Sprite
  input_keys: any

  constructor () {
    super("MainScene")
  }

  preload () {
    Player.preload(this)
  }

  create () {
    console.log('create')
    this.player = new Player({scene: this, x:0, y:0, texture: 'male', frame: 'tile001'})

    this.input_keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    })

    let a = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    })
  } 

  update(time: number, delta: number): void {
      this.player.update()
  }
}