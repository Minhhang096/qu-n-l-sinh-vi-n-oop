"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getToken } from "@/lib/api-client";

export default function DebugPage() {
  const [results, setResults] = useState<string>("");
  
  useEffect(() => {
    // Auto test on load
    testAPIs();
  }, []);

  const testAPIs = async () => {
    const token = getToken();
    console.log("Token from localStorage:", token ? "✓ Found" : "✗ Missing");
    
    let output = "=== API Test Results ===\n\n";
    
    try {
      if (!token) {
        output += "❌ No token found in localStorage\n";
        output += "Go to /setup-token to set it\n";
        setResults(output);
        return;
      }
      
      // Test sections
      output += "1️⃣ Testing /api/sections...\n";
      const sectionsRes = await fetch("http://localhost:5000/api/sections", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sectionsData = await sectionsRes.json();
      
      if (sectionsData.success) {
        output += `✓ Success! Found ${sectionsData.data?.length} sections\n`;
        sectionsData.data?.forEach((s: any) => {
          output += `  - Section ${s.sectionId}: ${s.courseId} (${s.courseName})\n`;
        });
      } else {
        output += `✗ Failed: ${sectionsData.message}\n`;
      }
      
      // Test enrollments
      output += "\n2️⃣ Testing /api/enrollments?sectionId=3...\n";
      const enrollRes = await fetch("http://localhost:5000/api/enrollments?sectionId=3", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const enrollData = await enrollRes.json();
      
      if (enrollData.success) {
        output += `✓ Success! Found ${enrollData.data?.length} enrollments\n`;
        enrollData.data?.forEach((e: any) => {
          output += `  - Enrollment ${e.enrollmentId}: Student ${e.studentId} in Section ${e.sectionId}\n`;
        });
      } else {
        output += `✗ Failed: ${enrollData.message}\n`;
      }
      
      // Test grades
      if (enrollData.data?.[0]) {
        const enrollmentId = enrollData.data[0].enrollmentId;
        output += `\n3️⃣ Testing /api/grades/enrollment/${enrollmentId}...\n`;
        const gradesRes = await fetch(`http://localhost:5000/api/grades/enrollment/${enrollmentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const gradesData = await gradesRes.json();
        
        if (gradesData.success) {
          output += `✓ Success!\n`;
          output += `  Grade: ${JSON.stringify(gradesData.data)}\n`;
        } else {
          output += `✗ Failed: ${gradesData.message}\n`;
        }
      }
      
    } catch (error) {
      output += `\n❌ Error: ${error}\n`;
    }
    
    setResults(output);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Debug API</h1>
      
      <Button onClick={testAPIs} className="w-full">
        Test APIs
      </Button>
      
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap bg-muted p-4 rounded text-sm overflow-auto">
              {results}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
