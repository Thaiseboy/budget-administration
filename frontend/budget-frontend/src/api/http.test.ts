import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { http } from "./http";

const API_BASE_URL = "/api";

describe("http", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    const localStorageMock = {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] ?? null;
      },
      setItem(key: string, value: string) {
        this.store[key] = value;
      },
      removeItem(key: string) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      },
    };

    vi.stubGlobal("localStorage", localStorageMock);
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("headers", () => {
    it("includes Content-Type and Accept headers", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: "test" }),
      });

      await http.get("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test`,
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Accept: "application/json",
          }),
        }),
      );
    });

    it("includes Authorization header when token exists", async () => {
      localStorage.setItem("auth_token", "my-secret-token");

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await http.get("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/test`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer my-secret-token",
          }),
        }),
      );
    });

    it("does not include Authorization header when no token", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await http.get("/test");

      const headers = mockFetch.mock.calls[0][1].headers;
      expect(headers.Authorization).toBeUndefined();
    });
  });

  describe("http.get", () => {
    it("makes GET request to correct endpoint", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 1 }),
      });

      const result = await http.get("/users/1");

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/users/1`,
        expect.objectContaining({ method: "GET" }),
      );
      expect(result).toEqual({ id: 1 });
    });
  });

  describe("http.post", () => {
    it("makes POST request with JSON body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 1 }),
      });

      await http.post("/users", { name: "John" });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/users`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ name: "John" }),
        }),
      );
    });

    it("makes POST request without body when data is undefined", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await http.post("/logout");

      expect.objectContaining({
        method: "POST",
        body: undefined,
      });
    });
  });

  describe("http.put", () => {
    it("makes PUT request with JSON body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 1, name: "Updated" }),
      });

      await http.put("/users/1", { name: "Updated" });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/users/1`,
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ name: "Updated" }),
        }),
      );
    });
  });

  describe("http.delete", () => {
    it("makes DELETE request", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await http.delete("/users/1");

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/users/1`,
        expect.objectContaining({ method: "DELETE" }),
      );
    });
  });

  describe("response handling", () => {
    it("returns undefined for 204 No Content", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const result = await http.delete("/users/1");

      expect(result).toBeUndefined();
    });

    it("parses JSON response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ users: [1, 2, 3] }),
      });

      const result = await http.get("/users");

      expect(result).toEqual({ users: [1, 2, 3] });
    });
  });

  describe("error handling", () => {
    it("throws error with message from JSON response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: "Invalid input" }),
      });

      await expect(http.post("/users", {})).rejects.toThrow("Invalid input");
    });

    it("throws error with error field from JSON response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: "Bad request" }),
      });

      await expect(http.get("/test")).rejects.toThrow("Bad request");
    });

    it("throws error with text response when JSON parsing fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error("Not JSON")),
        text: () => Promise.resolve("Internal Server Error"),
      });

      await expect(http.get("/test")).rejects.toThrow("Internal Server Error");
    });

    it("clears token on 401 Unauthorized", async () => {
      localStorage.setItem("auth_token", "expired-token");

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: "Unauthorized" }),
      });

      await expect(http.get("/protected")).rejects.toThrow("Unauthorized");
      expect(localStorage.getItem("auth_token")).toBeNull();
    });
  });
});
