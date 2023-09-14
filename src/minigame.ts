class Minigame
{
    // ✖ ⏺ ▲ ■ ⏺
    public speed: number
    public columns: number

    public dots: Array<MinigameDot> = []
    public triggerRange: number
    public screenPosition: Vec2D

    public rangeDom: HTMLDivElement

    public winFailHistory: Array<string> = []
    
    public heartDom: HTMLDivElement
    public heartText: string

    public level: number = 0

    constructor()
    {
        this.screenPosition = new Vec2D(500, 500)

        this.rangeDom = document.createElement("div")
        this.rangeDom.className = "mr"
        getBody().appendChild(this.rangeDom)

        this.heartDom = document.createElement("div")
        this.heartDom.className = "mh"
        getBody().appendChild(this.heartDom)
    }

    start(speed: number, columns: number)
    {
        this.speed = speed
        this.columns = columns
        this.triggerRange = 50
    }

    startNext()
    {
        this.level += 1

        if (this.level < 2)
        {
            this.dots.push(new MinigameDot(2, 0, randFloat(1, 1), randFloat(100, 120)))
            this.dots.push(new MinigameDot(0, 1, randFloat(1, 1), randFloat(150, 170)))
            this.dots.push(new MinigameDot(0, 2, randFloat(1, 1), randFloat(170, 200)))
            this.dots.push(new MinigameDot(2, 3, randFloat(1, 1), randFloat(100, 120)))
        }
        else if (this.level < 6)
        {
            this.dots.push(new MinigameDot(2, 0, randFloat(1, 1), randFloat(100, 120)))
            this.dots.push(new MinigameDot(0, 1, randFloat(1, 1), randFloat(150, 170)))
            this.dots.push(new MinigameDot(0, 2, randFloat(1, 1), randFloat(170, 200)))
            this.dots.push(new MinigameDot(0, 2, randFloat(1, 1), randFloat(230, 250)))
            this.dots.push(new MinigameDot(2, 3, randFloat(1, 1), randFloat(100, 120)))
        }
        else if (this.level < 10)
        {
            this.dots.push(new MinigameDot(2, 0, randFloat(1, 1), randFloat(100, 120)))
            this.dots.push(new MinigameDot(0, 1, randFloat(1, 1), randFloat(150, 170)))
            this.dots.push(new MinigameDot(3, 2, randFloat(1, 1), randFloat(170, 200)))
            this.dots.push(new MinigameDot(0, arrayPick([ 1, 2 ]), randFloat(1, 1), randFloat(230, 250)))
            this.dots.push(new MinigameDot(3, arrayPick([ 1, 2 ]), randFloat(1, 1), randFloat(280, 350)))
            this.dots.push(new MinigameDot(0, arrayPick([ 1, 2 ]), randFloat(1, 1), randFloat(350, 400)))
            this.dots.push(new MinigameDot(2, 3, randFloat(1, 1), randFloat(100, 120)))
        }
        else if (this.level < 15)
        {
            this.dots.push(new MinigameDot(2, 0, randFloat(1, 1), randFloat(100, 120)))
            this.dots.push(new MinigameDot(0, arrayPick([ 1, 2 ]), randFloat(1, 1), randFloat(230, 250)))
            this.dots.push(new MinigameDot(1, arrayPick([ 1, 2 ]), randFloat(1, 1), randFloat(280, 350)))
            this.dots.push(new MinigameDot(arrayPick([ 0, 1, 2 ]), arrayPick([ 1, 2 ]), randFloat(1, 1.2), randFloat(350, 400)))
            this.dots.push(new MinigameDot(arrayPick([ 0, 1, 2 ]), arrayPick([ 1, 2 ]), randFloat(1, 1.2), randFloat(400, 450)))
            this.dots.push(new MinigameDot(arrayPick([ 0, 1, 2 ]), arrayPick([ 1, 2 ]), randFloat(1, 1.2), randFloat(450, 500)))
            this.dots.push(new MinigameDot(arrayPick([ 0, 1, 2 ]), arrayPick([ 1, 2 ]), randFloat(1, 1.2), randFloat(500, 550)))
            this.dots.push(new MinigameDot(2, 3, randFloat(1, 1), randFloat(100, 120)))
        }
        else
        {
            this.dots.push(new MinigameDot(arrayPick([ 0, 1, 2 ]), arrayPick([ 0, 1, 2 ]), randFloat(1, 1.2), randFloat(100, 150)))
            this.dots.push(new MinigameDot(arrayPick([ 0, 1, 2 ]), arrayPick([ 0, 1, 2 ]), randFloat(1, 1.2), randFloat(150, 200)))
            this.dots.push(new MinigameDot(arrayPick([ 0, 1, 2 ]), arrayPick([ 0, 1, 2 ]), randFloat(1, 1.2), randFloat(200, 250)))
            this.dots.push(new MinigameDot(arrayPick([ 0, 1, 2 ]), arrayPick([ 0, 1, 2 ]), randFloat(1, 1.2), randFloat(250, 300)))
            this.dots.push(new MinigameDot(arrayPick([ 0, 1, 2 ]), arrayPick([ 0, 1, 2 ]), randFloat(1, 1.2), randFloat(300, 350)))
            this.dots.push(new MinigameDot(arrayPick([ 0, 1, 2 ]), arrayPick([ 0, 1, 2 ]), randFloat(1, 1.2), randFloat(350, 400)))
            this.dots.push(new MinigameDot(arrayPick([ 0, 1 ]), arrayPick([ 0, 1, 2 ]), randFloat(1.5, 1.8), randFloat(500, 400)))
            this.dots.push(new MinigameDot(arrayPick([ 0, 1 ]),  arrayPick([ 0, 1, 2 ]), randFloat(1.5, 1.8), randFloat(500, 400)))
        }

        this.rangeDom.style.animation = "mr-start 0.7s"
    }

    tick(dt: number, dtt: number)
    {
        this.rangeDom.style.left = (_minigame.screenPosition.x + -150 * _game.windowScale) + "px"
        this.rangeDom.style.top = (_minigame.screenPosition.y + (this.triggerRange - 20) * _game.windowScale) + "px"
        this.rangeDom.style.width = (370 * _game.windowScale) + "px"
        this.rangeDom.style.height = ((this.triggerRange * 2) * _game.windowScale) + "px"

        // this.rangeDom.style.borderTop = (this.triggerRange * _game.windowScale) + "px solid #00aa0044"
        this.rangeDom.style.borderTopWidth = (this.triggerRange * _game.windowScale) + "px"

        this.heartDom.style.left = (_minigame.screenPosition.x + -150 * _game.windowScale) + "px"
        this.heartDom.style.top = (_minigame.screenPosition.y + (this.triggerRange - 120) * _game.windowScale) + "px"

        // ---
        let s: string = ""
        let c: string
        let fails: number = 0

        for (let i=0; i<5; i++)
        {
            if (this.winFailHistory[i])
            {
                c = this.winFailHistory[i]
                if (this.winFailHistory[i] == "fail")
                {
                    fails += 1
                }
            }
            else
            {
                c = "new"
            }

            s += "<span class=\"mh-" + c + "\">■</span> "
        }

        this.heartDom.innerHTML = s

        if (fails >= 3)
        {
            this.winFailHistory = []
            this.failRound()
        }

        if (this.winFailHistory.length >= 5)
        {
            this.winFailHistory = []
            this.winRound()
        }
        // ---

        for (let dot of this.dots)
        {
            dot.tick(dt, dtt)
        }

        this.dots.filter(function(a) { return !a.destroyed; })
    }

    pressColumn(index: number)
    {
        for (let dot of this.dots)
        {
            if (dot.destroyed)
            {
                continue
            }

            if (dot.columnIndex == index)
            {
                dot.onClick()
                break
            }
        }
    }

    winOne()
    {
        this.rangeDom.style.animation = "mr-win 0.7s"
        this.winFailHistory.push("win")
    }

    failOne()
    {
        this.rangeDom.style.animation = "mr-fail 0.7s"
        this.winFailHistory.push("fail")
    }

    winRound()
    {
    }

    failRound()
    {
        _game.addDivert()
    }
}
