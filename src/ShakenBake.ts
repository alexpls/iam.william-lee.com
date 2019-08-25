import { WillHeadImage } from './WillHeadImage'

const shake = require('shake.js')

export class ShakenBake {

  shakeInstance: any

  constructor (private readonly image: WillHeadImage) {
    this.shakeInstance = new shake({
      threshold: 0,
      timeout: 1000
    })

    this.shakeInstance.start()

    window.addEventListener('shake', this.shakeEvent.bind(this), false);
  }

  private shakeEvent (event) {
    this.image.nextImage()
  }
}
