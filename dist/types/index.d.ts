export type AIType = 'claude' | 'cursor' | 'windsurf' | 'antigravity' | 'copilot' | 'kiro' | 'codex' | 'roocode' | 'gemini' | 'all';
export type InstallMode = 'folder' | 'file';
export interface PlatformConfig {
    platform: string;
    displayName: string;
    installMode: InstallMode;
    skillsFolder?: string;
    filePath?: string;
    detectFolders: string[];
}
export declare const AI_TYPES: AIType[];
export declare const AI_DISPLAY_NAMES: Record<AIType, string>;
//# sourceMappingURL=index.d.ts.map