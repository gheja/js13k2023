class MinigameDot
{
    // v1 ⬤ - touch it
    // v2 ✖ - don't touch
    // v3 ▲ - just decoy

    public typeTexts = [ "⬤", "✖", "▲" ]
    public typeIndex: number
    public columnIndex: number
    public speed: number
    public verticalPosition: number
    public domElement: HTMLDivElement
    public wasInTriggerRange: boolean = false
    public isInTriggerRange: boolean = false
    public destroyed: boolean = false

    // flows from 100 to -100, 0 is middle

    constructor(typeIndex, columnIndex, speed, startPosition: number)
    {
        this.domElement = document.createElement("div")
        this.domElement.className = "md md-out-" + typeIndex
        this.domElement.innerHTML = this.typeTexts[typeIndex]
        this.typeIndex = typeIndex
        this.speed = speed
        this.columnIndex = columnIndex
        this.verticalPosition = startPosition

        this.domElement.addEventListener("click", this.onClick.bind(this))
        getBody().appendChild(this.domElement)
    }

    destroyThis()
    {
        if (this.destroyed)
        {
            return
        }

        this.domElement.parentNode.removeChild(this.domElement)
        this.destroyed = true
    }

    onClick()
    {
        console.log("clicked " + this.typeIndex + ", " + this.isInTriggerRange)

        if (this.typeIndex == 0)
        {
            if (this.isInTriggerRange)
            {
                _minigame.winOne()
            }
            else
            {
                _minigame.failOne()
            }
        }
        else if (this.typeIndex == 1)
        {
            _minigame.failOne()
        }

        this.destroyThis()
    }

    tick(dt: number, dtt: number)
    {
        if (this.destroyed)
        {
            return
        }

        if (this.verticalPosition < -_minigame.triggerRange)
        {
            if (this.typeIndex == 0)
            {
                _minigame.failOne()
            }
            this.destroyThis()
            return
        }

        if (this.verticalPosition < -100)
        {
            this.verticalPosition = 100
        }
        this.verticalPosition -= this.speed * dtt

        let opacity = 1

        if (this.verticalPosition > 50)
        {
            opacity = clampn(this.verticalPosition, 100, 50)
        }
        else if (this.verticalPosition < -50)
        {
            opacity = clampn(this.verticalPosition, -100, -50)
        }

        this.domElement.style.display = "block"
        this.domElement.style.left = (_minigame.screenPosition.x + (-120 + this.columnIndex * 80) * _game.windowScale) + "px"
        this.domElement.style.top = (_minigame.screenPosition.y + this.verticalPosition * _game.windowScale) + "px"
        this.domElement.style.opacity = opacity.toString()

        this.isInTriggerRange = (this.verticalPosition < _minigame.triggerRange) && (this.verticalPosition > -_minigame.triggerRange)

        if (this.isInTriggerRange && !this.wasInTriggerRange)
        {
            this.domElement.classList.remove("md-out-" + this.typeIndex)
            this.domElement.classList.add("md-in-" + this.typeIndex)
        }
        else if (!this.isInTriggerRange && this.wasInTriggerRange)
        {
            this.domElement.classList.remove("md-in-" + this.typeIndex)
            this.domElement.classList.add("md-out-" + this.typeIndex)
        }

        this.wasInTriggerRange = this.isInTriggerRange
    }
}
