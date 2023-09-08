class Game
{
    private conversations = new Conversation

    loadFinished()
    {
        getElement("loading").style.display = 'none'
        getElement("loaded").style.display = 'block'
        window.addEventListener("click", this.start.bind(this))
        window.addEventListener("keypress", this.start.bind(this))
    }

    start()
    {
        getElement("load_screen").style.display = 'none'
        getElement("game").style.display = 'block'
        getBody().className = 'intro'
        this.conversations.startConversation([
            [ "", "One day ... ... ..."],
            [ "king", "hey there lorem ipsum" ],
            [ "you", "oh, dolor sit amet, porttitor cursus purus, non aliquam urna iaculis in. Nam non tempus tortor. Cras vitae purus nulla." ],
            [ "king", "sure... sure..." ],
            [ "", "*nods*"],
            [ "king", "well the thing is... arcu mi mattis nunc, vitae accumsan diam odio vitae metus. Donec eget neque lobortis, semper neque placerat, vehicula tortor. Nullam fringilla sed sem non gravida. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent blandit aliquam augue sit amet vehicula. Aenean risus urna, imperdiet nec dui eu, ornare hendrerit nisi. Praesent tempor tortor vel pretium scelerisque. Donec sollicitudin nibh vitae fermentum rhoncus. Phasellus ac pretium ante." ],
        ])
    }

    onResize()
    {
        // TODO
    }

    init()
    {
        window.addEventListener("resize", this.onResize.bind(this))
        this.onResize()
        this.loadFinished()
    }
}
