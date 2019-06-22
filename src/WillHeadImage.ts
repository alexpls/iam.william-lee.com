import { Size } from './Size'
import { Point } from './Point'

const PATH_TO_IMAGE = '/will.png'

export class WillHeadImage {
  readonly size: Size = new Size(120, 183)
  readonly offset: Point = new Point(0, 0)
  private imageElementCached: HTMLImageElement

  get imageElement (): HTMLImageElement {
    if (!this.imageElementCached) {
      this.imageElementCached = this.createImageElement()
    }
    return this.imageElementCached
  }

  private createImageElement (): HTMLImageElement {
    const image = document.createElement('img')
    image.src = PATH_TO_IMAGE
    return image
  }
}
