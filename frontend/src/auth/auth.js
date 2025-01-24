export const login = (employeeId, password) => {
    if (employeeId === "test" && password === "test") {
        return { status: "success", data: { name: "Test User", department: "CSE" } };
    }
    return { status: "error", message: "Invalid credentials" };
};