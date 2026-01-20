// Login test với credentials từ README

const login = async () => {
    const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: "a.turing@univ.edu",
            password: "password123"
        })
    });
    
    if (response.status === 200) {
        const data = await response.json();
        console.log("✓ Login successful!");
        console.log("Token:", data.token);
        console.log("User:", data.user);
        return data.token;
    } else {
        console.log("✗ Login failed:", response.status);
        const text = await response.text();
        console.log("Response:", text);
        return null;
    }
};

login();
