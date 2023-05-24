/**
 * Atlas format.
 */
import { ISpritesheetFrameData } from "./ISpritesheetFrameData";

export interface ISpritesheetData {
    frames: Record<string, ISpritesheetFrameData>;
    // animations?: Dict<string[]>;
    meta: {
        app?: string,
        version?: string;
        image: string;
        format?: "RGBA8888";
        size: { "w": number, "h": number };
        scale: string;
    };
}
