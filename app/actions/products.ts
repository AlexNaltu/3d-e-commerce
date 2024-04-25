"use server";

import { Product } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import Stripe from "stripe";

//create a schema for the post
const productSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(10).max(1000),
  image: z.string().min(10).max(10000),
  unit_amount: z.number(),
});

//create an interface for the PostFormState
interface PostFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}

//create an asyncronous function that creates a post
export async function createProduct(
  //the function accepts a form state and form data
  formState: PostFormState,
  formData: FormData
  //this promise receives the PostFormState interface
): Promise<PostFormState> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-04-10",
  });

  //parse the form data using the postSchema
  const result = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    image: formData.get("image"),
    unit_amount: parseFloat(formData.get("unit_amount") as string),
  });

  //if the result is not successful, return an error
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }
  //create a variable post with the Post types
  let post: Product;
  //try to create the post
  try {
    post = await prisma.product.create({
      data: {
        name: result.data.name,
        description: result.data.description,
        image: result.data.image,
        unit_amount: result.data.unit_amount,
      },
    });

    const stripeProduct = await stripe.products.create({
      name: post.name,
      description: post.description as string,
      images: [post.image as string],
    });

    const stripePrice = await stripe.prices.create({
      product: post.id,
      unit_amount: post.unit_amount,
      currency: "usd",
    });
    //if the post is not created, return an error
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        //return an error with the error message
        errors: {
          _form: [error.message],
        },
      };
      //if the error is not an error, return an error
    } else {
      return {
        errors: {
          _form: ["Something went wrong."],
        },
      };
    }
  }

  //if the post is created, revalidate the posts page
  revalidatePath("/");
  redirect("/");
}

//create an asyncronous function that updates a post
export async function updateProduct(
  //the function accepts an id, form state and form data
  id: string,
  formState: PostFormState,
  formData: FormData
  //this promise receives the PostFormState interface
): Promise<PostFormState> {
  //parse the form data using the postSchema
  const result = productSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    image: formData.get("image"),
    unit_amount: formData.get("unit_amount"),
  });

  //if the result is not successful, return an error
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  //create a variable post with the Post types
  let post: Product;
  try {
    //try to update the post
    post = await prisma.product.update({
      where: { id },
      data: {
        name: result.data.name,
        description: result.data.description,
        image: result.data.image,
        unit_amount: result.data.unit_amount,
      },
    });
    //if the post is not created, return an error
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      };
      //if the error is not an error, return an error
    } else {
      return {
        errors: {
          _form: ["Something went wrong."],
        },
      };
    }
  }
  //if the post is created, revalidate the posts page
  revalidatePath("/");
  redirect("/");
}

//create an asyncronous function that deletes a post
export async function deleteProduct(id: string): Promise<PostFormState> {
  //create a variable post with the Post types
  let post: Product;

  //try to delete the post
  try {
    post = await prisma.product.delete({
      where: { id },
    });
    //if the post is not created, return an error
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      };
      //if the error is not an error, return an error
    } else {
      return {
        errors: {
          _form: ["Something went wrong."],
        },
      };
    }
  }

  //if the post is created, revalidate the posts page
  revalidatePath("/");
  redirect("/");
}
