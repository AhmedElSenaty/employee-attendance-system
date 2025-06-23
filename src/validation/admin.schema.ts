import * as yup from "yup";

export const getAdminSchema = (isUpdate: boolean) =>
  yup.object().shape({
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username cannot exceed 50 characters")
      .matches(/^\S*$/, {
        message: "Username must not contain spaces",
        excludeEmptyString: true,
      }),

    title: yup
      .string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot exceed 100 characters"),

    email: yup
      .string()
      .email("Email must be a valid email address")
      .when([], {
        is: () => isUpdate,
        then: (schema) => schema.required("Email is required"),
        otherwise: (schema) => schema.strip(),
      }),

      password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, { message: "uppercase", type: "uppercase" })
        .matches(/[a-z]/, { message: "lowercase", type: "lowercase" })
        .matches(/[0-9]/, { message: "number", type: "number" })
        .matches(/[!@#$%^&]/, { message: "specialChar", type: "specialChar" })
        .when([], {
          is: () => !isUpdate,
          then: (schema) => schema.required("Password is required"),
          otherwise: (schema) => schema.strip(), // remove it from add form
        }),
  });

  export type AdminFormValues = yup.InferType<ReturnType<typeof getAdminSchema>>;
