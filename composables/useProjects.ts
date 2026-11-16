/** Projects for the Work section: the featured (selected) projects, in `order`. */
export async function useProjects() {
  const { data: projects } = await useAsyncData("projects", () =>
    queryCollection("projects").order("order", "ASC").all(),
  );

  const featured = computed(() =>
    (projects.value ?? []).filter((project) => project.featured),
  );

  const slug = (path: string) => path.split("/").filter(Boolean).pop() ?? path;

  return { featured, slug };
}
