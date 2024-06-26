<script setup lang="ts">
import { ArrowRightOnRectangleIcon } from "@heroicons/vue/24/outline";
import { onMounted } from "vue";

import { session } from "lib/sessionManager";
import { supabase } from "lib/supabase";

import { manageTheme } from "scripts/theme";

import { router } from "main";

const user = session.value?.user;

const navigation = [
    { name: "Features", link: "/#features" },
    { name: "Support server", link: "https://discord.gg/9aT626ABdq" },
    { name: "Repository", link: "https://github.com/fowled/mango" },
    { name: "Upvote", link: "https://top.gg/bot/497443144632238090" },
];

async function login() {
    await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: { scopes: "identify guilds" },
    });
}

async function logout() {
    await supabase.auth.signOut();

    return router.go(0);
}

onMounted(async () => {
    manageTheme();
});
</script>

<template>
	<nav class="max-w-7xl mx-auto bg-transparent border-gray-200 dark:border-gray-800 border-b px-2 sm:px-4 py-6 rounded">
		<div class="container flex flex-wrap justify-between items-center">
			<router-link to="/" class="flex">
				<img alt="mango's logo" src="/assets/mango.png" class="w-5 mx-2.5" />
				<span class="self-center text-lg font-semibold whitespace-nowrap dark:text-white">Mango</span>
			</router-link>

			<div class="flex">
				<div class="hidden lg:visible justify-between items-center w-full lg:flex lg:w-auto border-r pr-6 border-gray-200 dark:border-gray-800">
					<ul class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-semibold">
						<li v-for="element in navigation">
							<a
								:href="element.link"
								class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
							>
								{{ element.name }}
							</a>
						</li>
					</ul>
				</div>

				<button id="theme-toggle" type="button" class="ml-3 text-blue-800 dark:text-yellow-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-2">
					<svg id="theme-toggle-dark-icon" class="hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
					</svg>

					<svg id="theme-toggle-light-icon" class="hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
					</svg>
				</button>

				<div v-if="user?.aud === 'authenticated'" class="flex flex-row space-x-3">
					<img alt="user's avatar" :src="user.user_metadata.avatar_url + '?size=256'" class="h-10 rounded-full" />

					<h1 class="flex items-center dark:text-gray-300">{{ user.user_metadata.full_name }}</h1>

					<span @click="logout" class="my-auto">
						<ArrowRightOnRectangleIcon class="self-center h-6 w-6 cursor-pointer dark:text-white" />
					</span>
				</div>

				<div v-else class="self-center">
					<button @click="login">
						<p class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"> Login </p>
					</button>
				</div>
			</div>
		</div>
	</nav>
</template>
