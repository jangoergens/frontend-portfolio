<script lang="ts">
	import githubLogo from "$lib/assets/github.svg";
</script>

<footer class="mt-auto flex justify-center gap-2 py-4">
	<span>Copyright © {new Date().getFullYear()}</span>
	<a
		class="flex gap-1 font-bold"
		href="https://www.github.com/jangoergens"
		rel="noopener noreferrer"
		target="_blank"
	>
		Jan Görgens
		<img alt="Github Logo" height="16" src={githubLogo} width="16" />
	</a>
</footer>
