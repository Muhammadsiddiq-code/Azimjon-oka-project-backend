const { Sequelize, DataTypes } = require("sequelize")
const sequelize = require("../config/db")

const Admin = require("./admin.model")(sequelize, DataTypes)
const Teacher = require("./teacher.model")(sequelize, DataTypes)
const Group = require("./group.model")(sequelize, DataTypes)
const Student = require("./student.model")(sequelize, DataTypes)

Teacher.hasMany(Group, { foreignKey: "teacherId", as: "groups", onDelete: "SET NULL" })
Group.belongsTo(Teacher, { foreignKey: "teacherId", as: "teacher" })

Group.hasMany(Student, { foreignKey: "groupId", as: "students", onDelete: "CASCADE" })
Student.belongsTo(Group, { foreignKey: "groupId", as: "group" })

module.exports = { sequelize, Sequelize, Admin, Teacher, Group, Student }
