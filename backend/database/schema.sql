-- University Management System Database Schema
-- MySQL Database Creation Script

-- Create database
CREATE DATABASE IF NOT EXISTS university_db;
USE university_db;

-- =============================================
-- TABLES
-- =============================================

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    dept_id VARCHAR(10) PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    class_id VARCHAR(20) PRIMARY KEY,
    class_name VARCHAR(100) NOT NULL,
    dept_id VARCHAR(10) NOT NULL,
    cohort_year INT NOT NULL,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE RESTRICT
);

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(20) NOT NULL DEFAULT 'Student',
    full_name VARCHAR(100),
    email VARCHAR(100)
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(20) PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    dob DATE,
    email VARCHAR(100),
    dept_id VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    class_id VARCHAR(20) NOT NULL,
    account_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE RESTRICT,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE RESTRICT,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE SET NULL
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
    teacher_id VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    dept_id VARCHAR(10) NOT NULL,
    account_id INT,
    status VARCHAR(20) DEFAULT 'Active',
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE RESTRICT,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE SET NULL
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    course_id VARCHAR(20) PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    credits INT NOT NULL,
    dept_id VARCHAR(10) NOT NULL,
    description VARCHAR(500),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE RESTRICT
);

-- Sections table
CREATE TABLE IF NOT EXISTS sections (
    section_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id VARCHAR(20) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    teacher_id VARCHAR(20) NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(20) DEFAULT 'Open',
    is_grade_locked BOOLEAN DEFAULT FALSE,
    schedule VARCHAR(100),
    room VARCHAR(50),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE RESTRICT,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE RESTRICT
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    section_id INT NOT NULL,
    enroll_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Enrolled',
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, section_id)
);

-- Grades table
CREATE TABLE IF NOT EXISTS grades (
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    enrollment_id INT NOT NULL UNIQUE,
    midterm DECIMAL(5,2),
    final DECIMAL(5,2),
    other DECIMAL(5,2),
    gpa_point DECIMAL(3,2),
    letter_grade VARCHAR(5),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(20),
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(enrollment_id) ON DELETE CASCADE
);

-- =============================================
-- SEED DATA
-- =============================================

-- =========================================================
-- (1) DEPARTMENTS
-- =========================================================
INSERT INTO departments (dept_id, dept_name) VALUES
('CS',   'Computer Science'),
('MATH', 'Mathematics'),
('PHYS', 'Physics'),
('ENG',  'English Literature'),
('BIO',  'Biology');

-- =========================================================
-- (2) CLASSES
-- =========================================================
INSERT INTO classes (class_id, class_name, dept_id, cohort_year) VALUES
('CS2024A', 'Computer Science 2024 - Section A', 'CS',   2024),
('CS2024B', 'Computer Science 2024 - Section B', 'CS',   2024),
('MATH2024','Mathematics 2024',                  'MATH', 2024),
('PHYS2023','Physics 2023',                      'PHYS', 2023),
('ENG2024', 'English Literature 2024',           'ENG',  2024),
('BIO2024', 'Biology 2024',                      'BIO',  2024);

-- =========================================================
-- =========================================================
-- (3) ACCOUNTS (80)
--   Password (plain text):
--     Admin      : admin123
--     Department : department123
--     Teacher    : teacher123
--     Student    : student123
-- =========================================================
INSERT INTO accounts (account_id, username, password, role, full_name, email, is_locked, created_at) VALUES
-- Admin (2)
(1,  'admin',  'password23', 'Admin', 'System Administrator',   'admin@univ.edu',  FALSE, '2020-01-01'),
(2,  'admin2', 'password123', 'Admin', 'System Administrator 2', 'admin2@univ.edu', FALSE, '2020-01-01'),

