export function calcArchetypes(lifePath: number) {
  const map: Record<number, string> = {
    1: 'leader',
    2: 'mediator',
    3: 'creator'
  };

  return {
    primary: map[lifePath] || 'explorer'
  };
}
