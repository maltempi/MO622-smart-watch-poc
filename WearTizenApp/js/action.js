function Action() {
    this.connect();
}

Action.prototype.connect = function() {
    this.semaphore = new SemaphoreMock();
    this.initObservers();
    this.semaphore.connect();
};

Action.prototype.disconnect = function() {
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
        } else {
            document.getElementById("sign").src="res/images/go.png";
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