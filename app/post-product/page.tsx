import PostForm from "@/components/form/PostForm";
import React from "react";
import { createProduct } from "../actions/products";

const PostProductPage = () => {
  return (
    <div className="bg-red-50">
      <PostForm
        formAction={createProduct}
        initialData={{ name: "", description: "", image: "" }}
      />
    </div>
  );
};

export default PostProductPage;
