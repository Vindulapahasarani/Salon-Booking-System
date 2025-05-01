'use client';

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedAdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not logged in or not an admin, redirect
    if (user && !user.isAdmin) {
      router.replace("/"); // Or redirect to /login if preferred
    }
  }, [user, router]);

  if (!user || !user.isAdmin) {
    return <p className="p-4">Checking access...</p>;
  }

  return <>{children}</>;
}
