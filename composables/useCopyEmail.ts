/** Click-to-copy for the site email, falling back to mailto: when the clipboard is unavailable. */
export function useCopyEmail() {
  const { site } = useAppConfig();
  const copied = ref(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      copied.value = true;
      clearTimeout(timer);
      timer = setTimeout(() => (copied.value = false), 2200);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  onBeforeUnmount(() => clearTimeout(timer));

  return { copied, copy };
}
