const express = require("express");
const router = express.Router();
const eduController = require("../controllers/edu.controller");
const authMiddleware = require("../controllers/auth.middleware");
const { validate, studentSchema } = require("../validation/validation");

/**
 * @swagger
 * tags:
 *   - name: Students
 *     description: Students management
 */

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Retrieve a list of students
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by student name or phone number
 *     responses:
 *       200:
 *         description: A list of students with their groups
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/students", authMiddleware, eduController.getAllStudents);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The student ID
 *     responses:
 *       200:
 *         description: Student details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.get("/students/:id", authMiddleware, eduController.getStudentById);

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Eshmatov Toshmat
 *               phone:
 *                 type: string
 *                 example: +998901234567
 *               coin:
 *                 type: integer
 *                 example: 246
 *               groupId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/students", authMiddleware, validate(studentSchema), eduController.createStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update an existing student
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Eshmatov Toshmat (Tahrirlangan)
 *               phone:
 *                 type: string
 *                 example: +998901234567
 *               coin:
 *                 type: integer
 *                 example: 246
 *               groupId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.put("/students/:id", authMiddleware, validate(studentSchema), eduController.updateStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The student ID
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.delete("/students/:id", authMiddleware, eduController.deleteStudent);

module.exports = router;
