import { timingSafeEqual, createHash } from "node:crypto";

<<<<<<< HEAD
export function timingSafeSecretEqual(providedSecret: string | null, expectedSecret: string | null | undefined): boolean {
  if (!providedSecret || !expectedSecret) return false;
=======
export function timingSafeSecretEqual(providedSecret: string | null, expectedSecret: string): boolean {
  if (!providedSecret) return false;
>>>>>>> gitlab/main
  const providedHash = createHash('sha256').update(String(providedSecret)).digest();
  const expectedHash = createHash('sha256').update(String(expectedSecret)).digest();
  return timingSafeEqual(providedHash, expectedHash);
}
