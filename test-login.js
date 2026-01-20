// Test login với seed data từ database

const testLogin = async () => {
    const credentials = [
        { email: "a.turing@univ.edu", username: "turing" },
        { email: "k.johnson@univ.edu", username: "johnson" },
        { email: "g.hopper@univ.edu", username: "hopper" },
    ];
    
    // Seed data hash (từ UniversityDbContext.cs)
    // Password: $2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK
    // Để tôi thử các password phổ biến
    
    const passwords = [
        "Password123!",
        "Teacher123!",
        "123456",
        "password",
        "admin",
    ];
    
    console.log("Testing login with various credentials...\n");
    
    for (const cred of credentials) {
        for (const pwd of passwords) {
            try {
                const response = await fetch("http://localhost:5000/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: cred.email, password: pwd }),
                });
                
                if (response.status === 200) {
                    const data = await response.json();
                    console.log(`✓ SUCCESS: ${cred.email} / ${pwd}`);
                    console.log(`  Token: ${data.token?.substring(0, 50)}...`);
                    console.log(`  User: ${data.user?.email}`);
                    return;
                }
            } catch (error) {
                // Ignore
            }
        }
    }
    
    console.log("✗ All login attempts failed");
};

testLogin();
