// Login.test.js
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import Login from "./login";

jest.mock("axios");

describe("Login Component", () => {
    it("handles form submission successfully", async () => {
        const mockData = { token: "mockToken" };
        axios.post.mockResolvedValueOnce({ data: mockData });

        const { getByLabelText, getByText } = render(<Login />);

        fireEvent.change(getByLabelText("Email"), { target: { value: "user@example.com" } });
        fireEvent.change(getByLabelText("Password"), { target: { value: "111" } });

        fireEvent.click(getByText("Submit"));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith("http://localhost:5005/user/auth/login", {
                email: "user@example.com",
                password: "111",
            });
            expect(localStorage.getItem("token")).toBe("mockToken");
            expect(localStorage.getItem("email")).toBe("user@example.com");
        });
    });
});
