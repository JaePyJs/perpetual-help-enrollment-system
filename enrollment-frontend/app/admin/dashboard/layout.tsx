import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Perpetual Help College of Manila",
  description: "Administrative dashboard for managing the enrollment system",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
