import { ProductType } from "@/types/ProductTypes";

const Product = ({
  name,
  image,
  unit_amount,
  id,
  description,
  user,
}: ProductType) => {
  return (
    <div>
      <h1 className="text-black">{name}</h1>
      <p>{description}</p>
    </div>
  );
};

export default Product;
