const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const Member = require('../models/Member.js');
const Trainer = require('../models/Trainer.js');

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

    let profile = null;
    let profileModel = null;

    if (normalizedRole === 'member') {
      profileModel = 'member';
      profile = await Member.findOne({ email: normalizedEmail });
      if (!profile) {
        profile = await Member.create({
          name: normalizedName,
          email: normalizedEmail,
          joiningDate: new Date(),
        });
      }
    } else if (normalizedRole === 'trainer') {
      profileModel = 'trainer';
      profile = await Trainer.findOne({ email: normalizedEmail });
      if (!profile) {
        profile = await Trainer.create({
          name: normalizedName,
          email: normalizedEmail,
          specialization: 'General Fitness',
          joiningDate: new Date(),
        });
      }
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        profileId: profile?._id || null,
        profileModel,
      },
      process.env.JWT_SECRET || 'gym-fallback-secret',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileId: profile?._id || null,
        profileModel,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};
