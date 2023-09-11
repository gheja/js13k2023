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
