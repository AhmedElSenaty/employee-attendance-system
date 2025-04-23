import * as yup from "yup";

export const getAdminSchema = (isUpdate: boolean) =>
  yup.object().shape({
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username cannot exceed 50 characters")
      .matches(/^\S*$/, { message: "matches", type: "matches" })
      .required("Username is required"),

    title: yup
      .string()
      .required("Title is required")
      .min(2, "Title must be at least 2 characters")
      .max(100, "Title cannot exceed 100 characters"),

    email: yup
      .string()
      .email("Email must be a valid email address")
      .when([], {
        is: () => isUpdate,
        then: (schema) => schema.required("Email is required"),
        otherwise: (schema) => schema.strip(), // remove it from add form
      }),

      password: yup
      .string()
      .when([], {
        is: () => !isUpdate,
        then: (schema) => schema.required("Password is required"),
        otherwise: (schema) => schema.strip(), // remove it from update form
      }),
  });
