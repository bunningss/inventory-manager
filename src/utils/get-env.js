export function getEnv(key) {
  const value = process.env[key];
  if (!value) throw new Error(`Env variable ${key} undefined.`);

  return value;
}
