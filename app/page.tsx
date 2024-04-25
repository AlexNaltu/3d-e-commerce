import Product from "@/components/Product";
import { FetchProducts } from "@/lib/FetchProducts";
import Image from "next/image";

export default async function Home() {
  const products = await FetchProducts();

  console.log(products);
  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h1 className="text-black">{product.name}</h1>
        </div>
      ))}
    </div>
  );
}
