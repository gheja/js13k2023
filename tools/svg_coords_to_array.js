"use strict";

function convert()
{
    let input = document.getElementById("input")
    let s
    let a
    let c
    let p = [ 0, 0 ]
    let value
    let mode
    let nextMode
    let position = [ 0, 0 ]
    let draw = false
    let points = []
    let scale = 10
    let pad = [ 15, 215 ]

    s = input.value.replaceAll("\n", "")
    s = s.replaceAll(/\s+/g, " ")
    s = s.trim()

    a = s.split(" ")

    nextMode = "L"
    mode = ""

    for (value of a)
    {
        if (nextMode)
        {
            mode = nextMode
        }

        nextMode = null

        if (value == "m" || value == "M" || value == "l" || value == "L" || value == "h" || value == "H" || value == "v" || value == "V")
        {
            mode = value
        }
        else if (value.match(/^-?\d+\.\d+,-?\d+\.\d+$/))
        {
            c = value.split(",")
            p[0] = parseFloat(c[0])
            p[1] = parseFloat(c[1])
        }
        else if (value.match(/^-?\d+\.\d+$/))
        {
            p[0] = parseFloat(value)
            p[1] = 0
        }
        else
        {
            // unknown value, skip it
            console.log("Unknown value: " + value)
            continue
        }

        draw = true

        if (mode == "m")
        {
            position[0] += p[0]
            position[1] += p[1]
            nextMode = "L"
            draw = false
        }
        else if (mode == "M")
        {
            position[0] = p[0]
            position[1] = p[1]
            nextMode = "L"
            draw = false
        }
        else if (mode == "l")
        {
            position[0] += p[0]
            position[1] += p[1]
        }
        else if (mode == "L")
        {
            position[0] = p[0]
            position[1] = p[1]
        }
        else if (mode == "h")
        {
            position[0] += p[0]
            // position[1]
        }
        else if (mode == "H")
        {
            position[0] = p[0]
            // position[1]
        }
        else if (mode == "v")
        {
            // position[0]
            position[1] += p[0]
        }
        else if (mode == "V")
        {
            // position[0]
            position[1] = p[0]
        }

        if (draw)
        {
            points.push([ Math.round(position[0] * scale + pad[0]), Math.round(position[1] * scale + pad[1]) ])
        }

        console.log([ mode, p ])
    }

    let t = ""
    for (a of points)
    {
        t += a[0] + "," + a[1] + ", "
    }

    document.getElementById("output").value = t
}
