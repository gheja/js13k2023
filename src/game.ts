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
        ])
    }

    startGame()
    {
        this.state = STATE_MAP
        this.setScreen("map")
    }

    createMap()
    {
        let hill_versions = []
        let mountain_versions = []
        let wave_versions = []
        let grass_versions = []
        let i: number
        let tmp: Renderer

        let map_layer0 = new Renderer(1920 * 4, 1080 * 4, getElement("map"), false)
        map_layer0.drawArrays(GFX_MAP_LAND, 1000, 5, "#574852", "#bda99d33", 2, 0.8)

        // generate multiple versions of these graphics, they will be different
        // due to fuzzy rendering. this gives some variation on the map
        for (i=0; i<30; i++)
        {
            // don't worry, zip loves repetition - compresses better than creating a function
            tmp = new Renderer(50, 50, null, false)
            tmp.drawArrays(GFX_HILL_V1, 100, 3, "#574852", null, 3, 0.8)
            hill_versions.push(tmp)

            tmp = new Renderer(50, 50, null, false)
            tmp.drawArrays(GFX_HILL_V2, 100, 3, "#574852", null, 3, 0.8)
            hill_versions.push(tmp)

            tmp = new Renderer(50, 50, null, false)
            tmp.drawArrays(GFX_HILL_V3, 100, 3, "#574852", null, 3, 0.8)
            hill_versions.push(tmp)

            tmp = new Renderer(50, 50, null, false)
            tmp.drawArrays(GFX_MOUNTAIN_V1, 100, 4, "#574852", null, 3, 0.8)
            mountain_versions.push(tmp)

            tmp = new Renderer(50, 50, null, false)
            tmp.drawArrays(GFX_WAVE_V1, 100, 2, "#574852", null, 3, 0.8)
            wave_versions.push(tmp)

            tmp = new Renderer(50, 50, null, false)
            tmp.drawArrays(GFX_WAVE_V2, 100, 2, "#574852", null, 3, 0.8)
            wave_versions.push(tmp)

            tmp = new Renderer(50, 50, null, false)
            tmp.drawArrays(GFX_GRASS_V1, 100, 2, "#574852", null, 3, 0.8)
            grass_versions.push(tmp)

            tmp = new Renderer(50, 50, null, false)
            tmp.drawArrays(GFX_GRASS_V2, 100, 2, "#574852", null, 3, 0.8)
            grass_versions.push(tmp)

            tmp = new Renderer(50, 50, null, false)
            tmp.drawArrays(GFX_GRASS_V1, 100, 1, "#574852", null, 3, 0.8)
            grass_versions.push(tmp)

            tmp = new Renderer(50, 50, null, false)
            tmp.drawArrays(GFX_GRASS_V2, 100, 1, "#574852", null, 3, 0.8)
            grass_versions.push(tmp)
        }

        let character_sprite = new Renderer(100, 100, getElement("map"), false)
        character_sprite.drawArrays(GFX_SHIP, 100, 0, null, "#4b726e", 3, 0.05)
        
        let mask_land = new Renderer(1920 * 4, 1080 * 4, null, true)
        let mask_hills = new Renderer(1920 * 4, 1080 * 4, null, true)
        let mask_mountains = new Renderer(1920 * 4, 1080 * 4, null, true)
        mask_land.drawArrays(GFX_MAP_LAND, 1000, 0, null, "#fff", 0, 0)
        mask_hills.drawArrays(GFX_MAP_HILLS_1, 1000, 0, null, "#fff", 0, 0)
        mask_mountains.drawArrays(GFX_MAP_HILLS_2, 1000, 0, null, "#fff", 0, 0)

        let x2: number
        let y2: number
        for (let x = 0; x < 1920 * 4; x += 50)
        {
            for (let y = 0; y < 1920 * 4; y += 50)
            {
                // add a bit of randomness
                x2 = x - 25 + (Math.random() - 0.5) * 25
                y2 = y - 25 + (Math.random() - 0.5) * 25 - ((x / 50) % 2) * 15

                if (mask_mountains.isActiveAtPosition(x, y))
                {
                    map_layer0.drawOther(arrayPick(mountain_versions), x2, y2)
                }
                else if (mask_hills.isActiveAtPosition(x, y))
                {
                    if (Math.random() < 0.8)
                    {
                        map_layer0.drawOther(arrayPick(hill_versions), x2, y2)
                    }
                }
                else if (!mask_land.isActiveAtPosition(x, y))
                {
                    if (Math.random() < 0.1)
                    {
                        map_layer0.drawOther(arrayPick(wave_versions), x2, y2)
                    }
                }
                else if (mask_land.isActiveAtPosition(x, y))
                {
                    if (Math.random() < 0.2)
                    {
                        map_layer0.drawOther(arrayPick(grass_versions), x2, y2)
                    }
                }
            }
        }
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
            this.startGame()
        }
    }

    init()
    {
        window.addEventListener("click", this.onClick.bind(this))
        window.addEventListener("keypress", this.onClick.bind(this))
        window.addEventListener("resize", this.onResize.bind(this))
        this.onResize()
        this.createMap()
        this.loadFinished()
    }
}
