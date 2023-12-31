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

    // clean up the input
    s = input.value.replaceAll("\n", "")
    s = s.replaceAll(/\s+/g, " ")
    s = s.trim()

    a = s.split(" ")

    // process the path
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
            continue
        }
        else if (value == "z" || value == "Z")
        {
            points.push([ points[0][0], points[0][1] ])
            // multiple paths are not supported so leave the processing here
            break
        }
        else if (value.match(/^-?\d+[-\d.e]*?,-?\d+[-\d.e]*?$/))
        {
            c = value.split(",")
            p[0] = parseFloat(c[0])
            p[1] = parseFloat(c[1])
        }
        else if (value.match(/^-?\d+[-\d.e]*$/))
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
            nextMode = "l"
        }
        else if (mode == "M")
        {
            position[0] = p[0]
            position[1] = p[1]
            nextMode = "L"
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
            // points.push([ Math.round(position[0] * scale + pad[0]), Math.round(position[1] * scale + pad[1]) ])
            points.push([ position[0], position[1] ])
        }

        // console.log([ mode, p ])
    }

    let i
    let min_coordinates = [ 0, 0 ]
    let max_coordinates = [ 0, 0 ]
    let pads = [ 0, 0 ]
    let scales = [ 1, 1 ]
    // var resolution = 1000 // max coordinate, 0..resolution, including the lower and upper bounds
    var resolution = parseInt(document.getElementById("resolution").value)

    // find the bounding box
    min_coordinates[0] = points[0][0]
    min_coordinates[1] = points[0][1]
    max_coordinates[0] = points[0][0]
    max_coordinates[1] = points[0][1]

    for (i in points)
    {
        if (points[i][0] < min_coordinates[0])
        {
            min_coordinates[0] = points[i][0]
        }
        if (points[i][1] < min_coordinates[1])
        {
            min_coordinates[1] = points[i][1]
        }
        if (points[i][0] > max_coordinates[0])
        {
            max_coordinates[0] = points[i][0]
        }
        if (points[i][1] > max_coordinates[1])
        {
            max_coordinates[1] = points[i][1]
        }
    }

    // pad and scale the coordinates
    pads[0] = 0 - min_coordinates[0]
    pads[1] = 0 - min_coordinates[1]

    scales[0] = resolution / (max_coordinates[0] - min_coordinates[0])
    scales[1] = resolution / (max_coordinates[1] - min_coordinates[1])

    // override with the final parameters for the map, if checked
    if (document.getElementById("final_map_parameters").checked)
    {
        resolution = 1000
        scales = [ 5.223941709335997, 9.759621403204987 ]
        pads = [ -24.734057999999965, -14.742199000000014 ]
    }
    else if (document.getElementById("final_sprite_parameters").checked)
    {
        resolution = 100
        scales = [ 1, 1 ]
        pads = [ 0, 0 ]
    }

    let points2 = []
    for (i in points)
    {
        points2.push([ Math.round((points[i][0] + pads[0]) * scales[0]),  Math.round((points[i][1] + pads[1]) * scales[1]) ])
    }

    // assemble the output
    let t = ""
    for (a of points2)
    {
        t += a[0] + "," + a[1] + ", "
    }

    document.getElementById("output").value = t
}

function drawArray(arr, fuzzy = false)
{
    /** @type HTMLCanvasElement */ let canvas = document.getElementById("canvas1")
    /** @type CanvasRenderingContext2D */ let ctx  = canvas.getContext("2d")

    canvas.width = 1000
    canvas.height = 1000

    ctx.clearRect(0, 0, 1000, 1000)
    ctx.beginPath()

    let i
    ctx.moveTo(arr[0], arr[1])
    for (i=2; i<arr.length; i+=2)
    {
        ctx.lineTo(arr[i], arr[i + 1])
    }
    // ctx.closePath()

    ctx.strokeStyle = "2px solid #000"
    ctx.fillStyle = "#ccc"
    ctx.stroke()
    ctx.fill()
}

function drawArrayFuzzy(arr)
{
    let fuzzLength = 3
    let fuzzAmount = 0.8

    /** @type HTMLCanvasElement */ let canvas = document.getElementById("canvas1")
    /** @type CanvasRenderingContext2D */ let ctx  = canvas.getContext("2d")

    canvas.width = 1000
    canvas.height = 1000

    ctx.clearRect(0, 0, 1000, 1000)
    ctx.beginPath()

    let a
    let i
    let p
    let p2
    let left
    ctx.moveTo(arr[0], arr[1])
    p = [ arr[0], arr[1] ]

    let len
    let angle
    for (i=2; i<arr.length; i+=2)
    {
        p2 = [ arr[i], arr[i + 1] ]

        let done = false

        while (!done)
        {
            len = Math.sqrt(Math.pow(p[0] - p2[0], 2) + Math.pow(p[1] - p2[1], 2))
            angle = Math.atan2(p2[1] - p[1], p2[0] - p[0])

            if (len > fuzzLength)
            {
                len = fuzzLength
                angle = angle + (Math.random() - 0.5) * fuzzAmount
            }
            else
            {
                done = true
            }

            p[0] += Math.cos(angle) * len
            p[1] += Math.sin(angle) * len
            
            ctx.lineTo(p[0], p[1])
        }
    }
    // ctx.closePath()

    ctx.strokeStyle = "2px solid #000"
    ctx.fillStyle = "#ccc"
    ctx.stroke()
    ctx.fill()
}
    
function drawOutput(fuzzy)
{
    let s = document.getElementById("output").value
    s = s.replaceAll(" ", "")
    s = s.replaceAll("\n", "")

    let arr = s.split(",")

    let i
    for (i in arr)
    {
        arr[i] = parseFloat(arr[i])
    }

    if (!fuzzy)
    {
        drawArray(arr)
    }
    else
    {
        drawArrayFuzzy(arr)
    }
}
