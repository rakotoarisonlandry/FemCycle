const cron = require("node-cron");
const User = require("../models/User");
const { generateNotifications } = require("../services/notificationService");

const startCron = () => {
  cron.schedule("0 8 * * *", async () => {
    console.log("Running daily notifications...");

    const users = await User.find();

    for (const user of users) {
      await generateNotifications(user);
    }

    console.log("Notifications générées");
  });
};

module.exports = startCron;