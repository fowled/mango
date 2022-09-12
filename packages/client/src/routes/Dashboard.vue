<script setup lang="ts">
import Navbar from "lib/Navbar.vue";
import Footer from "lib/Footer.vue";

import { getGuilds } from "shared/requests";

const guilds = await getGuilds();

if (!guilds[0]) {
	window.location.href = import.meta.env.VITE_REDIRECT_URI;
}
</script>

<template>
	<Navbar />

	<section id="dashboard" class="dark:text-white container mx-auto text-center mt-12">
		<p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">Select a server to get started!</p>

		<ul class="flex flex-wrap flex-col sm:flex-row justify-center mx-auto sm:gap-x-12 mt-14 sm:space-x-4 space-x-0 sm:space-y-0 pb-12">
			<router-link v-for="guild in guilds" :to="`manage/${guild.id}`">
				<li class="transition transform sm:hover:-translate-y-1 pb-14 space-y-4">
					<img alt="guild's icon" class="w-48 h-48 mx-auto rounded-full" :src="guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256` : '/assets/discord_default.png'" />

					<div class="text-lg leading-6 font-medium space-y-1">
						<h3>{{ guild.name }}</h3>

						<p class="text-indigo-600">{{ guild.bot ? "Configure server" : "Invite Mango" }}</p>
					</div>
				</li>
			</router-link>
		</ul>
	</section>

	<Footer />
</template>
