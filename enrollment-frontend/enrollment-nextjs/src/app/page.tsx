"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the Shadcn UI demo page
    router.push("/shadcn-demo");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          Redirecting to Shadcn UI Demo...
        </h1>
        <p>Please wait while we redirect you to the demo page.</p>
      </div>
    </div>
  );
}
