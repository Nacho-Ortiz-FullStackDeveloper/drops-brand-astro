import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadProductImage(supabase: SupabaseClient, file: File) {
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from("products").getPublicUrl(filePath);

  return data.publicUrl;
}
