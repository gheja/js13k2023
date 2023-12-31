class Renderer
{
    public canvas: HTMLCanvasElement
    public ctx: CanvasRenderingContext2D

    constructor(width: number, height: number, parentNode: HTMLElement = null, isMaskLayer: boolean)
    {
        this.canvas = document.createElement("canvas")
        this.ctx = this.canvas.getContext("2d", { willReadFrequently: isMaskLayer }) as CanvasRenderingContext2D
        this.canvas.width = width
        this.canvas.height = height

        // this.ctx.clearRect(0, 0, width, height)
        if (isMaskLayer)
        {
            this.ctx.fillStyle = "#000"
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        }

        if (parentNode)
        {
            parentNode.appendChild(this.canvas)
        }
    }

    // drawArrays(arrays: Array<Array<number>>, resolution = 100, strokeWidth = 0, strokeColor = null, fillColor = null, fuzzLength: number = 3, fuzzAmount: number = 0.8)
    drawArrays(arrays: Array<Array<number>>, resolution: number, strokeWidth: number, strokeColor: string, fillColor: string, fuzzLength: number, fuzzAmount: number)
    {
        for (let points of arrays)
        {
            this.ctx.beginPath()
        
            let p: Array<number>
            let p2: Array<number>
            this.ctx.moveTo(points[0]  / resolution * this.canvas.width, points[1]  / resolution * this.canvas.height)
            p = [ points[0], points[1] ]
        
            let len: number
            let angle: number
            for (let i = 2; i < points.length; i += 2)
            {
                p2 = [ points[i], points[i + 1] ]
        
                let done = false
        
                while (!done)
                {
                    len = Math.sqrt(Math.pow(p[0] - p2[0], 2) + Math.pow(p[1] - p2[1], 2))
                    angle = getAngle(p, p2)
        
                    if (fuzzLength != 0 && len > fuzzLength)
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
                    
                    this.ctx.lineTo(p[0] / resolution * this.canvas.width, p[1] / resolution * this.canvas.height)
                }
            }

            if (fillColor)
            {
                this.ctx.fillStyle = fillColor
                this.ctx.fill()
            }
        
            if (strokeWidth)
            {
                this.ctx.lineWidth = strokeWidth
                this.ctx.strokeStyle = strokeColor
                this.ctx.lineJoin = "round"
                this.ctx.lineCap = "round"
                this.ctx.stroke()
            }
        }
    }

    drawOther(other: Renderer, x: number, y: number)
    {
        this.ctx.drawImage(other.canvas, x, y)
    }

    isActiveAtPosition(x: number, y: number)
    {
        let tmp = this.ctx.getImageData(x, y, 1, 1)
        return (tmp.data[0] > 128)
    }
}