-- Department (5)
(3,  'dept_cs',   'password123', 'Department', 'CS Department Office',      'cs@univ.edu',   FALSE, '2020-01-01'),
(4,  'dept_math', 'password123', 'Department', 'Math Department Office',    'math@univ.edu', FALSE, '2020-01-01'),
(5,  'dept_phys', 'password123', 'Department', 'Physics Department Office', 'phys@univ.edu', FALSE, '2020-01-01'),
(6,  'dept_eng',  'password123', 'Department', 'English Department Office', 'eng@univ.edu',  FALSE, '2020-01-01'),
(7,  'dept_bio',  'password123', 'Department', 'Biology Department Office', 'bio@univ.edu',  FALSE, '2020-01-01'),

-- Teacher (13)
(8,  't001', 'password123', 'Teacher', 'Dr. Alan Turing',         'a.turing@univ.edu',      FALSE, '2019-08-01'),
(9,  't002', 'password123', 'Teacher', 'Dr. Katherine Johnson',   'k.johnson@univ.edu',     FALSE, '2019-08-01'),
(10, 't003', 'password123', 'Teacher', 'Dr. Grace Hopper',        'g.hopper@univ.edu',      FALSE, '2019-08-01'),
(11, 't004', 'password123', 'Teacher', 'Dr. Michael Scott',       'm.scott@univ.edu',       FALSE, '2019-08-01'),
(12, 't005', 'password123', 'Teacher', 'Dr. David Anderson',      'd.anderson@univ.edu',    FALSE, '2019-08-01'),
(13, 't006', 'password123', 'Teacher', 'Dr. Robert Wilson',       'r.wilson@univ.edu',      FALSE, '2019-08-01'),
(14, 't007', 'password123', 'Teacher', 'Dr. James Thompson',      'j.thompson@univ.edu',    FALSE, '2019-08-01'),
(15, 't008', 'password123', 'Teacher', 'Dr. Daniel Martinez',     'd.martinez@univ.edu',    FALSE, '2019-08-01'),
(16, 't009', 'password123', 'Teacher', 'Dr. William Taylor',      'w.taylor@univ.edu',      FALSE, '2019-08-01'),
(17, 't010', 'password123', 'Teacher', 'Dr. Joseph Moore',        'j.moore@univ.edu',       FALSE, '2019-08-01'),
(18, 't011', 'password123', 'Teacher', 'Dr. Charles Jackson',     'c.jackson@univ.edu',     FALSE, '2019-08-01'),
(19, 't012', 'password123', 'Teacher', 'Dr. Thomas White',        't.white@univ.edu',       FALSE, '2019-08-01'),
(20, 't013', 'password123', 'Teacher', 'Dr. Christopher Harris',  'c.harris@univ.edu',      FALSE, '2019-08-01'),

