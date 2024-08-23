import jimp from "jimp"
import fs from "fs"

if (!process.argv[2] || !process.argv[3]) {
    console.log("Run this program with the place file and metadata file names as arguments, " +
        "i.e 'bun canvas2image.js place.bin metadata.json' to use a custom board & metadata path...")
}

const placeFile = process.argv[2] || "place"
const metadataFile = process.argv[3] || "metadata.json"

console.log(`Using place file: ${placeFile} and metadata file: ${metadataFile}`)
    ; (async function () {
    const startDate = Date.now()

    const metadata = JSON.parse(fs.readFileSync(metadataFile, "utf-8"))
    const { palette, width, height } = metadata

    new jimp(width, height, 0x0, (err, img) => {
        const board = new Uint8Array(fs.readFileSync(placeFile))
        for (let i = 0; i < board.byteLength; i++) {
            const colour = palette[board[i]]
            img.setPixelColor(colour, i % width, Math.floor(i / width))
        }
        img.write("./place.png")
    });

    console.log("Image saved, time taken: " + (Date.now() - startDate) + "ms")
})()
