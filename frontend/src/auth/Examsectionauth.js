export const examEmployeeLogin = (employeeId, password) => {
    if (employeeId === "test" && password === "test") {
        return { 
            status: "success", 
            data: { 
                name: "Exam Section User", 
                department: "Examination Section" 
            } 
        };
    }
    return { status: "error", message: "Invalid credentials" };
};