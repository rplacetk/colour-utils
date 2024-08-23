import Jimp from 'jimp'

const imagePath = process.argv[2]
const margin = parseInt(process.argv[3], 10) || 0

const isSimilar = (color1, color2, margin) => {
    const r1 = (color1 >> 16) & 0xff
    const g1 = (color1 >> 8) & 0xff
    const b1 = color1 & 0xff

    const r2 = (color2 >> 16) & 0xff
    const g2 = (color2 >> 8) & 0xff
    const b2 = color2 & 0xff

    return (
        Math.abs(r1 - r2) <= margin &&
        Math.abs(g1 - g2) <= margin &&
        Math.abs(b1 - b2) <= margin
    )
}

Jimp.read(imagePath).then(image => {
    const colors = []

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        const red = image.bitmap.data[idx]
        const green = image.bitmap.data[idx + 1]
        const blue = image.bitmap.data[idx + 2]
        const color = (red << 16) | (green << 8) | blue

        if (!colors.some(c => isSimilar(c, color, margin))) {
            colors.push(color)
        }
    })

    console.log(colors)
})
.catch(err => {
    console.error('Error reading image:', err)
})
