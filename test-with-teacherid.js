// Login test với correct username (TeacherId)

const testLogin = async () => {
    const teacherIds = ["T001", "T002", "T003"];
    
    for (const teacherId of teacherIds) {
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: teacherId,
                    password: "password123"
                })
            });
            
            if (response.status === 200) {
                const data = await response.json();
                console.log(`✓ Login successful with ${teacherId}!`);
                console.log("Token:", data.token);
                console.log("User:", data.user);
                console.log("\n=== Using this token to test API ===\n");
                
                // Test API sections
                await testAPI(data.token);
                return;
            }
        } catch (error) {
            console.error(`Login failed for ${teacherId}:`, error.message);
        }
    }
    
    console.log("✗ All login attempts failed");
};

const testAPI = async (token) => {
    try {
        // Test sections
        const sectionsRes = await fetch("http://localhost:5000/api/sections", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const sectionsData = await sectionsRes.json();
        console.log("✓ Sections API working");
        console.log(`  Total sections: ${sectionsData.data?.length}`);
        
        // Test enrollments for section 3 (CS201)
        const enrollRes = await fetch("http://localhost:5000/api/enrollments?sectionId=3", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const enrollData = await enrollRes.json();
        console.log("✓ Enrollments API working");
        console.log(`  Section 3 enrollments: ${enrollData.data?.length}`);
        
    } catch (error) {
        console.error("API test failed:", error.message);
    }
};

testLogin();
