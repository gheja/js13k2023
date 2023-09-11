let _game: Game
let _mapDom: HTMLDivElement
let _gameObjects: Array<ObjBase> = []
let _input: Input

function init()
{
    _mapDom = getElement("map") as HTMLDivElement
    _input = new Input()
    _game = new Game()
    _game.init()
}

window.addEventListener("load", init)
