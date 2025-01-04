export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
    <h1>Auth layout</h1>
    {children}
    </>
  );
}
