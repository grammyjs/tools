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
        <details key={query} className="my-2 py-1">
          <summary className="mb-2 cursor-pointer select-none">
            <a href={`#${slug(query)}`}></a>
            <h3 className="inline-block font-mono" id={`${slug(query)}`}>
              {q == "" ? (
                query
              ) : (
                <>
                  {query.slice(0, query.indexOf(q))}
                  <span className="text-grammy">{q}</span>
                  {query.slice(query.indexOf(q) + q.length)}
                </>
              )}
            </h3>
          </summary>
          <div className="b-l mx-2 my-2 p-4">{doc}</div>
        </details>
      );
    });

export default function FilterQueryBrowser() {
  const [q, setQ] = useState("");

  return (
    <Main>
      <input
        type="text"
        autoComplete="off"
        id="query"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`Browse ${filterQueries.length} filter queries...`}
        className="outlie-none w-full bg-altbackground p-3 placeholder:opacity-80 focus:outline-none dark:placeholder:opacity-50"
      />
      <div className="py-4">{list(q)}</div>
    </Main>
  );
}
