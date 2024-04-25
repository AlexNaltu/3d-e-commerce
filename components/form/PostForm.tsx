"use client";

import { useFormState } from "react-dom";
import { Button } from "../ui/button";

interface FormErrors {
  name?: string[];
  description?: string[];
  unit_amount?: string[];
}

interface FormState {
  errors: FormErrors;
}

interface FormProps {
  formAction: any;
  initialData: {
    name: string;
    description: string;
    image: string;
    unit_amount: number;
  };
}
function PostForm({ formAction, initialData }: FormProps) {
  const [formState, action] = useFormState<FormState>(formAction, {
    errors: {},
  });
  return (
    <>
      <h1 className="max-w-sm mx-auto my-10">
        {initialData.name ? "Update" : "Create"} Post
      </h1>
      <form action={action} className="flex flex-col max-w-sm mx-auto">
        <label htmlFor="image">Image Link</label>
        <input id="image" name="image" type="text" />
        <label htmlFor="unit_amount">Unit Amount</label>
        <input id="unit_amount" name="unit_amount" type="number" />
        {formState.errors.unit_amount && (
          <div>{formState.errors.unit_amount.join(",")}</div>
        )}
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" />
        {formState.errors.name && <div>{formState.errors.name.join(",")}</div>}
        <label htmlFor="description"> Description</label>
        <textarea
          name="description"
          id="description"
          cols={30}
          rows={10}
        ></textarea>
        {formState.errors.description && (
          <div>{formState.errors.description.join(",")}</div>
        )}
        <Button type="submit">Save</Button>
      </form>
    </>
  );
}

export default PostForm;
