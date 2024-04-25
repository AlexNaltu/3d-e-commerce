import PostForm from "@/components/form/PostForm";
import React from "react";
import { createProduct } from "../actions/products";

const PostProductPage = () => {
  return (
    <div className="bg-red-50">
      <PostForm
        formAction={createProduct}
        initialData={{ name: "", description: "", image: "", unit_amount: 0 }}
      />
    </div>
  );
};

export default PostProductPage;
