const express = require('express');
const router = express.Router();
const pool = require('../config/database');

/**
 * @swagger
 * /api/orders/member/{memberId}/tracking:
 *   get:
 *     summary: 회원ID로 주문ID 조회 후 송장번호 조회
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: "회원ID (예: USR-0001)"
 *     responses:
 *       200:
 *         description: 주문 및 송장번호 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       주문ID:
 *                         type: string
 *                       송장번호:
 *                         type: string
 *       404:
 *         description: 주문 정보를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/member/:memberId/tracking', async (req, res) => {
  try {
    const { memberId } = req.params;
    
    // 회원ID로 주문ID 조회 후, 주문ID로 송장번호 조회
    const result = await pool.query(`
      SELECT 
        o."주문ID",
        s."송장번호",
        s."택배사",
        s."배송상태",
        s."배송추적URL"
      FROM 주문정보 o
      LEFT JOIN 배송정보 s ON o."주문ID" = s."주문ID"
      WHERE o."회원ID" = $1
      ORDER BY o."주문일시" DESC
    `, [memberId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '주문 정보를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching order tracking:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.',
      error: error.message
    });
  }
});

module.exports = router;
