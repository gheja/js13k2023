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
