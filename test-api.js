// Test to check API sections and enrollments

const fetchSections = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/sections");
        const data = await response.json();
        console.log("=== SECTIONS ===");
        console.log("Status:", response.status);
        console.log("Success:", data.success);
        console.log("Count:", data.data?.length);
        console.log("Sections:");
        data.data?.forEach((s) => {
            console.log(`  - ID: ${s.sectionId}, CourseId: ${s.courseId}, Name: ${s.courseName}`);
        });
    } catch (error) {
        console.error("Error fetching sections:", error.message);
    }
};

const fetchEnrollments = async (sectionId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/enrollments?sectionId=${sectionId}`);
        const data = await response.json();
        console.log(`\n=== ENROLLMENTS FOR SECTION ${sectionId} ===`);
        console.log("Status:", response.status);
        console.log("Success:", data.success);
        console.log("Count:", data.data?.length);
        if (data.data) {
            data.data.forEach((e) => {
                console.log(`  - Enrollment: ${e.enrollmentId}, Student: ${e.studentId}, Section: ${e.sectionId}`);
            });
        }
    } catch (error) {
        console.error("Error fetching enrollments:", error.message);
    }
};

(async () => {
    console.log("Testing API endpoints...\n");
    await fetchSections();
    
    // Test CS201 section (should be sectionId 3)
    await fetchEnrollments(3);
    await fetchEnrollments(1);
    await fetchEnrollments(4);
})();
