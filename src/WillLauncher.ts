import { Konami } from './Konami'
import { ShakenBake } from './ShakenBake'
import { WillHeadImage } from './WillHeadImage'
import { ImageParticle } from './ImageParticle'
import { Point } from './Point'
import { CanvasCreator } from './CanvasCreator'
import { Size } from './Size'

export class WillLauncher {
  private image = new WillHeadImage()
  private wills: ImageParticle[] = []
  private canvas = new CanvasCreator().createAndAddToDocument()
  private konami = new Konami(this.image)

  launch (fromPosition: Point): void {
    const will = new ImageParticle(
      fromPosition,
      this.image.imageElement,
      this.image.size,
      this.image.offset,
      new Size(this.canvas.width, this.canvas.height),
      this.canvas.getContext('2d')
    )
    this.wills.push(will)
  }

  listenForDomEventsAndLaunchWills (): void {
    const onMouseMove = (event: MouseEvent) =>
      this.launch(new Point(event.clientX, event.clientY))

    document.addEventListener('mousedown', e => {
      e.preventDefault()
      document.addEventListener('mousemove', onMouseMove, false)
    }, false)

    document.addEventListener('mouseup', e => {
      e.preventDefault()
      document.removeEventListener('mousemove', onMouseMove, false)
    }, false)

    document.addEventListener('touchstart', (e: TouchEvent) => {
      e.preventDefault()
      Array.from(e.changedTouches).forEach(touch =>
        this.launch(new Point(touch.pageX, touch.pageY))
      )
    }, false)

    document.addEventListener('touchmove', (e: TouchEvent) => {
      e.preventDefault()
      Array.from(e.changedTouches).forEach(touch =>
        this.launch(new Point(touch.pageX, touch.pageY))
      )
    }, false)

    this.konami.listen()
    new ShakenBake(this.image)
  }

  animate (): void {
    this.wills.forEach((will, idx) => {
      will.update()
      if (will.isOffScreen()) {
        this.wills.splice(idx, 1)
      }
    })
    requestAnimationFrame(this.animate.bind(this))
  }
}
