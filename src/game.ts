class Game
{

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
    }

    init()
    {
        // todo
        this.loadFinished()
    }
}
