export class CanvasCreator {
  createAndAddToDocument (): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.style.position = 'absolute'
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.prepend(canvas)
    return canvas
  }
}
