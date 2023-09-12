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
    
    private map: ObjBase
    private character: ObjCharacter
    private objCompassArrow: ObjBase
    private objTargetArrow: ObjBase
    private objRealArrow: ObjBase
    private objDivertVisual: ObjBase
    // private pastTrails: Array<Array<Vec2D>>
    // private currentTrail: Array<Vec2D>

    private viewScale: number = 1.75
    private viewCenter: Vec2D = new Vec2D(-3125, -1560)
    private windowScale: number = 1
    private windowCenter: Vec2D

    private ticks: number = 0
    private lastTickTime: number
    private divertAngle: number = 0

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
        this.paused = false
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
    }

    initLevel()
    {
        let tmp: Renderer

        this.character = new ObjCharacter(-3125, -1560)

        // UI elements
        tmp = new Renderer(VISUAL_SIZE_1, VISUAL_SIZE_1, null, false)
        tmp.drawArrays(GFX_UI_COMPASS, 100, 0, null, "#79444a", 0, 0)
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

        window.setTimeout(this.destroyElement.bind(this, tmp), 3000)
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

        // lowering the divert on each frame
        this.divertAngle = stepn(this.divertAngle, 0, 0.005 * dtt)
        
        if (_input.keysPressed['a'])
        {
            this.objTargetArrow.angle -= 0.015 * dtt
        }
        if (_input.keysPressed['d'])
        {
            this.objTargetArrow.angle += 0.015 * dtt
        }

        this.objCompassArrow.angle = 0
        this.objRealArrow.angle = stepn(this.objRealArrow.angle, this.objTargetArrow.angle + this.divertAngle, 0.015 * dtt)

        let speed = 0.5

        dx = Math.cos(this.objRealArrow.angle) * speed * dtt
        dy = Math.sin(this.objRealArrow.angle) * speed * dtt

        let pos: Vec2D = new Vec2D(this.character.position.x + dx, this.character.position.y + dy)

        if (this.maskPlayArea.isActiveAtPosition(Math.round(pos.x) + VISUAL_SIZE_MAP_WIDTH/2, Math.round(pos.y) + VISUAL_SIZE_MAP_HEIGHT/2))
        {
            this.character.position.copyFrom(pos)
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

        for (let obj of _gameObjects)
        {
            obj.update()
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
        this.initLevel()
        this.tick()
        this.loadFinished()
    }
}
