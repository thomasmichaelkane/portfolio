// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			/** Set when arriving at /apps via the home page transition */
			fromHome?: boolean;
			/** Set when arriving at / via the /apps home link transition */
			fromApps?: boolean;
			/** Set when arriving at /about via the home page fade */
			fadeIn?: boolean;
			/** Set when arriving at / via the /about home icon fade */
			fromAbout?: boolean;
		}
		// interface Platform {}
	}
}

export {};
