<script lang="ts">
	import { Github, Twitter } from "@steeze-ui/feather-icons";
	import { Icon } from "@steeze-ui/svelte-icon";
</script>

<section class="text-gray-700 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-800 border-gray-200">
	<div class="container flex flex-col items-center px-8 py-8 mx-auto max-w-7xl sm:flex-row">
		<span class="flex flex-row">
			<img alt="mango's logo" src="/assets/mango.png" class="h-10" />
			<span class="self-center text-lg font-semibold whitespace-nowrap dark:text-white ml-3">Mango</span>
		</span>

		<p class="mt-4 text-sm text-gray-500 dark:text-gray-400 sm:ml-4 sm:pl-4 sm:border-l sm:border-gray-200 dark:sm:border-gray-600 sm:mt-0">© 2022 - Mango</p>

		<span class="inline-flex mt-4 space-x-2 sm:ml-auto sm:mt-0 sm:justify-start max-w-fit">
			<a href="https://twitter.com/playboifowled">
				<Icon src={Twitter} class="h-6 w-6 text-neutral-300" />
			</a>

			<a href="https://github.com/fowled">
				<Icon src={Github} class="h-6 w-6 text-neutral-300" />
			</a>
		</span>
	</div>
</section>
