<script setup lang="ts">
/** Experience · F — Pixel calendar: one square per month since the first role, coloured by the role held. */
const { site } = useAppConfig();

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const TONES = ["#C4454A", "#8B2A32", "#F4F1EC", "#A7A7A7"];

const monthIndex = (value: string) => {
  const [year, month] = value.split("-").map(Number);
  return year * 12 + (month - 1);
};

const now = new Date();
const nowIndex = now.getFullYear() * 12 + now.getMonth();

const roles = computed(() =>
  site.experience.map((entry, i) => {
    const from = monthIndex(entry.start);
    // Inclusive of the end month, matching the "March–May" labels. Where roles
    // overlap by a month, `roleAt` gives it to the newer role (listed first).
    const to = entry.end ? monthIndex(entry.end) : nowIndex;
    return { ...entry, from, to, months: to - from + 1, tone: TONES[i % TONES.length] };
  }),
);

const firstYear = Math.min(...site.experience.map((entry) => Number(entry.start.slice(0, 4))));
const years = Array.from({ length: now.getFullYear() - firstYear + 1 }, (_, i) => firstYear + i);

const roleAt = (index: number) =>
  roles.value.findIndex((role) => index >= role.from && index <= role.to);

const focused = ref<number | null>(null);

// Count calendar months worked (overlapping months once).
const totalMonths = computed(() => {
  const first = Math.min(...roles.value.map((role) => role.from));
  let count = 0;
  for (let i = first; i <= nowIndex; i++) if (roleAt(i) >= 0) count++;
  return count;
});
</script>

<template>
  <section class="border-t border-border" aria-labelledby="experience-f-title">
    <div class="container-x section-pad">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="eyebrow eyebrow-marker">Experience</p>
          <h2 id="experience-f-title" class="section-title mt-4">Professional Experience</h2>
        </div>
        <p class="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
          {{ totalMonths }} months on the job &middot; 1 pixel = 1 month
        </p>
      </div>

      <div class="mt-14 grid gap-14 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-20">
        <!-- Calendar -->
        <div class="overflow-x-auto" aria-hidden="true">
          <table class="border-separate border-spacing-1 font-mono text-[0.6rem] text-muted">
            <thead>
              <tr>
                <th />
                <th v-for="(m, i) in MONTHS" :key="i" class="pb-1 font-normal">{{ m }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="year in years" :key="year">
                <th class="pr-3 text-right font-normal">{{ year }}</th>
                <td v-for="m in 12" :key="m" class="p-0">
                  <span
                    class="cal-px block h-6 w-6 sm:h-8 sm:w-8"
                    :class="{
                      'is-now': year * 12 + m - 1 === nowIndex,
                      'is-dim': focused !== null && roleAt(year * 12 + m - 1) !== focused,
                      'is-future': year * 12 + m - 1 > nowIndex,
                    }"
                    :style="{
                      backgroundColor:
                        roleAt(year * 12 + m - 1) >= 0 ? roles[roleAt(year * 12 + m - 1)].tone : undefined,
                    }"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Legend / entries -->
        <ol class="border-t border-border">
          <li
            v-for="(role, i) in roles"
            :key="role.start"
            class="border-b border-border"
          >
            <button
              type="button"
              class="w-full py-6 text-left transition-opacity"
              :class="focused !== null && focused !== i ? 'opacity-40' : ''"
              :aria-pressed="focused === i"
              @mouseenter="focused = i"
              @mouseleave="focused = null"
              @focus="focused = i"
              @blur="focused = null"
            >
              <span class="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">
                <span class="h-3 w-3 shrink-0" :style="{ backgroundColor: role.tone }" aria-hidden="true" />
                <time :datetime="role.start">{{ role.dateLabel }}</time>
                <span class="text-border">/</span>
                {{ role.months }} mo
              </span>
              <span class="mt-3 block font-display text-2xl font-semibold tracking-tight">{{ role.role }}</span>
              <span class="mt-1 block text-sm text-muted">{{ role.company }}</span>
              <span class="mt-3 block max-w-lg text-sm leading-relaxed text-muted">{{ role.summary }}</span>
            </button>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cal-px {
  background-color: #32363a;
  transition:
    opacity 250ms ease,
    transform 250ms ease;
}

.cal-px.is-future {
  background-color: transparent;
  box-shadow: inset 0 0 0 1px #3a3e41;
}

.cal-px.is-dim {
  opacity: 0.18;
}

.cal-px.is-now {
  outline: 1px solid #f4f1ec;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: no-preference) {
  .cal-px.is-now {
    animation: cal-blink 1.1s steps(1, end) infinite;
  }
}

@keyframes cal-blink {
  50% {
    opacity: 0.35;
  }
}
</style>
