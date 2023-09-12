class ObjCity extends ObjBase
{
    public name: string
    public locked: boolean
    public hidden: boolean
    public justVisited: boolean

    constructor(x: number, y: number, name: string, locked: boolean, hidden: boolean)
    {
        let graphics = new Renderer(100, 100, null, false)
        graphics.drawArrays(GFX_CITY, 100, 0, null, "#79444a", 3, 0.05)
        super(x, y, graphics)

        this.name = name
        this.hidden = hidden
        this.locked = locked
    }
}