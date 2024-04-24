import { authOptions } from "@/app/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Stripe from "stripe";

export const FetchProducts = async () => {
  const session = await getServerSession(authOptions);
  const getProducts = async () => {
    // Create a new Stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2024-04-10",
    });

    // Get all products
    const products = await stripe.products.list();

    // Create a map to store prices
    const priceMap = new Map();

    // Get all prices
    const prices = await stripe.prices.list();

    // Map prices to products
    prices.data.forEach((price) => {
      // If the price has a product, add it to the map
      if (price.product) {
        // If the product is not already in the map, add it
        if (!priceMap.has(price.product)) {
          // Add the product to the map
          priceMap.set(price.product, price);
        } else {
          // If the price is newer, update the price
          const existingPrice = priceMap.get(price.product);
          if (price.created > existingPrice.created) {
            priceMap.set(price.product, price);
          }
        }
      }
    });

    // Map products
    const allProducts = products.data.map((product) => {
      // Get the price for the product
      const price = priceMap.get(product.id);

      // Return the product
      return {
        id: product.id,
        name: product.name,
        unit_amount: price ? price.unit_amount : null,
        image: product.images[0],
        currency: price ? price.currency : null,
        description: product.description,
        metadata: product.metadata,
      };
    });

    return allProducts;
  };

  // Get products
  const products = await getProducts();

  return products;
};
