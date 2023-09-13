function getElement(id: string)
{
    return document.getElementById(id)
}

function getBody()
{
    return document.body
}

function arrayPick(arr: Array<any>)
{
    return arr[Math.floor(Math.random() * arr.length)]
}

// normalize and clamp
function clampn(value: number, min: number, max: number)
{
    let a = (value - min) / (max - min)
    a = Math.min(1, Math.max(0, a))
    return a
}

function lerp(a: number, b: number, t: number)
{
    return a + (b - a) * t
}

function stepn(a: number, b: number, stepSize: number)
{
    let c: number = stepSize

    if (Math.abs(b - a) < stepSize)
    {
        c = Math.abs(b - a)
    }

    if (a < b)
    {
        return a + c
    }

    return a - c
}

function wrapAngle(angle: number)
{
    return (angle + 3 * Math.PI) % (2 * Math.PI) - Math.PI
}

function dist2D(p1: Vec2D, p2: Vec2D)
{
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

function getAngle(p1: Array<number>, p2: Array<number>)
{
    return Math.atan2(p2[1] - p1[1], p2[0] - p1[0])
}

function randFloat(min: number, max: number)
{
    return min + Math.random() * (max - min)
}
