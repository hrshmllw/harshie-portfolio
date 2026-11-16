type ContactField = "name" | "email" | "subject" | "message";

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Validation + Web3Forms submit for the contact form (`components/ui/ContactForm.vue`). */
export function useContactForm() {
  const config = useRuntimeConfig();

  const fields = reactive({
    name: "",
    email: "",
    subject: "",
    message: "",
    botcheck: "",
  });

  const errors = reactive<Record<ContactField, string>>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const isSubmitting = ref(false);
  const status = ref<"idle" | "success" | "error">("idle");

  const validate = (field: ContactField) => {
    const value = fields[field].trim();
    if (field === "email") {
      if (!value) errors.email = "Please enter your email.";
      else if (!isValidEmail(value))
        errors.email = "Please enter a valid email address.";
      else errors.email = "";
      return;
    }
    errors[field] = value ? "" : `Please enter ${field === "name" ? "your name" : `a ${field}`}.`;
  };

  const fieldNames: ContactField[] = ["name", "email", "subject", "message"];

  const validateAll = () => {
    fieldNames.forEach(validate);
    return fieldNames.every((field) => !errors[field]);
  };

  const clear = () => {
    fields.name = "";
    fields.email = "";
    fields.subject = "";
    fields.message = "";
    fields.botcheck = "";
    fieldNames.forEach((field) => (errors[field] = ""));
  };

  const reset = () => {
    clear();
    status.value = "idle";
  };

  const submit = async () => {
    status.value = "idle";
    if (!validateAll()) return;
    if (fields.botcheck) return;

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
          name: fields.name.trim(),
          email: fields.email.trim(),
          subject: fields.subject.trim(),
          message: fields.message.trim(),
          botcheck: fields.botcheck,
        }),
      });
      const result = await response.json();
      if (result.success) {
        clear();
        status.value = "success";
      } else {
        status.value = "error";
      }
    } catch {
      status.value = "error";
    } finally {
      isSubmitting.value = false;
    }
  };

  const firstError = computed(
    () => fieldNames.map((field) => errors[field]).find(Boolean) ?? "",
  );

  return {
    fields,
    errors,
    isSubmitting,
    status,
    firstError,
    validate,
    reset,
    submit,
  };
}
