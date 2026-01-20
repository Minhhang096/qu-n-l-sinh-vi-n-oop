// Script để set localStorage với valid token

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
    teacherId: 't001',
    fullName: 'Dr. Alan Turing',
    email: 'a.turing@univ.edu',
    deptId: 'CS',
    deptName: 'Computer Science',
    status: 'Active',
    accountId: null,
    sectionCount: 0
  }
};

// If in browser
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  console.log('✓ Token and user saved to localStorage');
} else {
  console.log('Not in browser environment');
  console.log('\n📋 MANUAL SETUP:');
  console.log('1. Open browser DevTools (F12)');
  console.log('2. Go to Console tab');
  console.log('3. Paste this code:');
  console.log(`
localStorage.setItem('token', '${token}');
localStorage.setItem('user', '${JSON.stringify(user)}');
location.reload();
  `);
}
