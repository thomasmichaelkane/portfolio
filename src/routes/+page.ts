import type { PageLoad } from './$types';
import infoData from '$lib/data/info.json';
import projectsData from '$lib/data/projects.json';
import publicationsData from '$lib/data/publications.json';

export const load: PageLoad = async () => {
  return {
    info: infoData,
    projects: projectsData.projects,
    publications: publicationsData.publications
  };
};