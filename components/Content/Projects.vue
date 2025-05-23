<template>
	<section class="h-max px-4 py-24">
		<!-- Other content here -->
		<div class="container p-8 mx-auto text-center dark:text-gray-200">
			<h2 class="text-4xl font-bold sm:text-5xl">Projects</h2>
			<p class="mt-2 text-sm text-gray-500 dark:text-gray-400 font-poppins">
				<span class="text-red-500">*</span> Some project details have been
				anonymized to respect confidentiality agreements with current and past
				employers
			</p>
		</div>

		<!-- Iterating through projectItems using v-for -->
		<div
			v-for="(project, index) in [...projectItems].reverse()"
			:key="project.id"
		>
			<div
				:class="[
					'container',
					'max-w-4xl',

					'px-10',
					'py-6',
					'mx-auto',
					'my-4',
					'rounded-lg',
					'shadow-sm',
					index % 2 === 0
						? 'bg-secondary dark:bg-accent'
						: 'bg-accent dark:bg-secondary',
					index % 2 === 0
						? 'text-gray-200 dark:text-black'
						: 'text-black dark:text-gray-200',
				]"
			>
				<div class="flex items-center justify-end">
					<!-- Displaying languages used for the project -->
					<a
						v-for="language in project.languages"
						:key="language"
						:class="[
							'px-2',
							'py-1',
							'mx-1',
							'font-poppins',
							'rounded-full',
							index % 2 === 0
								? 'bg-accent dark:bg-secondary'
								: 'bg-secondary dark:bg-accent',
							index % 2 === 0
								? 'text-black dark:text-gray-200'
								: 'text-gray-200 dark:text-black',
						]"
					>
						{{ language }}
					</a>
				</div>
				<div class="mt-3">
					<!-- Displaying project name and description -->
					<h3 :href="project.demoUrl" class="text-2xl font-bold">
						{{ project.name }}
						<span v-if="project.confidential" class="text-red-500">*</span>
					</h3>
					<p class="mt-2 font-poppins">{{ project.description }}</p>
				</div>
				<div
					v-if="!project.confidential"
					class="flex items-center justify-end mt-4 font-poppins"
				>
					<!-- Displaying demo and GitHub links -->
					<a
						v-if="project.demoUrl"
						:href="project.demoUrl"
						target="_blank"
						rel="noopener noreferrer"
						:class="[
							'mx-1',
							'bg-primary',
							'hover:underline',
							'text-gray-200',
							'p-2',
							'rounded-md',
						]"
					>
						Video Demo
					</a>
					<a
						v-if="project.githubUrl"
						:href="project.githubUrl"
						target="_blank"
						rel="noopener noreferrer"
						:class="[
							'mx-1',
							'bg-primary',
							'hover:underline',
							'text-gray-200',
							'p-2',
							'rounded-md',
						]"
					>
						Repo
					</a>
					<a
						v-if="project.liveDemoUrl"
						:href="project.liveDemoUrl"
						target="_blank"
						rel="noopener noreferrer"
						:class="[
							'mx-1',
							'bg-primary',
							'hover:underline',
							'text-gray-200',
							'p-2',
							'rounded-md',
						]"
					>
						Site
					</a>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	data() {
		return {
			projectItems: [
				{
					id: 1,
					name: "TaskMate",
					description:
						"A simple task management web application with to-do list, note-taking, and calendar functionalities. Developed as part of a requirement for a course.",
					languages: ["JavaScript", "PHP"],
					githubUrl: "https://github.com/hrshmllw/task-mate",
					liveDemoUrl: "",
					videoDemoUrl: "",
				},
				{
					id: 2,
					name: "Video Conference App",
					description:
						"A video conference web application created for our thesis, proposed as an alternative app for online classes. With facial recognition using the face_recognition Python library, eye-tracking via MediaPipe for JavaScript, and attendance-taking functionalities. The video conferencing function was implemented through Agora SDK.",
					languages: ["JavaScript", "Python"],
					githubUrl: "https://github.com/hrshmllw/video-conference-app",
					liveDemoUrl: "",
					videoDemoUrl: "",
				},
				{
					id: 3,
					name: "Ten Mixer Cryptocurrency Privacy Bridge",
					description:
						"A Web 3.0 application for transferring and converting cryptocurrencies anonymously. Created using Next.js, with core functionalities powered by the BlockBlend.io API.",
					languages: ["NextJS", "Tailwind", "Axios"],
					githubUrl: "",
					liveDemoUrl: "https://tenmixer.com",
					videoDemoUrl: "",
				},
				{
					id: 4,
					name: "D-Line Pictures Portfolio",
					description:
						"A VFX company website displaying all the projects worked on with a contact form for inquiries. Created using a headless WordPress as the CMS and NextJS for the front-end.",
					languages: ["NextJS", "Tailwind", "WordPress", "Motion"],
					githubUrl: "",
					liveDemoUrl: "https://dlpictures.ph/",
					videoDemoUrl: "",
				},
				{
					id: 5,
					name: "Casino Consult Pro (formerly JP Casino Pro)",
					description:
						"An online casino gaming consultancy website offering comprehensive solutions such as payment methods integration, game content sourcing, etc. Built to provide flexible and customized consultancy for online casino operators.",
					languages: ["NextJS", "Tailwind"],
					githubUrl: "",
					liveDemoUrl: "https://casinoconsult.pro",
					videoDemoUrl: "",
				},
				{
					id: 6,
					name: "E-commerce Publishing Platform",
					description:
						"An online store for selling books by an independent, Wall Street Journal and USA Today bestselling author. Built with WordPress and WooCommerce, enhanced with GSAP animations for an engaging user experience.",
					languages: ["WordPress", "WooCommerce", "GSAP", "SCSS"],
					githubUrl: "",
					liveDemoUrl: "https://tabula-rasa.propdev.xyz/",
					videoDemoUrl: "",
					confidential: true,
				},
				{
					id: 7,
					name: "Media Production Directory",
					description:
						"An AU-based film, TV, and media industry directory website. Revamped old website using Vue/Nuxt 3 to modernize design, improve functionality, and boost performance.",
					languages: ["Vue", "Nuxt 3"],
					githubUrl: "",
					liveDemoUrl: "https://productionbook.com.au/",
					videoDemoUrl: "",
					confidential: true,
				},
				{
					id: 8,
					name: "Video Game News Portal",
					description:
						"A news website for video games with reviews and insights for an AU-based video-game focused company. Developed using WordPress/PHP, Tailwind for styling and GSAP for animations.",
					languages: ["WordPress", "PHP", "Tailwind", "GSAP"],
					githubUrl: "",
					liveDemoUrl: "https://thisweekinvideogames.com/",
					videoDemoUrl: "",
					confidential: true,
				},
				{
					id: 9,
					name: "Networking Products E-commerce Site",
					description:
						"An e-commerce platform for networking hardware showcasing products and support, built and maintained with Shopify.",
					languages: ["Shopify"],
					githubUrl: "",
					liveDemoUrl: "https://linksys.com/",
					videoDemoUrl: "",
					confidential: true,
				},
				{
					id: 10,
					name: "Automotive Advertorial Campaign",
					description:
						"Branded web articles published on a major business and financial news outlet. Built as a lightweight static project, enhanced with GSAP animations.",
					languages: ["JavaScript", "GSAP"],
					githubUrl: "",
					liveDemoUrl:
						"https://www.cnbc.com/advertorial/start-your-impossible/",
					videoDemoUrl: "",
					confidential: true,
				},
				{
					id: 11,
					name: "Financial Services Website",
					description:
						"A corporate site highlighting services, team, and global reach for an Sydney-based investment management firm, created with WordPress CMS and GSAP for interactive elements.",
					languages: ["WordPress", "GSAP"],
					githubUrl: "",
					liveDemoUrl: "https://taurusfunds.com.au/",
					videoDemoUrl: "",
					confidential: true,
				},
			],
		};
	},
};
</script>
