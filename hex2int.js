function hexToRGBA(hex) {
    let red = parseInt(hex.slice(1, 3), 16)
    let green = parseInt(hex.slice(3, 5), 16)
    let blue = parseInt(hex.slice(5, 7), 16)
    let alpha = 255

    return (red << 24) | (green << 16) | (blue << 8) | alpha
}

function main() {
    const args = process.argv.slice(2)

    const output = args.map(hex => hexToRGBA(hex))

    console.log(`[ ${output.join(', ')} ]`)
}

main()
