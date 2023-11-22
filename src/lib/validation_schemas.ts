import { object, string, ref } from "yup";
export let COMMENT_MIN_LENGTH: number = 3;

export let sign_up_schema = object({
  email: string()
    .email("components.sign-up_form.input_error.email.valid")
    .min(5, "components.sign-up_form.input_error.email.length")
    .max(100, "components.sign-up_form.input_error.email.length"),
  password: string()
    .min(5, "components.sign-up_form.input_error.password.length")
    .max(100, "components.sign-up_form.input_error.password.length"),
  password_confirmation: string().oneOf(
    [ref("password"), null],
    "components.sign-up_form.input_error.password_confirmation"
  ),
});

export let review_schema = object({
  comment: string().min(3, "comment_error_message"),
});

export let profiling_schema = object({
  shop_name: string()
    .matches(/^[a-zA-Z0-9- ]*$/, "routes.shop.profiling.input_error.no_special")
    .min(3, "routes.shop.profiling.input_error.length")
    .max(30, "routes.shop.profiling.input_error.length"),
});

export let marketing_schema = object({
  email: string()
    .email("components.marketing_form.email.invalid")
    .required("components.marketing_form.email.required"),
});
