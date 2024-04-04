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

int main(int argc, char** argv)
{
    printf("[ ");
    for (int i = 1; i < argc; i++)
    {
        uint32_t colourInt = hexToRGBA(argv[i]);
        printf("%u%s", colourInt, i == argc - 1 ? "" : ", ");
    }
    printf(" ]\n");

    return 0;
}
// gcc -o rgb2int rgb2int.c && ./rgb2int
