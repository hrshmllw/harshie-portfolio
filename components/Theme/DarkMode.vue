<template>
	<button
		class="w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center transition duration-300 focus:outline-none shadow"
		@click="toggleDarkMode"
	>
		<div
			id="switch-toggle"
			:class="{
				'bg-yellow-400 -translate-x-2': !darkMode,
				'bg-gray-700 translate-x-full': darkMode,
			}"
			class="w-8 h-8 relative rounded-full transition duration-500 delay-75 transform p-1 text-black dark:text-white"
		>
			<svg
				v-if="!darkMode"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
			<svg
				v-else
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
				/>
			</svg>
		</div>
	</button>
</template>

<script>
export default {
	data() {
		return {
			darkMode: false,
		};
	},
	methods: {
		toggleDarkMode() {
			this.darkMode = !this.darkMode;

			localStorage.setItem("darkMode", this.darkMode);

			document.documentElement.classList.toggle("dark", this.darkMode);
		},
	},
	mounted() {
		const isDarkMode = localStorage.getItem("darkMode");
		if (isDarkMode === "true") {
			this.darkMode = true;
			document.documentElement.classList.add("dark");
		}
	},
};
</script>
