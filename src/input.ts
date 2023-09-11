class Input
{
    private validKeys = [ "a", "d", "w", "s", "h", "j", "k", "l" ]
    public keysPressed: Array<boolean> = []
    public keysJustPressed: Array<boolean> = []

    constructor()
    {
        this.validKeys.forEach(element => {
            this.keysPressed[element] = false
        })

        this.clearKeysJustPressed()

        document.addEventListener("keydown", this.keyEvent.bind(this))
        document.addEventListener("keyup", this.keyEvent.bind(this))
    }

    clearKeysJustPressed()
    {
        this.validKeys.forEach(element => {
            this.keysJustPressed[element] = false
        })
    }

    keyEvent(event: KeyboardEvent)
    {
        let a = event.key.toLowerCase()
    
        if (this.validKeys.indexOf(a) === -1 || (event.type != "keydown" && event.type != "keyup") || event.repeat)
        {
            return
        }
    
        this.keysPressed[a] = (event.type == "keydown")

        if (event.type == "keydown")
        {
            this.keysJustPressed[a] = true
        }

        event.preventDefault()
    }
}
