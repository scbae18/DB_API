const express = require('express');
const router = express.Router();
const pool = require('../config/database');

/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     summary: 상품ID로 상품 정보 조회
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: "상품ID (예: PRD-0001)"
 *     responses:
 *       200:
 *         description: 상품 정보 조회 성공
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
 *         description: 상품을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM 상품정보 WHERE "상품ID" = $1',
      [productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.',
      error: error.message
    });
  }
});

module.exports = router;
