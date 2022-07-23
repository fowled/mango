<script lang="ts">
	import { Router, Route } from "svelte-routing";

	import Dashboard from "routes/Dashboard.svelte";
	import Manage from "routes/Manage.svelte";
	import Home from "./routes/Home.svelte";

	import Footer from "lib/Footer.svelte";
	import Navbar from "lib/Navbar.svelte";
</script>

<Router>
	<Navbar />

	<Route path="/" component={Home} />
	<Route path="/dashboard" component={Dashboard} />
	<Route path="/manage/:guildId" component={Manage} />

	<Footer />
</Router>
