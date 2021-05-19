import React from "react";

/**
 * Component could be used to show error or errors
 * to the user
 * @param {{error: String | Array}} props
 */
function GlobalErr({ error }) {
  return (
    <>
      {error instanceof Array && error.length > 0 ? (
        <div className="alert alert--error">
          <ul>
            {error.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      ) : (
        error && (
          <div className="alert alert--error">
            <p>{error}</p>
          </div>
        )
      )}
    </>
  );
}

export default GlobalErr;
