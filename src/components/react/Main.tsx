export default function Main({ children }: { children?: React.ReactNode }) {
  return <main className="p-4"><div className="max-w-screen-sm mx-auto">{children}</div></main>;
}
