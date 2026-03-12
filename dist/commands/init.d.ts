import type { AIType } from '../types/index.js';
interface InitOptions {
    ai?: AIType;
    skills?: string;
    force?: boolean;
    dryRun?: boolean;
}
export declare function initCommand(options: InitOptions): Promise<void>;
export {};
//# sourceMappingURL=init.d.ts.map