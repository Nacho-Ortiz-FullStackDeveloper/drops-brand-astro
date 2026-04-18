import { createServerClient } from "@supabase/ssr";

export async function onRequest(context, next) {
  const { request, cookies } = context;

  const url = new URL(request.url);

  // solo proteger rutas /admin (menos login)
  if (url.pathname.startsWith("/admin") && url.pathname !== "/admin/login") {
    const supabase = createServerClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookies.get(name)?.value;
          },
        },
      },
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // si no hay sesión → redirige
    if (!session) {
      return Response.redirect(new URL("/admin/login", request.url));
    }
  }

  return next();
}
