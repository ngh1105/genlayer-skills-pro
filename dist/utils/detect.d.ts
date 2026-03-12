import type { AIType } from '../types/index.js';
/**
 * Detect which AI assistants are present in the current project directory.
 * Returns a list of detected AI types and a suggested default.
 */
export declare function detectAITypes(cwd: string): Promise<{
    detected: AIType[];
    suggested: AIType | null;
}>;
export declare function getAIDescription(aiType: AIType): string;
//# sourceMappingURL=detect.d.ts.map