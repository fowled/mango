<script lang="ts">
	import { Transition } from "@rgossiaux/svelte-headlessui";
	import { ExclamationCircle } from "@steeze-ui/heroicons";
	import { Icon } from "@steeze-ui/svelte-icon";

	import { navigate } from "svelte-routing";

	import Spinner from "lib/Spinner.svelte";
	import { getGuildInfo } from "shared/requests";

	import type { ManageGuild } from "interfaces/manage";

	export let guildId: string;

	let formData = {} as ManageGuild;

	const fetchQuote = async () => {
		const quote = await fetch("https://api.quotable.io/random").then((res) => res.json());
		const user = await fetch("https://random-data-api.com/api/users/random_user").then((res) => res.json());

		formData.quote = { content: quote.content, length: quote.content.length, maxLength: 200 };
		formData.welcome = { content: user.uid, length: user.uid.length, maxLength: 200 };
	};

	const fetchGuild = async () => {
		const guild = await getGuildInfo(guildId);

		if (!guild.name) {
			return (window.location.href = import.meta.env.VITE_REDIRECT_URI);
		}

		return guild;
	};

	const fetchStats = async () => {
		const data = await fetchGuild();

		return [
			{ name: "Members", stat: data.memberCount },
			{ name: "Channels", stat: data.channels?.length },
			{ name: "Created on", stat: new Date(data.createdTimestamp).toLocaleDateString() },
		];
	};

	const forms = [{ name: "quote" }, { name: "welcome" }];

	let banner = false;

	const handleChange = async (event: Event) => {
		const target = event.target as HTMLTextAreaElement;

		formData[target.name] = {
			...formData[target.name],
			content: target.value,
			length: target.value.length,
		};

		banner = true;
	};

	const resetChanges = async () => {
		return navigate(`/manage/${guildId}`);
	};

	const saveChanges = async () => {
		banner = false;
	};
</script>

<section id="manage" class="dark:text-white container mx-auto text-center mt-12">
	{#await fetchGuild()}
		<Spinner divHeight="h-10" spinHeight="h-10" />
	{:then guild}
		<p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl space-x-3">
			Manage • <span class="text-indigo-500">{guild.name}</span>
			<img alt="guild's icon" class="w-16 inline-block rounded-full" src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256` : "/assets/discord_default.png"} />
		</p>

		<dl class="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 max-w-fit sm:max-w-2xl mx-auto">
			{#await fetchStats()}
				<Spinner divHeight="h-10" spinHeight="h-10" />
			{:then stats}
				{#each stats as item}
					<div class="sm:block px-4 py-5 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden sm:p-6">
						<dt class="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">{item.name}</dt>
						<dd class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{item.stat}</dd>
					</div>
				{/each}
			{/await}
		</dl>

		<p class="my-10 max-w-2xl text-lg text-gray-500 dark:text-gray-200 mx-auto">✨ This page isn't finished yet. Enjoy this quote in the meantime!</p>

		<div class="flex flex-row space-x-4 sm:max-w-3xl mx-auto my-6 justify-center">
			{#await fetchQuote()}
				<Spinner divHeight="h-10" spinHeight="h-10" />
			{:then}
				{#each forms as form}
					<div class="space-y-2">
						<span class="block text-sm">
							{form.name} • {formData[form.name].length}/{formData[form.name].maxLength}
						</span>

						<textarea
							name={form.name}
							value={formData[form.name].content}
							on:input={handleChange}
							spellCheck={false}
							maxLength={formData[form.name].maxLength}
							class="h-40 resize-none text-sm p-3 overflow-hidden focus:outline-none shadow-sm rounded-md dark:bg-slate-800 dark:ring-0"
						/>
					</div>
				{/each}
			{/await}
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
	{/await}
</section>
