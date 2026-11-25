import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import App from './App.svelte';

const props = {
	name: 'Hestia',
	logoSrc: '/apps/hestia-logo.svg',
	playStoreUrl: 'https://play.google.com/store/apps/details?id=example',
	privacyPolicyUrl: '/apps/hestia-privacy-policy'
};

describe('App.svelte', () => {
	test('logo links to the Play Store in a new tab', () => {
		render(App, { props });
		const link = screen.getByRole('link', { name: 'Hestia on Google Play' });
		expect(link).toHaveAttribute('href', props.playStoreUrl);
		expect(link).toHaveAttribute('target', '_blank');
	});

	test('shows the name and links to the privacy policy', () => {
		render(App, { props });
		expect(screen.getByText('Hestia')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'privacy policy' })).toHaveAttribute(
			'href',
			props.privacyPolicyUrl
		);
	});
});
