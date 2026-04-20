import { defineMiddleware } from "astro:middleware";
import { createServerSupabaseClient } from "./lib/supabaseServer.js";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url } = context;

  // Proteger solo rutas admin, excepto login
  if (url.pathname.startsWith("/admin") && url.pathname !== "/admin/login") {
    const supabase = createServerSupabaseClient(context);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return context.redirect("/admin/login");
    }
  }

  return next();
});
