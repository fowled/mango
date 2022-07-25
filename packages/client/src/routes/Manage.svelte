<script lang="ts">
	import { Transition } from "@rgossiaux/svelte-headlessui";
	import { ExclamationCircle } from "@steeze-ui/heroicons";
	import { Icon } from "@steeze-ui/svelte-icon";
	import { onMount } from "svelte";

	import Spinner from "lib/Spinner.svelte";

	import { getGuildInfo } from "shared/requests";

	import type { Guild } from "interfaces/interfaces";

	export let guildId: string;

	let banner = false,
		forms: { name: string; content: string; default: string; maxLength: number }[] = [],
		guild: Guild,
		stats: { name: string; stat: string | number }[];

	const handleChange = () => {
		let sameContent = true;

		for (const form of forms) {
			if (form.content !== form.default) {
				sameContent = false;
			}
		}

		if (sameContent === true) {
			return (banner = false);
		} else {
			return (banner = true);
		}
	};

	const resetChanges = () => {
		for (const form of forms) {
			form.content = form.default;
		}

		forms = forms;

		return (banner = false);
	};

	const saveChanges = async () => {
		banner = false;
	};

	onMount(async () => {
		const quote = await fetch("https://api.quotable.io/random").then((res) => res.json());
		const content = quote.content;

		forms = [
			{ name: "quote", content, default: content, maxLength: 200 },
			{ name: "yes", content: quote.content, default: content, maxLength: 250 },
		];

		guild = await getGuildInfo(guildId);

		if (!guild.name) {
			return (window.location.href = import.meta.env.VITE_REDIRECT_URI);
		}

		stats = [
			{ name: "Members", stat: guild.memberCount },
			{ name: "Channels", stat: guild.channels?.length },
			{ name: "Created on", stat: new Date(guild.createdTimestamp).toLocaleDateString() },
		];
	});
</script>

<section id="manage" class="dark:text-white container mx-auto text-center mt-12">
	{#if guild}
		<p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl space-x-3">
			Manage • <span class="text-indigo-500">{guild.name}</span>
			<img alt="guild's icon" class="w-16 inline-block rounded-full" src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256` : "/assets/discord_default.png"} />
		</p>

		<dl class="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 max-w-fit sm:max-w-2xl mx-auto">
			{#each stats as item}
				<div class="sm:block px-4 py-5 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden sm:p-6">
					<dt class="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">{item.name}</dt>
					<dd class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{item.stat}</dd>
				</div>
			{:else}
				<Spinner divHeight="h-10" spinHeight="h-10" />
			{/each}
		</dl>
	{:else}
		<Spinner divHeight="h-10" spinHeight="h-10" />
	{/if}

	<p class="my-10 max-w-2xl text-lg text-gray-500 dark:text-gray-200 mx-auto">✨ This page isn't finished yet. Enjoy this quote in the meantime!</p>

	<div class="flex flex-row space-x-4 sm:max-w-3xl mx-auto my-6 justify-center">
		{#each forms as form}
			<div class="space-y-2">
				<span class="block text-sm">
					{form.name} • {form.content.length}/{form.maxLength}
				</span>

				<textarea name={form.name} bind:value={form.content} on:input={handleChange} spellCheck={false} maxLength={form.maxLength} class="h-40 resize-none text-sm p-3 overflow-hidden focus:outline-none shadow-sm rounded-md dark:bg-slate-800 dark:ring-0" />
			</div>
		{/each}
	</div>

	<Transition
		show={banner}
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
					<Icon src={ExclamationCircle} class="h-6 w-6 text-white" aria-hidden="true" />
				</span>

				<p class="ml-3 font-medium text-white truncate">You have unsaved changes!</p>
			</div>

			<span class="sm:flex cursor-pointer hidden order-3 items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white" on:click={resetChanges} role="button" tabIndex={0}> Reset </span>

			<span class="flex cursor-pointer ml-2 order-4 items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50" on:click={saveChanges} role="button" tabIndex={0}> Save changes </span>
		</div>
	</Transition>
</section>
