class ObjBase
{
    public position: Vec2D // the center of the object
    public graphics: Renderer
    public visible: boolean
    public angle: number = 0 // in radians, 0 is right
    public labelDom: HTMLDivElement

    constructor(x: number, y: number, graphics: Renderer, label: string = null)
    {
        this.position = new Vec2D(x, y)
        this.graphics = graphics
        this.visible = true

        _mapDom.appendChild(graphics.canvas)
        _gameObjects.push(this)

        if (label)
        {
            this.labelDom = document.createElement("div")
            this.labelDom.innerHTML = label
            this.labelDom.className = "city-label"
            _mapDom.appendChild(this.labelDom)
        }
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
        this.graphics.canvas.style.transform = "rotate(" + this.angle + "rad)"

        if (this.labelDom)
        {
            this.labelDom.style.width = (_game.worldToScreenSize(400)) + "px"
            this.labelDom.style.left = (pos.x - width / 2 - _game.worldToScreenSize(150)) + "px"
            this.labelDom.style.top = (pos.y - height / 2 + _game.worldToScreenSize(90)) + "px"
        }
    }
}
