import { IRectangle } from "./IRectangle";

export interface IGMSpritesheetJSON {
    "src": IRectangle;
    "dest": IRectangle;
    "size": IRectangle;
    "sheetid": number;
}