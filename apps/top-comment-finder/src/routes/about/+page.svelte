<script lang="ts">
	import { resolve } from "$app/paths";
</script>

<svelte:head>
	<title>About - TopCommentFinder</title>
	<meta
		content="Why I built TopCommentFinder, how it sorts YouTube comments by likes, and when that simpler view is useful."
		name="description"
	/>
</svelte:head>

<section aria-labelledby="about-title" class="mx-auto max-w-4xl py-4 sm:py-8">
	<div class="mb-6 max-w-2xl">
		<p class="mb-2 text-sm font-semibold text-orange-700 dark:text-orange-400">
			About TopCommentFinder
		</p>
		<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl" id="about-title">
			Comments, ordered by likes.
		</h1>
		<p class="mt-3 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
			A simple way to explore what viewers liked, with a clear rule for how comments are ranked.
		</p>
	</div>

	<div
		class="grid overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-[1.3fr_1fr] dark:border-slate-600 dark:bg-slate-800"
	>
		<div class="space-y-6 p-5 sm:p-7">
			<div>
				<h2>Why I built it</h2>
				<p class="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
					When I built this tool, I found YouTube's comment ranking frustrating, especially when
					revisiting older videos. Highly liked comments could be hard to find.
				</p>
				<p class="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
					YouTube's ranking has gotten much better since then. I still like having the option to
					sort by one thing: likes. That's where TopCommentFinder comes in.
				</p>
			</div>

			<div>
				<h2>When it comes in handy</h2>
				<ul class="mt-3 space-y-3 text-slate-600 dark:text-slate-300">
					<li class="border-l-2 border-orange-400 pl-3">
						Revisiting an old favorite and looking for well-liked comments you remember.
					</li>
					<li class="border-l-2 border-orange-400 pl-3">
						Getting a quick look at reactions that resonated with other viewers.
					</li>
					<li class="border-l-2 border-orange-400 pl-3">
						Exploring a comment section with an explicit sorting rule.
					</li>
				</ul>
			</div>
		</div>

		<div
			class="border-t border-slate-200 bg-slate-50 p-5 sm:p-7 md:border-t-0 md:border-l dark:border-slate-600 dark:bg-slate-900/40"
		>
			<h2>How it works</h2>
			<ol class="mt-4 space-y-4">
				<li class="flex gap-3">
					<span
						aria-hidden="true"
						class="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-800 dark:bg-orange-500/15 dark:text-orange-300"
						>1</span
					>
					<p class="leading-7">Paste a YouTube video link.</p>
				</li>
				<li class="flex gap-3">
					<span
						aria-hidden="true"
						class="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-800 dark:bg-orange-500/15 dark:text-orange-300"
						>2</span
					>
					<p class="leading-7">The fetched comments are sorted by like count, highest first.</p>
				</li>
				<li class="flex gap-3">
					<span
						aria-hidden="true"
						class="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-800 dark:bg-orange-500/15 dark:text-orange-300"
						>3</span
					>
					<p class="leading-7">Read up to 20 comments in that order.</p>
				</li>
			</ol>
			<p
				class="mt-6 border-t border-slate-200 pt-4 text-sm leading-relaxed text-slate-600 dark:border-slate-600 dark:text-slate-300"
			>
				Likes determine the order here. YouTube still determines which comments are available
				through its API. On videos with many comments, results may be a sample rather than the
				most-liked comments overall.
			</p>
		</div>
	</div>

	<a
		class="mt-5 inline-flex items-center rounded-md bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
		href={resolve("/")}>Find comments</a
	>
</section>
