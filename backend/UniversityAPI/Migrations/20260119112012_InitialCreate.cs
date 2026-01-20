using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace UniversityAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "accounts",
                columns: table => new
                {
                    account_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    username = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    password = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    is_locked = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    role = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    full_name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_accounts", x => x.account_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "departments",
                columns: table => new
                {
                    dept_id = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dept_name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_departments", x => x.dept_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "classes",
                columns: table => new
                {
                    class_id = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    class_name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dept_id = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    cohort_year = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_classes", x => x.class_id);
                    table.ForeignKey(
                        name: "FK_classes_departments_dept_id",
                        column: x => x.dept_id,
                        principalTable: "departments",
                        principalColumn: "dept_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "courses",
                columns: table => new
                {
                    course_id = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    course_name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    credits = table.Column<int>(type: "int", nullable: false),
                    dept_id = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_courses", x => x.course_id);
                    table.ForeignKey(
                        name: "FK_courses_departments_dept_id",
                        column: x => x.dept_id,
                        principalTable: "departments",
                        principalColumn: "dept_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "teachers",
                columns: table => new
                {
                    teacher_id = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    full_name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dept_id = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    account_id = table.Column<int>(type: "int", nullable: true),
                    status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_teachers", x => x.teacher_id);
                    table.ForeignKey(
                        name: "FK_teachers_accounts_account_id",
                        column: x => x.account_id,
                        principalTable: "accounts",
                        principalColumn: "account_id");
                    table.ForeignKey(
                        name: "FK_teachers_departments_dept_id",
                        column: x => x.dept_id,
                        principalTable: "departments",
                        principalColumn: "dept_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "students",
                columns: table => new
                {
                    student_id = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    fullname = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dob = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    email = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dept_id = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    class_id = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    account_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_students", x => x.student_id);
                    table.ForeignKey(
                        name: "FK_students_accounts_account_id",
                        column: x => x.account_id,
                        principalTable: "accounts",
                        principalColumn: "account_id");
                    table.ForeignKey(
                        name: "FK_students_classes_class_id",
                        column: x => x.class_id,
                        principalTable: "classes",
                        principalColumn: "class_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_students_departments_dept_id",
                        column: x => x.dept_id,
                        principalTable: "departments",
                        principalColumn: "dept_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "sections",
                columns: table => new
                {
                    section_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    course_id = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    semester = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    teacher_id = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    capacity = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    is_grade_locked = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    schedule = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    room = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sections", x => x.section_id);
                    table.ForeignKey(
                        name: "FK_sections_courses_course_id",
                        column: x => x.course_id,
                        principalTable: "courses",
                        principalColumn: "course_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_sections_teachers_teacher_id",
                        column: x => x.teacher_id,
                        principalTable: "teachers",
                        principalColumn: "teacher_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "enrollments",
                columns: table => new
                {
                    enrollment_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    student_id = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    section_id = table.Column<int>(type: "int", nullable: false),
                    enroll_date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_enrollments", x => x.enrollment_id);
                    table.ForeignKey(
                        name: "FK_enrollments_sections_section_id",
                        column: x => x.section_id,
                        principalTable: "sections",
                        principalColumn: "section_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_enrollments_students_student_id",
                        column: x => x.student_id,
                        principalTable: "students",
                        principalColumn: "student_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "grades",
                columns: table => new
                {
                    grade_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    enrollment_id = table.Column<int>(type: "int", nullable: false),
                    midterm = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    final = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    other = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    gpa_point = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    letter_grade = table.Column<string>(type: "varchar(5)", maxLength: 5, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_grades", x => x.grade_id);
                    table.ForeignKey(
                        name: "FK_grades_enrollments_enrollment_id",
                        column: x => x.enrollment_id,
                        principalTable: "enrollments",
                        principalColumn: "enrollment_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "accounts",
                columns: new[] { "account_id", "created_at", "email", "full_name", "is_locked", "password", "role", "username" },
                values: new object[,]
                {
                    { 1, new DateTime(2020, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@univ.edu", "System Administrator", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Admin", "admin" },
                    { 2, new DateTime(2020, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "department@univ.edu", "Emily Davis", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Department", "department" },
                    { 3, new DateTime(2019, 8, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "a.turing@univ.edu", "Dr. Alan Turing", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Teacher", "turing" },
                    { 4, new DateTime(2019, 8, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "k.johnson@univ.edu", "Dr. Katherine Johnson", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Teacher", "johnson" },
                    { 5, new DateTime(2019, 8, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "g.hopper@univ.edu", "Dr. Grace Hopper", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Teacher", "hopper" },
                    { 6, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "alice.w@univ.edu", "Alice Weaver", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "alice" },
                    { 7, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "bob.m@univ.edu", "Bob Miller", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "bob" },
                    { 8, new DateTime(2023, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "charlie.b@univ.edu", "Charlie Brown", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "charlie" },
                    { 9, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "diana.p@univ.edu", "Diana Prince", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "diana" },
                    { 10, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "evan.j@univ.edu", "Evan Johnson", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "evan" },
                    { 11, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "fiona.g@univ.edu", "Fiona Green", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "fiona" },
                    { 12, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "george.h@univ.edu", "George Harris", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "george" },
                    { 13, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "helena.k@univ.edu", "Helena King", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "helena" },
                    { 14, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "isaac.l@univ.edu", "Isaac Lee", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "isaac" },
                    { 15, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "julia.m@univ.edu", "Julia Martin", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "julia" },
                    { 16, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "kevin.n@univ.edu", "Kevin Nelson", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "kevin" },
                    { 17, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "laura.o@univ.edu", "Laura Owen", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "laura" },
                    { 18, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "michael.p@univ.edu", "Michael Parker", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "michael" },
                    { 19, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "nancy.q@univ.edu", "Nancy Quinn", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "nancy" },
                    { 20, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "oscar.r@univ.edu", "Oscar Roberts", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "oscar" },
                    { 21, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "paula.s@univ.edu", "Paula Scott", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "paula" },
                    { 22, new DateTime(2024, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "quinn.t@univ.edu", "Quinn Taylor", false, "$2a$11$K2vXsKpWkGqWy7E.U6TxKelIQR6.WZYpPJG3IWC5FbJXzRYk7DXPK", "Student", "quinn" }
                });

            migrationBuilder.InsertData(
                table: "departments",
                columns: new[] { "dept_id", "dept_name" },
                values: new object[,]
                {
                    { "BIO", "Biology" },
                    { "CS", "Computer Science" },
                    { "ENG", "English Literature" },
                    { "MATH", "Mathematics" },
                    { "PHYS", "Physics" }
                });

            migrationBuilder.InsertData(
                table: "classes",
                columns: new[] { "class_id", "class_name", "cohort_year", "dept_id" },
                values: new object[,]
                {
                    { "CS2024A", "Computer Science 2024 - Section A", 2024, "CS" },
                    { "CS2024B", "Computer Science 2024 - Section B", 2024, "CS" },
                    { "MATH2024", "Mathematics 2024", 2024, "MATH" },
                    { "PHYS2023", "Physics 2023", 2023, "PHYS" }
                });

            migrationBuilder.InsertData(
                table: "courses",
                columns: new[] { "course_id", "course_name", "credits", "dept_id", "description" },
                values: new object[,]
                {
                    { "CS101", "Introduction to Computer Science", 4, "CS", "Foundational concepts in computing" },
                    { "CS201", "Data Structures & Algorithms", 4, "CS", "Core data structures and algorithms" },
                    { "CS450", "Machine Learning", 4, "CS", "Fundamentals of machine learning" },
                    { "ENG102", "Academic Writing", 3, "ENG", "Research and academic writing skills" },
                    { "MATH201", "Linear Algebra", 3, "MATH", "Vectors, matrices, and linear transformations" }
                });

            migrationBuilder.InsertData(
                table: "teachers",
                columns: new[] { "teacher_id", "account_id", "dept_id", "email", "full_name", "status" },
                values: new object[,]
                {
                    { "T001", 3, "CS", "a.turing@univ.edu", "Dr. Alan Turing", "Active" },
                    { "T002", 4, "MATH", "k.johnson@univ.edu", "Dr. Katherine Johnson", "Active" },
                    { "T003", 5, "CS", "g.hopper@univ.edu", "Dr. Grace Hopper", "Active" }
                });

            migrationBuilder.InsertData(
                table: "sections",
                columns: new[] { "section_id", "capacity", "course_id", "is_grade_locked", "room", "schedule", "semester", "status", "teacher_id" },
                values: new object[,]
                {
                    { 1, 50, "CS101", false, "Science 101", "Mon, Wed 10:00-11:30", "Spring2026", "Open", "T001" },
                    { 2, 50, "CS101", false, "Science 102", "Tue, Thu 14:00-15:30", "Spring2026", "Closed", "T003" },
                    { 3, 40, "CS201", false, "Tech Lab 201", "Mon, Wed, Fri 09:00-10:00", "Spring2026", "Open", "T001" },
                    { 4, 45, "MATH201", false, "Math Hall 101", "Tue, Thu 10:00-11:30", "Spring2026", "Open", "T002" }
                });

            migrationBuilder.InsertData(
                table: "students",
                columns: new[] { "student_id", "account_id", "class_id", "dept_id", "dob", "email", "fullname", "status" },
                values: new object[,]
                {
                    { "2023015", 8, "PHYS2023", "PHYS", new DateTime(2003, 3, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "charlie.b@univ.edu", "Charlie Brown", "Active" },
                    { "2024001", 6, "CS2024A", "CS", new DateTime(2004, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "alice.w@univ.edu", "Alice Weaver", "Active" },
                    { "2024002", 7, "CS2024A", "CS", new DateTime(2004, 8, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "bob.m@univ.edu", "Bob Miller", "Active" },
                    { "2024003", 9, "CS2024A", "CS", new DateTime(2004, 3, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "diana.p@univ.edu", "Diana Prince", "Active" },
                    { "2024004", 10, "CS2024A", "CS", new DateTime(2004, 7, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "evan.j@univ.edu", "Evan Johnson", "Active" },
                    { "2024005", 11, "CS2024A", "CS", new DateTime(2004, 11, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "fiona.g@univ.edu", "Fiona Green", "Active" },
                    { "2024006", 12, "CS2024A", "CS", new DateTime(2004, 2, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "george.h@univ.edu", "George Harris", "Active" },
                    { "2024007", 13, "CS2024A", "CS", new DateTime(2004, 6, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), "helena.k@univ.edu", "Helena King", "Active" },
                    { "2024008", 14, "CS2024A", "CS", new DateTime(2004, 9, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), "isaac.l@univ.edu", "Isaac Lee", "Active" },
                    { "2024009", 15, "MATH2024", "MATH", new DateTime(2004, 1, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "julia.m@univ.edu", "Julia Martin", "Active" },
                    { "2024010", 16, "MATH2024", "MATH", new DateTime(2004, 4, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "kevin.n@univ.edu", "Kevin Nelson", "Active" },
                    { "2024011", 17, "MATH2024", "MATH", new DateTime(2004, 10, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "laura.o@univ.edu", "Laura Owen", "Active" },
                    { "2024012", 18, "MATH2024", "MATH", new DateTime(2004, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "michael.p@univ.edu", "Michael Parker", "Active" },
                    { "2024013", 19, "CS2024B", "CS", new DateTime(2004, 5, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "nancy.q@univ.edu", "Nancy Quinn", "Active" },
                    { "2024014", 20, "CS2024B", "CS", new DateTime(2004, 8, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), "oscar.r@univ.edu", "Oscar Roberts", "Active" },
                    { "2024015", 21, "CS2024B", "CS", new DateTime(2004, 3, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "paula.s@univ.edu", "Paula Scott", "Active" },
                    { "2024016", 22, "CS2024B", "ENG", new DateTime(2004, 7, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "quinn.t@univ.edu", "Quinn Taylor", "Active" }
                });

            migrationBuilder.InsertData(
                table: "enrollments",
                columns: new[] { "enrollment_id", "enroll_date", "section_id", "status", "student_id" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "Enrolled", "2024001" },
                    { 2, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "Enrolled", "2024002" },
                    { 3, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "Enrolled", "2024003" },
                    { 4, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "Enrolled", "2024004" },
                    { 5, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "Enrolled", "2024005" },
                    { 6, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "Enrolled", "2024006" },
                    { 7, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "Enrolled", "2024007" },
                    { 8, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "Enrolled", "2024008" },
                    { 9, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, "Enrolled", "2024013" },
                    { 10, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, "Enrolled", "2024014" },
                    { 11, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, "Enrolled", "2024015" },
                    { 12, new DateTime(2026, 1, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, "Enrolled", "2023015" },
                    { 13, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, "Enrolled", "2024016" },
                    { 14, new DateTime(2026, 1, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, "Enrolled", "2024001" },
                    { 15, new DateTime(2026, 1, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, "Enrolled", "2024002" },
                    { 16, new DateTime(2026, 1, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, "Enrolled", "2024003" },
                    { 17, new DateTime(2026, 1, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, "Enrolled", "2024004" },
                    { 18, new DateTime(2026, 1, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, "Enrolled", "2024005" },
                    { 19, new DateTime(2026, 1, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, "Enrolled", "2024006" },
                    { 20, new DateTime(2026, 1, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, "Enrolled", "2024007" },
                    { 21, new DateTime(2026, 1, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, "Enrolled", "2024008" },
                    { 22, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, "Enrolled", "2024009" },
                    { 23, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, "Enrolled", "2024010" },
                    { 24, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, "Enrolled", "2024011" },
                    { 25, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, "Enrolled", "2024012" },
                    { 26, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, "Enrolled", "2024001" },
                    { 27, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, "Enrolled", "2024002" },
                    { 28, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, "Enrolled", "2024003" },
                    { 29, new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, "Enrolled", "2024004" }
                });

            migrationBuilder.InsertData(
                table: "grades",
                columns: new[] { "grade_id", "enrollment_id", "final", "gpa_point", "letter_grade", "midterm", "other", "updated_at", "updated_by" },
                values: new object[,]
                {
                    { 1, 1, 88m, 3.5m, "B+", 85m, 90m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3712), "T001" },
                    { 2, 2, 90m, 3.7m, "A-", 92m, 88m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3716), "T001" },
                    { 3, 3, 82m, 3.0m, "B", 78m, 80m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3719), "T001" },
                    { 4, 4, 91m, 3.6m, "A-", 88m, 89m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3723), "T001" },
                    { 5, 5, 79m, 2.9m, "C+", 75m, 77m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3725), "T001" },
                    { 6, 6, 93m, 3.8m, "A", 91m, 92m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3728), "T001" },
                    { 7, 7, 85m, 3.3m, "B", 82m, 84m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3731), "T001" },
                    { 8, 8, 87m, 3.5m, "B+", 89m, 88m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3733), "T001" },
                    { 9, 9, 83m, 3.2m, "B", 80m, 81m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3736), "T003" },
                    { 10, 10, 89m, 3.5m, "B+", 86m, 87m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3738), "T003" },
                    { 11, 11, 92m, 3.9m, "A", 94m, 93m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3741), "T003" },
                    { 12, 12, 80m, 2.9m, "C+", 77m, 78m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3747), "T003" },
                    { 13, 13, 86m, 3.3m, "B", 83m, 85m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3750), "T003" },
                    { 14, 14, 91m, 3.6m, "A-", 88m, 90m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3752), "T001" },
                    { 15, 15, 82m, 3.2m, "B", 85m, 80m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3756), "T001" },
                    { 16, 16, 81m, 3.0m, "B", 79m, 80m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3758), "T001" },
                    { 17, 17, 94m, 3.8m, "A", 92m, 93m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3761), "T001" },
                    { 18, 18, 78m, 2.8m, "C+", 76m, 77m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3763), "T001" },
                    { 19, 19, 89m, 3.5m, "B+", 87m, 88m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3766), "T001" },
                    { 20, 20, 86m, 3.3m, "B", 84m, 85m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3768), "T001" },
                    { 21, 21, 88m, 3.6m, "A-", 90m, 89m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3771), "T001" },
                    { 22, 22, 92m, 3.7m, "A-", 89m, 91m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3773), "T002" },
                    { 23, 23, 84m, 3.2m, "B", 81m, 83m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3775), "T002" },
                    { 24, 24, 95m, 3.9m, "A", 93m, 94m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3778), "T002" },
                    { 25, 25, 77m, 2.7m, "C", 74m, 75m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3780), "T002" },
                    { 26, 26, 88m, 3.4m, "B+", 86m, 87m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3783), "T002" },
                    { 27, 27, 91m, 3.7m, "A-", 90m, 91m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3785), "T002" },
                    { 28, 28, 85m, 3.3m, "B", 82m, 84m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3788), "T002" },
                    { 29, 29, 90m, 3.5m, "B+", 87m, 88m, new DateTime(2026, 1, 19, 11, 20, 12, 408, DateTimeKind.Utc).AddTicks(3790), "T002" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_accounts_username",
                table: "accounts",
                column: "username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_classes_dept_id",
                table: "classes",
                column: "dept_id");

            migrationBuilder.CreateIndex(
                name: "IX_courses_dept_id",
                table: "courses",
                column: "dept_id");

            migrationBuilder.CreateIndex(
                name: "IX_enrollments_section_id",
                table: "enrollments",
                column: "section_id");

            migrationBuilder.CreateIndex(
                name: "IX_enrollments_student_id_section_id",
                table: "enrollments",
                columns: new[] { "student_id", "section_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_grades_enrollment_id",
                table: "grades",
                column: "enrollment_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_sections_course_id",
                table: "sections",
                column: "course_id");

            migrationBuilder.CreateIndex(
                name: "IX_sections_teacher_id",
                table: "sections",
                column: "teacher_id");

            migrationBuilder.CreateIndex(
                name: "IX_students_account_id",
                table: "students",
                column: "account_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_students_class_id",
                table: "students",
                column: "class_id");

            migrationBuilder.CreateIndex(
                name: "IX_students_dept_id",
                table: "students",
                column: "dept_id");

            migrationBuilder.CreateIndex(
                name: "IX_teachers_account_id",
                table: "teachers",
                column: "account_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_teachers_dept_id",
                table: "teachers",
                column: "dept_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "grades");

            migrationBuilder.DropTable(
                name: "enrollments");

            migrationBuilder.DropTable(
                name: "sections");

            migrationBuilder.DropTable(
                name: "students");

            migrationBuilder.DropTable(
                name: "courses");

            migrationBuilder.DropTable(
                name: "teachers");

            migrationBuilder.DropTable(
                name: "classes");

            migrationBuilder.DropTable(
                name: "accounts");

            migrationBuilder.DropTable(
                name: "departments");
        }
    }
}
