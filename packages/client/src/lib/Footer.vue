<script setup lang="ts">
import feather from "vue-feather";
</script>

<template>
    <section
        class="text-gray-700 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-800 border-gray-200 max-w-7xl mx-auto">
        <div class="container flex flex-col items-center px-8 py-8 sm:flex-row">
            <span class="flex flex-row">
                <img alt="mango's logo" src="/assets/mango.png" class="h-10" />
                <span class="self-center text-lg font-semibold whitespace-nowrap dark:text-white ml-3">Mango</span>
            </span>

            <p
                class="mt-4 text-sm text-gray-500 dark:text-gray-400 sm:ml-4 sm:pl-4 sm:border-l sm:border-gray-200 dark:sm:border-gray-600 sm:mt-0">
                © 2022 - Mango » <RouterLink to="/terms" class="text-blue-400">terms of service</RouterLink> &
                <RouterLink to="/privacy-policy" class="text-blue-400">privacy policy</RouterLink>
            </p>

            <span class="inline-flex mt-4 space-x-2 sm:ml-auto sm:mt-0 sm:justify-start max-w-fit">
                <a href="https://twitter.com/playboifowled">
                    <feather type="twitter" class="text-gray-100" />
                </a>

                <a href="https://github.com/fowled">
                    <feather type="github" class="text-gray-100" />
                </a>
            </span>
        </div>
    </section>
</template>
