class Game
{
    private conversations = new Conversation
    private state = STATE_STARTUP
    private readyToProceed = false
    private currentScreenId = "loader"

    private paused: boolean = true

    private maskLand: Renderer
    private maskHills: Renderer
    private maskMountains: Renderer
    private maskPlayArea: Renderer

    private fog: Renderer

    private cities: Array<ObjCity> = []
    private currentCity: ObjCity
    private targetCity: ObjCity
    
    private map: ObjBase
    private objFog: ObjBase
    private character: ObjCharacter
    private objCompassArrow: ObjBase
    private objTargetArrow: ObjBase
    private objRealArrow: ObjBase
    private objDivertVisual: ObjBase
    // private pastTrails: Array<Array<Vec2D>>
    // private currentTrail: Array<Vec2D>

    private viewScale: number = 1.75
    private viewCenter: Vec2D = new Vec2D(-3125, -1560)
    public windowScale: number = 1
    public windowCenter: Vec2D

    private ticks: number = 0
    private lastTickTime: number
    private divertAngle: number = 0

    private objCursor: ObjBase

    worldToScreenSize(x: number)
    {
        return x * this.viewScale * this.windowScale
    }

    worldToScreenCoordinates(pos: Vec2D)
    {
        return new Vec2D(this.worldToScreenSize(pos.x - this.viewCenter.x) + this.windowCenter.x, this.worldToScreenSize(pos.y - this.viewCenter.y) + this.windowCenter.y)
    }

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
            [ "", "It was a nice summer day. You just finished your lunch and was about to get back to work when a messenger arrived."],
            [ "", "He told you that the King wants to speak with you and it sounds urgent. You get up and leave to the King."],
            [ "king", "My loyal servant, my scouts just returned and they reported that there might be more land outside my realm." ],
            [ "you", "I see, my lord..." ],
            [ "king", "But they seem to be scared of going outside the country of Europe..." ],
            [ "you", "I see, my lord..." ],
            [ "king", "So I chose you to go and explore the land beyond my realm." ],
            [ "you", "My lord?" ],
            [ "king", "You look brave and fierce, what could go wrong?!" ],
            [ "", "*laughs*"],
            [ "king", "Pack up your goods and get your ship and horses ready, you'll begin your travels immediately." ],
            [ "you", "... ... As you wish, my lord." ],
            [ "king", "Good luck and have this compass help you on your way" ],
            [ "", "*hands you a red compass*"],
            [ "king", "... and while you're out there... Bring me a golden coat, will you?" ],
            [ "you", "Certanly, my lord." ],
        ])
    }

    startGame()
    {
        this.state = STATE_MAP
        this.setScreen("map")
        this.paused = false
        _minigame.start(1, 4)
    }

    createMap()
    {
        let hill_versions = []
        let mountain_versions = []
        let wave_versions = []
        let grass_versions = []
        let i: number
        let tmp: Renderer

        let map_layer0 = new Renderer(VISUAL_SIZE_MAP_WIDTH, VISUAL_SIZE_MAP_HEIGHT, null, false)
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

        this.maskLand = new Renderer(VISUAL_SIZE_MAP_WIDTH, VISUAL_SIZE_MAP_HEIGHT, null, true)
        this.maskHills = new Renderer(VISUAL_SIZE_MAP_WIDTH, VISUAL_SIZE_MAP_HEIGHT, null, true)
        this.maskMountains = new Renderer(VISUAL_SIZE_MAP_WIDTH, VISUAL_SIZE_MAP_HEIGHT, null, true)
        this.maskPlayArea = new Renderer(VISUAL_SIZE_MAP_WIDTH, VISUAL_SIZE_MAP_HEIGHT, null, true)

        this.maskLand.drawArrays(GFX_MAP_LAND, 1000, 0, null, "#fff", 0, 0)
        this.maskHills.drawArrays(GFX_MAP_HILLS_1, 1000, 0, null, "#fff", 0, 0)
        this.maskMountains.drawArrays(GFX_MAP_HILLS_2, 1000, 0, null, "#fff", 0, 0)
        this.maskPlayArea.drawArrays(GFX_MAP_PLAY_AREA, 1000, 0, null, "#fff", 0, 0)

        let x2: number
        let y2: number
        for (let x = 0; x < VISUAL_SIZE_MAP_WIDTH; x += 50)
        {
            for (let y = 0; y < VISUAL_SIZE_MAP_HEIGHT; y += 50)
            {
                // add a bit of randomness
                x2 = x - 25 + (Math.random() - 0.5) * 25
                y2 = y - 25 + (Math.random() - 0.5) * 25 - ((x / 50) % 2) * 15

                if (this.maskMountains.isActiveAtPosition(x, y))
                {
                    map_layer0.drawOther(arrayPick(mountain_versions), x2, y2)
                }
                else if (this.maskHills.isActiveAtPosition(x, y))
                {
                    if (Math.random() < 0.8)
                    {
                        map_layer0.drawOther(arrayPick(hill_versions), x2, y2)
                    }
                }
                else if (!this.maskLand.isActiveAtPosition(x, y))
                {
                    if (Math.random() < 0.1)
                    {
                        map_layer0.drawOther(arrayPick(wave_versions), x2, y2)
                    }
                }
                else if (this.maskLand.isActiveAtPosition(x, y))
                {
                    if (Math.random() < 0.2)
                    {
                        map_layer0.drawOther(arrayPick(grass_versions), x2, y2)
                    }
                }
            }
        }

        this.map = new ObjBase(0, 0, map_layer0)

        this.cities.push(new ObjCity(-3175, -1595, "Venice",         false, false, 1, [ ],                [ "golden coat" ]))
        this.cities.push(new ObjCity(-3165, -1325, "Civitavecchia",  false, false, 1, [ "emerald" ],      [ "perfumes" ]))
        this.cities.push(new ObjCity(-1690,  -555, "Acre",           false, false, 1, [ "pepper" ],       [ "wool"]))
        this.cities.push(new ObjCity(-1140,  -490, "Baghdad",        false, false, 1, [ "spices" ],       [ "wool" ]))
        this.cities.push(new ObjCity( -395,   -70, "port of Hormuz", false, false, 1, [ "cotton" ],       [ "wool", "spices" ]))
        this.cities.push(new ObjCity( -600,  -685, "Terbil",         false, false, 2, [ "perfumes" ],     [ "cotton", "spices" ]))
        this.cities.push(new ObjCity(  260,  -890, "Balkh",          false, false, 2, [ "ruby" ],         [ "spices", "perfumes" ]))
        this.cities.push(new ObjCity(  400, -1310, "Samarkand",      false, false, 2, [ "pearls"],        [ "perfumes", "wool" ]))
        this.cities.push(new ObjCity( 1140, -1070, "Kashgar",        false, false, 2, [ "silk" ],         [ "perfumes", "wine" ]))
        this.cities.push(new ObjCity( 1280,  -960, "Yarkand",        false, false, 4, [ "amber"],         [ "silk", "sapphire" ]))
        this.cities.push(new ObjCity( 2380,  -830, "Lanzhou",        false, false, 3, [ "silver" ],       [ "silk", "ruby", "wine" ]))
        this.cities.push(new ObjCity( 2270, -1240, "Karakorum",      false, false, 3, [ "silver" ],       [ "silk", "wool", "perfumes" ]))
        this.cities.push(new ObjCity( 2815, -1217, "Shangdu",        false, false, 3, [ "sapphire" ],     [ "pepper", "silk", "perfumes" ]))
        this.cities.push(new ObjCity( 2950, -1070, "Bejing",         false, false, 3, [ "golden coat" ], [ "sapphire", "silk", "perfumes", "pearl" ]))
        this.cities.push(new ObjCity( 2770,  -380, "Chengdu",        false, false, 4, [ "emerald" ],      [ "sapphire", "amber", "ruby" ]))
        this.cities.push(new ObjCity( 2610,   -10, "Kunmig",         false, false, 4, [ "turquoise" ],    [ "emerald", "pearls" ]))
        this.cities.push(new ObjCity( 1890,   330, "Pagan",          false, false, 4, [ "quartz" ],       [ "sapphire", "pearls" ]))
        this.cities.push(new ObjCity(  900,  1050, "Calicut",        false, false, 4, [ "golden coat" ], [ "quartz", "pearls", "silver" ]))

        // - wool
        // - wine
        // - pepper
        // - spices
        // - precious stones (emerald, sapphire, ruby || amethyst, quartz crystal, amber, jade, jasper, coral, lapis lazuli, pearls, turquoise)
        // - pearls
        // - silk
        // - gold fabrics
        // - cotton
        // - perfumes
        // - silver

        this.targetCity = this.cities[0]

        this.fog = new Renderer(VISUAL_SIZE_MAP_WIDTH, VISUAL_SIZE_MAP_HEIGHT, null, false)
        this.fog.ctx.fillStyle = "#ab9b8e"
        this.fog.ctx.fillRect(0, 0, VISUAL_SIZE_MAP_WIDTH, VISUAL_SIZE_MAP_HEIGHT)

        this.objFog = new ObjBase(0, 0, this.fog)

        this.clearFogAt(-2600, -1400, 1.5)
        this.clearFogAt(-2770, -1000, 1.5)
        this.clearFogAt(-2800, -1600, 1.5)
        this.clearFogAt(-3100, -1600, 1.5)
        this.clearFogAt(-3150, -1300, 1.5)
        this.clearFogAt(-3400, -1600, 1.5)

        if (DEBUG_WITH_CURSOR)
        {
            tmp = new Renderer(10, 10, null, false)
            tmp.ctx.fillStyle = "#ff00ff"
            tmp.ctx.fillRect(0, 0, 10, 10)

            this.objCursor = new ObjBase(0, 0, tmp)
            this.fog.canvas.style.display = "none"
        }
    }

    initLevel()
    {
        let tmp: Renderer

        this.character = new ObjCharacter(-3125, -1560)
        this.character.goodsAvailable.push("wool")
        this.character.goodsAvailable.push("wine")

        // UI elements
        tmp = new Renderer(VISUAL_SIZE_1, VISUAL_SIZE_1, null, false)
        tmp.drawArrays(GFX_UI_COMPASS, 100, 2, "#ab9b8e", "#79444a", 0, 0)
        this.objCompassArrow = new ObjBase(0, 0, tmp)
        
        tmp = new Renderer(VISUAL_SIZE_1, VISUAL_SIZE_1, null, false)
        tmp.drawArrays(GFX_UI_TARGET, 100, 5, "#847875", null, 0, 0)
        this.objTargetArrow = new ObjBase(0, 0, tmp)
        this.objTargetArrow.angle = 0.785
        
        tmp = new Renderer(VISUAL_SIZE_1, VISUAL_SIZE_1, null, false)
        tmp.drawArrays(GFX_UI_REAL, 100, 0, null, "#4b726e", 0, 0)
        this.objRealArrow = new ObjBase(0, 0, tmp)

        tmp = new Renderer(VISUAL_SIZE_1, VISUAL_SIZE_1, null, false)
        this.objDivertVisual = new ObjBase(0, 0, tmp)
        // this.objDivertVisual.graphics.ctx.lineCap = "round"
        this.objDivertVisual.graphics.ctx.strokeStyle = "#4b726e"
        this.objDivertVisual.graphics.ctx.lineWidth = 8
    }

    destroyElement(element: HTMLElement)
    {
        element.parentNode.removeChild(element)
    }

    popUpMessage(text: string, color: string)
    {
        let tmp: HTMLDivElement
        tmp = document.createElement("div")
        tmp.className = "popup"
        tmp.innerHTML = text
        tmp.style.color = color
        document.body.appendChild(tmp)

        window.setTimeout(this.destroyElement.bind(this, tmp), 4000)
    }

    addDivert()
    {
        // making sure it's at least 0.5 in absolute value
        let a = 0.5 + Math.random() * Math.PI

        if (Math.random() < 0.5)
        {
            a *= -1
        }

        this.divertAngle += a
        this.objRealArrow.angle += a

        this.popUpMessage("Detour!", "#ae5d40")
    }

    clearFogAt(x: number, y: number, size: number)
    {
        this.fog.ctx.save()
        this.fog.ctx.beginPath()
        this.fog.ctx.arc(x + VISUAL_SIZE_MAP_WIDTH / 2, y + VISUAL_SIZE_MAP_HEIGHT / 2, VISUAL_SIZE_1 * size, 0, 2 * Math.PI)
        this.fog.ctx.clip()
        this.fog.ctx.clearRect(0, 0, VISUAL_SIZE_MAP_WIDTH, VISUAL_SIZE_MAP_HEIGHT)
        this.fog.ctx.restore()

/*
        this.fog.ctx.beginPath()
        this.fog.ctx.arc(x + VISUAL_SIZE_MAP_WIDTH / 2, y + VISUAL_SIZE_MAP_HEIGHT / 2, VISUAL_SIZE_1 * 1.5, 0, 2 * Math.PI)
        this.fog.ctx.strokeStyle = "#000"
        this.fog.ctx.stroke()

        this.fog.ctx.font = "30pt Arial"
        this.fog.ctx.fillStyle = "#000"
        this.fog.ctx.fillText(x.toString() + ";" + y.toString(), x + VISUAL_SIZE_MAP_WIDTH / 2, y + VISUAL_SIZE_MAP_HEIGHT / 2)
*/
    }

    getGoodsListHtml(goods1: Array<string>, goods2: Array<string>, isMissingNew: boolean)
    {
        let s = ""

        for (let good of goods1)
        {
            s += "<span class=\"" + (goods2.indexOf(good) === -1 ? (isMissingNew ? "g-new" : "g-miss") : "g-have") + "\">" + good + "</span> ";
        }

        return s;
    }

    actionTrade()
    {
        this.character.tradeWithCity(this.currentCity)
        this.updateTradeScreen()
    }

    updateTradeScreen()
    {
        getElement("city-name").innerHTML = "- " + this.currentCity.name + " -";
        getElement("g-give").innerHTML = this.getGoodsListHtml(this.currentCity.goodsAvailable, this.character.goodsAvailable, true)
        getElement("g-want").innerHTML = this.getGoodsListHtml(this.currentCity.goodsWanted, this.character.goodsAvailable, false)
        getElement("g-own").innerHTML = this.getGoodsListHtml(this.character.goodsAvailable, this.character.goodsAvailable, false)
        getElement("a-trade").className = this.character.canTradeWithCity(this.currentCity) ? "" : "disabled"
    }

    highlightNextCity()
    {
        let cities: Array<ObjCity> = []

        for (let city of this.cities)
        {
            if (this.character.canTradeWithCity(city))
            {
                cities.push(city)
            }
        }

        cities.sort(function(a, b) { return dist2D(a.position, _game.character.position) - dist2D(b.position, _game.character.position); })

        // console.log(cities)

        this.targetCity = cities[0]
    }

    arriveAtCity(city: ObjCity)
    {
        city.justVisited = true

        this.state = STATE_ENTERING_CITY
        this.paused = true
        this.currentCity = city
        this.popUpMessage("Arrived at "  + city.name, "#79444a")

        this.updateTradeScreen()

        window.setTimeout(this.onSetReadyToProceed.bind(this), 750)
    }

    enterCity()
    {
        this.state = STATE_CITY
        this.setScreen("city")
        // this.paused = true
    }

    leaveCity()
    {
        this.state = STATE_MAP
        this.highlightNextCity()
        this.setScreen("map")
        this.paused = false
    }

    tick()
    {
        let now = performance.now()
        let dt = Math.min(now - this.lastTickTime, 1000) / 1000 // don't jump more than 1 second
        this.lastTickTime = now

        window.requestAnimationFrame(this.tick.bind(this))

        if (this.paused)
        {
            return
        }

        this.ticks++

        this.divertAngle = wrapAngle(this.divertAngle)
        this.objRealArrow.angle = wrapAngle(this.objRealArrow.angle)
        this.objTargetArrow.angle = wrapAngle(this.objTargetArrow.angle)

        let dx: number = 0
        let dy: number = 0
        let dtt: number = dt / (1/60) // a ratio to 60 fps
        let warning: string = ""

        // lowering the divert on each frame
        this.divertAngle = stepn(this.divertAngle, 0, 0.005 * dtt)

        _minigame.tick(dt, dtt)
        
        if (this.ticks % 60 == 1)
        {
            this.highlightNextCity()
        }

        if (_input.keysPressed['a'])
        {
            this.objTargetArrow.angle -= 0.015 * dtt
        }
        if (_input.keysPressed['d'])
        {
            this.objTargetArrow.angle += 0.015 * dtt
        }
        if (_input.keysJustPressed['h'])
        {
            _minigame.pressColumn(0)
        }
        if (_input.keysJustPressed['j'])
        {
            _minigame.pressColumn(1)
        }
        if (_input.keysJustPressed['k'])
        {
            _minigame.pressColumn(2)
        }
        if (_input.keysJustPressed['l'])
        {
            _minigame.pressColumn(3)
        }

        this.objCompassArrow.angle = this.character.position.angleTo(this.targetCity.position)
        this.objRealArrow.angle = stepn(this.objRealArrow.angle, this.objTargetArrow.angle + this.divertAngle, 0.015 * dtt)

        let speed = 0.5

        dx = Math.cos(this.objRealArrow.angle) * speed * dtt
        dy = Math.sin(this.objRealArrow.angle) * speed * dtt

        let pos: Vec2D = new Vec2D(this.character.position.x + dx, this.character.position.y + dy)

        if (!this.maskPlayArea.isActiveAtPosition(Math.round(pos.x) + VISUAL_SIZE_MAP_WIDTH/2, Math.round(pos.y) + VISUAL_SIZE_MAP_HEIGHT/2))
        {
            warning = "We are getting too far from the destination..."
        }
        else if (this.maskMountains.isActiveAtPosition(Math.round(pos.x) + VISUAL_SIZE_MAP_WIDTH/2, Math.round(pos.y) + VISUAL_SIZE_MAP_HEIGHT/2))
        {
            warning = "This terrain is too rough for us to navigate..."
        }
        else
        {
            if (!DEBUG_WITH_CURSOR)
            {
                this.character.position.copyFrom(pos)
            }
        }

        this.objCompassArrow.position.copyFrom(this.character.position)
        this.objTargetArrow.position.copyFrom(this.character.position)
        this.objRealArrow.position.copyFrom(this.character.position)
        this.objDivertVisual.position.copyFrom(this.character.position)

        // update divert visual
        this.objDivertVisual.graphics.ctx.clearRect(0, 0, VISUAL_SIZE_1, VISUAL_SIZE_1)
        this.objDivertVisual.graphics.ctx.beginPath()
        this.objDivertVisual.graphics.ctx.arc(VISUAL_SIZE_1 / 2, VISUAL_SIZE_1 / 2, VISUAL_SIZE_1 * 0.31, this.objTargetArrow.angle, this.objRealArrow.angle, (this.objTargetArrow.angle > this.objRealArrow.angle))
        this.objDivertVisual.graphics.ctx.stroke()
        
        this.viewCenter.copyFrom(this.character.position)
        this.viewScale = lerp(1.75, 1.0, clampn(this.character.position.y, -3000, 2000))

        for (let city of this.cities)
        {
            if (city.justVisited)
            {
                if (dist2D(city.position, this.character.position) > CITY_LEAVE_DISTANCE)
                {
                    city.justVisited = false
                }
                continue
            }

            if (dist2D(city.position, this.character.position) < CITY_ARRIVE_DISTANCE)
            {
                this.arriveAtCity(city)
                break
            }
        }

        getElement("warning").innerHTML = warning


        if (DEBUG_WITH_CURSOR)
        {
            if (_input.keysPressed['w'])
            {
                this.objCursor.position.y -= 5 / 2
            }
            if (_input.keysPressed['s'])
            {
                this.objCursor.position.y += 5 / 2
            }
            if (_input.keysPressed['a'])
            {
                this.objCursor.position.x -= 5 / 2
            }
            if (_input.keysPressed['d'])
            {
                this.objCursor.position.x += 5 / 2
            }
            if (_input.keysJustPressed['h'])
            {
                console.log(this.objCursor.position.x + ", " + this.objCursor.position.y)
            }
            if (this.ticks % 60 == 0)
            {
                this.clearFogAt(this.objCursor.position.x, this.objCursor.position.y, 1.2)
            }

            this.viewCenter.copyFrom(this.objCursor.position)
            this.viewScale = 0.5
        }

        for (let obj of _gameObjects)
        {
            obj.update()
        }

        if (this.ticks % 60 == 0)
        {
            this.clearFogAt(this.character.position.x, this.character.position.y, 1.2)
        }

        if (this.ticks % 900 == 0)
        {
            _minigame.startNext()
        }

        _input.clearKeysJustPressed()
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
        this.windowScale = Math.min(document.body.clientWidth / 1920, document.body.clientHeight / 1080)
        this.windowCenter = new Vec2D(document.body.clientWidth / 2, document.body.clientHeight / 2)

        _minigame.screenPosition = new Vec2D(document.body.clientWidth - (4 * 80 - 20) * this.windowScale, document.body.clientHeight - (4 * 100 - 20) * this.windowScale)
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
        else if (this.state == STATE_ENTERING_CITY)
        {
            this.enterCity()
        }
    }

    init()
    {
        window.addEventListener("click", this.onClick.bind(this))
        window.addEventListener("keypress", this.onClick.bind(this))
        window.addEventListener("resize", this.onResize.bind(this))
        getElement("a-leave").addEventListener("click", this.leaveCity.bind(this))
        getElement("a-trade").addEventListener("click", this.actionTrade.bind(this))
        this.onResize()
        this.createMap()
        this.initLevel()
        this.tick()
        this.loadFinished()
    }
}
