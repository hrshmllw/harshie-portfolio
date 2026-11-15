/** Projects for the /lab work variants: featured by default, everything on toggle. */
export async function useProjects() {
  const showAll = ref(false);

  const { data: projects } = await useAsyncData("projects", () =>
    queryCollection("projects").order("order", "ASC").all(),
  );

  const featured = computed(() =>
    (projects.value ?? []).filter((project) => project.featured),
  );

  const displayed = computed(() =>
    showAll.value ? (projects.value ?? []) : featured.value,
  );

  const hasMore = computed(
    () => (projects.value?.length ?? 0) > featured.value.length,
  );

  const total = computed(() => projects.value?.length ?? 0);

  const slug = (path: string) => path.split("/").filter(Boolean).pop() ?? path;

  return { showAll, displayed, hasMore, total, slug };
}
