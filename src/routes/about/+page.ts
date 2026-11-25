import type { PageLoad } from './$types';
import infoData from '$lib/data/info.json';
import projectsData from '$lib/data/projects.json';

export const load: PageLoad = async () => {
  return {
    info: infoData,
    projects: projectsData.projects,
  };
};