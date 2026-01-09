
export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
        image.src = url
    })

export function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation)

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    }
}

/**
 * This function returns the new cropped image url and blob.
 * 
 * @param imageSrc - The source image url
 * @param pixelCrop - The crop area in pixels (relative to the displayed image)
 * @param rotation - Rotation in degrees
 * @param flip - Horizontal/Vertical flip
 * @param imageElement - (Optional) The actual image element to get natural dimensions from
 */
export default async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation = 0,
    flip = { horizontal: false, vertical: false },
    imageElement?: HTMLImageElement
): Promise<Blob | null> {
    const image = imageElement || await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    const rotRad = getRadianAngle(rotation)

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.naturalWidth,
        image.naturalHeight,
        rotation
    )

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth
    canvas.height = bBoxHeight

    // translate canvas context to a central location so that we can rotate around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(rotRad)
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2)

    // draw rotated image
    ctx.drawImage(image, 0, 0)

    // If the image was scaled in the UI, we just need to know the scale factor.
    // However, react-image-crop usually gives pixelCrop related to the *displayed* size if you pass the image ref.
    // BUT, if we are doing this strictly with the coordinates passed, we assume the caller has already scaled them
    // OR we can implement logic here if we had the display dimensions.
    // simpler approach: The standard `react-image-crop` demo suggests passing the loaded image ref 
    // and using `scaleX = image.naturalWidth / image.width`.

    // For now, let's assume pixelCrop passed here is already in NATURAL coordinates or we correct it if imageElement is passed.

    let cropX = pixelCrop.x
    let cropY = pixelCrop.y
    let cropWidth = pixelCrop.width
    let cropHeight = pixelCrop.height

    if (imageElement && imageElement.width && imageElement.height) {
        const scaleX = image.naturalWidth / imageElement.width;
        const scaleY = image.naturalHeight / imageElement.height;
        cropX = pixelCrop.x * scaleX
        cropY = pixelCrop.y * scaleY
        cropWidth = pixelCrop.width * scaleX
        cropHeight = pixelCrop.height * scaleY
    }

    const data = ctx.getImageData(
        cropX,
        cropY,
        cropWidth,
        cropHeight
    )

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = cropWidth
    canvas.height = cropHeight

    // paste generated rotate image at the top left corner
    ctx.putImageData(data, 0, 0)

    // As Blob
    return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
            if (file) {
                resolve(file)
            } else {
                reject(new Error('Canvas is empty'))
            }
        }, 'image/jpeg')
    })
}
