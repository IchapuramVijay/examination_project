export const adminLogin = (adminId, password) => {
    if (adminId === "test" && password === "test") {
        return { status: "success", data: { name: "Admin", department: "Administration" } };
    }
    return { status: "error", message: "Invalid credentials" };
 };