const Cycle = require("../models/Cycle");
const Log = require("../models/Log");

exports.getCycleAverage = async (req, res) => {
  const cycles = await Cycle.find({ userId: req.user.id });

  if (cycles.length < 2) {
    return res.json({ msg: "Not enough data" });
  }

  let total = 0;

  for (let i = 1; i < cycles.length; i++) {
    const diff =
      (new Date(cycles[i].startDate) - new Date(cycles[i - 1].startDate)) /
      (1000 * 60 * 60 * 24);

    total += diff;
  }

  const avg = total / (cycles.length - 1);

  res.json({ averageCycle: Math.round(avg) });
};

exports.getSymptomsStats = async (req, res) => {
  const logs = await Log.find({ userId: req.user.id });

  const moodCount = {};
  let totalPain = 0;

  logs.forEach(log => {
    if (log.mood) {
      moodCount[log.mood] = (moodCount[log.mood] || 0) + 1;
    }

    if (log.pain) totalPain += log.pain;
  });

  const avgPain = logs.length ? totalPain / logs.length : 0;

  res.json({
    moods: moodCount,
    averagePain: avgPain.toFixed(1)
  });
};

exports.getAccuracy = async (req, res) => {
  const cycles = await Cycle.find({ userId: req.user.id });

  if (cycles.length < 3) {
    return res.json({ msg: "Not enough data" });
  }

  let errors = [];

  for (let i = 1; i < cycles.length; i++) {
    const predicted = new Date(cycles[i - 1].startDate);
    predicted.setDate(predicted.getDate() + 28); // estimation simple

    const actual = new Date(cycles[i].startDate);

    const error =
      Math.abs(actual - predicted) / (1000 * 60 * 60 * 24);

    errors.push(error);
  }

  const avgError =
    errors.reduce((a, b) => a + b, 0) / errors.length;

  const accuracy = Math.max(0, 100 - avgError * 5);

  res.json({
    accuracy: accuracy.toFixed(2) + "%"
  });
};

exports.getInsights = async (req, res) => {
  const logs = await Log.find({ userId: req.user.id });

  let insights = [];

  const highPainDays = logs.filter(l => l.pain >= 7).length;

  if (highPainDays > 3) {
    insights.push("Tu as souvent des douleurs élevées pendant ton cycle");
  }

  const moods = logs.map(l => l.mood);
  const sadDays = moods.filter(m => m === "sad").length;

  if (sadDays > logs.length * 0.4) {
    insights.push("Ton humeur est souvent basse pendant ton cycle");
  }

  if (insights.length === 0) {
    insights.push("Ton cycle semble stable, continue comme ça !");
  }

  res.json({ insights });
};