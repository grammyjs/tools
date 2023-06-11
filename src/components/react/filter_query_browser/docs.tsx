import { Fragment } from "react";
import { L1_SHORTCUTS, L2_SHORTCUTS, UPDATE_KEYS } from "./filter.ts";
import FILTER_QUERIES from "./mod.ts";

const CONTEXT_SHORTCUTS: Record<string, string> = UPDATE_KEYS.reduce((prev, current) => {
  return { ...prev, [current]: camelCase(current, "_") };
}, {});

function camelCase(str: string, separator: string) {
  return (
    str[0] +
    str
      .split(separator)
      .map((w) => w[0].toUpperCase() + w.substring(1))
      .join("")
      .substring(1)
  );
}

const PREFIX_DOCS = {
  chat_member: (
    <b>
      You need to specify this update in <code>allowed_updates</code> to receive them.
    </b>
  ),
};

export function generate() {
  const queryDocs: { query: string; doc: JSX.Element }[] = [];

  for (const query of FILTER_QUERIES) {
    const [l1, l2, L3] = query.split(":");
    const L1 = L1_SHORTCUTS[l1 as keyof typeof L1_SHORTCUTS] ?? [l1];
    const L2 = L2_SHORTCUTS[l2 as keyof typeof L2_SHORTCUTS] ?? [l2];

    const prefix = PREFIX_DOCS?.[query as keyof typeof PREFIX_DOCS];

    // L1T means L1Text or textual representation of L1.
    const L1T = (
      <span>
        {L1.map((k1, i) => (
          <Fragment key={String(i)}>
            {!i ? "" : " / "}
            <code>{k1}</code>
          </Fragment>
        ))}
      </span>
    );
    const L2T = (
      <span>
        {L2.map((k2, i) => (
          <Fragment key={String(i)}>
            {!i ? "" : " / "}
            <code>{k2}</code>
          </Fragment>
        ))}
      </span>
    );
    const L3T = <code>{L3}</code>;

    let doc: JSX.Element;

    if (L1[0] && !L2[0] && !L3) {
      doc = (
        <div>
          <p>Query for filtering {L1T} update.</p>
          <p>Here is how you can access the information about the update:</p>
          <pre className="b-rounded @dark:bg-gray-800 mt-3 w-full bg-gray-200 p-3">
            <code>{L1.map((k1) => `ctx.${CONTEXT_SHORTCUTS[k1]};`).join("\n")}</code>
          </pre>
        </div>
      );
    } else if (L1[0] && L2[0] && !L3) {
      doc = (
        <div>
          <p>
            Query for filtering {L1T} update with the field {L2T}.
          </p>
          <p>Here is how you can access the properties of the field:</p>
          <pre className="b-rounded @dark:bg-gray-800 mt-3 w-full bg-gray-200 p-3">
            <code>{L1.map((k1) => L2.map((k2) => `ctx.${CONTEXT_SHORTCUTS[k1]}.${k2};`).join("\n")).join("\n")}</code>
          </pre>
        </div>
      );
    } else if (L1[0] && L2[0] && L3) {
      const isEntity = L2.includes("entities");
      const info0 = isEntity ? (
        <span>containing at least one entity of the type {L3T}</span>
      ) : (
        <span>with {L3T} property</span>
      );
      const accessInfo = L2.join().includes("entities")
        ? `ctx.entities("${L3}");`
        : L1.map((k1) =>
            L2.map((k2) => {
              return `ctx.${CONTEXT_SHORTCUTS[k1]}.${k2}.${L3};`;
            }).join("\n")
          ).join("\n");

      doc = (
        <div>
          <p>
            Query for filtering {L1T} update with the field {L2T} {info0}.
          </p>
          <p>
            Here is how you can access the{" "}
            {isEntity ? <span>entities of {L3T} type</span> : <span>{L3T} property</span>}:
          </p>
          <pre className="b-rounded @dark:bg-gray-800 mt-3 w-full bg-gray-200 p-3">
            <code>{accessInfo}</code>
          </pre>
        </div>
      );
    } else {
      throw new Error(`There is some issue with the "${query}" filter query.`);
    }

    queryDocs.push({
      query,
      doc: prefix ? (
        <div>
          <p>{prefix}</p>
          {doc}
        </div>
      ) : (
        doc
      ),
    });
  }

  return queryDocs;
}
