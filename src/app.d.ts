// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			/** Set when arriving at /apps or /about via the home page's transition */
			fromHome?: boolean;
		}
		// interface Platform {}
	}
}

export {};
