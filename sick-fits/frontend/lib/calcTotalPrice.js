export default function calcTotalPrice(cart) {
  return cart.reduce((tally, cartItem) => {
    if (!cartItem.product) return tally; // Products can be deleted, but they still could be in your cart
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);
}
