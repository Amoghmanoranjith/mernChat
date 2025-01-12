import { Navbar } from "@/components/navbar/Navbar";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="h-[calc(100vh-3.5rem)]">{children}</main>
    </>
  );
}
