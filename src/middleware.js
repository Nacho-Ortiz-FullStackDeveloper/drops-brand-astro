import { defineMiddleware } from "astro:middleware";
import { createServerSupabaseClient } from "./lib/supabaseServer.js";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url } = context;

  // Proteger rutas admin, excepto login
  if (url.pathname.startsWith("/admin") && url.pathname !== "/admin/login") {
    const supabase = createServerSupabaseClient(context);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return context.redirect("/admin/login");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      return context.redirect("/");
    }
  }

  // Proteger VIP: solo usuarios logueados
  if (url.pathname.startsWith("/vip")) {
    const supabase = createServerSupabaseClient(context);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return context.redirect("/auth");
    }
  }

  return next();
});
