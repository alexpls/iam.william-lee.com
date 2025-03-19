import { WillHeadImage } from './WillHeadImage'

enum KeyMap {
  Up = 38,
  Down = 40,
  Left = 37,
  Right = 39,
  A = 65,
  B = 66
}

export class Konami {
  private sequence = [
    KeyMap.Up,
    KeyMap.Up,
    KeyMap.Down,
    KeyMap.Down,
    KeyMap.Left,
    KeyMap.Right,
    KeyMap.Left,
    KeyMap.Right,
    KeyMap.B,
    KeyMap.A
  ]

  private sequenceDetected = []

  constructor (private readonly image: WillHeadImage) {}

  listen () {
    document.addEventListener('keydown', this.isKonamiKey.bind(this))
  }

  isKonamiKey (event: any): void {
    const evt = event || window.event
    const key = evt.keyCode ? evt.keyCode : evt.which
    let codeOk = true
    // @ts-ignore
    this.sequenceDetected.push(key)
    if (this.sequenceDetected.length < this.sequence.length) {
      for (let i = 0, max = this.sequenceDetected.length; i < max; i++) {
        if (this.sequenceDetected[i] !== this.sequence[i]) {
          codeOk = false
        }
      }
      if (!codeOk) {
        this.sequenceDetected = []
        // @ts-ignore
        this.sequenceDetected.push(key)
      }
    } else if (this.sequenceDetected.length === this.sequence.length) {
      for (let j = 0, max = this.sequenceDetected.length; j < max; j++) {
        if (this.sequenceDetected[j] !== this.sequence[j]) {
          codeOk = false
        }
      }
      this.sequenceDetected = []
      if (codeOk) {
        this.changeImage()
      }
    } else {
      this.sequenceDetected = []
    }
  }

  changeImage() {
    this.image.nextImage()
  }
}
