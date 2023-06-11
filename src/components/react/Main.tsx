export default function Main({ children }: { children?: React.ReactNode }) {
  return (
    <main className="p-4">
      <div className="mx-auto max-w-screen-sm">{children}</div>
    </main>
  );
}
