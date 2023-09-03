let _game

function init()
{
    _game = new Game()
    _game.init()
}

window.addEventListener("load", init)
