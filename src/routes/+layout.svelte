<script lang="ts">
	import '../app.css';
</script>

<a href="/">home</a>
<a href="/magic">magic</a>
<div id="app">
	<slot />
</div>

<style global>
  html, body, #app {
    @apply w-full h-full;
  }
</style>