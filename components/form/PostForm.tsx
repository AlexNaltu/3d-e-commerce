"use client";

import { useFormState } from "react-dom";
import { Button } from "../ui/button";

interface FormErrors {
  name?: string[];
  description?: string[];
}

interface FormState {
  errors: FormErrors;
}

interface FormProps {
  formAction: any;
  initialData: {
    name: string;
    description: string;
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
