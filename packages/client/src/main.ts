import App from "./App.svelte";

import { manageTheme } from "scripts/theme";

import "style/app.css";

const app = new App({
	target: document.getElementById("app"),
});

manageTheme();

for (let index = 0; index < 10; index++) {
	console.log("%cBe careful!", "color: yellow; font-size: 40px");
	console.log("%cGiving attackers your session identifier could lead in your Discord account being hacked. Don't paste any code here.", "color: red; font-size: 20px");
	console.log("%cPlease close this window to stay safe. If you've made a mistake, revoke Mango's access inside SETTINGS > AUTHORIZED APPS > 'Deauthorize Mango'.", "font-size: 20px");
}

export default app;
