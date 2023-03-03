import Main from "../components/Main.tsx";
import { generate } from "./docs.tsx";

const filterQueries = generate();

function slug(str: string) {
  return str.replace(":", "-").replace("_", "-");
}

const list = filterQueries.map(({ query, doc }) => {
  return (
    <details key={query} className="py-1 my-2">
      <summary className="mb-2 select-none cursor-pointer">
        <a href={`#${slug(query)}`}></a>
        <h3 className="font-mono inline-block" id={`${slug(query)}`}>
          {query}
        </h3>
      </summary>
      <div className="b-l mx-2 p-4 my-2">{doc}</div>
    </details>
  );
});

export default function Component() {
  return (
    <Main>
      <div className="max-w-screen-sm">
        <p className="pb-4">
          Here you can view and search through all of the available{" "}
          <a className="link" href="https://grammy.dev/guide/filter-queries">
            filter queries
          </a>
          , and know what kind of updates they filter.
        </p>
        <input
          type="text"
          autoComplete="off"
          id="query"
          placeholder={`Search among ${filterQueries.length} filter queries...`}
          className="py-3 w-full b-b-1 b-gray-900 @dark:b-gray-100 bg-inherit focus:outline-none px-0.5"
        />
        <div className="py-4">{list}</div>
      </div>
    </Main>
  );
}
