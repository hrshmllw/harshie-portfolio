<template>
	<section class="lg:h-max">
		<!-- Other content here -->
		<div class="container p-8 mx-auto text-center dark:text-gray-200">
			<h2 class="text-4xl font-bold sm:text-5xl mt-20 lg:mt-32">
				Projects
			</h2>
		</div>

		<!-- Iterating through projectItems using v-for -->
		<div v-for="(project, index) in projectItems" :key="project.id">
			<div
				:class="[
					'container',
					'max-w-xs',
					'sm:max-w-xl',
					'md:max-w-2xl',
					'lg:max-w-4xl',
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
							'font-bold',
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
					<a :href="project.demoUrl" class="text-2xl font-bold">{{
						project.name
					}}</a>
					<p class="mt-2">{{ project.description }}</p>
				</div>
				<div class="flex items-center justify-end mt-4">
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
						GitHub
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
					name: "Video Conference App",
					description:
						"A video conference web application created for our thesis project, proposed as an alternative app for online classes. With facial recognition using the face_recognition Python library, eye-tracking via MediaPipe for JavaScript, and attendance-taking functionalities. The video conferencing function was implemented through Agora SDK.",
					languages: ["JavaScript", "Python"],
					githubUrl:
						"https://github.com/hrshmllw/video-conference-app",
					liveDemoUrl: "",
					videoDemoUrl: "",
				},
				{
					id: 2,
					name: "TaskMate",
					description:
						"A simple task management web application with to-do list, note-taking, and calendar functionalities. Currently planning on doing a revamp on this project using newly learned frameworks.",
					languages: ["JavaScript", "PHP"],
					githubUrl: "https://github.com/hrshmllw/task-mate",
					liveDemoUrl: "",
					videoDemoUrl: "",
				},
			],
		};
	},
};
</script>
