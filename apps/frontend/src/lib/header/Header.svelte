<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/assets/youtubeTopCommentsLogo.svg';
</script>

<header class="flex justify-center items-center h-16">
	<a href="/">
		<img src={logo} alt="TopCommentFinder Logo" class="h-12 rounded-lg" />
	</a>
	<nav data-sveltekit-preload-data>
		<ul class="flex h-12">
			<li class:active={$page.url.pathname === '/about'}>
				<a href="/about" class="hover:text-orange-500 font-bold flex items-center h-full px-4"
					>About</a
				>
			</li>
		</ul>
	</nav>
</header>
