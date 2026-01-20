// Login test với username (đúng field)

const login = async () => {
    const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: "turing",
            password: "password123"
        })
    });
    
    console.log("Status:", response.status);
    
    if (response.status === 200) {
        const data = await response.json();
        console.log("✓ Login successful!");
        console.log("Token:", data.token.substring(0, 80) + "...");
        console.log("User:", {
            accountId: data.user.accountId,
            username: data.user.username,
            role: data.user.role,
            email: data.user.email
        });
        console.log("\n📌 Save this token for API testing!");
        return data.token;
    } else {
        const data = await response.json();
        console.log("✗ Login failed:", data.message);
        return null;
    }
};

login();
