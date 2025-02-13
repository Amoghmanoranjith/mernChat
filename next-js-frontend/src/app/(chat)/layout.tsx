import { Navbar } from "@/components/navbar/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chats - Mernchat",
  description: "Chat with your friends in real-time on Mernchat. Send messages, share media, and stay connected.",
  keywords: [
    "Mernchat chat",
    "real-time messaging",
    "chat with friends",
    "instant messaging",
    "secure chat platform"
  ],
  openGraph: {
    title: "Chats - Mernchat",
    description: "Chat with your friends in real-time on MernChat. Send messages, share media, and stay connected.",
    url: "https://mernchat.in/chat",
    siteName: "Mernchat",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Chats - Mernchat",
    description: "Chat with your friends in real-time on MernChat. Send messages, share media, and stay connected.",
  },
};

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
