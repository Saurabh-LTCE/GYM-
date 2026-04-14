const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const VALID_ROLES = ['admin', 'trainer', 'member'];

exports.firebaseAuth = async (req, res, next) => {
  try {
    const { name, email, uid, role } = req.body;

    if (!email || !uid || !role) {
      return res
        .status(400)
        .json({ message: 'name, email, uid and role are required' });
    }

    const normalizedRole = String(role).toLowerCase().trim();
    if (!VALID_ROLES.includes(normalizedRole)) {
      return res.status(400).json({ message: 'Invalid role selected' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedName =
      String(name || normalizedEmail.split('@')[0] || 'Gym User').trim();

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name: normalizedName,
        email: normalizedEmail,
        uid: String(uid).trim(),
        role: normalizedRole,
      });
    } else {
      user.name = normalizedName || user.name;
      user.uid = String(uid).trim() || user.uid;
      if (user.role !== normalizedRole) {
        user.role = normalizedRole;
      }
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'gym-fallback-secret',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
