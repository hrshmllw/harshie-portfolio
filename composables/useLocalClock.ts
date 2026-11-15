/** Ticking HH:MM in a time zone, client-only (shows "--:--" on the server). */
export function useLocalClock(timeZone = "Asia/Manila") {
  const time = ref("--:--");
  let timer: ReturnType<typeof setInterval> | undefined;

  const update = () => {
    time.value = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
  };

  onMounted(() => {
    update();
    timer = setInterval(update, 15_000);
  });

  onBeforeUnmount(() => clearInterval(timer));

  return time;
}
