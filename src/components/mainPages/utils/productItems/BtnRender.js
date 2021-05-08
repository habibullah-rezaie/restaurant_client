import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";

function BtnRender({ product, deleteProduct }) {
  const state = useContext(GlobalState);
  const [isAdmin] = state.authAPI.isAdmin;
  const addCart = state.userAPI.addCart;
  return (
    <div className="row-btn">
      {isAdmin ? (
        <>
          <Link
            id="btn-buy"
            to="#!"
            onClick={() => deleteProduct(product.id, product.images.pubilc_id)}>
            Delete
          </Link>
          <Link id="btn-view" to={`/edit_product/${product.id}`}>
            Edit
          </Link>{" "}
        </>
      ) : (
        <>
          <Link id="btn-buy" to="#!" onClick={() => addCart(product)}>
            BUY
          </Link>
          {/* FIXME: Does not redirect to top. */}
          <Link id="btn-view" to={`/detail/${product.id}#top`}>
            VIEW
          </Link>{" "}
        </>
      )}
    </div>
  );
}
export default BtnRender;
