<script setup lang="ts">
import { ExclamationCircleIcon } from "@heroicons/vue/24/outline";
import { TransitionRoot } from "@headlessui/vue";
import { useRoute } from "vue-router";
import { reactive, ref } from "vue";

import { fetchGuild } from "lib/fetchData";

const route = useRoute();

const guild = await fetchGuild(route.params.guildId as string);

const stats = [
	{ name: "Members", stat: guild.memberCount },
	{ name: "Channels", stat: guild.channels?.length },
	{ name: "Created on", stat: new Date(guild.createdTimestamp).toLocaleDateString() },
];

const showBanner = ref(false);

/* const forms = reactive([
	{ name: "birthdays", content: guild.birthdays, maxLength: 200 },
	{ name: "welcome", content: guild.welcome, maxLength: 250 },
]);

const handleChange = () => {
	let areFormsEqual = true;

	forms.forEach(async (form) => {
		if (form.content !== guild[form.name as keyof typeof guild.bot]) {
			return (areFormsEqual = false);
		}
	});

	return areFormsEqual ? (showBanner.value = false) : (showBanner.value = true);
};

const resetChanges = () => {
	forms.forEach((form) => {
		form.content = guild[form.name as keyof typeof guild.bot];
	});

	return (showBanner.value = false);
};

const saveChanges = () => {
	return (showBanner.value = false);
}; */
</script>

<template>
	<section id="manage" class="dark:text-white container mx-auto text-center mt-12">
		<p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl space-x-3">
			Manage • <span class="text-indigo-500">{{ guild.name }}</span>

			<img alt="guild's icon" class="w-16 inline-block rounded-full" :src="guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256` : '/assets/discord_default.png'" />
		</p>

		<dl class="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 max-w-fit sm:max-w-2xl mx-auto">
			<div v-for="stat in stats" class="sm:block px-4 py-5 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden sm:p-6">
				<dt class="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">{{ stat.name }}</dt>
				<dd class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{{ stat.stat }}</dd>
			</div>
		</dl>

		<!-- <div class="flex flex-row space-x-4 sm:max-w-3xl mx-auto my-6 justify-center">
			<div v-for="form in forms" class="space-y-2">
				<span class="block text-sm"> {{ form.name }} • {{ form.content!.length }}/{{ form.maxLength }} </span>

				<textarea :name="form.name" @input="handleChange" v-model="form.content" :spellCheck="false" :maxLength="form.maxLength" class="h-40 resize-none text-sm p-3 overflow-hidden focus:outline-none shadow-sm rounded-md dark:bg-slate-800 dark:ring-0" />
			</div>
		</div>

		<transition-root
			:show="showBanner"
			enter="transition duration-700 transform"
			enterFrom="translate-y-full"
			enterTo="translate-y-0"
			leave="transition duration-700 transform"
			leaveFrom="translate-y-0"
			leaveTo="translate-y-full"
			class="bottom-0 fixed inset-x-0 pb-2 sm:pb-5 max-w-5xl mx-auto px-2 sm:px-6 lg:px-8"
		>
			<div class="p-2 rounded-lg bg-indigo-600 shadow-lg sm:p-3 flex items-center justify-between flex-wrap">
				<div class="w-0 flex-1 flex items-center">
					<span class="flex p-2 rounded-lg bg-indigo-800">
						<ExclamationCircleIcon class="h-6 w-6 text-white" />
					</span>

					<p class="ml-3 font-medium text-white truncate">You have unsaved changes!</p>
				</div>

				<span class="sm:flex cursor-pointer hidden order-3 items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white" @click="resetChanges" role="button"> Reset </span>

				<span class="flex cursor-pointer ml-2 order-4 items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50" @click="saveChanges" role="button"> Save changes </span>
			</div>
		</transition-root> -->
	</section>
</template>