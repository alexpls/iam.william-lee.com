import { WillHeadImage } from './WillHeadImage'

const shake = require('shake.js')

interface Shake {
  start: Function
}

export class ShakenBake {

  shakeInstance: any

  constructor (private readonly image: WillHeadImage) {
    this.shakeInstance = new shake({
      threshold: 15,
      timeout: 1000
    })
    this.shakeInstance.start()

    document.addEventListener('shake', this.shakeEvent.bind(this), false);
  }

  private shakeEvent (event) {
    this.image.nextImage()
  }
}
