<script setup lang="ts">
const { site } = useAppConfig();
const { shouldAnimate } = useMotionPreference();
const config = useRuntimeConfig();

const name = ref("");
const email = ref("");
const subject = ref("");
const message = ref("");
const botcheck = ref("");

const errors = reactive({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const isSubmitting = ref(false);
const submitStatus = ref<"idle" | "success" | "error">("idle");

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validateField = (field: keyof typeof errors) => {
  if (field === "name") {
    errors.name = name.value.trim() ? "" : "Please enter your name.";
  }
  if (field === "email") {
    if (!email.value.trim()) errors.email = "Please enter your email.";
    else if (!isValidEmail(email.value))
      errors.email = "Please enter a valid email address.";
    else errors.email = "";
  }
  if (field === "subject") {
    errors.subject = subject.value.trim() ? "" : "Please enter a subject.";
  }
  if (field === "message") {
    errors.message = message.value.trim() ? "" : "Please enter a message.";
  }
};

const validateAll = () => {
  validateField("name");
  validateField("email");
  validateField("subject");
  validateField("message");
  return !errors.name && !errors.email && !errors.subject && !errors.message;
};

const resetForm = () => {
  name.value = "";
  email.value = "";
  subject.value = "";
  message.value = "";
  botcheck.value = "";
  errors.name = "";
  errors.email = "";
  errors.subject = "";
  errors.message = "";
  submitStatus.value = "idle";
};

const submitForm = async () => {
  submitStatus.value = "idle";
  if (!validateAll()) return;
  if (botcheck.value) return;

  isSubmitting.value = true;

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: config.public.web3formsAccessKey,
        name: name.value.trim(),
        email: email.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim(),
        botcheck: botcheck.value,
      }),
    });

    const result = await response.json();

    if (result.success) {
      name.value = "";
      email.value = "";
      subject.value = "";
      message.value = "";
      botcheck.value = "";
      errors.name = "";
      errors.email = "";
      errors.subject = "";
      errors.message = "";
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
  <section id="contact" class="border-t border-border">
    <div class="container-x section-pad">
      <div class="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 20 } : false"
          :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 500 }"
        >
          <p class="eyebrow">Contact</p>
          <h2 class="section-title mt-4">Interested? Get in touch.</h2>
          <p class="mt-4 max-w-md text-muted">
            Have a project in mind, a role to discuss, or a question about my
            work? Send a message and I'll get back to you.
          </p>

          <ul class="mt-8 space-y-4 text-sm">
            <li class="flex items-center gap-3 text-muted">
              <Icon name="lucide:map-pin" class="h-4 w-4 shrink-0" />
              <span>{{ site.location }}</span>
            </li>
            <li>
              <a
                :href="`mailto:${site.email}`"
                class="flex items-center gap-3 text-muted transition-colors hover:text-fg"
              >
                <Icon name="lucide:mail" class="h-4 w-4 shrink-0" />
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
                <span>{{ social.label }}</span>
              </a>
            </li>
          </ul>
        </div>

        <form
          v-motion
          :initial="shouldAnimate ? { opacity: 0, y: 20 } : false"
          :visibleOnce="shouldAnimate ? { opacity: 1, y: 0 } : false"
          :transition="{ duration: 500, delay: 100 }"
          class="relative border border-border bg-surface/40 p-6 md:p-8"
          novalidate
          @submit.prevent="submitForm"
        >
          <!-- Honeypot — visually and accessibly hidden -->
          <input
            v-model="botcheck"
            type="text"
            name="botcheck"
            tabindex="-1"
            autocomplete="off"
            class="pointer-events-none absolute left-0 top-0 h-px w-px -translate-x-full opacity-0"
            aria-hidden="true"
          />

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="contact-name" class="mb-2 block text-sm">Name</label>
              <input
                id="contact-name"
                v-model="name"
                type="text"
                name="name"
                autocomplete="name"
                class="field-input"
                :aria-invalid="!!errors.name"
                :aria-describedby="errors.name ? 'name-error' : undefined"
                @blur="validateField('name')"
              />
              <p
                v-if="errors.name"
                id="name-error"
                class="mt-1.5 text-xs text-accent-bright"
                role="alert"
              >
                {{ errors.name }}
              </p>
            </div>

            <div>
              <label for="contact-email" class="mb-2 block text-sm">Email</label>
              <input
                id="contact-email"
                v-model="email"
                type="email"
                name="email"
                autocomplete="email"
                class="field-input"
                :aria-invalid="!!errors.email"
                :aria-describedby="errors.email ? 'email-error' : undefined"
                @blur="validateField('email')"
              />
              <p
                v-if="errors.email"
                id="email-error"
                class="mt-1.5 text-xs text-accent-bright"
                role="alert"
              >
                {{ errors.email }}
              </p>
            </div>
          </div>

          <div class="mt-5">
            <label for="contact-subject" class="mb-2 block text-sm">Subject</label>
            <input
              id="contact-subject"
              v-model="subject"
              type="text"
              name="subject"
              class="field-input"
              :aria-invalid="!!errors.subject"
              :aria-describedby="errors.subject ? 'subject-error' : undefined"
              @blur="validateField('subject')"
            />
            <p
              v-if="errors.subject"
              id="subject-error"
              class="mt-1.5 text-xs text-accent-bright"
              role="alert"
            >
              {{ errors.subject }}
            </p>
          </div>

          <div class="mt-5">
            <label for="contact-message" class="mb-2 block text-sm">Message</label>
            <textarea
              id="contact-message"
              v-model="message"
              name="message"
              rows="5"
              class="field-input resize-y"
              :aria-invalid="!!errors.message"
              :aria-describedby="errors.message ? 'message-error' : undefined"
              @blur="validateField('message')"
            />
            <p
              v-if="errors.message"
              id="message-error"
              class="mt-1.5 text-xs text-accent-bright"
              role="alert"
            >
              {{ errors.message }}
            </p>
          </div>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              class="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Sending..." : "Send message" }}
            </button>
            <button type="button" class="btn-ghost" @click="resetForm">
              Reset
            </button>
          </div>

          <div class="mt-4 min-h-[1.25rem]" aria-live="polite" role="status">
            <p
              v-if="submitStatus === 'success'"
              class="text-sm text-fg"
            >
              Message sent successfully. I'll be in touch soon.
            </p>
            <p
              v-if="submitStatus === 'error'"
              class="text-sm text-accent-bright"
            >
              Something went wrong. Please try again or email me directly.
            </p>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
