function Action() {
    this.connect();
}

Action.prototype.connect = function() {
    this.semaphore = new SemaphoreMock();
    this.initObservers();
    this.semaphore.connect();
    this.street = "";
};

function playSound(audioResource) {
    var audio = document.getElementById("audio");
    audio.src = audioResource;
    audio.play();
}

Action.prototype.disconnect = function() {
    navigator.vibrate(0); // cancel vibration
    this.semaphore.disconnect();
    document.location.href = 'index.html';
};

Action.prototype.tapScreen = function() {

    var that = this;

    util.doubleTapHandler(function(isDoubleTap) {
        if (isDoubleTap) {
            that.disconnect();
        } else {
            that.showStreetName();
        }
    });
}

Action.prototype.showStreetName = function() {
    alert(this.streetName);
};

Action.prototype.initObservers = function() {

    var that = this;

    document.addEventListener("semaphoreStatus", function(e) {
        console.log(e);
        var semaphoreStatus = e.detail;

        if (semaphoreStatus === 'stop') {
            document.getElementById("sign").src = "res/images/stop.png";
            document.body.style.background = 'red';
            navigator.vibrate(1000);
        } else {
            document.getElementById("sign").src = "res/images/go.png";

            if (that.semaphore.getTimeLeft() >= 1 && that.semaphore.getTimeLeft() <= 5) {
                navigator.vibrate(1000);
                playSound('res/audios/dangerous_crossing.mp3');
            } else {
                navigator.vibrate([500, 100, 500]); // 500 on; 100 off; 500 on;
            }
            document.body.style.background = 'green';
        }
    });

    document.addEventListener("timeLeft", function(e) {
        console.log(e);
        document.getElementById("timeLeft").innerHTML = e.detail;
    });

    document.addEventListener("streetName", function(e) {
        that.streetName = e.detail;
    });

    /*
    Don't works on Tizen platform :(

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