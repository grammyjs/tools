import { Link } from "react-router-dom";
import Main from "../components/Main.tsx";

export default function Index() {
  return (
    <>
      <Main>
        <ul className="flex flex-col gap-2">
          <li>
            <Link to="/filter-query-browser" className="link">
              Filter Query Browser
            </Link>
          </li>
          <li>
            <a className="link" href="https://tg-updates.vercel.app" target="_blank" rel="noreferrer">Update Visualizer</a>
          </li>
        </ul>
      </Main>
    </>
  );
}
