let inputString = ''

process.stdin.on('data', chunk => {
    inputString += chunk
})

process.stdin.on('end', () => {
    inputString = inputString.trim()
    let inputColours

    // Check if the input is a JSON array (starts with '[')
    if (inputString.startsWith("[") && inputString.endsWith("]")) {
        try {
            const data = JSON.parse(inputString)
            if (Array.isArray(data)) {
                inputColours = data
            }
        } catch (e) {
            console.error("Invalid JSON input")
            process.exit(1)
        }
    } else {
        // Split by spaces for a raw list
        inputColours = inputString.split(/\s+/)
    }

    if (inputColours.length == 0) {
        console.error("Provided data must be a list of integers or hexadecimal colours separated by spaces.")
        process.exit(1)
    }

    function parseColour(colour) {
        return String(colour).startsWith("#") ? parseInt(colour.slice(1), 16) : colour
    }

    const orderedColours = inputColours.sort((a, b) => {
        const colourA = parseColour(a)
        const colourB = parseColour(b)
        return colourA > colourB ? 1 : -1
    })

    console.log(orderedColours)
})

process.stdin.resume()
process.stderr.write("Reading input from stdin.\nUsage examples:\n\techo \"#fff\" | bun order-palette.js\n\tcat palette.txt | bun order-palette.js > new_palette.json\n\n")
