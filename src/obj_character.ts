class ObjCharacter extends ObjBase
{
    public goodsAvailable: Array<string> = []

    constructor(x: number, y: number)
    {
        let graphics = new Renderer(100, 100, null, false)
        graphics.drawArrays(GFX_SHIP, 100, 0, null, "#4b726e", 3, 0.05)
        super(x, y, graphics)
    }
}