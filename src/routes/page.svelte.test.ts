import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

describe('/+page.svelte (landing)', () => {
	test('links to the about and apps pages', () => {
		render(Page);
		expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
		expect(screen.getByRole('link', { name: /apps/i })).toHaveAttribute('href', '/apps');
	});
});
