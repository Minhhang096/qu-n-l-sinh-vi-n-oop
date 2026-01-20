// Login test với username

const login = async () => {
    const testCreds = [
        { username: "turing", password: "password123" },
        { email: "turing", password: "password123" },
        { email: "a.turing@univ.edu", password: "password123" },
    ];
    
    for (const cred of testCreds) {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cred)
        });
        
        console.log(`Trying: ${JSON.stringify(cred)} => ${response.status}`);
        
        if (response.status === 200) {
            const data = await response.json();
            console.log("✓ Login successful!");
            console.log("Token:", data.token.substring(0, 80) + "...");
            console.log("User role:", data.user.role);
            return data.token;
        }
    }
    
    console.log("✗ All attempts failed");
    return null;
};

login();
