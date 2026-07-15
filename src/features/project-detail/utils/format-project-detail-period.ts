const formatProjectDetailDate = (value: string) => {
  const matched = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!matched) {
    return value;
  }

  const [, year, month, day] = matched;

  return `${year}.${month}.${day}`;
};

export const formatProjectDetailPeriod = (
  createdAt: string,
  completedAt: string | null,
) => {
  const startDate = formatProjectDetailDate(createdAt);
  const endDate = completedAt
    ? formatProjectDetailDate(completedAt)
    : "진행 중";

  return `${startDate} - ${endDate}`;
};
