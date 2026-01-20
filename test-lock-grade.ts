// Test script để verify nút khoá điểm hoạt động

// Giả lập test - tương tự như gọi API từ browser
const testLockGrade = async () => {
    const token = "test_token"; // Tạm thời, backend không check auth
    const sectionId = 1;

    try {
        // Test PATCH lock-grade endpoint
        const response = await fetch(`http://localhost:5000/api/sections/${sectionId}/lock-grade`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("Response status:", response.status);
        const text = await response.text();
        console.log("Response text:", text);
        
        if (!text) {
            console.error("✗ Không có response từ backend");
            return false;
        }

        const data = JSON.parse(text);
        console.log("Lock grade response:", data);
        console.log("Success:", data.success);
        console.log("Message:", data.message);
        console.log("IsGradeLocked:", data.data?.isGradeLocked);

        if (data.success) {
            console.log("✓ Nút khoá điểm hoạt động!");
            return true;
        } else {
            console.error("✗ Lỗi:", data.message);
            return false;
        }
    } catch (error) {
        console.error("✗ Lỗi request:", error);
        return false;
    }
};

// Test save grade
const testSaveGrade = async () => {
    const token = "test_token";

    try {
        const response = await fetch("http://localhost:5000/api/grades", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                enrollmentId: 1,
                midterm: 85,
                final: 90,
                other: 0,
            }),
        });

        console.log("Response status:", response.status);
        const text = await response.text();
        console.log("Response text:", text);
        
        if (!text) {
            console.error("✗ Không có response từ backend");
            return false;
        }

        const data = JSON.parse(text);
        console.log("Save grade response:", data);

        if (data.success) {
            console.log("✓ Lưu điểm hoạt động!");
            console.log("Grade data:", data.data);
            return true;
        } else {
            console.error("✗ Lỗi:", data.message);
            return false;
        }
    } catch (error) {
        console.error("✗ Lỗi request:", error);
        return false;
    }
};

// Chạy tests
(async () => {
    console.log("\n=== TEST LOCK GRADE ===");
    await testLockGrade();

    console.log("\n=== TEST SAVE GRADE ===");
    await testSaveGrade();
})();
