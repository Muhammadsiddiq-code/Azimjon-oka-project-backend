const { Teacher, Group, Student } = require("../models");
const { Op } = require("sequelize");

exports.getStats = async (req, res) => {
  try {
    const groupsCount = await Group.count();
    const teachersCount = await Teacher.count();
    const studentsCount = await Student.count();

    return res.status(200).json({
      groupsCount,
      teachersCount,
      studentsCount,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const { search } = req.query;
    const whereClause = {};

    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }

    const groups = await Group.findAll({
      where: whereClause,
      include: [
        {
          model: Teacher,
          as: "teacher",
          attributes: ["id", "fullName", "phone"],
        },
      ],
      order: [["id", "ASC"]],
    });

    const groupsWithStudentCount = await Promise.all(
      groups.map(async (group) => {
        const studentCount = await Student.count({ where: { groupId: group.id } });
        return {
          ...group.toJSON(),
          studentsCount: studentCount,
        };
      })
    );

    return res.status(200).json(groupsWithStudentCount);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findByPk(id, {
      include: [
        {
          model: Teacher,
          as: "teacher",
          attributes: ["id", "fullName", "phone"],
        },
        {
          model: Student,
          as: "students",
          attributes: ["id", "fullName", "phone", "coin"],
        },
      ],
    });

    if (!group) {
      return res.status(404).json({ error: "guruh topilmadi" });
    }

    return res.status(200).json(group);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { name, speciality, teacherId } = req.body;

    if (teacherId) {
      const teacher = await Teacher.findByPk(teacherId);
      if (!teacher) {
        return res.status(400).json({ error: "belgilangan teacher topilmadi" });
      }
    }

    const newGroup = await Group.create({ name, speciality, teacherId });
    return res.status(201).json({
      message: "gurux yaratildi",
      group: newGroup,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, speciality, teacherId } = req.body;

    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ error: "guruh topilmadi" });
    }

    if (teacherId) {
      const teacher = await Teacher.findByPk(teacherId);
      if (!teacher) {
        return res.status(400).json({ error: "oqituvchi topilmadi" });
      }
    }

    await group.update({ name, speciality, teacherId });
    return res.status(200).json({
      message: "guruh tahrirlandi",
      group,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ error: "guruh topilmadi" });
    }

    await group.destroy();
    return res.status(200).json({ message: "guruh ochirildi" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const { search } = req.query;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const teachers = await Teacher.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
    });

    const teachersWithStats = await Promise.all(
      teachers.map(async (teacher) => {
        const groups = await Group.findAll({
          where: { teacherId: teacher.id },
          attributes: ["id"],
        });

        const groupsCount = groups.length;
        const groupIds = groups.map((g) => g.id);

        const studentsCount =
          groupIds.length > 0
            ? await Student.count({ where: { groupId: { [Op.in]: groupIds } } })
            : 0;

        return {
          ...teacher.toJSON(),
          groupsCount,
          studentsCount,
        };
      })
    );

    return res.status(200).json(teachersWithStats);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByPk(id, {
      include: [
        {
          model: Group,
          as: "groups",
          attributes: ["id", "name", "speciality"],
        },
      ],
    });

    if (!teacher) {
      return res.status(404).json({ error: "teacher topilmadi" });
    }

    const groupIds = teacher.groups.map((g) => g.id);
    const studentsCount =
      groupIds.length > 0
        ? await Student.count({ where: { groupId: { [Op.in]: groupIds } } })
        : 0;

    return res.status(200).json({
      ...teacher.toJSON(),
      studentsCount,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const newTeacher = await Teacher.create({ fullName, phone });
    return res.status(201).json({
      message: "teacher yaratildi",
      teacher: newTeacher,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone } = req.body;

    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ error: "teachwer topilmadi" });
    }

    await teacher.update({ fullName, phone });
    return res.status(200).json({
      message: "O'qituvchi muvaffaqiyatli tahrirlandi",
      teacher,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ error: "O'qituvchi topilmadi" });
    }

    await teacher.destroy();
    return res.status(200).json({ message: "teacher ochirildi" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const { search } = req.query;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const students = await Student.findAll({
      where: whereClause,
      include: [
        {
          model: Group,
          as: "group",
          attributes: ["id", "name"],
        },
      ],
      order: [["id", "ASC"]],
    });

    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id, {
      include: [
        {
          model: Group,
          as: "group",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ error: "teacher topilmadi" });
    }

    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { fullName, phone, coin, groupId } = req.body;

    if (groupId) {
      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(400).json({ error: "guruh topilmadi" });
      }
    }

    const newStudent = await Student.create({ fullName, phone, coin: coin || 0, groupId });
    return res.status(201).json({
      message: "O'quvchi muvaffaqiyatli yaratildi",
      student: newStudent,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, coin, groupId } = req.body;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: "teacher topilmadi" });
    }

    if (groupId) {
      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(400).json({ error: "guruh topilmadi" });
      }
    }

    await student.update({ fullName, phone, coin, groupId });
    return res.status(200).json({
      message: "uquvchi tahrirlandi",
      student,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: "uquvchi topilmadi" });
    }

    await student.destroy();
    return res.status(200).json({ message: "uquvchi ochirildi" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

