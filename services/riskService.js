const getRisk = (score) => {
  if (score >= 750) {
    return "LOW";
  }

  if (score >= 600) {
    return "MEDIUM";
  }

  return "HIGH";
};

module.exports = {
  getRisk
};
