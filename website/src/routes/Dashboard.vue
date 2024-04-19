<script setup lang="ts">
import { onMounted, ref, toRaw } from "vue";

import Navbar from "components/Navbar.vue";
import Footer from "components/Footer.vue";

import { filterGuilds } from "lib/fetchData";
import { session } from "lib/sessionManager";
import { supabase } from "lib/supabase";

import { PartialGuild } from "types/interfaces";

if (!session.value?.provider_token) {
	await supabase.auth.signInWithOAuth({ provider: "discord" });
}

const guilds = ref(session.value?.user.user_metadata.guilds as PartialGuild[]);

const loading = ref(false);

if (!guilds) {
	window.location.href = import.meta.env.VITE_REDIRECT_URI;
}

onMounted(async () => {
	await refreshGuildsList(true);
});

async function refreshGuildsList(silent: boolean) {
	!silent && (loading.value = true);

	const mutualGuildsFromAPI = await filterGuilds();

	if (toRaw(guilds.value).toString() !== mutualGuildsFromAPI.toString()) {
		guilds.value = mutualGuildsFromAPI;

		await supabase.auth.updateUser({ data: { guilds: mutualGuildsFromAPI } });
	}

	!silent && (loading.value = false);
}

console.log(guilds);
</script>

<template>
	<Navbar />

	<section id="dashboard" class="dark:text-white container mx-auto text-center my-12">
		<p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
			{{ guilds.length > 0 ? "Select a server to get started!" : "Add Mango to a server you manage!" }}
		</p>

		<ul
			v-if="guilds.length > 0"
			class="flex flex-wrap flex-col sm:flex-row justify-center mx-auto sm:gap-x-12 my-14 sm:space-x-4 space-x-0 sm:space-y-0"
		>
			<router-link
				v-for="guild in guilds"
				:to="`manage/${guild.id}`"
				class="transition transform sm:hover:-translate-y-1 space-y-4"
			>
				<img
					alt="guild's icon"
					class="w-48 h-48 mx-auto rounded-full"
					:src="
						guild.icon
							? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256`
							: '/assets/discord_default.png'
					"
				/>

				<div class="text-lg leading-6 font-medium space-y-1">
					<h3 class="max-w-[175px] text-ellipsis whitespace-nowrap overflow-hidden">{{ guild.name }}</h3>

					<p class="text-indigo-600">Configure server</p>
				</div>
			</router-link>
		</ul>

		<div class="my-14 max-w-fit mx-auto" v-else>
			<a href="https://go.fowled.club/mango" class="space-y-4 transition transform sm:hover:-translate-y-1">
				<img alt="guild's icon" class="w-48 h-48 mx-auto rounded-full" src="/assets/discord_default.png" />

				<div class="text-lg leading-6 font-medium space-y-1">
					<h3>Add Mango</h3>

					<p class="text-indigo-600">To configure</p>
				</div>
			</a>
		</div>

		<button
			v-if="guilds.length > 0"
			@click="refreshGuildsList(false)"
			:class="loading && 'cursor-not-allowed !bg-blue-700 hover:!bg-blue-800 focus:!ring-blue-300'"
			class="text-white bg-green-600 hover:bg-green-700 focus:ring-green-300 focus:ring-4 font-medium rounded-lg text-sm px-5 py-3 text-center md:mr-0"
		>
			{{ loading ? "⌛ Fetching..." : "🔄 Refresh" }}
		</button>
	</section>

	<Footer />
</template>
