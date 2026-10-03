<script lang="ts">
	import { FORMSPREE_ENDPOINT } from "$app/env/public";
	import { page } from "$app/state";

	import personalAvatar from "#lib/assets/personalAvatar.svg";
	import plancraftLogo from "#lib/assets/plancraft.svg";
	import ContactForm from "#lib/ContactForm.svelte";
	import ExternalArrow from "#lib/ExternalArrow.svelte";
	import { getLocale, translations } from "#lib/i18n.ts";

	let copy = $derived(translations[getLocale(page.params.lang)]);
</script>

<svelte:head>
	<title>{copy.home.pageTitle}</title>
	<meta name="description" content={copy.home.description} />
	<meta property="og:title" content={copy.home.pageTitle} />
	<meta property="og:description" content={copy.home.description} />
	<meta property="og:type" content="website" />
</svelte:head>

<section class="intro" aria-labelledby="intro-title">
	<div class="intro-copy">
		<h1 id="intro-title">Jan Görgens</h1>
		<p class="intro-lead">
			{copy.home.introBefore}
			<a href="https://plancraft.com" target="_blank" rel="noopener noreferrer">plancraft</a>
			{copy.home.introAfter}
		</p>
		<a class="text-link intro-link" href="#contact">{copy.navigation.getInTouch}</a>
	</div>
	<img class="intro-avatar" src={personalAvatar} alt={copy.home.avatar} width="200" height="200" />
</section>

<section class="work-section" id="work" aria-labelledby="work-title">
	<div class="section-heading"><h2 id="work-title">{copy.home.workTitle}</h2></div>
	<div class="work-grid">
		<article class="work-card" aria-label={copy.home.workLabel}>
			<span class="eyebrow">{copy.home.atWork}</span>
			<div class="work-heading plancraft-brand">
				<img src={plancraftLogo} alt="plancraft" width="146" height="40" />
			</div>
			<p>
				{copy.home.workDescription}
			</p>
			<div class="card-links">
				<a class="text-link" href="https://plancraft.com" target="_blank" rel="noopener noreferrer"
					>plancraft.com <ExternalArrow /></a
				><a
					class="secondary-link"
					href="https://github.com/janplancraft"
					target="_blank"
					rel="noopener noreferrer">{copy.home.workGithub} <ExternalArrow /></a
				>
			</div>
		</article>
		<article class="work-card" aria-labelledby="agents-title">
			<span class="eyebrow">{copy.home.howIWork}</span>
			<div class="work-heading"><h3 id="agents-title">{copy.home.agentsTitle}</h3></div>
			<p>
				{copy.home.agentsDescription}
			</p>
			<p>
				{copy.home.agentsWorkflows}
			</p>
		</article>
	</div>
</section>

<section class="project-section" aria-labelledby="project-title">
	<div class="section-heading"><h2 id="project-title">{copy.home.projectTitle}</h2></div>
	<a
		class="project-card"
		href="https://topcomments.jangoergens.de"
		target="_blank"
		rel="noopener noreferrer"
		aria-label={copy.home.projectLabel}
	>
		<h3>TopComments <ExternalArrow /></h3>
		<p>
			{copy.home.projectDescription}
		</p>
		<span class="project-stack">{copy.home.projectStack}</span>
		<span class="text-link">{copy.home.openProject} <ExternalArrow /></span>
	</a>
</section>

<section class="about-section" id="about" aria-labelledby="about-title">
	<h2 id="about-title">{copy.home.aboutTitle}</h2>
	<p>
		{copy.home.aboutApproach}
	</p>
	<p>
		{copy.home.aboutTools}
	</p>
</section>

<section class="contact-section" id="contact" aria-labelledby="contact-title">
	<div class="contact-intro">
		<h2 id="contact-title">{copy.navigation.getInTouch}</h2>
		<p>
			{copy.home.contactDescription}
		</p>
		<div class="contact-links">
			<a
				class="contact-button"
				href="https://www.linkedin.com/in/jan-goergens/"
				target="_blank"
				rel="noopener noreferrer">LinkedIn <ExternalArrow /></a
			><a
				class="contact-button"
				href="https://github.com/jangoergens"
				target="_blank"
				rel="noopener noreferrer">GitHub <ExternalArrow /></a
			>
		</div>
	</div>
	<ContactForm endpoint={FORMSPREE_ENDPOINT} />
</section>
