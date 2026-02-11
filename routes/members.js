const express = require('express');
const router = express.Router();
const pool = require('../config/database');

/**
 * @swagger
 * /api/members/{memberId}:
 *   get:
 *     summary: 회원ID로 회원 정보 조회
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: "회원ID (예: USR-0001)"
 *     responses:
 *       200:
 *         description: 회원 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: 회원을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM 회원정보 WHERE "회원ID" = $1',
      [memberId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.',
      error: error.message
    });
  }
});

module.exports = router;
