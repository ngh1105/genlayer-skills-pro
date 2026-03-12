import type { AIType } from '../types/index.js';
/**
 * Install skills for a single AI platform.
 * Returns list of paths written.
 */
export declare function installForPlatform(aiType: Exclude<AIType, 'all'>, targetDir: string, force?: boolean): Promise<string[]>;
/**
 * Install skills for all supported platforms.
 */
export declare function installForAll(targetDir: string, force?: boolean): Promise<Map<string, string[]>>;
//# sourceMappingURL=template.d.ts.map