export const formatUpdatedDate = (value: string | null | undefined) => {
  if (!value) {
    return "-";
  }

  const matched = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!matched) {
    return value;
  }

  const [, year, month, day] = matched;

  return `${year}.${month}.${day}`;
};
