export class Modal {
    constructor(options) {
        this.container = options.container                                      // DOMElement
        this.overlay = options.overlay                                          // DOMElement
        this.onOpen = options.onOpen || (() => {})                               // function
        this.onClose = options.onClose || (() => {})                             // function
        this.onCloseButtonClick = options.onCloseButtonClick || (() => {})  // function
        this.opened = false

        this.container.style.display = 'block'

        this.container.querySelector('.modal__close').addEventListener('click', () => {
            this.close()
            this.onCloseButtonClick()
        })

        document.addEventListener('keyup', (event) => {
            if (event.key === 'Escape')
                this.close()
        })
    }

    open() {
        if (!this.opened) {
            this.opened = true
            this.onOpen()

            document.body.style.overflowY = 'hidden'

            this.container.style.visibility = 'visible'
            this.container.style.top = '4vh'
            this.container.style.opacity = 1

            this.overlay.style.display = 'block'
            this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
        }
    }

    close() {
        if (this.opened) {
            this.opened = false
            this.onClose()

            document.body.style.overflowY = 'auto'

            this.container.style.visibility = 'hidden'
            this.container.style.top = '0vh'
            this.container.style.opacity = 0

            this.overlay.style.display = 'none'
            this.overlay.style.backgroundColor = ''
        }
    }
}

export class NetworkAlert extends Modal {
    constructor(options) {
        super(options)
        this.retryButton = options.retryButton       // DOMElement
        this.onRetry = options.onRetry || (() => {}) // function

        this.retryButton.addEventListener('click', () => {
            this.close()
            this.onRetry()
        })
    }
}