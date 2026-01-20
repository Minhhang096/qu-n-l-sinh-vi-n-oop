// Test nếu user đã logged in hay chưa

if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log("=== STORED AUTH DATA ===");
    console.log("Token:", token ? `✓ (${token.substring(0, 50)}...)` : "✗ missing");
    console.log("User:", user ? user : "✗ missing");
    
    if (user) {
        try {
            const userData = JSON.parse(user);
            console.log("User data:", userData);
        } catch (e) {
            console.log("Could not parse user data");
        }
    }
} else {
    console.log("Not in browser environment");
}
