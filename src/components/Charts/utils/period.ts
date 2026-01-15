export const getLongerPeriod = (data: Partial<{ timestamp: Date | string; timestampComparison: Date | string }>[]) => {
  if (!data || data.length === 0) {
    return 'timestamp'; // Default to 'timestamp' if data is empty or undefined
  }

  const countTimestamps = data?.filter((item) => item?.timestamp).length;
  const countTimestampsComparison = data?.filter((item) => item?.timestampComparison).length;

  return countTimestamps >= countTimestampsComparison ? 'timestamp' : 'timestampComparison';
};
