export interface ISpritesheetFrameData {
    frame: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    trimmed?: boolean;
    rotated?: boolean;
    sourceSize?: {
        w: number;
        h: number;
    };
    spriteSourceSize?: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    // anchor?: IPointData;
}
