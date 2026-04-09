"use server";

import { auth } from "@/auth";
import { dataService } from "./data-service";
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
  
  let epitaph = formData.get("epitaph") as string;
  if (!epitaph) {
    epitaph = await generateEpitaph(name, cause, personality);
  }

  const avatar_url = await generateAvatar(name, cause, personality);

  const res = await dataService.createTomb({
    owner_gh_user: (session.user as any).username || (session.user as any).name,
    lobster_name: name,
    cause_of_death: cause,
    personality_tags: [personality],
    epitaph,
    avatar_url,
    died_at: died_at || new Date().toISOString().split('T')[0],
  });

  revalidatePath("/cemetery/all");
  redirect(`/tomb/${res.id}`);
}

export async function generateAIEpitaphAction(name: string, cause: string, personality: string) {
  return await generateEpitaph(name, cause, personality);
}

export async function getMeritTextsAction() {
  return await getDynamicMeritTexts();
}

export async function incrementMeritAction(val = 1) {
  await dataService.incrementMerit(val);
}

export async function getGlobalStatsAction() {
  return await dataService.getGlobalStats();
}

export async function addIncenseAction(tombId: string, logData: any) {
  await dataService.addIncense(tombId, logData);
  revalidatePath(`/tomb/${tombId}`);
}

export async function addGiftAction(tombId: string, giftData: any) {
  await dataService.addGift(tombId, giftData);
  revalidatePath(`/tomb/${tombId}`);
}