-- Student (60)
(21, 'alice',             'password123', 'Student', 'Alice Weaver',         'alice.w@univ.edu',             FALSE, '2024-09-01'),
(22, 'bob',               'password123', 'Student', 'Bob Miller',           'bob.m@univ.edu',               FALSE, '2024-09-01'),
(23, 'charlie',           'password123', 'Student', 'Charlie Brown',        'charlie.b@univ.edu',           FALSE, '2023-09-01'),
(24, 'emma_johnson',      'password123', 'Student', 'Emma Johnson',         'emma.johnson@univ.edu',        FALSE, '2024-09-01'),
(25, 'liam_smith',        'password123', 'Student', 'Liam Smith',           'liam.smith@univ.edu',          FALSE, '2024-09-01'),
(26, 'olivia_williams',   'password123', 'Student', 'Olivia Williams',      'olivia.williams@univ.edu',     FALSE, '2024-09-01'),
(27, 'noah_brown',        'password123', 'Student', 'Noah Brown',           'noah.brown@univ.edu',          FALSE, '2024-09-01'),
(28, 'ava_jones',         'password123', 'Student', 'Ava Jones',            'ava.jones@univ.edu',           FALSE, '2024-09-01'),
(29, 'elijah_garcia',     'password123', 'Student', 'Elijah Garcia',        'elijah.garcia@univ.edu',       FALSE, '2024-09-01'),
(30, 'sophia_miller',     'password123', 'Student', 'Sophia Miller',        'sophia.miller@univ.edu',       FALSE, '2024-09-01'),
(31, 'lucas_davis',       'password123', 'Student', 'Lucas Davis',          'lucas.davis@univ.edu',         FALSE, '2024-09-01'),
(32, 'isabella_rodriguez','password123', 'Student', 'Isabella Rodriguez',   'isabella.rodriguez@univ.edu',  FALSE, '2024-09-01'),
(33, 'mason_martinez',    'password123', 'Student', 'Mason Martinez',       'mason.martinez@univ.edu',      FALSE, '2024-09-01'),
(34, 'mia_hernandez',     'password123', 'Student', 'Mia Hernandez',        'mia.hernandez@univ.edu',       FALSE, '2024-09-01'),
(35, 'ethan_lopez',       'password123', 'Student', 'Ethan Lopez',          'ethan.lopez@univ.edu',         FALSE, '2024-09-01'),
(36, 'charlotte_gonzalez','password123', 'Student', 'Charlotte Gonzalez',   'charlotte.gonzalez@univ.edu',  FALSE, '2024-09-01'),
(37, 'james_wilson',      'password123', 'Student', 'James Wilson',         'james.wilson@univ.edu',        FALSE, '2024-09-01'),
(38, 'amelia_anderson',   'password123', 'Student', 'Amelia Anderson',      'amelia.anderson@univ.edu',     FALSE, '2024-09-01'),
(39, 'benjamin_thomas',   'password123', 'Student', 'Benjamin Thomas',      'benjamin.thomas@univ.edu',     FALSE, '2024-09-01'),
(40, 'harper_taylor',     'password123', 'Student', 'Harper Taylor',        'harper.taylor@univ.edu',       FALSE, '2024-09-01'),
(41, 'logan_moore',       'password123', 'Student', 'Logan Moore',          'logan.moore@univ.edu',         FALSE, '2024-09-01'),
(42, 'evelyn_jackson',    'password123', 'Student', 'Evelyn Jackson',       'evelyn.jackson@univ.edu',      FALSE, '2024-09-01'),
(43, 'alexander_martin',  'password123', 'Student', 'Alexander Martin',     'alexander.martin@univ.edu',    FALSE, '2024-09-01'),
(44, 'abigail_lee',       'password123', 'Student', 'Abigail Lee',          'abigail.lee@univ.edu',         FALSE, '2024-09-01'),
(45, 'henry_perez',       'password123', 'Student', 'Henry Perez',          'henry.perez@univ.edu',         FALSE, '2024-09-01'),
(46, 'emily_thompson',    'password123', 'Student', 'Emily Thompson',       'emily.thompson@univ.edu',      FALSE, '2024-09-01'),
(47, 'sebastian_white',   'password123', 'Student', 'Sebastian White',      'sebastian.white@univ.edu',     FALSE, '2024-09-01'),
(48, 'ella_harris',       'password123', 'Student', 'Ella Harris',          'ella.harris@univ.edu',         FALSE, '2024-09-01'),
(49, 'jack_sanchez',      'password123', 'Student', 'Jack Sanchez',         'jack.sanchez@univ.edu',        FALSE, '2024-09-01'),
(50, 'avery_clark',       'password123', 'Student', 'Avery Clark',          'avery.clark@univ.edu',         FALSE, '2024-09-01'),
(51, 'daniel_ramirez',    'password123', 'Student', 'Daniel Ramirez',       'daniel.ramirez@univ.edu',      FALSE, '2024-09-01'),
(52, 'scarlett_lewis',    'password123', 'Student', 'Scarlett Lewis',       'scarlett.lewis@univ.edu',      FALSE, '2024-09-01'),
(53, 'matthew_robinson',  'password123', 'Student', 'Matthew Robinson',     'matthew.robinson@univ.edu',    FALSE, '2024-09-01'),
(54, 'grace_walker',      'password123', 'Student', 'Grace Walker',         'grace.walker@univ.edu',        FALSE, '2024-09-01'),
(55, 'samuel_young',      'password123', 'Student', 'Samuel Young',         'samuel.young@univ.edu',        FALSE, '2024-09-01'),
(56, 'chloe_allen',       'password123', 'Student', 'Chloe Allen',          'chloe.allen@univ.edu',         FALSE, '2024-09-01'),
(57, 'david_king',        'password123', 'Student', 'David King',           'david.king@univ.edu',          FALSE, '2024-09-01'),
(58, 'lily_wright',       'password123', 'Student', 'Lily Wright',          'lily.wright@univ.edu',         FALSE, '2024-09-01'),
(59, 'joseph_scott',      'password123', 'Student', 'Joseph Scott',         'joseph.scott@univ.edu',        FALSE, '2024-09-01'),
(60, 'hannah_torres',     'password123', 'Student', 'Hannah Torres',        'hannah.torres@univ.edu',       FALSE, '2024-09-01'),
(61, 'andrew_nguyen',     'password123', 'Student', 'Andrew Nguyen',        'andrew.nguyen@univ.edu',       FALSE, '2024-09-01'),
(62, 'victoria_hill',     'password123', 'Student', 'Victoria Hill',        'victoria.hill@univ.edu',       FALSE, '2024-09-01'),
(63, 'ryan_flores',       'password123', 'Student', 'Ryan Flores',          'ryan.flores@univ.edu',         FALSE, '2024-09-01'),
(64, 'zoe_green',         'password123', 'Student', 'Zoe Green',            'zoe.green@univ.edu',           FALSE, '2024-09-01'),
(65, 'nathan_adams',      'password123', 'Student', 'Nathan Adams',         'nathan.adams@univ.edu',        FALSE, '2024-09-01'),
(66, 'penelope_nelson',   'password123', 'Student', 'Penelope Nelson',      'penelope.nelson@univ.edu',     FALSE, '2024-09-01'),
(67, 'caleb_baker',       'password123', 'Student', 'Caleb Baker',          'caleb.baker@univ.edu',         FALSE, '2024-09-01'),
(68, 'riley_hall',        'password123', 'Student', 'Riley Hall',           'riley.hall@univ.edu',          FALSE, '2024-09-01'),
(69, 'anthony_rivera',    'password123', 'Student', 'Anthony Rivera',       'anthony.rivera@univ.edu',      FALSE, '2024-09-01'),
(70, 'layla_campbell',    'password123', 'Student', 'Layla Campbell',       'layla.campbell@univ.edu',      FALSE, '2024-09-01'),
(71, 'isaac_mitchell',    'password123', 'Student', 'Isaac Mitchell',       'isaac.mitchell@univ.edu',      FALSE, '2024-09-01'),
(72, 'aria_carter',       'password123', 'Student', 'Aria Carter',          'aria.carter@univ.edu',         FALSE, '2024-09-01'),
(73, 'julian_roberts',    'password123', 'Student', 'Julian Roberts',       'julian.roberts@univ.edu',      FALSE, '2024-09-01'),
(74, 'stella_gomez',      'password123', 'Student', 'Stella Gomez',         'stella.gomez@univ.edu',        FALSE, '2024-09-01'),
(75, 'leo_phillips',      'password123', 'Student', 'Leo Phillips',         'leo.phillips@univ.edu',        FALSE, '2024-09-01'),
(76, 'nora_evans',        'password123', 'Student', 'Nora Evans',           'nora.evans@univ.edu',          FALSE, '2024-09-01'),
(77, 'christian_turner',  'password123', 'Student', 'Christian Turner',     'christian.turner@univ.edu',    FALSE, '2024-09-01'),
(78, 'paisley_diaz',      'password123', 'Student', 'Paisley Diaz',         'paisley.diaz@univ.edu',        FALSE, '2024-09-01'),
(79, 'skylar_reed',       'password123', 'Student', 'Skylar Reed',          'skylar.reed@univ.edu',         FALSE, '2024-09-01'),
(80, 'madison_cook',      'password123', 'Student', 'Madison Cook',         'madison.cook@univ.edu',        FALSE, '2024-09-01');

