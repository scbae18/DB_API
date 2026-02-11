const express = require('express');
const router = express.Router();
const pool = require('../config/database');

/**
 * @swagger
 * /api/shipments/tracking/{trackingNumber}:
 *   get:
 *     summary: 송장번호로 배송정보 조회
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: trackingNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: "송장번호 (예: 811518691982)"
 *     responses:
 *       200:
 *         description: 배송정보 조회 성공
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
 *         description: 배송정보를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/tracking/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM 배송정보 WHERE "송장번호" = $1',
      [trackingNumber]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '배송정보를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching shipment:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.',
      error: error.message
    });
  }
});

module.exports = router;
