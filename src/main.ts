let _game: Game
let _mapDom: HTMLDivElement
let _gameObjects: Array<ObjBase> = []

function init()
{
    _mapDom = getElement("map") as HTMLDivElement
    _game = new Game()
    _game.init()
}

window.addEventListener("load", init)
