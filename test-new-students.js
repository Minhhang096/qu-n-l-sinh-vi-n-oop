const http = require('http');

// First, login to get token
const loginRequest = JSON.stringify({
  username: 'turing',
  password: 'password123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginRequest.length
  }
};

const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const response = JSON.parse(data);
    const token = response.token;
    console.log('✓ Logged in, token:', token.substring(0, 30) + '...');

    // Now fetch sections
    const sectionsOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/sections',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const sectionsReq = http.request(sectionsOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const sections = JSON.parse(data);
        console.log(`✓ Found ${sections.length} sections`);

        // Get CS201 section (section_id = 3)
        const cs201 = sections.find(s => s.courseId === 'CS201');
        console.log(`✓ CS201 Section ID: ${cs201.id}`);

        // Fetch enrollments for CS201
        const enrollmentOptions = {
          hostname: 'localhost',
          port: 5000,
          path: `/api/enrollments?sectionId=${cs201.id}`,
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const enrollmentReq = http.request(enrollmentOptions, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            const enrollments = JSON.parse(data);
            console.log(`✓ Found ${enrollments.length} students in CS201`);
            
            enrollments.forEach((enrollment, idx) => {
              console.log(`  ${idx + 1}. Student ${enrollment.studentId} (Enrollment ${enrollment.id})`);
            });

            // Fetch grades for the first enrollment
            if (enrollments.length > 0) {
              const firstEnrollmentId = enrollments[0].id;
              const gradesOptions = {
                hostname: 'localhost',
                port: 5000,
                path: `/api/grades/enrollment/${firstEnrollmentId}`,
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              };

              const gradesReq = http.request(gradesOptions, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                  const grade = JSON.parse(data);
                  console.log(`✓ First student grades: midterm=${grade.midterm}, final=${grade.final}`);
                });
              });
              gradesReq.on('error', console.error);
              gradesReq.end();
            }
          });
        });
        enrollmentReq.on('error', console.error);
        enrollmentReq.end();
      });
    });
    sectionsReq.on('error', console.error);
    sectionsReq.end();
  });
});

loginReq.on('error', console.error);
loginReq.write(loginRequest);
loginReq.end();
