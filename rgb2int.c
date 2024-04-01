#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

// Function to convert hexadecimal color values to RGBA integers
uint32_t hexToRGBA(const char* hex)
{
    unsigned int red, green, blue, alpha = 255;
    sscanf(hex + 1, "%02x%02x%02x", &red, &green, &blue);
    return (red << 24) | (green << 16) | (blue << 8) | alpha;
}

int main()
{
    const char* colorHexValues[] = {
        "#000000", // Black
        "#696969", // Dim Grey
        "#555555", // Dark Grey
        "#808080", // Medium Grey
        "#D3D3D3", // Light Grey
        "#FFFFFF", // White
        "#FF9999", // Light Red
        "#CC3333", // Medium Red
        "#DC143C", // Crimson
        "#990000", // Dark Red
        "#800000", // Maroon
        "#FF5700", // Reddit Orange
    };

    printf("[ ");
    for (int i = 0; i < sizeof(colorHexValues) / sizeof(colorHexValues[0]); ++i) {
        uint32_t colorInt = hexToRGBA(colorHexValues[i]);
        printf("%u, ", colorInt);
    }
    printf("]\n");

    return 0;
}
// gcc -o rgb2int rgb2int.c && ./rgb2int