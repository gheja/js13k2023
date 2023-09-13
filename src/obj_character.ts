class ObjCharacter extends ObjBase
{
    public goodsAvailable: Array<string> = []

    constructor(x: number, y: number)
    {
        let graphics = new Renderer(100, 100, null, false)
        graphics.drawArrays(GFX_SHIP, 100, 0, null, "#4b726e", 3, 0.05)
        super(x, y, graphics)
    }

    canTradeWithCity(city: ObjCity)
    {
        if (city.tradeDone || city.goodsWanted.length == 0)
        {
            return false
        }

        for (let good of city.goodsWanted)
        {
            if (this.goodsAvailable.indexOf(good) === -1)
            {
                return false
            }
        }

        return true
    }

    tradeWithCity(city: ObjCity)
    {
        if (!this.canTradeWithCity(city))
        {
            return
        }

        for (let good of city.goodsAvailable)
        {
            if (this.goodsAvailable.indexOf(good) === -1)
            {
                this.goodsAvailable.push(good)
            }
        }

        city.tradeDone = true
    }
}