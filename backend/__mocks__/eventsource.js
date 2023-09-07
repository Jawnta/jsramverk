class MockEventSource {
    constructor(url) {
        this.url = url;
        this.listeners = {};
    }

    addEventListener(event, callback) {
        this.listeners[event] = callback;
    }

    trigger(event, data) {
        if (this.listeners[event]) {
            this.listeners[event](data);
        }
    }

    reset() {
        this.listeners = {};
    }
}

module.exports = MockEventSource;
