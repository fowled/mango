import { createRouter, createWebHistory } from "vue-router";
import { createApp } from "vue";

import Dashboard from "routes/Dashboard.vue";
import Privacy from "routes/Privacy.vue";
import Manage from "routes/Manage.vue";
import Terms from "routes/Terms.vue";
import Home from "routes/Home.vue";

import App from "App.vue";

const routes = [
	{ path: "/", component: Home },
	{ path: "/dashboard", component: Dashboard },
	{ path: "/manage/:guildId", component: Manage },
	{ path: "/terms", component: Terms },
	{ path: "/privacy-policy", component: Privacy }
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});

createApp(App).use(router).mount("#app");

for (let index = 0; index < 10; index++) {
	console.log("%cBe careful!", "color: yellow; font-size: 40px");
	console.log("%cGiving attackers your session identifier could lead in your Discord account being hacked. Don't paste any code here.", "color: red; font-size: 20px");
	console.log("%cPlease close this window to stay safe. If you've made a mistake, revoke Mango's access inside SETTINGS > AUTHORIZED APPS > 'Deauthorize Mango'.", "font-size: 20px");
}