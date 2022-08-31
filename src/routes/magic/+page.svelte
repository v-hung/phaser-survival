<script lang="ts">
	let start: boolean = false;
  let set_time: NodeJS.Timer | null = null
  let time: number = 20

	const getGo = () => {
		try {
			if (typeof document.webkitFullscreenElement !== 'undefined' && !document.fullscreenElement
			) {
				document.documentElement.requestFullscreen();
			}
			start = true;

			let set_time = setInterval(() => {
				time = time - 1;
				if (time <= 0) {
					clearInterval(set_time);
				}
			}, 1000);
		} catch (e) {
			console.log(e);
		}
	};

  const back = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    start = false
  }
</script>

<div id="magic" x-data="app">
	<!-- game chua bat dau -->
	{#if !start}
		<div class="menu">
			<p>Nhìn vào tâm giữa màn hình trong 20s</p>
			<button on:click|preventDefault={getGo}>Bắt đầu</button>
		</div>
	{/if}

	<!-- game bat dau -->
	{#if start}
		<div class="game">
			<div class="top">
				<div class="parent">
					{#each new Array(40) as _,i}
						  <div class="child" />
            {/each}
				</div>
			</div>
			<div class="bot">
				<div class="parent">
					<template x-for="(_,i) in new Array(40)" :key="i">
            {#each new Array(40) as _,i}
						  <div class="child" />
            {/each}
					</template>
				</div>
			</div>
			<div class="icon">
        {#if time > 0}
				  <span>{time}</span>
        {:else}
				  <button on:click|preventDefault={back}>Trở lại</button>
        {/if}
			</div>
		</div>
  {/if}
</div>

<style>
	#magic {
		width: 100%;
		height: 100%;
	}

	#magic .game {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		position: relative;
	}

	#magic .menu {
		width: 100%;
		height: 100%;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	#magic .menu p {
		font-size: 20px;
		font-weight: 600;
	}

	#magic .menu button {
		padding: 12px 18px;
		border: none;
		border-radius: 3px;
		margin-top: 20px;
		background: #0284c7;
		color: #fff;
		cursor: pointer;
		font-size: 16px;
	}
	#magic .menu button:hover {
		background-color: #0ea5e9;
	}

	#magic .icon {
		content: 'Lock';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 50px;
		height: 50px;
		background-color: red;
		border-radius: 9999px;
		display: grid;
		place-items: center;
		color: #fff;
	}

	#magic .icon button {
		background-color: transparent;
		border: none;
		width: 100%;
		height: 100%;
		color: #fff;
		cursor: pointer;
	}

	#magic .top,
	#magic .bot {
		flex-grow: 1;
		position: relative;
		overflow: hidden;
	}

	#magic .parent {
		position: absolute;
		width: 100%;
		height: 200%;
		/* top: 0; */
		left: 0;
		display: flex;
		gap: 2.5%;
		flex-direction: column;
		animation: move 3s linear infinite reverse;
	}

	#magic .bot .parent {
		animation: move 3s linear infinite;
	}

	#magic .child {
		flex: none;
		width: 100%;
		height: 2.5%;
		background: #000;
	}

	@keyframes move {
		from {
			bottom: 0;
		}

		to {
			bottom: 100%;
		}
	}
</style>
