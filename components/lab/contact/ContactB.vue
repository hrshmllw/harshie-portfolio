<script setup lang="ts">
/** Contact · B — Mad-libs: the form is one sentence with inline blanks. */
const { site } = useAppConfig();
const { fields, errors, isSubmitting, status, validate, reset, submit } =
  useContactForm();

const firstName = site.fullName.split(" ")[0];

const errorList = computed(() =>
  (["name", "email", "subject", "message"] as const)
    .filter((field) => errors[field])
    .map((field) => ({ field, text: errors[field] })),
);
</script>

<template>
  <section class="border-t border-border" aria-labelledby="contact-b-title">
    <div class="container-x section-pad">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="eyebrow eyebrow-marker">Contact</p>
          <h2 id="contact-b-title" class="section-title mt-4">Interested? Get in&nbsp;touch.</h2>
        </div>
        <a :href="`mailto:${site.email}`" class="font-mono text-xs text-muted transition-colors hover:text-fg">
          or email {{ site.email }}
        </a>
      </div>

      <form class="relative mt-14" novalidate @submit.prevent="submit">
        <input
          v-model="fields.botcheck"
          type="text"
          name="botcheck"
          tabindex="-1"
          autocomplete="off"
          class="pointer-events-none absolute left-0 top-0 h-px w-px -translate-x-full opacity-0"
          aria-hidden="true"
        />

        <p class="madlib font-display text-[clamp(1.5rem,3.6vw,3.25rem)] font-medium leading-[1.6] tracking-[-0.01em] text-muted">
          Hi {{ firstName }}, my name is
          <label class="sr-only" for="madlib-name">Your name</label>
          <input
            id="madlib-name"
            v-model="fields.name"
            name="name"
            type="text"
            autocomplete="name"
            placeholder="your name"
            class="blank w-[8.5em]"
            :aria-invalid="!!errors.name"
            @blur="validate('name')"
          />
          and you can reach me at
          <label class="sr-only" for="madlib-email">Your email</label>
          <input
            id="madlib-email"
            v-model="fields.email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="you@email.com"
            class="blank w-[10em]"
            :aria-invalid="!!errors.email"
            @blur="validate('email')"
          />. I'd like to talk about
          <label class="sr-only" for="madlib-subject">Subject</label>
          <input
            id="madlib-subject"
            v-model="fields.subject"
            name="subject"
            type="text"
            placeholder="a new website"
            class="blank w-[9em]"
            :aria-invalid="!!errors.subject"
            @blur="validate('subject')"
          />.
        </p>

        <label for="madlib-message" class="mt-10 block font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
          Here's the gist
        </label>
        <textarea
          id="madlib-message"
          v-model="fields.message"
          name="message"
          rows="3"
          placeholder="A few lines about the project, timeline, or role…"
          class="lab-input mt-2 resize-y text-lg"
          :aria-invalid="!!errors.message"
          @blur="validate('message')"
        />

        <ul v-if="errorList.length" class="mt-6 space-y-2" role="alert">
          <li v-for="error in errorList" :key="error.field" class="lab-error">
            <label :for="`madlib-${error.field}`" class="cursor-pointer">{{ error.text }}</label>
          </li>
        </ul>

        <div class="mt-10 flex flex-wrap items-center gap-6">
          <button
            type="submit"
            class="group inline-flex items-center gap-3 bg-fg px-6 py-4 font-display text-lg font-semibold text-accent transition-colors hover:bg-accent-bright hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Sending…" : "Send it" }}
            <Icon name="lucide:arrow-right" class="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
          <button type="button" class="font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-fg" @click="reset">
            Start over
          </button>
        </div>

        <div class="mt-4 min-h-[1.25rem] text-sm" aria-live="polite" role="status">
          <p v-if="status === 'success'">Message sent. I'll be in touch soon.</p>
          <p v-if="status === 'error'">Something went wrong. Please try again or email me directly.</p>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.blank {
  display: inline-block;
  max-width: 100%;
  margin-inline: 0.15em;
  padding: 0 0.1em;
  border: 0;
  border-bottom: 2px solid #45494c;
  background: transparent;
  color: #f4f1ec;
  font: inherit;
  line-height: 1.1;
  vertical-align: baseline;
  box-shadow: none;
  transition: border-color 200ms ease;
}

.blank::placeholder {
  color: rgba(167, 167, 167, 0.35);
}

.blank:focus {
  outline: none;
  border-bottom-color: #c4454a;
  box-shadow: none;
}

.blank[aria-invalid="true"] {
  border-bottom-color: #c4454a;
}
</style>
