import jimp from 'jimp'
import * as fs from "fs"

let palette = [
    '211, 211, 211',
    '128, 128, 128',
    '85, 85, 85',
    '112, 128, 144',
    '105, 105, 105',
    '255, 153, 153',
    '204, 51, 51',
    '153, 0, 0',
    '220, 20, 60',
    '128, 0, 0',
    '255, 87, 0',
    '255, 255, 255'
]

if (!process.argv[2]) {
    console.log("You need to run this program with image path")
    process.exit(0)
}

async function processImage(imagePath) {
    try {
        const image = await jimp.read(imagePath)
        const byteArray = []

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
            const r = image.bitmap.data[idx]
            const g = image.bitmap.data[idx + 1]
            const b = image.bitmap.data[idx + 2]

            let closestColorIndex = 0
            let closestColorDistance = Number.MAX_SAFE_INTEGER
            palette.forEach((color, index) => {
                const distance = Math.sqrt((r - color[0]) ** 2 + (g - color[1]) ** 2 + (b - color[2]) ** 2)
                if (distance < closestColorDistance) {
                    closestColorDistance = distance
                    closestColorIndex = index
                }
            });

            byteArray.push(closestColorIndex);
        })

        fs.writeFileSync('place', Buffer.from(byteArray))
    } catch (error) {
        console.error('Error processing image:', error)
    }
}


console.log(`Using ${process.argv[2]}`)
processImage(process.argv[2])
