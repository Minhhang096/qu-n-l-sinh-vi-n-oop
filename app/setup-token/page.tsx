"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SetTokenPage() {
  const router = useRouter();

  useEffect(() => {
    // Set token and user in localStorage
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjgiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidDAwMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlRlYWNoZXIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhLnR1cmluZ0B1bml2LmVkdSIsImV4cCI6MTc2OTQyNDQ2OSwiaXNzIjoiVW5pdmVyc2l0eUFQSSIsImF1ZCI6IlVuaXZlcnNpdHlBcHAifQ.1H0wi_uIeZqx30J8PKamN3R9R5kGR2ta2KyOr9f0bQk";
    const user = {
      accountId: 8,
      username: 't001',
      role: 'Teacher',
      fullName: 'Dr. Alan Turing',
      email: 'a.turing@univ.edu',
      isLocked: false,
      createdAt: '2019-08-01T00:00:00',
      student: null,
      teacher: {
        teacherId: 'T001',
        fullName: 'Dr. Alan Turing',
        email: 'a.turing@univ.edu',
        deptId: 'CS',
        deptName: 'Computer Science',
        status: 'Active',
        accountId: null,
        sectionCount: 0
      }
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    console.log("✓ Token set!");
    
    // Redirect to teacher classes
    setTimeout(() => {
      router.push('/teacher/classes/CS201-02');
    }, 1000);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">⏳ Đang setup token...</h1>
        <p className="text-muted-foreground">Sẽ chuyển hướng tới trang teacher classes trong giây lát</p>
      </div>
    </div>
  );
}
