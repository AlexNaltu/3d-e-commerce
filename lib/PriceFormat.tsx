// Purpose: Format price to USD currency.
const formatPrice = (amount: number) => {
  //return the formatted price
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
};

export default formatPrice;
