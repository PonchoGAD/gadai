export type AppEnv = 'local' | 'staging' | 'prod';

export function mustGetEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(Missing env: );
  return v;
}
