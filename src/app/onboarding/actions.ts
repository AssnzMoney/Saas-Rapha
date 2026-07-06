"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createTenant(formData: FormData) {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = formData.get("storeName") as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 1000);

  // Create the tenant
  const { data: tenant, error: tenantError } = await supabaseServer
    .from("tenants")
    .insert({ name, slug })
    .select()
    .single();

  if (!tenantError && tenant) {
    // Create the user profile linked to this tenant
    await supabaseServer
      .from("profiles")
      .insert({
        user_id: user.id,
        tenant_id: tenant.id,
        role: "admin",
      });

    redirect("/admin");
  } else {
    throw new Error("Failed to create tenant");
  }
}
