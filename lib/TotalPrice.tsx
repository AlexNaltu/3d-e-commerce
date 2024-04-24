import { CartType } from "@/types/CartTypes";

//create a function that calculates the total price of the cart
export const totalPrice = (cart: CartType[]) => {
  //return the total price of the cart
  return cart.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);
};
