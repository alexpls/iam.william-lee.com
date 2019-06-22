import { Point } from './Point'
import { Size } from './Size'

const GRAVITY_UPWARDS_BOUNCE = 0.81
const GRAVITY_DOWNWARDS_FORCE = 0.91

export class ImageParticle {
  private currentPosition: Point
  private force: Point

  constructor (
    startPosition: Point,
    private image: CanvasImageSource,
    private imageSize: Size,
    private imageOffset: Point,
    private canvasSize: Size,
    private canvasContext: CanvasRenderingContext2D
  ) {
    this.currentPosition = startPosition
    this.force = randomStartingForce()
  }

  update (): void {
    this.applyForceToCurrentPosition()

    if (this.isAtBottomOfScreen()) {
      this.preventFromFallingOffBottomOfScreen()
      this.setForceToBounceUpwards()
    }

    this.setForceToIncreaseWithGravity()

    this.drawToCanvas()
  }

  isOffScreen () {
    return this.currentPosition.x < (-this.imageSize.halfWidth) ||
      this.currentPosition.x > (this.canvasSize.width + this.imageSize.halfWidth)
  }

  private applyForceToCurrentPosition (): void {
    this.currentPosition = new Point(this.currentPosition.x + this.force.x, this.currentPosition.y + this.force.y)
  }

  private isAtBottomOfScreen (): boolean {
    return this.currentPosition.y > this.canvasSize.height - this.imageSize.halfHeight
  }

  private preventFromFallingOffBottomOfScreen (): void {
    this.currentPosition = new Point(this.currentPosition.x, this.canvasSize.height - this.imageSize.halfHeight)
  }

  private setForceToBounceUpwards (): void {
    this.force = new Point(this.force.x, -this.force.y * GRAVITY_UPWARDS_BOUNCE)
  }

  private setForceToIncreaseWithGravity (): void {
    this.force = new Point(this.force.x, this.force.y + GRAVITY_DOWNWARDS_FORCE)
  }

  private drawToCanvas () {
    this.canvasContext.drawImage(
      this.image,
      this.imageOffset.x,
      this.imageOffset.y,
      this.imageSize.width,
      this.imageSize.height,
      Math.floor(this.currentPosition.x - this.imageSize.halfWidth),
      Math.floor(this.currentPosition.y - this.imageSize.halfHeight),
      this.imageSize.width,
      this.imageSize.height
    )
  }
}

function randomStartingForce (): Point {
  const forceX = (Math.floor(Math.random() * 6 - 3) * 2) || 2
  // start with a negative vertical force so will's head bounces upwards
  // before it starts to fall down.
  const forceY = -Math.floor(Math.random() * 16)
  return new Point(forceX, forceY)
}
