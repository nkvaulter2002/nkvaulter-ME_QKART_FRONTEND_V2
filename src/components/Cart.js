import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";
// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */


export const generateCartItemsFrom = (cartData, productsData) => {
  let cartItem = [];
  cartData.forEach((element) => {
    productsData.forEach((product) => {
      if (product._id === element.productId)
        cartItem.push({
          name: product.name,
          qty: element.qty,
          category: product.category,
          cost: product.cost,
          rating: product.rating,
          image: product.image,
          productId: product._id,
        });
    });
  });
  return cartItem;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let cost=0;
  items.forEach((element)=>{
    cost+=element.cost*element.qty;
  })
  return cost;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
 export const getTotalItems = (items = []) => {
  let totalItems=0;
  items.forEach((element)=>{
    totalItems+=element.qty;
  })
  return totalItems;
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({ value, handleAdd, handleDelete }) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ isReadOnly,products, items = [], handleQuantity }) => {
  const history= useHistory();
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items.map((element, id) => {
          return (
            <Box display="flex" alignItems="flex-start" padding="1rem" key={id}>
              <Box className="image-container">
                <img
                  src={element.image}
                  alt={element.name}
                  width="100%"
                  height="100%"
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="6rem"
                paddingX="1rem"
              >
                <div>{element.name}</div>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {isReadOnly?(
                      <p>Qty:{element.qty}</p>  
                  ):(
                    <ItemQuantity
                    value={element.qty}
                    handleAdd={() => {
                      handleQuantity(
                        localStorage.getItem("token"),
                        items,
                        products,
                        element.productId,
                        element.qty + 1,
                        {preventDuplicate: false}
                      );
                    }}
                    handleDelete={() => {
                      handleQuantity(
                        localStorage.getItem("token"),
                        items,
                        products,
                        element.productId,
                        element.qty - 1,
                        {preventDuplicate: false}
                      );
                    }}
                  />
                  )}
                  
                  <Box padding="0.5rem" fontWeight="700">
                    ${element.cost}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        {isReadOnly?(
          <>
          </>
        ):(
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={()=>history.push("/checkout")}
          >
            Checkout
          </Button>
        </Box>
        )}
      </Box>
      {isReadOnly?(
        <Box className="cart" padding="1rem" alignItems="center">
        <div>
          <h3>Order Details</h3>
        </div>
        <div className="cart-order-details">
          <span>Products</span>
          <span>{getTotalItems(items)}</span>
        </div>
        <div className="cart-order-details">
          <span>Subtotal</span>
          <span>${getTotalCartValue(items)}</span>
        </div>
        <div className="cart-order-details" >
          <span>Shipping Charges</span>
          <span>$0</span>
        </div>
        <div className="cart-order-details-footer">
          <h4>Total</h4>
          <h4>${getTotalCartValue(items)}</h4>
        </div>
      </Box>
      ):(
        <>
        </>
      )}
    </>
  );
};

export default Cart;
