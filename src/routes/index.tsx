import { Link } from "react-router-dom";
import Main from "../components/Main.tsx";

export default function Index() {
  return (
    <>
      <Main>
        <Link to="/filter-query-browser" className="link">
          Filter Query Browser
        </Link>
      </Main>
    </>
  );
}
