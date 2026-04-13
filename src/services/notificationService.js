const Notification = require("../models/Notification");
const Cycle = require("../models/Cycle");
const { calculateCycle } = require("./cycleService");

exports.generateNotifications = async (user) => {

  const lastCycle = await Cycle.findOne({ userId: user._id })
    .sort({ startDate: -1 });

  if (!lastCycle) return;

  const result = calculateCycle(
    lastCycle.startDate,
    lastCycle.cycleLength
  );

  const notifications = [];

  // règles demain
  if (result.day === lastCycle.cycleLength - 1) {
    notifications.push({
      message: "Tes règles arrivent demain, pense à te préparer !",
      type: "PERIOD"
    });
  }

  // ovulation
  if (result.phase === "PRE_OVULATION" && result.day === 12) {
    notifications.push({
      message: "Ovulation imminente, pense à te protéger !",
      type: "OVULATION"
    });
  }

  // sauvegarde
  for (const notif of notifications) {
    await Notification.create({
      userId: user._id,
      ...notif,
      date: new Date()
    });
  }
};