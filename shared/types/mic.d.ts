declare module "mic" {
    import { Readable } from "stream";

    interface MicOptions {
        rate?: string;
        channels?: string;
        debug?: boolean;
        exitOnSilence?: number;
        device?: string;
        fileType?: string;
        bitwidth?: string;
        endian?: string;
        encoding?: string;
        format?: string;
        threshold?: number;
        silence?: string;
        verbose?: boolean;
    }

    export interface MicInstance {
        getAudioStream(): Readable;
        start(): void;
        stop(): void;
        pause(): void;
        resume(): void;
    }

    function mic(options?: MicOptions): MicInstance;

    export = mic;
}