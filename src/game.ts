class Game
{
    private conversations = new Conversation
    private state = STATE_STARTUP
    private readyToProceed = false
    private currentScreenId = "loader"

    loadFinished()
    {
        getElement("loader").innerHTML = "Game loaded."
        this.onSetReadyToProceed()
    }

    setScreen(screenId: string)
    {
        getElement(this.currentScreenId).style.display = "none"

        getElement(screenId).style.display = "block"
        getBody().className = "body-" + screenId
        this.currentScreenId = screenId
    }

    startIntro()
    {
        this.state = STATE_INTRO
        this.readyToProceed = false
        this.setScreen("conversation")

        this.conversations.startConversation([
            [ "", "One day ... ... ..."],
            [ "king", "hey there lorem ipsum" ],
            [ "you", "sit amet" ],
            [ "king", "sure... sure..." ],
            [ "", "*nods*"],
            [ "you", "sit amet" ],
            [ "king", "sure... sure..." ],
            [ "", "*nods*"],
            [ "you", "sit amet" ],
            [ "king", "sure... sure..." ],
            [ "", "*nods*"],
            [ "you", "sit amet" ],
            [ "king", "sure... sure..." ],
            [ "", "*nods*"],
        ])
    }

    onSetReadyToProceed()
    {
        this.readyToProceed = true
        getElement("click-to-continue").style.display = "block"
    }

    onResize()
    {
        // so it'll be always scrolled to the end
        getElement("conversation").scrollBy(0, 10000)
    }

    onClick()
    {
        if (!this.readyToProceed)
        {
            return
        }

        getElement("click-to-continue").style.display = "none"

        if (this.state == STATE_STARTUP)
        {
            this.startIntro()
        }
        else if (this.state == STATE_INTRO)
        {
            console.log("go")
        }
    }

    init()
    {
        window.addEventListener("click", this.onClick.bind(this))
        window.addEventListener("keypress", this.onClick.bind(this))
        window.addEventListener("resize", this.onResize.bind(this))
        this.onResize()
        this.loadFinished()
    }
}
