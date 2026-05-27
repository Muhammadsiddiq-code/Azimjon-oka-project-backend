const express = require("express");
const router = express.Router();
const eduController = require("../controllers/edu.controller");
const authMiddleware = require("../controllers/auth.middleware");

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Dashboard metrics and statistics
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get overall statistics for groups, teachers, and students
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Counts of entities retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/dashboard/stats", authMiddleware, eduController.getStats);

module.exports = router;
