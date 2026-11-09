export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isDuplicateKeyError(e: unknown): e is { code: number; keyPattern?: Record<string, 1> } {
  return typeof e === 'object' && e !== null && 'code' in e && (e as { code: number }).code === 11000;
}
