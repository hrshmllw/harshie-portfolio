<template>
	<section class="h-max py-24">
		<div
			class="container max-w-xl px-6 m-auto space-y-6 lg:space-y-12 lg:max-w-7xl"
		>
			<h2 class="text-4xl font-bold text-center sm:text-5xl dark:text-gray-200">
				About Me
			</h2>
			<div class="grid lg:gap-8 lg:grid-cols-2 lg:items-center">
				<div
					v-motion-slide-visible-once-right
					class="lg:col-start-2 font-poppins"
				>
					<p class="mt-3 text-lg dark:text-gray-200">
						Hello! I'm Edcel Jeremy Macawili, a Frontend Developer with
						{{ new Date().getFullYear() - 2023 }} years of professional
						experience. I currently work at a company where I build and maintain
						web applications that prioritize responsiveness, interactivity, and
						smooth animations—making sites not just look good, but feel good to
						use, without compromising SEO or performance.
					</p>
					<p class="mt-3 text-lg dark:text-gray-200">
						My expertise spans a variety of tech stacks: React/Next.js,
						Vue/Nuxt.js, WordPress, and even Shopify Liquid and Laravel Blade
						templating. I also have experience building static sites using
						vanilla JavaScript, HTML, and CSS. I enjoy working with different
						frameworks and tools, always aiming to deliver seamless user
						experiences across devices.
					</p>
					<p class="mt-3 text-lg dark:text-gray-200">
						If you'd like to get in touch, click
						<a href="#contact" class="underline">here</a> or send me an email
						<a href="mailto:edceljmacawili@gmail.com" class="underline">here</a
						>.
					</p>
					<div class="my-12">
						<a
							href="/Edcel Jeremy Macawili - Resume 2025.pdf"
							download="Macawili, Edcel Jeremy - Resume"
							class="p-3 rounded-md transition ease-in-out duration-300 hover:ring hover:animate-pulse ring-gray-200 bg-primary text-gray-200"
							>Download Resume</a
						>
					</div>
				</div>
				<div
					v-motion-slide-visible-once-left
					class="mt-10 lg:mt-0 lg:col-start-1 lg:row-start-1"
				>
					<img
						src="~/assets/img/gradpic.png"
						alt=""
						class="mx-auto rounded-lg shadow-lg dark:bg-gray-500"
					/>
				</div>
			</div>
		</div>
	</section>
</template>
