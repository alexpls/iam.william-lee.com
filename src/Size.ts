export class Size {
  readonly halfWidth: number
  readonly halfHeight: number

  constructor (readonly width: number, readonly height: number) {
    this.halfWidth = width / 2
    this.halfHeight = height / 2
  }
}
