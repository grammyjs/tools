import { useState } from "react";
import Main from "../Main";
import { generate } from "./docs";
const filterQueries = generate();

function slug(str: string) {
  return str.replace(":", "-").replace("_", "-");
}

const list = (q: string) =>
  filterQueries
    .filter(({ query }) => query.includes(q.toLowerCase()))
    .map(({ query, doc }) => {
      return (
        <details key={query} className="py-1 my-2">
          <summary className="mb-2 select-none cursor-pointer">
            <a href={`#${slug(query)}`}></a>
            <h3 className="font-mono inline-block" id={`${slug(query)}`}>
              {q == ""
                ? (
                  query
                )
                : (
                  <>
                    {query.slice(0, query.indexOf(q))}
                    <span className="text-grammy">{q}</span>
                    {query.slice(query.indexOf(q) + q.length)}
                  </>
                )}
            </h3>
          </summary>
          <div className="b-l mx-2 p-4 my-2">{doc}</div>
        </details>
      );
    });

export default function FilterQueryBrowser() {
  const [q, setQ] = useState("");

  return (
    <Main>
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
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`Search among ${filterQueries.length} filter queries...`}
        className="p-3 w-full bg-altbackground focus:outline-none placeholder:opacity-80 dark:placeholder:opacity-50"
      />
      <div className="py-4">{list(q)}</div>
    </Main>
  );
}
