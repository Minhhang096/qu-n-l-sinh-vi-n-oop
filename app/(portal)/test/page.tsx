"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getToken } from "@/lib/api-client";
import { toast } from "sonner";

export default function TestLockGradePage() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testLockGrade = async () => {
    setLoading(true);
    const token = getToken();

    if (!token) {
      toast.error("Vui lòng đăng nhập lại");
      setResult("❌ Không có token");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/sections/1/lock-grade", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("✓ Khóa điểm thành công!");
        setResult(`✓ Thành công!\nMessage: ${data.message}\nIsGradeLocked: ${data.data?.isGradeLocked}`);
      } else {
        toast.error("Lỗi: " + data.message);
        setResult(`❌ Lỗi: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Lỗi request");
      setResult(`❌ Lỗi: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSaveGrade = async () => {
    setLoading(true);
    const token = getToken();

    if (!token) {
      toast.error("Vui lòng đăng nhập lại");
      setResult("❌ Không có token");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/grades", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enrollmentId: 1,
          midterm: 85,
          final: 90,
          other: 0,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("✓ Lưu điểm thành công!");
        setResult(`✓ Thành công!\nGrade ID: ${data.data?.gradeId}\nLetter Grade: ${data.data?.letterGrade}`);
      } else {
        toast.error("Lỗi: " + data.message);
        setResult(`❌ Lỗi: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Lỗi request");
      setResult(`❌ Lỗi: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Test Lock Grade & Save Grade</h1>

      <div className="space-y-4">
        <Button onClick={testLockGrade} disabled={loading} className="w-full">
          {loading ? "Đang test..." : "Test Lock Grade"}
        </Button>
        
        <Button onClick={testSaveGrade} disabled={loading} variant="secondary" className="w-full">
          {loading ? "Đang test..." : "Test Save Grade"}
        </Button>
      </div>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Kết quả</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap bg-muted p-4 rounded text-sm">{result}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
