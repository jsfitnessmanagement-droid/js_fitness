const express = require('express');
const router = express.Router();
const {
  getAllPlans,
  getAllPlansAdmin,
  createPlan,
  updatePlan,
  deletePlan,
  recordSale,
  getSalesStats
} = require('../controllers/membershipPlanController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllPlans);

// Admin routes
router.get('/admin/all', protect, admin, getAllPlansAdmin);
router.post('/', protect, admin, createPlan);
router.put('/:id', protect, admin, updatePlan);
router.delete('/:id', protect, admin, deletePlan);
router.post('/:id/sale', protect, recordSale);
router.get('/stats', protect, admin, getSalesStats);

module.exports = router;
