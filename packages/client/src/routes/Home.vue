<script setup lang="ts">
import { ShieldCheckIcon, CakeIcon, InformationCircleIcon, CubeIcon, EllipsisHorizontalCircleIcon } from "@heroicons/vue/24/outline";

import { getStats } from "shared/requests";

import { RouterLink } from "vue-router";

const gatherStats = await getStats();

const stats = [
	{ figure: gatherStats.users, description: "Users" },
	{ figure: gatherStats.servers, description: "Servers" },
	{ figure: "4.8/5", description: "Rating" },
];

const features = [
	{
		feature: "Protect your server",
		feature_description: "Thanks to 13 moderation commands, secure your server from malicious users and spambots.",
		icon: ShieldCheckIcon,
		placement: "left",
		opinion: "Honestly not a bad bot at all, awesome functions and it's fast!",
		pfp: "/assets/enzo.jpg",
		name: "Enzo",
	},
	{
		feature: "Birthdays and levels included",
		feature_description: "Add your birthday to the database, start a giveaway, sell items to Mango's marketplace, check the level leaderboard, start a poll or get a random cat picture. Possibilities are endless.",
		icon: CakeIcon,
		placement: "right",
		opinion: "It's difficult to find a more useful bot than Mango, its features are amazing.",
		pfp: "/assets/ilian.jpg",
		name: "Un cochon d'inde",
	},
	{
		feature: "COVID-19 stats and other info",
		feature_description: "Get latest COVID-19 information right from your server, generate an invitation link, set a reminder, check a user's info or get the help message. Wow, almost ran out of characters.",
		icon: InformationCircleIcon,
		placement: "left",
		opinion: "This bot works f**ing amazing. Rated 5 stars on top.gg!",
		pfp: "/assets/nol.jpg",
		name: "Nol",
	},
	{
		feature: "Play games",
		feature_description: "Start a tictactoe or hangman game with your friends in a matter of seconds.",
		icon: CubeIcon,
		placement: "right",
		opinion: "Say goodbye to bots that are each used for one feature, because Mango has them all!",
		pfp: "/assets/pverte.jpg",
		name: "Pverte",
	},
	{
		feature: "... and more",
		feature_description: "Join the support server to request what you'd like to see added to Mango!",
		icon: EllipsisHorizontalCircleIcon,
		placement: "left",
		opinion: "Pro tip: submit your features inside the #ideas channel! <3",
		pfp: "/assets/fowled.png",
		name: "fowled, head developer",
	},
];
</script>

<template>
	<section id="header" class="container px-4 pt-16 lg:pt-24 mx-auto xl:max-w-4xl text-center inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center]">
		<h1 class="text-4xl font-extrabold tracking-tight dark:text-gray-100 text-gray-800 sm:leading-none md:text-5xl lg:text-6xl">Enhance your Discord server with lots of useful features.</h1>

		<h3 class="text-gray-500 dark:text-gray-300 font-normal text-lg my-8">
			Have you ever dreamed of a discord bot that does all the tasks you need to do daily in your Discord server, and without having to pay the premium package? Say hi to Mango. <br />
			<br />
			Introducing the best <code class="text-blue-600">moderation</code>, <code class="text-blue-600">fun</code>, <code class="text-blue-600">economy</code> and <code class="text-blue-600">games</code> commands out there. <br />
			Keep scrolling to find out more about the bot!
		</h3>

		<a href="https://go.fowled.club/mango" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"> Add to your server </a>

		<router-link to="/dashboard" class="text-white bg-gray-800 hover:bg-black focus:ring-4 font-medium rounded-lg text-sm px-5 py-3 text-center md:mr-0 dark:focus:ring-black ml-2">Dashboard</router-link>

		<div class="mt-10 border-t border-gray-200 dark:border-gray-800 text-left flex flex-wrap flex-row space-y-0 space-x-8 md:space-x-16 justify-center max-w-fit mx-auto">
			<div v-for="stat in stats" class="flex flex-col pt-6">
				<h1 class="text-3xl font-bold text-indigo-500">{{ stat.figure }}</h1>
				<h5 class="text-gray-700 dark:text-gray-200">{{ stat.description }}</h5>
			</div>
		</div>
	</section>

	<section id="features" class="relative py-16 overflow-hidden mx-auto space-y-20">
		<div v-for="feature in features" class="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
			<div class="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
				<span class="h-12 w-12 rounded-md flex items-center justify-center bg-indigo-600">
					<component :is="feature.icon" class="h-6 w-6 text-white" aria-hidden="true" />
				</span>

				<div class="mt-6">
					<h2 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">{{ feature.feature }}</h2>
					<p class="mt-4 text-lg text-gray-500 dark:text-gray-400">{{ feature.feature_description }}</p>

					<div class="mt-6">
						<a href="#test" class="inline-flex bg-indigo-600 bg-origin-border px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white"> Get started </a>
					</div>
				</div>

				<div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
					<blockquote>
						<p class="text-base text-gray-500 dark:text-gray-400">&ldquo;{{ feature.opinion }}&rdquo;</p>

						<div class="mt-3 flex items-center space-x-3">
							<div class="flex-shrink-0">
								<img class="h-6 w-6 rounded-full" :src="feature.pfp" alt="pfp" />
							</div>

							<div class="text-base font-medium text-gray-700 dark:text-white">{{ feature.name }}</div>
						</div>
					</blockquote>
				</div>
			</div>

			<div :class="feature.placement === 'left' && 'lg:col-start-1'" class="mt-12 sm:mt-16 lg:mt-0">
				<div :class="feature.placement === 'left' ? 'pl-4 -mr-48 sm:pl-6 md:-mr-16' : 'pr-4 -ml-48 sm:pr-6 md:-ml-16'" class="lg:px-0 lg:m-0 lg:relative lg:h-full">
					<img :class="feature.placement === 'left' ? 'lg:right-0' : 'lg:left-0'" class="w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:right-0 lg:absolute lg:h-full lg:w-auto lg:max-w-none" src="/assets/test.png" alt="Inbox user interface" />
				</div>
			</div>
		</div>
	</section>

	<section id="call-to-action" class="max-w-7xl text-center sm:text-left mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
		<h2 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
			<span class="block">Ready to dive in?</span>
			<span class="block text-indigo-500">Add Mango to your server.</span>
		</h2>

		<div class="mt-8 flex lg:mt-0 lg:flex-shrink-0 justify-center">
			<div class="inline-flex rounded-md shadow">
				<a href="https://go.fowled.club/mango" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"> Add Mango </a>
			</div>

			<div class="ml-3 inline-flex rounded-md shadow">
				<a href="https://discord.gg/9aT626ABdq" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"> Join server </a>
			</div>
		</div>
	</section>
</template>
