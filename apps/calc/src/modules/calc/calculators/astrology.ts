export function calcAstrology(input: {
  date_of_birth: string;
  time_of_birth?: string;
}) {
  const month = new Date(input.date_of_birth).getUTCMonth() + 1;

  const solar =
    month >= 3 && month <= 4
      ? 'aries'
      : month >= 4 && month <= 5
      ? 'taurus'
      : 'unknown';

  return {
    solar_sign: solar,
    has_time: Boolean(input.time_of_birth)
  };
}
