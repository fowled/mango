import { ref } from "vue";

import { supabase } from "./supabase";

import type { Session } from "@supabase/supabase-js";

export const session = ref<Session | null>();

const fetchSession = await supabase.auth.getSession();

if (!fetchSession.error) {
    session.value = fetchSession.data.session;
}

supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
});
