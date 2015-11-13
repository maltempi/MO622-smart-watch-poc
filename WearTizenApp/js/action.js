function Action() {
    this.connect();
}

Action.prototype.connect = function() {
    this.semaphore = new SemaphoreMock();
    this.initObservers();
    this.semaphore.connect();
    this.street = "";
};

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
            if (that.isStreetShowing()) {
                that.hideStreetName();
            } else {
                that.showStreetName();
            }
        }
    });
};

Action.prototype.isStreetShowing = function() {
    return document.getElementById("extraInfoDiv").style.display === 'block';
};

Action.prototype.showStreetName = function() {
    document.getElementById("signsDiv").style.display = 'none';
    document.getElementById("extraInfoDiv").style.display = 'block';
    document.getElementById("streetName").textContent = this.streetName;

    switch (this.streetName) {
        case 'Av. Brasil':
            util.playSound('res/audios/av_brasil.mp3', 2);
            break;
        case 'Av. Nove de Abril':
            util.playSound('res/audios/av_nove_abril.mp3', 2);
            break;
        case 'Av. dos Trabalhadores':
            util.playSound('res/audios/av_trabalhadores.mp3', 2);
            break;
        case 'Av. Pe. Jaime':
            util.playSound('res/audios/av_pe_jaime.mp3', 2);
            break;
    };
};

Action.prototype.hideStreetName = function() {
    document.getElementById("signsDiv").style.display = 'block';
    document.getElementById("extraInfoDiv").style.display = 'none';
    document.getElementById("streetName").textContent = '';
};

Action.prototype.initObservers = function() {

    var that = this;

    document.addEventListener("semaphoreStatus", function(e) {
        console.log(e);
        var semaphoreStatus = e.detail;

        if (semaphoreStatus === 'stop') {
            document.getElementById("sign").src = "res/images/stop.png";
            document.body.style.background = 'red';

            if (util.getCurrentSoundSource().indexOf('dangerous_crossing.mp3') > -1) {
                util.playSound('res/audios/stop.mp3', 2, 3000);
            } else {
                util.playSound('res/audios/stop.mp3', 3);
            }
            navigator.vibrate(1000);
        } else {
            document.getElementById("sign").src = "res/images/go.png";

            if (that.semaphore.getTimeLeft() >= 1 && that.semaphore.getTimeLeft() <= 5) {
                util.playSound('res/audios/dangerous_crossing.mp3', 3);
                navigator.vibrate(1000);
            } else {
                util.playSound('res/audios/go.mp3', 3);
                navigator.vibrate([500, 100, 500]); // 500 on; 100 off; 500 on;
            }
            document.body.style.background = 'green';
        }
    });

    document.addEventListener("timeLeft", function(e) {
        console.log(e);

        document.getElementById("timeLeft").textContent = e.detail;

        switch (e.detail) {
            case 5:
                util.playSound('res/audios/time_left_5.mp3', 0);
                break;
            case 10:
                util.playSound('res/audios/time_left_10.mp3', 0);
                break;
            case 15:
                util.playSound('res/audios/time_left_15.mp3', 0);
                break;
        };
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