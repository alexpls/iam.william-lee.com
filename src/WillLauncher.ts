import { CanvasCreator } from './CanvasCreator'
import { ImageParticle } from './ImageParticle'
import { Konami } from './Konami'
import { Point } from './Point'
import { randomNumberBetween } from './randomNumberBetween';
import { Size } from './Size'
import { WillHeadImage } from './WillHeadImage'

export class WillLauncher {
  private image = new WillHeadImage()
  private wills: ImageParticle[] = []
  private canvas = new CanvasCreator().createAndAddToDocument()
  private _isAutoLaunching = false
  private konami = new Konami(this.image)

  get isAutoLaunching (): boolean {
    return this._isAutoLaunching
  }

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

  toggleAutoLaunch (): void {
    if (this.isAutoLaunching) {
      this._isAutoLaunching = false
    } else {
      this._isAutoLaunching = true
      this.autoLaunch()
    }
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

  private autoLaunch (): void {
    if (!this.isAutoLaunching) {
      return
    }

    setTimeout(() => {
      this.launchAtRandomPosition()
      this.autoLaunch()
    }, randomNumberBetween(100, 300))
  }

  private launchAtRandomPosition (): void {
    const halfCanvasHeight = this.canvas.height / 2
    const randomPosition = new Point(
      randomNumberBetween(0, this.canvas.width),
      randomNumberBetween(30, halfCanvasHeight),
    )
    this.launch(randomPosition)
  }
}
