import { Link } from "react-router-dom";
import Main from "../components/Main.tsx";

export default function Index() {
  return (
    <>
      <Main>
        <Link to="/filter-query-browser" className="link">
          Filter Query Browser
        </Link>
        <a href="https://tg-updates.vercel.app" target="_blank" rel="noreferrer">Update Visualizer</a>
      </Main>
    </>
  );
}
