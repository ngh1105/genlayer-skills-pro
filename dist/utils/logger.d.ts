import { type Ora } from 'ora';
export declare const logger: {
    title(msg: string): void;
    info(msg: string): void;
    success(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
    file(path: string): void;
    blank(): void;
    spinner(text: string): Ora;
};
//# sourceMappingURL=logger.d.ts.map