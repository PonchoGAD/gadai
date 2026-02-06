function reduce(n: number): number {
  while (n > 9) {
    n = n
      .toString()
      .split('')
      .reduce((a, b) => a + Number(b), 0);
  }
  return n;
}

export function calcNumerology(date: string) {
  const digits = date.replace(/\D/g, '');
  const sum = digits.split('').reduce((a, b) => a + Number(b), 0);

  return {
    life_path: reduce(sum)
  };
}
