const parseUpdatedAt = (value: string) => {
  const normalized = value.trim().replace(" ", "T");
  const matched = normalized.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|[+-]\d{2}:\d{2})?$/,
  );

  if (!matched) {
    return new Date(normalized);
  }

  const [, year, month, day, hour, minute, second, fraction = "", timezone] =
    matched;
  const millisecond = Number(fraction.slice(0, 3).padEnd(3, "0"));

  if (timezone) {
    const dateWithTimezone = `${year}-${month}-${day}T${hour}:${minute}:${second}.${String(
      millisecond,
    ).padStart(3, "0")}${timezone}`;
    return new Date(dateWithTimezone);
  }

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
    millisecond,
  );
};

export const formatUpdatedAt = (updatedAt: string, now = new Date()) => {
  const date = parseUpdatedAt(updatedAt);

  if (Number.isNaN(date.getTime())) {
    return updatedAt;
  }

  const diffMs = now.getTime() - date.getTime();

  if (diffMs <= 0) {
    return "방금 수정됨";
  }

  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;

  if (diffMs < minute) {
    return "방금 수정됨";
  }

  if (diffMs < hour) {
    return `${Math.floor(diffMs / minute)}분전 수정됨`;
  }

  if (diffMs < day) {
    return `${Math.floor(diffMs / hour)}시간전 수정됨`;
  }

  const days = Math.floor(diffMs / day);

  if (days === 1) {
    return "어제 수정됨";
  }

  if (diffMs < month) {
    return `${days}일전 수정됨`;
  }

  return `${Math.floor(diffMs / month)}달전 수정됨`;
};
