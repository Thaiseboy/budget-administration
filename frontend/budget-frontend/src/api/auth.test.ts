import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  register,
  login,
  logout,
  getCurrentUser,
  sendVerificationEmail,
  checkVerificationStatus,
} from "./auth";
import { http } from "./http";

vi.mock("./http");

describe("auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("calls http.post with registration data", async () => {
      const mockResponse = {
        user: { id: 1, name: "John", email: "john@example.com" },
        token: "abc123",
        message: "Registered successfully",
      };
      vi.mocked(http.post).mockResolvedValueOnce(mockResponse);

      const data = {
        name: "John",
        email: "john@example.com",
        password: "password123",
        password_confirmation: "password123",
      };

      const result = await register(data);
      expect(http.post).toHaveBeenCalledWith("/register", data);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("login", () => {
    it("calls http.post with login credentials", async () => {
      const mockResponse = {
        user: { id: 1, name: "John", email: "john@example.com" },
        token: "abc123",
        message: "Logged in",
      };
      vi.mocked(http.post).mockResolvedValueOnce(mockResponse);

      const data = { email: "john@example.com", password: "password123" };
      const result = await login(data);

      expect(http.post).toHaveBeenCalledWith("/login", data);
      expect(result).toEqual(mockResponse);
    });

    it("includes remember option when provided", async () => {
      vi.mocked(http.post).mockResolvedValueOnce({});

      const data = {
        email: "john@example.com",
        password: "password123",
        remember: true,
      };

      await login(data);

      expect(http.post).toHaveBeenCalledWith("/login", data);
    });
  });

  describe("logout", () => {
    it("calls http.post to logout endpoint", async () => {
      vi.mocked(http.post).mockResolvedValueOnce(undefined);

      await logout();

      expect(http.post).toHaveBeenCalledWith("/logout");
    });
  });

  describe("getCurrentUser", () => {
    it("calls http.get and returns user from response", async () => {
      const mockUser = {
        id: 1,
        name: "John",
        email: "john@example.com",
        email_verified_at: "2024-01-01",
        theme: "light",
        currency: "EUR",
        date_format: "d-m-Y",
        language: "en",
      };
      vi.mocked(http.get).mockResolvedValueOnce({ user: mockUser });

      const result = await getCurrentUser();

      expect(http.get).toHaveBeenCalledWith("/user");
      expect(result).toEqual(mockUser);
    });
  });

  describe("sendVerificationEmail", () => {
    it("calls http.post to send verification email", async () => {
      vi.mocked(http.post).mockResolvedValueOnce(undefined);

      await sendVerificationEmail();

      expect(http.post).toHaveBeenCalledWith(
        "/email/verification-notification",
      );
    });
  });

  describe("checkVerificationStatus", () => {
    it("return true when email is verified", async () => {
      vi.mocked(http.get).mockResolvedValueOnce({ verified: true });

      const result = await checkVerificationStatus();

      expect(http.get).toHaveBeenCalledWith("/email/verification-status");
      expect(result).toBe(true);
    });

    it("return false when email is not verified", async () => {
      vi.mocked(http.get).mockResolvedValueOnce({ verified: false });

      const result = await checkVerificationStatus();
      expect(result).toBe(false);
    });
  });
});
