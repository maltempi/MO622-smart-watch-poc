var SemaphoreMock = SemaphoreMock;

/*
 * This application is developed to run at Samsung Smartwatch.
 * The members of this team don't have a Samsung device compatible with Gear to make the bluetooth integration.
 * As this project is developed to Human-Computer Interface discipline, the premise is first think in interface.
 *
 * This class is a mock of communication, simulating the behavior of a semaphore.
 */
function SemaphoreMock() {

    /*
     * String value: 'go' or 'stop'
     */
    this.semaphoreStatus = null;

    /*
     *  The max time to 'go' status is 10 seconds
     */
    this.timeoutGo = 10;

    /*
     *  The max time to 'go' status is 20 seconds
     */
    this.timeoutStop = 20;

    /*
     * How time left to change status?
     */
    this.timeLeft = null;

    /*
     * Variable to control if the 'device' is connected
     */
    this.connected = false;

}

/*
 * Disconnect from device
 */
SemaphoreMock.prototype.disconnect = function() {
    this.connected = false;
    this.timeLeft = 0;
}

/*
 * Connect to device
 */
SemaphoreMock.prototype.connect = function() {
    if (!this.connected) {
        this.connected = true;
        this.startEngine();
    }
}

/*
 * Initialize the semaphore logic with a random initial value
 */
SemaphoreMock.prototype.startEngine = function() {
    this.semaphoreStatus = Math.floor(Math.random() * 2) === 0 ? 'stop' : 'go';
    this.fireEventSemaphoreStatus();
    this.run(this.timeoutGo);
};

/*
 * Run the semaphore logic
 */
SemaphoreMock.prototype.run = function() {

    // 10 or 20 seconds depending on semaphore status
    var seconds = this.semaphoreStatus === 'go' ? this.timeoutGo : this.timeoutStop;

    // if is a first time, will be a random timeLeft
    if (this.timeLeft == null) {
        this.timeLeft = Math.floor((Math.random() * seconds) + 1);
    } else {
        this.timeLeft = seconds;
    }

    this.fireEventTimeLeft();

    this.timer(this.timeLeft);
};


/*
 * The count down to change status
 */
SemaphoreMock.prototype.timer = function() {

    var that = this;

    setTimeout(function() {

        // countdown....
        if (that.timeLeft > 0) {

            that.timeLeft--;

            that.fireEventTimeLeft();

            // here we go!
            that.timer(that.timeLeft);
        } else {
            // timeout! change status and run again if connected yet!
            if (that.connected) {
                that.changeStatus();
                that.run();
            }
        }

    }, 1000);
}

SemaphoreMock.prototype.fireEventTimeLeft = function() {
    var event = new CustomEvent("timeLeft", {
        "detail": this.timeLeft
    });

    document.dispatchEvent(event);
}

SemaphoreMock.prototype.fireEventSemaphoreStatus = function() {
    var event = new CustomEvent("semaphoreStatus", {
        "detail": this.semaphoreStatus
    });

    document.dispatchEvent(event);
}

/*
 * Change semaphore status.
 */
SemaphoreMock.prototype.changeStatus = function() {
    this.semaphoreStatus = this.semaphoreStatus === 'go' ? 'stop' : 'go';
    this.fireEventSemaphoreStatus();
};