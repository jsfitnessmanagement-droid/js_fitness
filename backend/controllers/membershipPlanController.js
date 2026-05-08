const MembershipPlan = require('../models/MembershipPlan');
const Member = require('../models/Member');

// @desc    Get all membership plans
// @route   GET /api/membership-plans
// @access  Public
const getAllPlans = async (req, res, next) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true }).sort({ order: 1 });
    
    // Calculate which plan is most popular based on sales
    const maxSales = Math.max(...plans.map(p => p.salesCount), 0);
    const plansWithPopularity = plans.map(plan => ({
      ...plan.toObject(),
      popular: maxSales > 0 && plan.salesCount === maxSales && plan.salesCount > 0
    }));

    res.json({ success: true, data: plansWithPopularity });
  } catch (error) {
    console.error(error);
    error.statusCode = 500;
    return next(error);
  }
};

// @desc    Get all membership plans (admin)
// @route   GET /api/membership-plans/admin/all
// @access  Private/Admin
const getAllPlansAdmin = async (req, res, next) => {
  try {
    const plans = await MembershipPlan.find().sort({ order: 1 });
    res.json({ success: true, data: plans });
  } catch (error) {
    console.error(error);
    error.statusCode = 500;
    return next(error);
  }
};

// @desc    Create a new membership plan
// @route   POST /api/membership-plans
// @access  Private/Admin
const createPlan = async (req, res, next) => {
  try {
    const { planName, durationInDays, displayDuration, price, features, savings, order } = req.body;

    const plan = await MembershipPlan.create({
      planName,
      durationInDays,
      displayDuration,
      price,
      features,
      savings,
      order: order || 0
    });

    res.json({ success: true, data: plan });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      error.statusCode = 400;
      error.message = 'A plan with this name already exists';
    }
    error.statusCode = error.statusCode || 500;
    return next(error);
  }
};

// @desc    Update a membership plan
// @route   PUT /api/membership-plans/:id
// @access  Private/Admin
const updatePlan = async (req, res, next) => {
  try {
    const { planName, durationInDays, displayDuration, price, features, savings, isActive, order } = req.body;

    const plan = await MembershipPlan.findById(req.params.id);

    if (!plan) {
      const err = new Error('Membership plan not found');
      err.statusCode = 404;
      return next(err);
    }

    plan.planName = planName || plan.planName;
    plan.durationInDays = durationInDays !== undefined ? durationInDays : plan.durationInDays;
    plan.displayDuration = displayDuration || plan.displayDuration;
    plan.price = price !== undefined ? price : plan.price;
    plan.features = features || plan.features;
    plan.savings = savings !== undefined ? savings : plan.savings;
    plan.isActive = isActive !== undefined ? isActive : plan.isActive;
    plan.order = order !== undefined ? order : plan.order;

    await plan.save();

    res.json({ success: true, data: plan });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      error.statusCode = 400;
      error.message = 'A plan with this name already exists';
    }
    error.statusCode = error.statusCode || 500;
    return next(error);
  }
};

// @desc    Delete a membership plan
// @route   DELETE /api/membership-plans/:id
// @access  Private/Admin
const deletePlan = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);

    if (!plan) {
      const err = new Error('Membership plan not found');
      err.statusCode = 404;
      return next(err);
    }

    await plan.deleteOne();

    res.json({ success: true, message: 'Membership plan deleted successfully' });
  } catch (error) {
    console.error(error);
    error.statusCode = 500;
    return next(error);
  }
};

// @desc    Increment sales count for a plan
// @route   POST /api/membership-plans/:id/sale
// @access  Private
const recordSale = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);

    if (!plan) {
      const err = new Error('Membership plan not found');
      err.statusCode = 404;
      return next(err);
    }

    plan.salesCount += 1;
    await plan.save();

    res.json({ success: true, data: plan });
  } catch (error) {
    console.error(error);
    error.statusCode = 500;
    return next(error);
  }
};

// @desc    Get sales statistics
// @route   GET /api/membership-plans/stats
// @access  Private/Admin
const getSalesStats = async (req, res, next) => {
  try {
    const plans = await MembershipPlan.find().sort({ salesCount: -1 });
    const totalSales = plans.reduce((sum, plan) => sum + plan.salesCount, 0);
    
    const stats = {
      totalSales,
      plans: plans.map(plan => ({
        planName: plan.planName,
        salesCount: plan.salesCount,
        revenue: plan.salesCount * plan.price
      }))
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error(error);
    error.statusCode = 500;
    return next(error);
  }
};

module.exports = {
  getAllPlans,
  getAllPlansAdmin,
  createPlan,
  updatePlan,
  deletePlan,
  recordSale,
  getSalesStats
};
