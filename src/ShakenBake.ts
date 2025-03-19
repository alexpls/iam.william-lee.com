import { WillHeadImage } from './WillHeadImage'
// @ts-ignore
import * as shake from 'shake.js'

export class ShakenBake {

  shakeInstance: any

  constructor (private readonly image: WillHeadImage) {
    this.shakeInstance = new shake.default({
      threshold: 0,
      timeout: 1000
    })

    this.shakeInstance.start()

    window.addEventListener('shake', this.shakeEvent.bind(this), false);
  }

  private shakeEvent () {
    this.image.nextImage()
  }
}
