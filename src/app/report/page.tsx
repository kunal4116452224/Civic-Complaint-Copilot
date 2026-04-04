"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ReportFlow } from "@/components/ReportFlow";

export default function ReportPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.ready && auth.isLoggedIn && auth.userRole === "admin") {
      router.replace("/dashboard");
    }
  }, [auth.ready, auth.isLoggedIn, auth.userRole, router]);

  if (auth.userRole === "admin") return null;

  return <ReportFlow />;
}
