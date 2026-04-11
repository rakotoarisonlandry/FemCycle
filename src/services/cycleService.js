const dayjs = require("dayjs");

function calculateCycle(startDate, cycleLength = 28) {
  const today = dayjs();
  const start = dayjs(startDate);

  const diff = today.diff(start, "day") % cycleLength;
  const currentDay = diff + 1;

  const ovulationDay = cycleLength - 14;

  let status = "SAFE";
  let phase = "";

  if (currentDay <= 5) {
    phase = "MENSTRUATION";
    status = "SAFE";
  } else if (currentDay <= 12) {
    phase = "PRE_OVULATION";
    status = "RISKY";
  } else if (currentDay <= 16) {
    phase = "OVULATION";
    status = "DANGER";
  } else {
    phase = "POST_OVULATION";
    status = "SAFE";
  }

  return {
    day: currentDay,
    phase,
    status,
    ovulationDay
  };
}

module.exports = { calculateCycle };