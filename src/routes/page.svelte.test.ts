import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';
import info from '$lib/data/info.json';
import projectsData from '$lib/data/projects.json';

describe('/+page.svelte', () => {
	test('should render name heading', () => {
		render(Page, { props: { data: { info, projects: projectsData.projects } } });
		expect(screen.getByRole('heading', { level: 1, name: info.myName })).toBeInTheDocument();
	});
});
