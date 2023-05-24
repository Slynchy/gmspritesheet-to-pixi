import * as path from "path";
import * as fs from "fs";
import { imageSize } from 'image-size';
import { IGMSpritesheetJSON } from "./src/interfaces/IGMSpritesheetJSON";
import { ISpritesheetData } from "./src/interfaces/ISpritesheetData";

const args: string[] = process.argv.slice(2);
function getPngInfo(path: string): {
    width: number;
    height: number;
    type: string;
    byteSize: number;
} | null {
    try {
        const dimensions = imageSize(path);
        if (dimensions.type !== 'png') {
            console.error('File is not a PNG image.');
            return null;
        }

        const stats = fs.statSync(path);
        const byteSize = stats.size;

        return {
            width: dimensions.width || -1,
            height: dimensions.height || -1,
            type: dimensions.type,
            byteSize: byteSize,
        };
    } catch (err) {
        console.error('Failed to get image info:', err);
        return null;
    }
}

function main() {
    const version = JSON.parse(fs.readFileSync("package.json", "utf8"))["version"];
    const argPathToInputSheetsFolder: string = args[0];
    const argPathToInputJSONFolder: string = args[1];

    if(!argPathToInputJSONFolder || !argPathToInputJSONFolder) {
        console.log(`
gmspritesheet-to-pixi
By Sam Lynch

Usage: npx ts-node [path to folder of spritesheets] [path to folder of JSONs]
`
        );
        return;
    }

    const pathToInputSheets = path.resolve(argPathToInputSheetsFolder);
    const pathToInputJSONFolder = path.resolve(argPathToInputJSONFolder);

    if(
        !fs.existsSync(pathToInputSheets)
    ) {
        console.error("Failed to find the input spritesheet!");
    }

    if(
        !fs.existsSync(pathToInputJSONFolder)
    ) {
        console.error("Failed to find the input folder containing JSONs!");
    }

    const jsonFiles = fs.readdirSync(pathToInputJSONFolder);
    const imgFiles = fs.readdirSync(pathToInputSheets);
    const spritesheetJSONs: IGMSpritesheetJSON[] = jsonFiles
        .map((value) => {
            return fs.readFileSync(
                pathToInputJSONFolder + "/" + value,
                "utf8"
            );
        })
        .map((value) => {
            return JSON.parse(value);
        });

    imgFiles.forEach((e) => {
        const pngInfo = getPngInfo(
            pathToInputSheets + "/" + e
        );
        if(!pngInfo) {
            throw new Error("Failed to process sprite " + e);
        }
        const returnValue: ISpritesheetData = {
            frames: {},
            meta: {
                app: "gmspritesheet-to-pixi",
                version: version,
                image: e,
                size: { "w": pngInfo.width, "h": pngInfo.height },
                scale: "1",
            },
        };

        const relevantJsons = spritesheetJSONs
            .map((sjson, i) => {
                return {
                    id: jsonFiles[i].substring(0, jsonFiles[i].indexOf(".")),
                    json: sjson
                };
            })
            .filter((data) => {
                return data.json.sheetid.toString() === e.substring(0, e.indexOf("."));
            });

        relevantJsons.forEach((json) => {
            returnValue.frames[
                json.id
            ] = {
                frame: {
                    x: json.json.src.x || -1,
                    y: json.json.src.y || -1,
                    w: json.json.src.width,
                    h: json.json.src.height,
                },
                trimmed: false,
                rotated: false,
                sourceSize: {
                    w: json.json.src.width,
                    h: json.json.src.height,
                },
                spriteSourceSize: {
                    x: json.json.dest.x || -1,
                    y: json.json.dest.y || -1,
                    w: json.json.dest.width,
                    h: json.json.dest.height,
                }
            }
        });

        fs.writeFileSync(
            e.toString() + ".json",
            JSON.stringify(
                returnValue,
                null,
                "  ",
            ),
            "utf8"
        );
    });
}

main();