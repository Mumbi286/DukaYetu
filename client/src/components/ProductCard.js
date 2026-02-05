import React from "react";
import PropTypes from "prop-types";
import { formatPrice } from "../utils/priceFormatter";

const ProductCard = ({ product, children }) => {
  return (
    <div className="card h-100">
      <img
        src={product.image}
        className="card-img-top"
        alt={product.name}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{formatPrice(product.price)}</p>
        <div className="mt-auto">{children}</div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node,
};

export default ProductCard;
