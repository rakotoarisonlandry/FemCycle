const Notification = require("../models/Notification");
const User = require("../models/User");

// settings
exports.getSettings = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.notificationSettings);
};

exports.updateSettings = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { notificationSettings: req.body },
    { new: true }
  );

  res.json(user.notificationSettings);
};

// historique
exports.getHistory = async (req, res) => {
  const notifications = await Notification.find({
    userId: req.user.id
  }).sort({ createdAt: -1 });

  res.json(notifications);
};

// test
exports.testNotification = async (req, res) => {
  const notif = await Notification.create({
    userId: req.user.id,
    message: "Test notification",
    type: "TEST",
    date: new Date()
  });

  res.json(notif);
};