-- =========================================================
-- (4) TEACHERS (13)
-- =========================================================
INSERT INTO teachers (teacher_id, full_name, email, dept_id, account_id, status) VALUES
('T001', 'Dr. Alan Turing',         'a.turing@univ.edu',     'CS',   8,  'Active'),
('T002', 'Dr. Katherine Johnson',   'k.johnson@univ.edu',    'MATH', 9,  'Active'),
('T003', 'Dr. Grace Hopper',        'g.hopper@univ.edu',     'CS',   10, 'Active'),
('T004', 'Dr. Michael Scott',       'm.scott@univ.edu',      'CS',   11, 'Active'),
('T005', 'Dr. David Anderson',      'd.anderson@univ.edu',   'CS',   12, 'Active'),
('T006', 'Dr. Robert Wilson',       'r.wilson@univ.edu',     'MATH', 13, 'Active'),
('T007', 'Dr. James Thompson',      'j.thompson@univ.edu',   'MATH', 14, 'Active'),
('T008', 'Dr. Daniel Martinez',     'd.martinez@univ.edu',   'PHYS', 15, 'Active'),
('T009', 'Dr. William Taylor',      'w.taylor@univ.edu',     'PHYS', 16, 'Active'),
('T010', 'Dr. Joseph Moore',        'j.moore@univ.edu',      'ENG',  17, 'Active'),
('T011', 'Dr. Charles Jackson',     'c.jackson@univ.edu',    'ENG',  18, 'Active'),
('T012', 'Dr. Thomas White',        't.white@univ.edu',      'BIO',  19, 'Active'),
('T013', 'Dr. Christopher Harris',  'c.harris@univ.edu',     'BIO',  20, 'Active');

