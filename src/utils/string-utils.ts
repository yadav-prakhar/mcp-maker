/**
 * Utility functions for string manipulation
 */

/**
 * Convert a string to PascalCase
 * @param str - The string to convert
 * @returns The PascalCase version of the string
 */
export function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Convert a string to camelCase
 * @param str - The string to convert
 * @returns The camelCase version of the string
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convert a string to kebab-case
 * @param str - The string to convert
 * @returns The kebab-case version of the string
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}
