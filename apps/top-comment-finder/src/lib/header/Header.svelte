<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/assets/logo.png?w=48&h=48&format=webp&imagetools';
</script>

<header class="flex h-16 flex-shrink-0 items-center justify-center">
	<a href="/">
		<img alt="TopCommentFinder Logo" class="h-12 rounded-lg" src={logo} />
	</a>
	<nav data-sveltekit-preload-data>
		<ul class="flex h-12">
			<li class:active={$page.url.pathname === '/about'}>
				<a class="flex h-full items-center px-4 font-bold hover:text-orange-500" href="/about"
					>About</a
				>
			</li>
		</ul>
	</nav>
</header>
