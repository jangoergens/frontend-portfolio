// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />

import "astro/astro-jsx";

declare global {
	namespace JSX {
		type Element = HTMLElement;
		type IntrinsicElements = astroHTML.JSX.IntrinsicElements;
	}
}
