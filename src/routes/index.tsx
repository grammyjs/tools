import { Link } from "react-router-dom";

export default function Index() {
  return (
    <h1>
      Welcome home! <Link to="/another-route">Another Route</Link>
    </h1>
  );
}
