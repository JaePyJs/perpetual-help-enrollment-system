"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the table of contents page
    router.push("/table-of-contents");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          Redirecting to Table of Contents...
        </h1>
        <p>Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
