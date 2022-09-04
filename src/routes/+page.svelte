<script lang="ts">
  import phaser from "phaser";
  import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
  import { onDestroy, onMount } from "svelte";
  import { MainScene } from "$lib/game/main_scene";

  let game: Phaser.Game | null = null

  let config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 512,
    height: 512,
    backgroundColor: '#999',  
    parent: 'game',
    scene: [MainScene],
    scale: {
      zoom: 2,
    },
    physics: {
      default: 'matter',
      matter: {
        debug: true,
        gravity: {y: 0}
      }
    },
    plugins: {
      scene: [
        {
          plugin: PhaserMatterCollisionPlugin,
          key: 'matterCollision',
          mapping: 'matterCollision'
        }
      ]
    }
  }

  onMount(async () => {
    game = new Phaser.Game(config)

    return () => {
      console.log('1')
      game?.destroy(true)
    }
  })

  onDestroy(() => {
    game?.destroy(true)
  })
</script>

<div id="game"></div>
