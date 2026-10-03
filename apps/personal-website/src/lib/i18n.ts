export type Locale = "de" | "en";

export function getLocale(value: string | undefined): Locale {
	return isLocale(value) ? value : "en";
}

export function isLocale(value: string | undefined): value is Locale {
	return value === "de" || value === "en";
}

export function localizedPath(locale: Locale, pathname: string): string {
	const path = pathname.replace(/^\/(?:de|en)(?=\/|$)/, "");
	return `/${locale}${path === "/" ? "" : path}`;
}

const en = {
	about: {
		agents:
			"I use agents to build more software and make it better. I spend a lot of time improving workflows that let them investigate issues, implement changes, and check the results.",
		approach:
			"I like understanding why something isn't working as expected, making changes, and checking whether they helped. I'm interested in tools that make that process easier without adding too much to maintain.",
		description:
			"About Jan Görgens: software at plancraft, working with AI agents and automation, and personal projects.",
		introAfter: ", mostly working on web applications.",
		introBefore: "I'm Jan. I build software at",
		pageTitle: "About — Jan Görgens",
		projectAfter:
			". It finds the most-liked comments on YouTube videos, with a Chrome extension to open it from a video.",
		projectBefore: "My last published personal project is",
		title: "About",
	},
	contact: {
		email: "Email",
		formLabel: "Send Jan a message",
		honeypot: "Leave this empty",
		invalidEmail: "Please enter a valid email address.",
		message: "Message",
		name: "Name",
		noteAfter: "to deliver your message.",
		noteBefore: "This form uses",
		required: "Please fill out this field.",
		submit: "Send message",
		unavailable: "The form is currently unavailable. You can reach me on LinkedIn.",
	},
	home: {
		aboutApproach:
			"I like understanding why something behaves the way it does, especially when it isn't working as expected. Usually that means investigating a bit, making changes, and checking whether they actually helped.",
		aboutTitle: "A bit about how I work",
		aboutTools:
			"I'm interested in tools that make that process easier, without making the whole setup harder to maintain.",
		agentsDescription:
			"I use agents to build more software and make it better. That means getting them to handle more of the development work, from investigating an issue to implementing and checking a fix.",
		agentsTitle: "Agents & automation",
		agentsWorkflows:
			"I spend a lot of time improving those workflows so I can take on more, without leaving more problems to deal with later.",
		atWork: "At work",
		avatar: "Avatar of Jan Görgens",
		contactDescription:
			"If we met at a conference, or you want to talk about something I'm working on, feel free to send me a message.",
		description: "I build software at plancraft with a focus on agentic workflows.",
		howIWork: "How I work",
		introAfter: "with a focus on agentic workflows.",
		introBefore: "I build software at",
		openProject: "Open TopComments",
		pageTitle: "Jan Görgens — software development",
		projectDescription:
			"My last published personal project. Paste in a YouTube link and it shows the most-liked comments it finds. There's also a Chrome extension to open it from a video.",
		projectLabel: "Open TopComments, my YouTube comment finder",
		projectStack: "SvelteKit · YouTube API · Chrome extension",
		projectTitle: "Personal project",
		workDescription:
			"I work at plancraft, where we build software that helps tradespeople manage projects, quotes, invoices, and the paperwork that comes with them.",
		workGithub: "Work GitHub",
		workLabel: "My work at plancraft",
		workTitle: "Work & interests",
	},
	navigation: {
		about: "About",
		backToTop: "Back to top",
		contact: "Contact",
		darkMode: "Enable Dark Mode",
		getInTouch: "Get in touch",
		home: "Jan Görgens, home",
		language: "Language",
		lightMode: "Enable Light Mode",
		main: "Main navigation",
		skip: "Skip to content",
		work: "Work",
	},
};