-- =========================================================
-- (5) STUDENTS (60)
-- =========================================================
INSERT INTO students (student_id, fullname, email, dob, dept_id, class_id, account_id, status) VALUES
('2024001', 'Alice Weaver',         'alice.w@univ.edu',             '2004-05-15', 'CS',   'CS2024A', 21, 'Active'),
('2024002', 'Bob Miller',           'bob.m@univ.edu',               '2004-08-22', 'MATH', 'MATH2024',22, 'Active'),
('2023015', 'Charlie Brown',        'charlie.b@univ.edu',           '2003-03-10', 'PHYS', 'PHYS2023',23, 'Active'),

('2024003', 'Emma Johnson',         'emma.johnson@univ.edu',        '2004-01-11', 'CS',   'CS2024A', 24, 'Active'),
('2024004', 'Liam Smith',           'liam.smith@univ.edu',          '2004-02-03', 'CS',   'CS2024B', 25, 'Active'),
('2024005', 'Olivia Williams',      'olivia.williams@univ.edu',     '2004-03-14', 'MATH', 'MATH2024',26, 'Active'),
('2024006', 'Noah Brown',           'noah.brown@univ.edu',          '2004-04-09', 'PHYS', 'PHYS2023',27, 'Active'),
('2024007', 'Ava Jones',            'ava.jones@univ.edu',           '2004-05-21', 'ENG',  'ENG2024', 28, 'Active'),
('2024008', 'Elijah Garcia',        'elijah.garcia@univ.edu',       '2004-06-18', 'BIO',  'BIO2024', 29, 'Active'),
('2024009', 'Sophia Miller',        'sophia.miller@univ.edu',       '2004-07-07', 'CS',   'CS2024A', 30, 'Active'),
('2024010', 'Lucas Davis',          'lucas.davis@univ.edu',         '2004-08-12', 'MATH', 'MATH2024',31, 'Active'),
('2024011', 'Isabella Rodriguez',   'isabella.rodriguez@univ.edu',  '2004-09-25', 'PHYS', 'PHYS2023',32, 'Active'),
('2024012', 'Mason Martinez',       'mason.martinez@univ.edu',      '2004-10-02', 'ENG',  'ENG2024', 33, 'Active'),
('2024013', 'Mia Hernandez',        'mia.hernandez@univ.edu',       '2004-11-16', 'BIO',  'BIO2024', 34, 'Active'),
('2024014', 'Ethan Lopez',          'ethan.lopez@univ.edu',         '2004-12-05', 'CS',   'CS2024B', 35, 'Active'),
('2024015', 'Charlotte Gonzalez',   'charlotte.gonzalez@univ.edu',  '2004-01-19', 'MATH', 'MATH2024',36, 'Active'),
('2024016', 'James Wilson',         'james.wilson@univ.edu',        '2004-02-27', 'PHYS', 'PHYS2023',37, 'Active'),
('2024017', 'Amelia Anderson',      'amelia.anderson@univ.edu',     '2004-03-08', 'ENG',  'ENG2024', 38, 'Active'),
('2024018', 'Benjamin Thomas',      'benjamin.thomas@univ.edu',     '2004-04-13', 'BIO',  'BIO2024', 39, 'Active'),
('2024019', 'Harper Taylor',        'harper.taylor@univ.edu',       '2004-05-04', 'CS',   'CS2024A', 40, 'Active'),
('2024020', 'Logan Moore',          'logan.moore@univ.edu',         '2004-06-22', 'CS',   'CS2024B', 41, 'Active'),
('2024021', 'Evelyn Jackson',       'evelyn.jackson@univ.edu',      '2004-07-15', 'MATH', 'MATH2024',42, 'Active'),
('2024022', 'Alexander Martin',     'alexander.martin@univ.edu',    '2004-08-28', 'PHYS', 'PHYS2023',43, 'Active'),
('2024023', 'Abigail Lee',          'abigail.lee@univ.edu',         '2004-09-09', 'ENG',  'ENG2024', 44, 'Active'),
('2024024', 'Henry Perez',          'henry.perez@univ.edu',         '2004-10-17', 'BIO',  'BIO2024', 45, 'Active'),
('2024025', 'Emily Thompson',       'emily.thompson@univ.edu',      '2004-11-02', 'CS',   'CS2024A', 46, 'Active'),
('2024026', 'Sebastian White',      'sebastian.white@univ.edu',     '2004-12-14', 'MATH', 'MATH2024',47, 'Active'),
('2024027', 'Ella Harris',          'ella.harris@univ.edu',         '2004-01-30', 'PHYS', 'PHYS2023',48, 'Active'),
('2024028', 'Jack Sanchez',         'jack.sanchez@univ.edu',        '2004-02-18', 'ENG',  'ENG2024', 49, 'Active'),
('2024029', 'Avery Clark',          'avery.clark@univ.edu',         '2004-03-26', 'BIO',  'BIO2024', 50, 'Active'),
('2024030', 'Daniel Ramirez',       'daniel.ramirez@univ.edu',      '2004-04-06', 'CS',   'CS2024B', 51, 'Active'),
('2024031', 'Scarlett Lewis',       'scarlett.lewis@univ.edu',      '2004-05-18', 'MATH', 'MATH2024',52, 'Active'),
('2024032', 'Matthew Robinson',     'matthew.robinson@univ.edu',    '2004-06-09', 'PHYS', 'PHYS2023',53, 'Active'),
('2024033', 'Grace Walker',         'grace.walker@univ.edu',        '2004-07-03', 'ENG',  'ENG2024', 54, 'Active'),
('2024034', 'Samuel Young',         'samuel.young@univ.edu',        '2004-08-20', 'BIO',  'BIO2024', 55, 'Active'),
('2024035', 'Chloe Allen',          'chloe.allen@univ.edu',         '2004-09-12', 'CS',   'CS2024A', 56, 'Active'),
('2024036', 'David King',           'david.king@univ.edu',          '2004-10-01', 'CS',   'CS2024B', 57, 'Active'),
('2024037', 'Lily Wright',          'lily.wright@univ.edu',         '2004-11-11', 'MATH', 'MATH2024',58, 'Active'),
('2024038', 'Joseph Scott',         'joseph.scott@univ.edu',        '2004-12-03', 'PHYS', 'PHYS2023',59, 'Active'),
('2024039', 'Hannah Torres',        'hannah.torres@univ.edu',       '2004-01-08', 'ENG',  'ENG2024', 60, 'Active'),
('2024040', 'Andrew Nguyen',        'andrew.nguyen@univ.edu',       '2004-02-22', 'BIO',  'BIO2024', 61, 'Active'),
('2024041', 'Victoria Hill',        'victoria.hill@univ.edu',       '2004-03-10', 'CS',   'CS2024A', 62, 'Active'),
('2024042', 'Ryan Flores',          'ryan.flores@univ.edu',         '2004-04-24', 'MATH', 'MATH2024',63, 'Active'),
('2024043', 'Zoe Green',            'zoe.green@univ.edu',           '2004-05-09', 'PHYS', 'PHYS2023',64, 'Active'),
('2024044', 'Nathan Adams',         'nathan.adams@univ.edu',        '2004-06-17', 'ENG',  'ENG2024', 65, 'Active'),
('2024045', 'Penelope Nelson',      'penelope.nelson@univ.edu',     '2004-07-26', 'BIO',  'BIO2024', 66, 'Active'),
('2024046', 'Caleb Baker',          'caleb.baker@univ.edu',         '2004-08-08', 'CS',   'CS2024B', 67, 'Active'),
('2024047', 'Riley Hall',           'riley.hall@univ.edu',          '2004-09-19', 'MATH', 'MATH2024',68, 'Active'),
('2024048', 'Anthony Rivera',       'anthony.rivera@univ.edu',      '2004-10-06', 'PHYS', 'PHYS2023',69, 'Active'),
('2024049', 'Layla Campbell',       'layla.campbell@univ.edu',      '2004-11-21', 'ENG',  'ENG2024', 70, 'Active'),
('2024050', 'Isaac Mitchell',       'isaac.mitchell@univ.edu',      '2004-12-09', 'BIO',  'BIO2024', 71, 'Active'),
('2024051', 'Aria Carter',          'aria.carter@univ.edu',         '2004-01-24', 'CS',   'CS2024A', 72, 'Active'),
('2024052', 'Julian Roberts',       'julian.roberts@univ.edu',      '2004-02-11', 'MATH', 'MATH2024',73, 'Active'),
('2024053', 'Stella Gomez',         'stella.gomez@univ.edu',        '2004-03-23', 'PHYS', 'PHYS2023',74, 'Active'),
('2024054', 'Leo Phillips',         'leo.phillips@univ.edu',        '2004-04-15', 'ENG',  'ENG2024', 75, 'Active'),
('2024055', 'Nora Evans',           'nora.evans@univ.edu',          '2004-05-28', 'BIO',  'BIO2024', 76, 'Active'),
('2024056', 'Christian Turner',     'christian.turner@univ.edu',    '2004-06-12', 'CS',   'CS2024B', 77, 'Active'),
('2024057', 'Paisley Diaz',         'paisley.diaz@univ.edu',        '2004-07-29', 'MATH', 'MATH2024',78, 'Active'),
('2024058', 'Skylar Reed',          'skylar.reed@univ.edu',         '2004-08-16', 'PHYS', 'PHYS2023',79, 'Active'),
('2024059', 'Madison Cook',         'madison.cook@univ.edu',        '2004-09-04', 'ENG',  'ENG2024', 80, 'Active');

