function Action() {
    this.connect();
}

Action.prototype.connect = function() {
    this.semaphore = new SemaphoreMock();
    this.initObservers();
    this.semaphore.connect();
};

Action.prototype.disconnect = function() {
    navigator.vibrate(0); // cancel vibration
    this.semaphore.disconnect();
    document.location.href = 'index.html';
};

Action.prototype.initObservers = function() {
    document.addEventListener("semaphoreStatus", function(e) {
        console.log(e);
        var semaphoreStatus = e.detail;

        if (semaphoreStatus === 'stop') {
            document.getElementById("sign").src="res/images/stop.png";
            document.body.style.background = 'red';
            navigator.vibrate(1000);
        } else {
            document.getElementById("sign").src="res/images/go.png";
            navigator.vibrate([500, 100, 500]); // 500 on; 100 off; 500 on;
            document.body.style.background = 'green';
        }
    });

    document.addEventListener("timeLeft", function(e) {
        console.log(e);
        document.getElementById("timeLeft").innerHTML = e.detail;
    });


    /*
    Don't works at Tizen platform :(

    Object.observe(this.semaphore, function(changes) {

        changes.forEach(function(change, index) {
            if (change.name === 'timeLeft') {
                var timeLeft = change.object.timeLeft;

                timeLeft = timeLeft < 0 ? 0 : timeLeft;

                document.getElementById("timeLeft").innerHTML = timeLeft;
            }

            if (change.name === 'semaphoreStatus') {
                var semaphoreStatus = change.object.semaphoreStatus;

                if (semaphoreStatus === 'stop') {
                    document.body.style.background = 'red';
                } else {
                    document.body.style.background = 'green';
                }
            }
        });
    });
*/
};

var action = new Action();