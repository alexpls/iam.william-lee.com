import { Size } from './Size'
import { Point } from './Point'

const IMAGES = ['/will.png', './will2.png', './will3.png']
const DEFAULT_PATH_TO_IMAGE = IMAGES[0]

export class WillHeadImage {
  readonly size: Size = new Size(120, 183)
  readonly offset: Point = new Point(0, 0)
  private imageElementCached: HTMLImageElement | undefined

  private lastImageIndex = 0

  get imageElement (): HTMLImageElement {
    if (!this.imageElementCached) {
      this.imageElementCached = this.createImageElement(DEFAULT_PATH_TO_IMAGE)
    }
    return this.imageElementCached
  }

  nextImage (): void {
    this.lastImageIndex = this.lastImageIndex < IMAGES.length - 1 ? ++this.lastImageIndex : 0
    this.imageElementCached = this.createImageElement(IMAGES[this.lastImageIndex])
  }

  private createImageElement (imagePath: string): HTMLImageElement {
    const image = document.createElement('img')
    image.src = imagePath
    return image
  }
}
