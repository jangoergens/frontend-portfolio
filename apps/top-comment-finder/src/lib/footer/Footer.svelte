<script lang="ts">
	import githubLogo from '$lib/assets/github.svg';
</script>

<footer class="mt-auto flex justify-center gap-2 py-4">
	<span>Copyright © {new Date().getFullYear()}</span>
	<a
		target="_blank"
		rel="noopener noreferrer"
		href="https://www.github.com/jangoergens"
		class="flex gap-1 font-bold"
	>
		Jan Görgens
		<img id="github-logo" src={githubLogo} alt="Github Logo" />
	</a>
</footer>
