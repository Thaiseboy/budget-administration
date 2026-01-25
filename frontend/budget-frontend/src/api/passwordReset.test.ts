import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  sendPasswordResetLink,
  resetPassword,
  type ForgotPasswordData,
  type ResetPasswordData,
  type MessageResponse,
} from "./passwordReset";
import { http } from "./http";

vi.mock("./http");

describe("passwordReset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sendPasswordResetLink", () => {
    it("calls http.post with email to forgot-password endpoint", async () => {
      const data: ForgotPasswordData = { email: "john@example.com" };
      const mockResponse: MessageResponse = { message: "Reset link sent" };
      vi.mocked(http.post).mockResolvedValueOnce(mockResponse);

      const result = await sendPasswordResetLink(data);

      expect(http.post).toHaveBeenCalledWith("/forgot-password", data);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("resetPassword", () => {
    it("calls http.post with reset password data", async () => {
      const data: ResetPasswordData = {
        email: "john@example.com",
        token: "abc123",
        password: "newpassword123",
        password_confirmation: "newpassword123",
      };
      const mockResponse: MessageResponse = {
        message: "Password reset successfully",
      };
      vi.mocked(http.post).mockResolvedValueOnce(mockResponse);

      const result = await resetPassword(data);

      expect(http.post).toHaveBeenCalledWith("/reset-password", data);
      expect(result).toEqual(mockResponse);
    });

    it("returns success message on valid reset", async () => {
      const data: ResetPasswordData = {
        email: "jane@example.com",
        token: "xyz789",
        password: "securepass",
        password_confirmation: "securepass",
      };
      const mockResponse: MessageResponse = { message: "Password updated" };
      vi.mocked(http.post).mockResolvedValueOnce(mockResponse);

      const result = await resetPassword(data);

      expect(result.message).toBe("Password updated");
    });
  });
});
