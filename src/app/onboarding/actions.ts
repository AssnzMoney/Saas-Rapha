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
    // O trigger do Supabase já cria o profile, então devemos fazer um UPDATE em vez de INSERT
    const { error: profileError } = await supabaseServer
      .from("profiles")
      .update({
        tenant_id: tenant.id,
        role: "admin",
      })
      .eq('user_id', user.id)
      .is('tenant_id', null);

    if (profileError) {
      console.error("ERRO AO ATUALIZAR PROFILE:", profileError);
      throw new Error(`Erro ao vincular loja: ${profileError.message}`);
    }

    redirect("/admin");
  } else {
    throw new Error("Failed to create tenant");
  }
}
