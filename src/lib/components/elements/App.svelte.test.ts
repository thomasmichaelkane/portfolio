import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import App from './App.svelte';

const props = {
	name: 'Hestia',
	logoSrc: '/apps/hestia-logo.svg',
	color: '#C98A5E',
	playStoreUrl: 'https://play.google.com/store/apps/details?id=example'
};

describe('App.svelte', () => {
	test('logo links to the Play Store in a new tab', () => {
		render(App, { props });
		const link = screen.getByRole('link', { name: 'Hestia on Google Play' });
		expect(link).toHaveAttribute('href', props.playStoreUrl);
		expect(link).toHaveAttribute('target', '_blank');
	});

	test('without a Play Store link it is not a link and says coming soon', () => {
		render(App, { props: { ...props, playStoreUrl: null } });
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Hestia, coming soon' })).toBeInTheDocument();
		expect(screen.getByText('coming soon')).toBeInTheDocument();
	});

	test('name is hidden until active', async () => {
		const { rerender } = render(App, { props });
		expect(screen.getByText('Hestia')).toHaveClass('opacity-0');
		await rerender({ ...props, active: true });
		expect(screen.getByText('Hestia')).not.toHaveClass('opacity-0');
	});
});
