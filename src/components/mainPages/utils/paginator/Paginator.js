import React from "react";

import "./paginator.css";

export const Paginator = (props) => {
  const [page, setPage] = props.page;
  const [limit, setLimit] = props.limit;
  const count = props.count;
  const style = props.style;

  return (
    <div
      className={
        props.classes?.paginator ? props.classes.paginator : "paginator"
      }>
      {page >= 1 && <button onClick={() => setPage(1)}>First</button>}

      {/* PREV BUTTON */}
      {page > 1 && (
        <button onClick={() => setPage(page - 1)}>
          <span
            className={
              props.classes?.paginator
                ? props.classes.paginator
                : "prev-next-icon"
            }>
            {"⏮"}
          </span>
        </button>
      )}

      {/* CURRENT PAGE */}
      <button>{page}</button>

      {/* NEXT BUTTON */}
      {page * limit < count && (
        <button onClick={() => setPage(page + 1)}>
          <span
            className={
              props.classes?.paginator
                ? props.classes.paginator
                : "prev-next-icon"
            }>
            {"⏭"}
          </span>
        </button>
      )}
      <button onClick={() => setPage(Math.ceil(count / limit))}>Last</button>
    </div>
  );
};
