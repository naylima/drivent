import { ApplicationError } from "@/protocols";

export function forbiddenError(): ApplicationError {
  return {
    name: "ForbiddenError",
    message: "User is not authorized to access this resource with an explicit deny!",
  };
}
