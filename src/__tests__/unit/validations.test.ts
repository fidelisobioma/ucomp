import { signUpSchema, signInSchema } from "@/lib/validations/auth";

describe("signUpSchema", () => {
  it("should pass with valid data", () => {
    const result = signUpSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("should fail if name is too short", () => {
    const result = signUpSchema.safeParse({
      name: "J",
      email: "john@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Name must be at least 2 characters",
    );
  });

  it("should fail with invalid email", () => {
    const result = signUpSchema.safeParse({
      name: "John Doe",
      email: "not-an-email",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Please enter a valid email address",
    );
  });

  it("should fail if passwords do not match", () => {
    const result = signUpSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      confirmPassword: "different123",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Passwords do not match");
  });

  it("should fail if password is too short", () => {
    const result = signUpSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "pass",
      confirmPassword: "pass",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Password must be at least 8 characters",
    );
  });
});

describe("signInSchema", () => {
  it("should pass with valid data", () => {
    const result = signInSchema.safeParse({
      email: "john@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("should fail with invalid email", () => {
    const result = signInSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("should fail with empty password", () => {
    const result = signInSchema.safeParse({
      email: "john@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
