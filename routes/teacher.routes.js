const express = require("express");
const router = express.Router();
const eduController = require("../controllers/edu.controller");
const authMiddleware = require("../controllers/auth.middleware");
const { validate, teacherSchema } = require("../validation/validation");

/**
 * @swagger
 * tags:
 *   - name: Teachers
 *     description: Teachers management
 */

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Retrieve a list of teachers
 *     tags: [Teachers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by teacher name or phone number
 *     responses:
 *       200:
 *         description: A list of teachers with their stats
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/teachers", authMiddleware, eduController.getAllTeachers);

/**
 * @swagger
 * /api/teachers/{id}:
 *   get:
 *     summary: Get a teacher by ID
 *     tags: [Teachers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The teacher ID
 *     responses:
 *       200:
 *         description: Teacher details with calculated statistics
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */
router.get("/teachers/:id", authMiddleware, eduController.getTeacherById);

/**
 * @swagger
 * /api/teachers:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Teachers]
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
 *                 example: Turg'unov Hayotbek
 *               phone:
 *                 type: string
 *                 example: +998901234567
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/teachers", authMiddleware, validate(teacherSchema), eduController.createTeacher);

/**
 * @swagger
 * /api/teachers/{id}:
 *   put:
 *     summary: Update an existing teacher
 *     tags: [Teachers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The teacher ID
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
 *                 example: Turg'unov Hayotbek (Tahrirlangan)
 *               phone:
 *                 type: string
 *                 example: +998901234567
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */
router.put("/teachers/:id", authMiddleware, validate(teacherSchema), eduController.updateTeacher);

/**
 * @swagger
 * /api/teachers/{id}:
 *   delete:
 *     summary: Delete a teacher
 *     tags: [Teachers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The teacher ID
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */
router.delete("/teachers/:id", authMiddleware, eduController.deleteTeacher);

module.exports = router;
