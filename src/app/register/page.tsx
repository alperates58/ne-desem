import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AppShell>
      <div className="grid min-h-[calc(100vh-180px)] place-items-center">
        <AuthForm mode="register" />
      </div>
    </AppShell>
  );
}
