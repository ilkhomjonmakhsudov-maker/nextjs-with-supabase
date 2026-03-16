import AppLayout from "@/components/layout/AppLayout";

export default function AppLayoutRoot({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayout>{children}</AppLayout>;
}
