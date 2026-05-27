const express = require("express");
const router = express.Router();
const eduController = require("../controllers/edu.controller");
const authMiddleware = require("../controllers/auth.middleware");
const { validate, groupSchema } = require("../validation/validation");

/**
 * @swagger
 * tags:
 *   - name: Groups
 *     description: Groups management
 */

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Retrieve a list of groups
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by group name
 *     responses:
 *       200:
 *         description: A list of groups with their student counts and teachers
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/groups", authMiddleware, eduController.getAllGroups);

/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Get a group by ID
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The group ID
 *     responses:
 *       200:
 *         description: Group details along with teacher and students list
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.get("/groups/:id", authMiddleware, eduController.getGroupById);

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - speciality
 *             properties:
 *               name:
 *                 type: string
 *                 example: ALG-Web-101
 *               speciality:
 *                 type: string
 *                 example: Frontend
 *               teacherId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Bad request (validation or invalid teacher ID)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/groups", authMiddleware, validate(groupSchema), eduController.createGroup);

/**
 * @swagger
 * /api/groups/{id}:
 *   put:
 *     summary: Update an existing group
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - speciality
 *             properties:
 *               name:
 *                 type: string
 *                 example: ALG-Web-101 (Tahrirlangan)
 *               speciality:
 *                 type: string
 *                 example: Frontend
 *               teacherId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.put("/groups/:id", authMiddleware, validate(groupSchema), eduController.updateGroup);

/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Delete a group
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The group ID
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.delete("/groups/:id", authMiddleware, eduController.deleteGroup);

module.exports = router;
