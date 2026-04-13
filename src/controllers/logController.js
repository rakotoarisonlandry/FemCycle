const Log = require("../models/Log");

exports.createLog = async (req, res) => {
  try {
    const log = await Log.create({
      ...req.body,
      userId: req.user.id,
    });

    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLogs = async (req, res) => {
  const logs = await Log.find({ userId: req.user.id }).sort({ date: -1 });
  res.json(logs);
};

exports.getLogByDate = async (req, res) => {
  const log = await Log.findOne({
    userId: req.user.id,
    date: req.params.date,
  });

  res.json(log);
};

exports.updateLog = async (req, res) => {
  const log = await Log.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true },
  );

  res.json(log);
};

exports.deleteLog = async (req, res) => {
  await Log.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  res.json({ msg: "Deleted" });
};
