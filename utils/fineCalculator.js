const calculateFine = (dueDate, returnDate) => {
  const due = new Date(dueDate);
  const returned = new Date(returnDate);
  const diffTime = returned - due;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 0;
  const finePerDay = parseFloat(process.env.FINE_PER_DAY) || 5;
  return diffDays * finePerDay;
};

module.exports = { calculateFine };