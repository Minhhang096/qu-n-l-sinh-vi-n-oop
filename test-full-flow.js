// Full end-to-end test - simulate browser flow

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjgiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidDAwMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlRlYWNoZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhLnR1cmluZ0B1bml2LmVkdSIsImV4cCI6MTc2OTQyNDQ2OSwiaXNzIjoiVW5pdmVyc2l0eUFQSSIsImF1ZCI6IlVuaXZlcnNpdHlBcHAifQ.1H0wi_uIeZqx30J8PKamN3R9R5kGR2ta2KyOr9f0bQk";

const testTeacherGradeFlow = async () => {
    console.log("=== TEACHER GRADE FLOW TEST ===\n");
    
    // Step 1: Fetch sections
    console.log("Step 1: Fetching sections...");
    const sectionsRes = await fetch("http://localhost:5000/api/sections", {
        headers: { Authorization: `Bearer ${token}` }
    });
    const sectionsData = await sectionsRes.json();
    
    if (!sectionsData.success) {
        console.error("✗ Failed to fetch sections");
        return;
    }
    
    console.log(`✓ Found ${sectionsData.data.length} sections`);
    
    // Find CS201 section
    const cs201Section = sectionsData.data.find((s) => s.courseId === "CS201");
    if (!cs201Section) {
        console.error("✗ CS201 section not found");
        return;
    }
    
    console.log(`✓ Found CS201 section: ID=${cs201Section.sectionId}, Name=${cs201Section.courseName}`);
    
    // Step 2: Fetch enrollments for CS201
    console.log(`\nStep 2: Fetching enrollments for section ${cs201Section.sectionId}...`);
    const enrollRes = await fetch(`http://localhost:5000/api/enrollments?sectionId=${cs201Section.sectionId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const enrollData = await enrollRes.json();
    
    if (!enrollData.success || !enrollData.data) {
        console.error("✗ Failed to fetch enrollments");
        return;
    }
    
    console.log(`✓ Found ${enrollData.data.length} enrollments`);
    enrollData.data.forEach((e) => {
        console.log(`  - Enrollment ${e.enrollmentId}: Student ${e.studentId}`);
    });
    
    // Step 3: Fetch grades for each enrollment
    console.log(`\nStep 3: Fetching grades for each student...`);
    for (const enrollment of enrollData.data) {
        const gradeRes = await fetch(`http://localhost:5000/api/grades/enrollment/${enrollment.enrollmentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const gradeData = await gradeRes.json();
        
        if (gradeData.success) {
            console.log(`  ✓ Enrollment ${enrollment.enrollmentId}: ${JSON.stringify(gradeData.data)}`);
        } else {
            console.log(`  ✗ Enrollment ${enrollment.enrollmentId}: ${gradeData.message}`);
        }
    }
    
    // Step 4: Test saving grade
    console.log(`\nStep 4: Testing grade update (POST)...`);
    if (enrollData.data.length > 0) {
        const enrollment = enrollData.data[0];
        const updateRes = await fetch("http://localhost:5000/api/grades", {
            method: "POST",
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                enrollmentId: enrollment.enrollmentId,
                midterm: 85,
                final: 90,
                other: 0
            })
        });
        const updateData = await updateRes.json();
        
        if (updateData.success) {
            console.log(`  ✓ Grade updated: ${JSON.stringify(updateData.data)}`);
        } else {
            console.log(`  ✗ Grade update failed: ${updateData.message}`);
        }
    }
    
    // Step 5: Test lock grade
    console.log(`\nStep 5: Testing grade lock (PATCH)...`);
    const lockRes = await fetch(`http://localhost:5000/api/sections/${cs201Section.sectionId}/lock-grade`, {
        method: "PATCH",
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    const lockData = await lockRes.json();
    
    if (lockData.success) {
        console.log(`  ✓ Grade lock toggled: isLocked=${lockData.data.isGradeLocked}`);
    } else {
        console.log(`  ✗ Grade lock failed: ${lockData.message}`);
    }
    
    console.log("\n=== TEST COMPLETE ===");
};

testTeacherGradeFlow();
