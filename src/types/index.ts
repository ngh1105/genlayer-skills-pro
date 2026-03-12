export type AIType =
  | 'claude'
  | 'cursor'
  | 'windsurf'
  | 'antigravity'
  | 'copilot'
  | 'kiro'
  | 'codex'
  | 'roocode'
  | 'gemini'
  | 'all';

export type InstallMode = 'folder' | 'file';

export interface PlatformConfig {
  platform: string;
  displayName: string;
  installMode: InstallMode;
  skillsFolder?: string;  // for 'folder' mode
  filePath?: string;      // for 'file' mode
  detectFolders: string[]; // folders to detect this AI in the project
}

export const AI_TYPES: AIType[] = [
  'claude',
  'cursor',
  'windsurf',
  'antigravity',
  'copilot',
  'kiro',
  'codex',
  'roocode',
  'gemini',
  'all',
];

export const AI_DISPLAY_NAMES: Record<AIType, string> = {
  claude: 'Claude Code',
  cursor: 'Cursor IDE',
  windsurf: 'Windsurf IDE',
  antigravity: 'Antigravity',
  copilot: 'GitHub Copilot',
  kiro: 'Kiro IDE',
  codex: 'Codex CLI',
  roocode: 'Roo Code',
  gemini: 'Gemini CLI',
  all: 'All AI Assistants',
};
