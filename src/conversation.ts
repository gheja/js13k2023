class Conversation
{
    private linesLeft = []

    speakScroll(span: HTMLSpanElement)
    {
        let shown: number = parseInt(span.dataset["shown"])
        shown +=1
        span.dataset["shown"] = shown.toString()

        // this prevents reflow when a word is partially shown and gets too long. also, the div will not resize either.
        span.innerHTML = span.dataset["text"].substring(0, shown) + "<span class=\"n\">" + span.dataset["text"].substring(shown) + "</span>"

        if (shown >= span.dataset["text"].length)
        {
            window.setTimeout(this.speakNextLine.bind(this, span), 500)
            return
        }

        window.setTimeout(this.speakScroll.bind(this, span), 40)
    }

    speakNextLine()
    {
        if (this.linesLeft.length == 0)
        {
            _game.onSetReadyToProceed()
            return
        }

        var a = this.linesLeft.shift()
        this.addSpeakText(a[0], a[1])

        // so it'll be always scrolled to the end
        getElement("conversation").scrollBy(0, 10000)
    }

    addSpeakText(speaker: string, text: string)
    {
        let div: HTMLDivElement = document.createElement("div")

        if (speaker != "")
        {
            div.className = "s"

            let span1: HTMLSpanElement = document.createElement("span")
            span1.className = "s-" + speaker
            span1.innerHTML = speaker + " "
            div.appendChild(span1)
        }

        let span2: HTMLSpanElement = document.createElement("span")
        span2.dataset["text"] = text
        span2.dataset["shown"] = "0"

        div.appendChild(span2)

        this.speakScroll(span2)

        getElement("conversation").appendChild(div)
    }

    startConversation(a)
    {
        this.linesLeft = a
        this.speakNextLine()
    }
}
