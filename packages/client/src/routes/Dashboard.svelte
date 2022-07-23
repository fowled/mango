<script lang="ts">
	import { Link } from "svelte-routing";

	import { getGuilds } from "shared/requests";

	import Spinner from "lib/Spinner.svelte";

	const fetchData = async () => {
		let guilds = await getGuilds();

		if (!guilds.authed) {
			return (window.location.href = import.meta.env.VITE_REDIRECT_URI);
		}

		return guilds;
	};
</script>

<section id="dashboard" class="dark:text-white container mx-auto text-center mt-12">
	<p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">Select a server to get started!</p>

	<ul class="flex flex-wrap flex-col sm:flex-row justify-center mx-auto sm:gap-x-12 mt-14 sm:space-x-4 space-x-0 sm:space-y-0 pb-12">
		{#await fetchData()}
			<Spinner divHeight="h-10" spinHeight="h-10" />
		{:then dash}
			{#each dash.guilds as guild}
				<Link to={`/manage/${guild?.id}`}>
					<li class="transition transform sm:hover:-translate-y-1 pb-14 space-y-4">
						<img alt="guild's icon" class="w-48 h-48 mx-auto rounded-full" src={guild?.icon ? `https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}.png?size=256` : "/assets/discord_default.png"} />

						<div class="text-lg leading-6 font-medium space-y-1">
							<h3>{guild?.name}</h3>

							<p class="text-indigo-600">{guild?.bot ? "Configure server" : "Invite Mango"}</p>
						</div>
					</li>
				</Link>
			{/each}
		{/await}
	</ul>
</section>
