<script lang="ts">
  import { Game, AUTO } from "phaser";
  // import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
  import { onDestroy, onMount } from "svelte";
  import { MainScene } from "$lib/game/main_scene";

  let game: Phaser.Game | null = null

  let config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 400,
    height: 250,
    // backgroundColor: '#999',  
    parent: 'game',
    scale: {
      zoom: 2,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: true
      }
    },
    scene: [MainScene],
  }

  onMount(async () => {
    game = new Game(config)
  })

  onDestroy(() => {
    game?.destroy(true)
  })
</script>

<div id="game"></div>
