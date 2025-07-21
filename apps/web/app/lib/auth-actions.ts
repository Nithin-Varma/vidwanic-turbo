"use server";

import { signIn, signOut } from "../../auth";

export async function handleSignIn() {
  await signIn(undefined, { redirectTo: "/" });
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}

export async function handleGoogleSignIn() {
  await signIn("google", { 
    redirectTo: "/",
    redirect: true 
  });
}

export async function handleGitHubSignIn() {
  await signIn("github", { 
    redirectTo: "/",
    redirect: true 
  });
}