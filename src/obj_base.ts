class ObjBase
{
    public position: Vec2D // the center of the object
    public graphics: Renderer
    public visible: boolean

    constructor(x: number, y: number, graphics: Renderer)
    {
        this.position = new Vec2D(x, y)
        this.graphics = graphics
        this.visible = true
        _mapDom.appendChild(graphics.canvas)
        _gameObjects.push(this)
    }

    update()
    {
        let pos = _game.worldToScreenCoordinates(this.position)
        let width = _game.worldToScreenSize(this.graphics.canvas.width)
        let height = _game.worldToScreenSize(this.graphics.canvas.height)

        this.graphics.canvas.style.left = (pos.x - width / 2) + "px"
        this.graphics.canvas.style.top = (pos.y - height / 2) + "px"
        this.graphics.canvas.style.width = width + "px"
        this.graphics.canvas.style.height = height + "px"
    }
}