-- =========================================================
-- (6) COURSES
-- =========================================================
INSERT INTO courses (course_id, course_name, credits, dept_id, description) VALUES
('CS101',   'Introduction to Computer Science', 4, 'CS',   'Foundational concepts in computing'),
('CS201',   'Data Structures & Algorithms',     4, 'CS',   'Core data structures and algorithms'),
('CS450',   'Machine Learning',                4, 'CS',   'Fundamentals of machine learning'),
('MATH201', 'Linear Algebra',                  3, 'MATH', 'Vectors, matrices, and linear transformations'),
('ENG102',  'Academic Writing',                3, 'ENG',  'Research and academic writing skills'),
('PHYS101', 'General Physics I',               4, 'PHYS', 'Mechanics, waves, and basic thermodynamics'),
('BIO101',  'Introduction to Biology',         4, 'BIO',  'Cell biology, genetics, and ecology');

-- =========================================================
-- (7) SECTIONS
-- =========================================================
INSERT INTO sections (section_id, course_id, teacher_id, semester, capacity, status, is_grade_locked, schedule, room) VALUES
(1, 'CS101',   'T001', 'Spring2026', 50, 'Open',   FALSE, 'Mon, Wed 10:00-11:30',        'Science 101'),
(2, 'CS101',   'T003', 'Spring2026', 50, 'Closed', FALSE, 'Tue, Thu 14:00-15:30',        'Science 102'),
(3, 'CS201',   'T001', 'Spring2026', 40, 'Open',   FALSE, 'Mon, Wed, Fri 09:00-10:00',   'Tech Lab 201'),
(4, 'MATH201', 'T002', 'Spring2026', 45, 'Open',   FALSE, 'Tue, Thu 10:00-11:30',        'Math Hall 101'),
(5, 'PHYS101', 'T008', 'Spring2026', 45, 'Open',   FALSE, 'Mon, Thu 08:00-09:30',        'Physics Lab 01'),
(6, 'BIO101',  'T012', 'Spring2026', 45, 'Open',   FALSE, 'Wed, Fri 13:00-14:30',        'Bio Hall 02');

