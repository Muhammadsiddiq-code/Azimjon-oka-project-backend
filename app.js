const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const { sequelize, Admin, Teacher, Group, Student } = require("./models");

// Import Routes
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const groupRoutes = require("./routes/group.routes");
const teacherRoutes = require("./routes/teacher.routes");
const studentRoutes = require("./routes/student.routes");

// Import Swagger
const setupSwagger = require("./swagger/swagger");

const app = express();
const PORT = process.env.PORT || 5577;

// Middlewares
app.use(express.json());
app.use(cors({ origin: "*" }));

setupSwagger(app);

// Register API Routes
app.use("/api", authRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", groupRoutes);
app.use("/api", teacherRoutes);
app.use("/api", studentRoutes);

app.get("/", (req, res) => {
  res.redirect("/swagger");
});

sequelize
  .sync({ alter: true }) 
  .then(async () => {
    console.log("Database connected and synchronized successfully.");

    // Auto-seed a default admin if none exist
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      const defaultEmail = "admin@example.com";
      const defaultPassword = "admin123";
      await Admin.create({
        email: defaultEmail,
        password: defaultPassword,
      });
      console.log("--------------------------------------------------");
      console.log("Default Admin Account Created!");
      console.log(`Email: ${defaultEmail}`);
      console.log(`Password: ${defaultPassword}`);
      console.log("--------------------------------------------------");
    }

    const teacherCount = await Teacher.count();
    if (teacherCount === 0) {
      console.log("Seeding mock data to match wireframes exactly...");
      
      // 1. Create 5 Teachers
      const teachers = [];
      teachers.push(await Teacher.create({ fullName: "Turg'unov Hayotbek", phone: "+998901234567" }));
      teachers.push(await Teacher.create({ fullName: "Sodiqov Farrux", phone: "+998909876543" }));
      teachers.push(await Teacher.create({ fullName: "Karimov Sherzod", phone: "+998931112233" }));
      teachers.push(await Teacher.create({ fullName: "Umarov Jamshid", phone: "+998944445566" }));
      teachers.push(await Teacher.create({ fullName: "Aliyeva Madina", phone: "+998957778899" }));

      const groups = [];
      groups.push(await Group.create({ name: "ALG-Web-101", speciality: "Frontend", teacherId: teachers[0].id }));
      groups.push(await Group.create({ name: "ALG-web-123", speciality: "Backend", teacherId: teachers[0].id }));
      
      const specialities = ["Frontend", "Backend", "Android", "iOS", "QA", "Design"];
      for (let i = 3; i <= 14; i++) {
        const spec = specialities[i % specialities.length];
        const teacherIndex = i % 5;
        groups.push(await Group.create({
          name: `ALG-web-${100 + i}`,
          speciality: spec,
          teacherId: teachers[teacherIndex].id
        }));
      }

        await Student.create({
        fullName: "Eshmatov Toshmat",
        phone: "+998901234567",
        coin: 246,
        groupId: groups[1].id 
      });

      // Seed 142 more students
      const firstNames = ["Solihjon", "Diyorbek", "Otabek", "Jasurbek", "Shahzod", "Asadbek", "Laziz", "Kamola", "Dilnoza", "Sevara", "Zilola", "Nilufar"];
      const lastNames = ["Nabijanov", "Eshmatov", "Turg'unov", "Sodiqov", "Karimov", "Umarov", "Aliyev", "Raximov", "Qodirov", "Mahmudov", "Usmonov"];
      for (let i = 2; i <= 143; i++) {
        const fname = firstNames[i % firstNames.length];
        const lname = lastNames[i % lastNames.length];
        const groupIndex = i % 14; 
        const randomCoin = Math.floor(Math.random() * 500) + 10;
        await Student.create({
          fullName: `${lname} ${fname}`,
          phone: `+9989${Math.floor(Math.random() * 9)}1234567`,
          coin: randomCoin,
          groupId: groups[groupIndex].id
        });
      }
      console.log("Mock data seeding completed successfully!");
      console.log("Counts seeded: 5 Teachers, 14 Groups, 143 Students.");
    }

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/swagger`);
    });
  })
  .catch((err) => {
    console.error("Database connection/sync error:", err);
  });
