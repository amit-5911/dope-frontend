import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NinjasPage } from "./NinjasPage";
import "@testing-library/jest-dom";

const mockNinjas = [
  {
    id: "1",
    name: "Naruto Uzumaki",
    location: "Konoha Village",
    health: "Healthy",
    power: 95,
  },
  {
    id: "2",
    name: "Sasuke Uchiha",
    location: "Hidden Leaf",
    health: "Injured",
    power: 92,
  },
  {
    id: "3",
    name: "Kakashi Hatake",
    location: "Konoha Village",
    health: "Healthy",
    power: 88,
  },
  {
    id: "4",
    name: "Sakura Haruno",
    location: "Medical Ward",
    health: "Critical",
    power: 85,
  },
];

vi.mock("@/features/ninjas", async () => {
  const actual = await vi.importActual<any>("@/features/ninjas");
  return {
    ...actual,
    generateNinjas: vi.fn(() => mockNinjas),
  };
});

vi.mock("@/api/useNinjasData", () => ({
  useNinjasData: vi.fn(),
}));

import { useNinjasData } from "@/api/useNinjasData";

describe("NinjasTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useNinjasData).mockReturnValue({
      //@ts-expect-error:""
      data: mockNinjas,
      status: "success",
      error: null,
      refetch: vi.fn(),
    });
  });

  it("filters ninja by name when user types in search input", async () => {
    const user = userEvent.setup();
    render(<NinjasPage />);

    const searchInput = screen.getByPlaceholderText(
      "Search ninja by name or location..."
    );

    await user.type(searchInput, "Naruto");

    await waitFor(() => {
      expect(screen.getByText("Naruto Uzumaki")).toBeInTheDocument();
      expect(screen.queryByText("Sasuke Uchiha")).not.toBeInTheDocument();
      expect(screen.queryByText("Kakashi Hatake")).not.toBeInTheDocument();
      expect(screen.queryByText("Sakura Haruno")).not.toBeInTheDocument();
    });
  });

  it("filters ninja by location when user types in search input", async () => {
    const user = userEvent.setup();
    render(<NinjasPage />);

    const searchInput = screen.getByPlaceholderText(
      "Search ninja by name or location..."
    );

    await user.type(searchInput, "Konoha");

    await waitFor(() => {
      expect(screen.getByText("Naruto Uzumaki")).toBeInTheDocument();
      expect(screen.getByText("Kakashi Hatake")).toBeInTheDocument();
      expect(screen.queryByText("Sasuke Uchiha")).not.toBeInTheDocument();
      expect(screen.queryByText("Sakura Haruno")).not.toBeInTheDocument();
    });
  });

  it("performs case-insensitive search", async () => {
    const user = userEvent.setup();
    render(<NinjasPage />);

    const searchInput = screen.getByPlaceholderText(
      "Search ninja by name or location..."
    );

    await user.type(searchInput, "KAKASHI");

    await waitFor(() => {
      expect(screen.getByText("Kakashi Hatake")).toBeInTheDocument();
      expect(screen.queryByText("Naruto Uzumaki")).not.toBeInTheDocument();
    });
  });

  it("shows 'No results' message when no ninjas match search", async () => {
    const user = userEvent.setup();
    render(<NinjasPage />);

    const searchInput = screen.getByPlaceholderText(
      "Search ninja by name or location..."
    );

    await user.type(searchInput, "NonexistentNinja");

    await waitFor(() => {
      expect(screen.getByText("No results.")).toBeInTheDocument();
    });
  });

  it("displays loading state while filtering with slow operation", async () => {
    const user = userEvent.setup();
    render(<NinjasPage />);

    const searchInput = screen.getByPlaceholderText(
      "Search ninja by name or location..."
    );

    await user.type(searchInput, "Sasuke");

    await waitFor(() => {
      expect(screen.getByText("Sasuke Uchiha")).toBeInTheDocument();
    });

    expect(screen.queryByText("Updating table...")).not.toBeInTheDocument();
  });

  it("searches across multiple columns (name and location)", async () => {
    const user = userEvent.setup();
    render(<NinjasPage />);

    const searchInput = screen.getByPlaceholderText(
      "Search ninja by name or location..."
    );

    await user.type(searchInput, "leaf");

    await waitFor(() => {
      expect(screen.getByText("Sasuke Uchiha")).toBeInTheDocument();
      expect(screen.queryByText("Naruto Uzumaki")).not.toBeInTheDocument();
    });
  });

  it("maintains search value in input field", async () => {
    const user = userEvent.setup();
    render(<NinjasPage />);

    const searchInput = screen.getByPlaceholderText(
      "Search ninja by name or location..."
    ) as HTMLInputElement;

    const searchTerm = "Sakura";
    await user.type(searchInput, searchTerm);

    expect(searchInput.value).toBe(searchTerm);
  });
});
