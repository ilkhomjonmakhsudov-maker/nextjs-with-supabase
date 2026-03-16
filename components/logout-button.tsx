"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function LogoutButton() {
  const router = useRouter();
  const { signOut } = useAuth();

  const logout = async () => {
    await signOut();
    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
