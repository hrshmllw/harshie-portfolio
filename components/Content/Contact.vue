<template>
	<section>
		<div
			class="grid max-w-6xl grid-cols-1 px-6 mx-auto mt-28 pb-28 lg:px-8 md:grid-cols-2 md:divide-x dark:text-gray-200"
		>
			<div class="py-6 md:py-0 md:px-6 mt-20">
				<h1 class="text-4xl font-bold">Get in touch</h1>
				<p class="pt-2 pb-4">
					Fill in the form to start a conversation
				</p>
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
						<span>Las Piñas, Metro Manila, Philippines</span>
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
				</div>
			</div>
			<form class="flex flex-col py-6 space-y-6 md:py-0 md:px-6">
				<label class="block">
					<span class="mb-1">Full name</span>
					<input
						type="text"
						class="block w-full rounded-md shadow-sm border-accent focus:outline-0 focus:ring-0 focus:border-accent dark:bg-secondary"
					/>
				</label>
				<label class="block">
					<span class="mb-1">Email address</span>
					<input
						type="email"
						class="block w-full rounded-md shadow-sm border-accent focus:outline-0 focus:ring-0 focus:border-accent dark:bg-secondary"
					/>
				</label>
				<label class="block">
					<span class="mb-1">Message</span>
					<textarea
						rows="3"
						class="block w-full rounded-md shadow-sm border-accent focus:outline-0 focus:ring-0 focus:border-accent dark:bg-secondary"
					></textarea>
				</label>
				<button
					type="button"
					class="self-center px-8 py-3 text-lg rounded focus:ring hover:ring ring-gray-200 dark:bg-primary dark:text-gray-200"
				>
					Submit
				</button>
			</form>
		</div>
	</section>
</template>
