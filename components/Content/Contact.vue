<template>
	<section>
		<div
			class="grid max-w-6xl grid-cols-1 p-4 mx-auto lg:px-8 md:grid-cols-2 md:divide-x dark:text-gray-200"
		>
			<div class="py-6 md:py-0 md:px-6 font-poppins">
				<h1 class="text-4xl font-bold font-inter">Get in touch</h1>
				<p class="pt-2 pb-4">Fill in the form to start a conversation</p>
				<div class="space-y-4">
					<p class="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="w-5 h-5 mr-2 sm:mr-6"
						>
							<path
								fill-rule="evenodd"
								d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
								clip-rule="evenodd"
							></path>
						</svg>
						<span>Calamba, Laguna, Philippines</span>
					</p>
					<p class="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="w-5 h-5 mr-2 sm:mr-6"
						>
							<path
								d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
							></path>
							<path
								d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
							></path>
						</svg>
						<span>edceljmacawili@gmail.com</span>
					</p>
					<p class="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 32 32"
							fill="currentColor"
							class="w-5 h-5 mr-2 sm:mr-6"
						>
							<path
								d="M0 15.968q0-3.264 1.28-6.208 2.528-5.952 8.48-8.48 2.944-1.28 6.208-1.28t6.208 1.28q5.888 2.496 8.48 8.48 1.28 3.040 1.28 6.208t-1.28 6.208q-2.592 6.016-8.48 8.544-2.944 1.28-6.208 1.28t-6.208-1.28q-5.952-2.56-8.48-8.544-1.28-2.944-1.28-6.208zM2.496 15.968q0 4.512 2.688 8.064 2.656 3.488 6.944 4.96v-2.56q0-1.92 1.28-2.784-0.64-0.032-1.504-0.224-1.632-0.288-2.784-1.024-2.912-1.76-2.912-6.368 0-2.4 1.6-4.096-0.736-1.888 0.16-4.096h0.64q0.32 0 0.8 0.16 1.248 0.384 2.784 1.408 1.952-0.512 3.84-0.512t3.872 0.512q1.248-0.832 2.336-1.28 1.024-0.384 1.472-0.32l0.384 0.032q0.864 2.208 0.16 4.096 1.6 1.696 1.6 4.096 0 3.584-1.76 5.408-0.96 1.024-2.528 1.6-1.312 0.48-2.912 0.608 1.312 0.928 1.312 2.784v2.56q4.128-1.472 6.816-5.024 2.624-3.52 2.624-8 0-2.72-1.056-5.248-1.024-2.432-2.88-4.288-1.792-1.792-4.288-2.848-2.56-1.088-5.216-1.088-2.624 0-5.248 1.088-2.4 1.024-4.288 2.848-1.792 1.856-2.88 4.288-1.056 2.528-1.056 5.248z"
							></path>
						</svg>
						<span>github.com/hrshmllw</span>
					</p>
					<p class="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 32 32"
							fill="currentColor"
							class="w-5 h-5 mr-2 sm:mr-6"
						>
							<path
								d="M8.732 11.161v17.696h-5.893v-17.696h5.893zM9.107 5.696q0.018 1.304-0.902 2.179t-2.42 0.875h-0.036q-1.464 0-2.357-0.875t-0.893-2.179q0-1.321 0.92-2.188t2.402-0.866 2.375 0.866 0.911 2.188zM29.929 18.714v10.143h-5.875v-9.464q0-1.875-0.723-2.938t-2.259-1.063q-1.125 0-1.884 0.616t-1.134 1.527q-0.196 0.536-0.196 1.446v9.875h-5.875q0.036-7.125 0.036-11.554t-0.018-5.286l-0.018-0.857h5.875v2.571h-0.036q0.357-0.571 0.732-1t1.009-0.929 1.554-0.777 2.045-0.277q3.054 0 4.911 2.027t1.857 5.938z"
							></path>
						</svg>
						<span>linkedin.com/in/edceljmacawili</span>
					</p>
				</div>
			</div>
			<form
				class="flex flex-col py-6 md:py-0 md:px-6 font-poppins"
				@submit.prevent="submitForm"
			>
				<label class="block">
					<span class="mb-1">Full name</span>
					<input
						v-model="name"
						type="text"
						class="block w-full rounded-md shadow-sm border-secondary dark:border-accent focus:outline-0 focus:ring-0 focus:border-secondary dark:focus:border-accent bg-accent dark:bg-secondary"
						required
						@blur="validateField('name')"
						:class="{ 'border-red-500': nameError }"
					/>
				</label>
				<span
					class="text-red-500 text-sm mt-none"
					:style="{ visibility: nameError ? 'visible' : 'hidden' }"
				>
					Please enter your full name.
				</span>

				<label class="block">
					<span class="mb-1">Email address</span>
					<input
						v-model="email"
						type="email"
						class="block w-full rounded-md shadow-sm border-secondary dark:border-accent focus:outline-0 focus:ring-0 focus:border-secondary dark:focus:border-accent bg-accent dark:bg-secondary"
						required
						@blur="validateField('email')"
						:class="{ 'border-red-500': emailError }"
					/>
					<!-- Show error message for email -->
					<span
						class="text-red-500 text-sm mt-none"
						:style="{
							visibility: emailError ? 'visible' : 'hidden',
						}"
					>
						Invalid email format.
					</span>
				</label>

				<label class="block">
					<span class="mb-1">Message</span>
					<textarea
						v-model="message"
						rows="3"
						class="block w-full rounded-md shadow-sm border-secondary dark:border-accent focus:outline-0 focus:ring-0 focus:border-secondary dark:focus:border-accent bg-accent dark:bg-secondary"
						required
						@blur="validateField('message')"
						:class="{ 'border-red-500': messageError }"
					></textarea>
					<!-- Show error message for message -->
					<span
						class="text-red-500 text-sm mt-none"
						:style="{
							visibility: messageError ? 'visible' : 'hidden',
						}"
					>
						Message is required.
					</span>
				</label>

				<div class="flex justify-center">
					<button
						type="submit"
						class="px-8 py-3 mx-2 text-lg rounded transition ease-in-out duration-300 enabled:hover:ring enabled:hover:animate-pulse ring-gray-200 bg-primary text-black dark:text-gray-200 disabled:bg-gray-200 disabled:dark:bg-gray-700 disabled:dark:opacity-50 disabled:cursor-not-allowed"
						:disabled="!isValid"
					>
						Submit
					</button>
					<button
						type="button"
						class="px-4 py-2 mx-2 text-lg rounded transition ease-in-out duration-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-800"
						@click="resetForm"
					>
						<svg
							viewBox="0 0 25 25"
							class="w-12 h-12 fill-black dark:fill-gray-200"
						>
							<path
								d="M4.56189 13.5L4.14285 13.9294L4.5724 14.3486L4.99144 13.9189L4.56189 13.5ZM9.92427 15.9243L15.9243 9.92427L15.0757 9.07574L9.07574 15.0757L9.92427 15.9243ZM9.07574 9.92426L15.0757 15.9243L15.9243 15.0757L9.92426 9.07574L9.07574 9.92426ZM19.9 12.5C19.9 16.5869 16.5869 19.9 12.5 19.9V21.1C17.2496 21.1 21.1 17.2496 21.1 12.5H19.9ZM5.1 12.5C5.1 8.41309 8.41309 5.1 12.5 5.1V3.9C7.75035 3.9 3.9 7.75035 3.9 12.5H5.1ZM12.5 5.1C16.5869 5.1 19.9 8.41309 19.9 12.5H21.1C21.1 7.75035 17.2496 3.9 12.5 3.9V5.1ZM5.15728 13.4258C5.1195 13.1227 5.1 12.8138 5.1 12.5H3.9C3.9 12.8635 3.92259 13.2221 3.9665 13.5742L5.15728 13.4258ZM12.5 19.9C9.9571 19.9 7.71347 18.6179 6.38048 16.6621L5.38888 17.3379C6.93584 19.6076 9.54355 21.1 12.5 21.1V19.9ZM4.99144 13.9189L7.42955 11.4189L6.57045 10.5811L4.13235 13.0811L4.99144 13.9189ZM4.98094 13.0706L2.41905 10.5706L1.58095 11.4294L4.14285 13.9294L4.98094 13.0706Z"
							/>
						</svg>
					</button>
				</div>
			</form>
		</div>
	</section>
</template>

<script>
const WEB3FORMS_ACCESS_KEY = "d9364708-16df-4e99-9c7d-6f7b8e263b40";

export default {
	data() {
		return {
			name: "",
			email: "",
			message: "",
			nameError: false,
			emailError: false,
			messageError: false,
		};
	},
	methods: {
		async submitForm() {
			const response = await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					access_key: WEB3FORMS_ACCESS_KEY,
					name: this.name,
					email: this.email,
					message: this.message,
				}),
			});
			const result = await response.json();
			if (result.success) {
				console.log(result);
				this.name = "";
				this.email = "";
				this.message = "";
			}
		},
		validateField(fieldName) {
			if (fieldName === "name") {
				this.nameError = this.name === "";
			} else if (fieldName === "email") {
				this.emailError = !this.isValidEmail;
			} else if (fieldName === "message") {
				this.messageError = this.message === "";
			}
		},
		resetForm() {
			this.name = "";
			this.email = "";
			this.message = "";
			this.nameError = false;
			this.emailError = false;
			this.messageError = false;
		},
	},
	computed: {
		isValid() {
			return this.name && this.email && this.message && this.isValidEmail;
		},
		isValidEmail() {
			const emailRules = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRules.test(this.email);
		},
	},
};
</script>
