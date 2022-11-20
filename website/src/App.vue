<script setup lang="ts">
import Spinner from "components/Spinner.vue";

import "./style/index.css";
</script>

<template>
	<router-view v-slot="{ Component }">
		<Suspense timeout="0">
			<component :is="Component" />

			<template #fallback>
				<Spinner spin-height="h-10" div-height="h-[100vh]" />
			</template>
		</Suspense>
	</router-view>
</template>
