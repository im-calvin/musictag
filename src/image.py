from PIL import Image


def cropImage(imageURL):
    im = Image.open(imageURL)
    cropped = im.crop((280, 0, 1000, 720))
    cropped.show()
