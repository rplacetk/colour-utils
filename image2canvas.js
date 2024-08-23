import jimp from 'jimp'
import * as fs from "fs"

const DEFAULT_PALETTE = [
// Base
255,1768516095,1431655935,2155905279,3553874943,4294967295,4288256511,3425907711,3692313855,2566914303,2147483903,4283891967,3439299839,2178840319,7290111,978695423,1823334399,2363097087,16777215,3078488063,3192258559,4198073343,4288217343,4293263615,1463025919,
// Gold (unusable)
437911807, 857342207, 1295188223, 1293549823, 858980607, 1714618623, 2135752959, 2571960575, 2573598975, 3009806591, 2137391359, 2135752959, 1716322559, 1717960959, 2137391359, 2139029759
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
            DEFAULT_PALETTE.forEach((colour, index) => {
                const pr = (colour >> 24) & 0xff
                const pg = (colour >> 16) & 0xff
                const pb = (colour >> 8) & 0xff

                const distance = Math.sqrt((r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2)
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
