class ObjCity extends ObjBase
{
    public name: string
    public locked: boolean
    public hidden: boolean
    public justVisited: boolean
    public unlockLevelNumber: number
    public goodsAvailable: Array<string>
    public goodsWanted: Array<string>

    constructor(x: number, y: number, name: string, locked: boolean, hidden: boolean, unlockLevelNumber: number, goodsAvailable: Array<string>, goodsWanted: Array<string>)
    {
        let graphics = new Renderer(100, 100, null, false)
        graphics.drawArrays(GFX_CITY, 100, 0, null, "#79444a", 3, 0.05)
        super(x, y, graphics, name)

        this.name = name
        this.locked = locked
        this.hidden = hidden
        this.unlockLevelNumber = unlockLevelNumber
        this.goodsAvailable = goodsAvailable
        this.goodsWanted = goodsWanted
    }
}