-- =========================================================
-- (8) ENROLLMENTS (chỉ enroll vào section Open)
-- =========================================================
INSERT INTO enrollments (enrollment_id, student_id, section_id, enroll_date, status) VALUES
(1, '2024001', 1, '2026-01-10', 'Enrolled'),
(2, '2024001', 4, '2026-01-10', 'Enrolled'),
(3, '2024002', 3, '2026-01-12', 'Enrolled'),
(4, '2023015', 1, '2026-01-08', 'Enrolled'),
(5, '2024001', 5, '2026-01-11', 'Enrolled'),
(6, '2024002', 6, '2026-01-11', 'Enrolled');

-- =========================================================
-- (9) GRADES (updated_by khớp teacher của section)
-- =========================================================
INSERT INTO grades (grade_id, enrollment_id, midterm, final, other, gpa_point, letter_grade, updated_by) VALUES
(1, 1, 85.00, 88.00, 90.00, 3.50, 'B+', 'T001'), -- section 1 -> T001
(2, 2, 92.00, 90.00, 88.00, 3.70, 'A-', 'T002'), -- section 4 -> T002
(3, 3, 78.00, 82.00, 80.00, 3.00, 'B',  'T001'), -- section 3 -> T001
(4, 4, 70.00, 75.00, 72.00, 2.50, 'C+', 'T001'), -- section 1 -> T001
(5, 5, 88.00, 90.00, 85.00, 3.70, 'A-', 'T008'), -- section 5 -> T008
(6, 6, 81.00, 79.00, 84.00, 3.20, 'B+', 'T012'); -- section 6 -> T012

-- =========================================================
-- (10) INDEXES FOR PERFORMANCE
-- =========================================================
CREATE INDEX idx_students_dept       ON students(dept_id);
CREATE INDEX idx_students_class      ON students(class_id);
CREATE INDEX idx_teachers_dept       ON teachers(dept_id);
CREATE INDEX idx_courses_dept        ON courses(dept_id);
CREATE INDEX idx_sections_course     ON sections(course_id);
CREATE INDEX idx_sections_teacher    ON sections(teacher_id);
CREATE INDEX idx_sections_semester   ON sections(semester);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_section ON enrollments(section_id);
