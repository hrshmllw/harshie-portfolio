<script setup lang="ts">
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();
const config = useRuntimeConfig();

const name = ref("");
const email = ref("");
const message = ref("");
const nameError = ref(false);
const emailError = ref(false);
const messageError = ref(false);
const isSubmitting = ref(false);
const submitStatus = ref<"idle" | "success" | "error">("idle");

const isValidEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));

const isValid = computed(
  () => name.value && email.value && message.value && isValidEmail.value,
);

const validateField = (fieldName: "name" | "email" | "message") => {
  if (fieldName === "name") nameError.value = name.value === "";
  if (fieldName === "email") emailError.value = !isValidEmail.value;
  if (fieldName === "message") messageError.value = message.value === "";
};

const resetForm = () => {
  name.value = "";
  email.value = "";
  message.value = "";
  nameError.value = false;
  emailError.value = false;
  messageError.value = false;
  submitStatus.value = "idle";
};

const submitForm = async () => {
  if (!isValid.value) return;

  isSubmitting.value = true;
  submitStatus.value = "idle";

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: config.public.web3formsAccessKey,
        name: name.value,
        email: email.value,
        message: message.value,
      }),
    });

    const result = await response.json();

    if (result.success) {
      name.value = "";
      email.value = "";
      message.value = "";
      nameError.value = false;
      emailError.value = false;
      messageError.value = false;
      submitStatus.value = "success";
    } else {
      submitStatus.value = "error";
    }
  } catch {
    submitStatus.value = "error";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section id="contact" class="section-container border-t border-border">
    <div class="grid gap-12 lg:grid-cols-2">
      <div
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 20 } : false"
        :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 500 }"
      >
        <p class="section-eyebrow">Contact</p>
        <h2 class="section-title">Let's work together.</h2>
        <p class="mt-4 max-w-md text-muted">
          Have a project in mind or want to say hello? Send a message and I'll
          get back to you.
        </p>

        <ul class="mt-8 space-y-4 text-sm">
          <li class="flex items-center gap-3 text-muted">
            <Icon name="mdi:map-marker-outline" class="h-4 w-4 shrink-0" />
            <span>{{ site.location }}</span>
          </li>
          <li>
            <a
              :href="`mailto:${site.email}`"
              class="flex items-center gap-3 text-muted transition-colors hover:text-fg"
            >
              <Icon name="mdi:email-outline" class="h-4 w-4 shrink-0" />
              <span>{{ site.email }}</span>
            </a>
          </li>
          <li v-for="social in site.socials" :key="social.url">
            <a
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 text-muted transition-colors hover:text-fg"
            >
              <Icon :name="social.icon" class="h-4 w-4 shrink-0" />
              <span>{{ social.url.replace("https://", "") }}</span>
            </a>
          </li>
        </ul>
      </div>

      <form
        v-motion
        :initial="shouldAnimate ? { opacity: 0, y: 20 } : false"
        :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
        :transition="{ duration: 500, delay: 100 }"
        class="rounded-xl border border-border bg-surface p-6 md:p-8"
        @submit.prevent="submitForm"
      >
        <label class="block">
          <span class="mb-2 block text-sm">Full name</span>
          <input
            v-model="name"
            type="text"
            required
            class="block w-full rounded-md border-border bg-bg text-fg shadow-sm focus:border-accent focus:ring-accent"
            :class="{ 'border-red-500': nameError }"
            @blur="validateField('name')"
          />
          <span
            class="mt-1 block text-xs text-red-500"
            :class="{ invisible: !nameError }"
          >
            Please enter your full name.
          </span>
        </label>

        <label class="mt-4 block">
          <span class="mb-2 block text-sm">Email address</span>
          <input
            v-model="email"
            type="email"
            required
            class="block w-full rounded-md border-border bg-bg text-fg shadow-sm focus:border-accent focus:ring-accent"
            :class="{ 'border-red-500': emailError }"
            @blur="validateField('email')"
          />
          <span
            class="mt-1 block text-xs text-red-500"
            :class="{ invisible: !emailError }"
          >
            Invalid email format.
          </span>
        </label>

        <label class="mt-4 block">
          <span class="mb-2 block text-sm">Message</span>
          <textarea
            v-model="message"
            rows="4"
            required
            class="block w-full rounded-md border-border bg-bg text-fg shadow-sm focus:border-accent focus:ring-accent"
            :class="{ 'border-red-500': messageError }"
            @blur="validateField('message')"
          />
          <span
            class="mt-1 block text-xs text-red-500"
            :class="{ invisible: !messageError }"
          >
            Message is required.
          </span>
        </label>

        <div class="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            class="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!isValid || isSubmitting"
          >
            {{ isSubmitting ? "Sending..." : "Send message" }}
          </button>
          <button type="button" class="btn-ghost" @click="resetForm">
            Reset
          </button>
        </div>

        <p
          v-if="submitStatus === 'success'"
          class="mt-4 text-sm text-accent"
        >
          Message sent successfully.
        </p>
        <p
          v-if="submitStatus === 'error'"
          class="mt-4 text-sm text-red-500"
        >
          Something went wrong. Please try again.
        </p>
      </form>
    </div>
  </section>
</template>
