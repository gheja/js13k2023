class Vec2D
{
    public x: number
    public y: number

    constructor(x: number, y: number)
    {
        this.x = x
        this.y = y
    }

    copyFrom(pos: Vec2D)
    {
        this.x = pos.x
        this.y = pos.y
    }
}