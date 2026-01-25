import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  updateProfile,
  updatePassword,
  updatePreferences,
  deleteAccount,
  type UpdateProfileData,
  type UpdatePasswordData,
  type UpdatePreferencesData,
  type DeleteAccountData,
} from "./profile";
import { http } from "./http";

vi.mock("./http");

describe("profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateProfile", () => {
    it("calls http.put with profile data", async () => {
      const data: UpdateProfileData = {
        name: "John Doe",
        email: "john@example.com",
      };
      const mockResponse = {
        user: { id: 1, name: "John Doe", email: "john@example.com" },
        message: "Profile updated",
      };
      vi.mocked(http.put).mockResolvedValueOnce(mockResponse);

      const result = await updateProfile(data);

      expect(http.put).toHaveBeenCalledWith("/profile", data);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("updatePassword", () => {
    it("calls http.put with password data", async () => {
      const data: UpdatePasswordData = {
        current_password: "oldpass123",
        password: "newpass123",
        password_confirmation: "newpass123",
      };
      const mockResponse = { message: "Password updated" };
      vi.mocked(http.put).mockResolvedValueOnce(mockResponse);

      const result = await updatePassword(data);

      expect(http.put).toHaveBeenCalledWith("/profile/password", data);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("updatePreferences", () => {
    it("calls http.put with preferences data", async () => {
      const data: UpdatePreferencesData = {
        theme: "dark",
        currency: "EUR",
        date_format: "d-m-Y",
        language: "nl",
      };
      const mockResponse = {
        user: { id: 1, theme: "dark", currency: "EUR" },
        message: "Preferences updated",
      };
      vi.mocked(http.put).mockResolvedValueOnce(mockResponse);

      const result = await updatePreferences(data);

      expect(http.put).toHaveBeenCalledWith("/profile/preferences", data);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("deleteAccount", () => {
    it("calls http.delete with password confirmation", async () => {
      const data: DeleteAccountData = { password: "mypassword123" };
      const mockResponse = { message: "Account deleted" };
      vi.mocked(http.delete).mockResolvedValueOnce(mockResponse);

      const result = await deleteAccount(data);

      expect(http.delete).toHaveBeenCalledWith("/profile", {
        body: JSON.stringify(data),
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
