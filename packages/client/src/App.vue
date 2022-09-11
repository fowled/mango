<script setup lang="ts">
import Spinner from "lib/Spinner.vue";

import Navbar from "lib/Navbar.vue";
import Footer from "lib/Footer.vue";

import "./style/index.css";
</script>

<template>
	<router-view v-slot="{ Component }">
		<Suspense timeout="0">
			<Navbar />
		</Suspense>
		
		<Suspense timeout="0">
			<template #default>
				<component :is="Component" />
			</template>

			<template #fallback>
				<Spinner spin-height="h-10" div-height="h-[100vh]" />
			</template>
		</Suspense>

		<Footer />
	</router-view>
</template>
