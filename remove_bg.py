
from PIL import Image
import os

def remove_background(image_path, output_path=None):
    try:
        img = Image.open(image_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Change all white (also shades of whites)
            # to transparent
            if item[0] > 200 and item[1] > 200 and item[2] > 200:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        if output_path:
            img.save(output_path, "PNG")
        else:
            img.save(image_path, "PNG")
        print(f"Successfully processed {image_path}")
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

# Process logo
remove_background("public/logo.png")

# Process favicon
# Note: favicon might have been copied from logo, so we process it too
remove_background("app/icon.png")
