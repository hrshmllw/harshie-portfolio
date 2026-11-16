<script setup lang="ts">
/** Flat underline contact form used in the contact section. */
const { fields, errors, isSubmitting, status, validate, reset, submit } =
  useContactForm();

const uid = useId();
const id = (field: string) => `${uid}-${field}`;
</script>

<template>
  <form class="relative" novalidate @submit.prevent="submit">
    <input
      v-model="fields.botcheck"
      type="text"
      name="botcheck"
      tabindex="-1"
      autocomplete="off"
      class="pointer-events-none absolute left-0 top-0 h-px w-px -translate-x-full opacity-0"
      aria-hidden="true"
    />

    <div class="grid gap-x-6 sm:grid-cols-2">
      <div v-for="field in (['name', 'email'] as const)" :key="field" class="line-field">
        <label :for="id(field)" class="line-label">{{ field }}</label>
        <input
          :id="id(field)"
          v-model="fields[field]"
          :type="field === 'email' ? 'email' : 'text'"
          :name="field"
          :autocomplete="field"
          class="line-input"
          :aria-invalid="!!errors[field]"
          :aria-describedby="errors[field] ? id(`${field}-error`) : undefined"
          @blur="validate(field)"
        />
        <p v-if="errors[field]" :id="id(`${field}-error`)" class="line-error" role="alert">
          {{ errors[field] }}
        </p>
      </div>
    </div>

    <div class="line-field">
      <label :for="id('subject')" class="line-label">subject</label>
      <input
        :id="id('subject')"
        v-model="fields.subject"
        type="text"
        name="subject"
        class="line-input"
        :aria-invalid="!!errors.subject"
        :aria-describedby="errors.subject ? id('subject-error') : undefined"
        @blur="validate('subject')"
      />
      <p v-if="errors.subject" :id="id('subject-error')" class="line-error" role="alert">
        {{ errors.subject }}
      </p>
    </div>

    <div class="line-field">
      <label :for="id('message')" class="line-label">message</label>
      <textarea
        :id="id('message')"
        v-model="fields.message"
        name="message"
        rows="4"
        class="line-input resize-y"
        :aria-invalid="!!errors.message"
        :aria-describedby="errors.message ? id('message-error') : undefined"
        @blur="validate('message')"
      />
      <p v-if="errors.message" :id="id('message-error')" class="line-error" role="alert">
        {{ errors.message }}
      </p>
    </div>

    <div class="mt-8 flex flex-wrap items-center gap-3">
      <button
        type="submit"
        class="btn-inverse disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? "Sending…" : "Send message" }}
      </button>
      <button type="button" class="btn-ghost" @click="reset">Reset</button>
    </div>

    <div class="mt-4 min-h-[1.25rem] text-sm" aria-live="polite" role="status">
      <p v-if="status === 'success'">Message sent. I'll be in touch soon.</p>
      <p v-if="status === 'error'">
        Something went wrong. Please try again or email me directly.
      </p>
    </div>
  </form>
</template>
