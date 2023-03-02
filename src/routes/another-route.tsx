import { Link } from "react-router-dom";

export default function AnotherRoute() {
  return (
    <h1>
      This is another route. <Link to="/">Go home</Link>?
    </h1>
  );
}
