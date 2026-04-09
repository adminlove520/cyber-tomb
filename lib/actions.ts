"use server";

import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { generateEpitaph, generateAvatar, getDynamicMeritTexts } from "@/lib/ai";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTomb(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const cause = formData.get("cause") as string;
  const personality = formData.get("personality") as string;
  const died_at = formData.get("died_at") as string;
  
  // Optional: Generate AI content if requested
  let epitaph = formData.get("epitaph") as string;
  if (!epitaph) {
    epitaph = await generateEpitaph(name, cause, personality);
  }

  // Handle Avatar (Pre-defined or generated)
  const avatar_url = await generateAvatar(name, cause, personality);

  const { data, error } = await supabase.from("tombs").insert({
    owner_gh_user: (session.user as any).username,
    lobster_name: name,
    cause_of_death: cause,
    personality_tags: [personality],
    epitaph,
    avatar_url,
    died_at: died_at || new Date().toISOString().split('T')[0],
  }).select().single();

  if (error) throw error;

  // Increment global tomb count
  await supabase.rpc('increment_tomb_count');

  revalidatePath("/cemetery/all");
  redirect(`/tomb/${data.id}`);
}

export async function generateAIEpitaphAction(name: string, cause: string, personality: string) {
  return await generateEpitaph(name, cause, personality);
}

export async function getMeritTextsAction() {
  return await getDynamicMeritTexts();
}
