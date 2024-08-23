/**
 * 
 * @param {File} imageFile 
 * @param {number} marginPercent 
 * @returns 
 */
export async function image2Palette(imageFile, marginPercent = 0) {
    function getPercentageSimilarity(colour1, colour2) {
        const r1 = (colour1 >> 16) & 0xff
        const g1 = (colour1 >> 8) & 0xff
        const b1 = colour1 & 0xff

        const r2 = (colour2 >> 16) & 0xff
        const g2 = (colour2 >> 8) & 0xff
        const b2 = colour2 & 0xff

        const totalDifference = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2)
        const maxDifference = 255 * 3 // Max possible difference for RGB

        return (totalDifference / maxDifference) * 100
    }

    function isColourSimilar(colour1, colour2, margin) {
        return getPercentageSimilarity(colour1, colour2) <= margin
    }

    const img = new Image()
    img.src = URL.createObjectURL(imageFile)

    return new Promise((resolve, reject) => {
        img.onload = () => {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
            const colours = []

            for (let i = 0; i < data.length; i += 4) {
                const red = data[i]
                const green = data[i + 1]
                const blue = data[i + 2]
                const colour = (red << 16) | (green << 8) | blue

                if (!colours.some(c => isColourSimilar(c, colour, marginPercent))) {
                    colours.push(colour)
                }
            }

            // Convert colours to hex format
            const hexColours = colours.map(c => `#${c.toString(16).padStart(6, "0")}`)
            resolve(hexColours)
        }

        img.onerror = (err) => reject(`Error loading image: ${err.message}`)
    })
}

/**
 * 
 * @param {File} canvasFile,
 * @param {{ width: number, height: number, palette: Array<number> }} metadata
 */
export async function canvas2Image(canvasFile, metadata) {
    function readArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.onerror = (err) => reject(err)
            reader.readAsArrayBuffer(file)
        })
    }

    function drawImageFromData(arrayBuffer, metadata) {
        return new Promise((resolve, reject) => {
            const { palette, width, height } = metadata;

            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            canvas.width = width
            canvas.height = height

            const imageData = ctx.createImageData(width, height);
            const data = new Uint8ClampedArray(imageData.data.length);
            const board = new Uint8Array(arrayBuffer)

            for (let i = 0; i < board.byteLength; i++) {
                const color = palette[board[i]]
                const r = (color >> 16) & 0xFF
                const g = (color >> 8) & 0xFF
                const b = color & 0xFF

                const idx = (i * 4)
                data[idx] = r
                data[idx + 1] = g
                data[idx + 2] = b
                data[idx + 3] = 255
            }

            imageData.data.set(data)
            ctx.putImageData(imageData, 0, 0)

            // Resolve the canvas as an image URL
            const imageURL = canvas.toDataURL("image/png")
            resolve(imageURL)
        });
    }

    try {
        const arrayBuffer = await readArrayBuffer(canvasFile)
        const imageURL = await drawImageFromData(arrayBuffer, metadata)
        return imageURL
    }
    catch (error) {
        console.error("Failed to convert canvas to image:", error)
        return null
    }
}