const de: typeof en = {
	about: {
		agents:
			"Ich nutze Agenten, um mehr Software zu entwickeln und sie zu verbessern. Ich arbeite viel an Abläufen, mit denen sie Probleme untersuchen, Änderungen umsetzen und die Ergebnisse prüfen können.",
		approach:
			"Ich möchte verstehen, warum etwas nicht wie erwartet funktioniert, Änderungen vornehmen und prüfen, ob sie geholfen haben. Mich interessieren Werkzeuge, die das einfacher machen, ohne zu viel zusätzlichen Wartungsaufwand zu verursachen.",
		description:
			"Über Jan Görgens: Software bei plancraft, die Arbeit mit KI-Agenten und Automatisierung und persönliche Projekte.",
		introAfter: ", vor allem Webanwendungen.",
		introBefore: "Ich bin Jan. Ich entwickle Software bei",
		pageTitle: "Über mich — Jan Görgens",
		projectAfter:
			". Es findet die Kommentare mit den meisten Likes unter YouTube-Videos. Mit der Chrome-Erweiterung lässt es sich direkt von einem Video aus öffnen.",
		projectBefore: "Mein zuletzt veröffentlichtes persönliches Projekt ist",
		title: "Über mich",
	},
	contact: {
		email: "E-Mail",
		formLabel: "Jan eine Nachricht senden",
		honeypot: "Dieses Feld leer lassen",
		invalidEmail: "Bitte gib eine gültige E-Mail-Adresse ein.",
		message: "Nachricht",
		name: "Name",
		noteAfter: "zum Versenden deiner Nachricht.",
		noteBefore: "Dieses Formular nutzt",
		required: "Bitte fülle dieses Feld aus.",
		submit: "Nachricht senden",
		unavailable: "Das Formular ist derzeit nicht verfügbar. Du erreichst mich auf LinkedIn.",
	},
	home: {
		aboutApproach:
			"Ich möchte verstehen, warum sich etwas so verhält, wie es sich verhält. Besonders dann, wenn es nicht wie erwartet funktioniert. Meistens heißt das: nachforschen, etwas ändern und prüfen, ob es wirklich geholfen hat.",
		aboutTitle: "Ein bisschen darüber, wie ich arbeite",
		aboutTools:
			"Mich interessieren Werkzeuge, die das einfacher machen, ohne die Wartung der ganzen Umgebung aufwendiger zu machen.",
		agentsDescription:
			"Ich nutze Agenten, um mehr Software zu entwickeln und sie zu verbessern. Sie übernehmen dabei immer mehr Entwicklungsarbeit: von der Untersuchung eines Problems bis zur Umsetzung und Prüfung einer Lösung.",
		agentsTitle: "Agenten & Automatisierung",
		agentsWorkflows:
			"Ich arbeite viel daran, diese Abläufe zu verbessern. So kann ich mehr angehen, ohne mir dabei mehr Probleme für später einzuhandeln.",
		atWork: "Bei der Arbeit",
		avatar: "Avatar von Jan Görgens",
		contactDescription:
			"Wenn wir uns auf einer Konferenz getroffen haben oder du über etwas sprechen möchtest, an dem ich arbeite, schreib mir gern eine Nachricht.",
		description:
			"Ich entwickle Software bei plancraft und arbeite daran, Agenten in Entwicklungsabläufe einzubinden.",
		howIWork: "Wie ich arbeite",
		introAfter: "und arbeite daran, Agenten in Entwicklungsabläufe einzubinden.",
		introBefore: "Ich entwickle Software bei",
		openProject: "TopComments öffnen",
		pageTitle: "Jan Görgens — Softwareentwicklung",
		projectDescription:
			"Mein zuletzt veröffentlichtes persönliches Projekt. Füge einen YouTube-Link ein und es zeigt dir die gefundenen Kommentare mit den meisten Likes. Mit der Chrome-Erweiterung kannst du es direkt von einem Video aus öffnen.",
		projectLabel: "TopComments öffnen, mein Tool für YouTube-Kommentare",
		projectStack: "SvelteKit · YouTube API · Chrome-Erweiterung",
		projectTitle: "Persönliches Projekt",
		workDescription:
			"Ich arbeite bei plancraft. Dort entwickeln wir Software, mit der Handwerksbetriebe Projekte, Angebote, Rechnungen und den dazugehörigen Papierkram verwalten können.",
		workGithub: "GitHub für die Arbeit",
		workLabel: "Meine Arbeit bei plancraft",
		workTitle: "Arbeit & Interessen",
	},
	navigation: {
		about: "Über mich",
		backToTop: "Nach oben",
		contact: "Kontakt",
		darkMode: "Dunklen Modus aktivieren",
		getInTouch: "Schreib mir",
		home: "Jan Görgens, Startseite",
		language: "Sprache",
		lightMode: "Hellen Modus aktivieren",
		main: "Hauptnavigation",
		skip: "Zum Inhalt springen",
		work: "Arbeit",
	},
};

export const translations = { de, en };
