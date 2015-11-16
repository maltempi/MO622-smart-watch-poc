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

    var that = this;

    var onStartVoice = function() {
        document.getElementById("signsDiv").style.display = 'none';
        document.getElementById("extraInfoDiv").style.display = 'block';
        document.getElementById("streetName").textContent = that.streetName;

        console.log(document.getElementById("audio").duration);

        audio.addEventListener('loadedmetadata', function() {
            setTimeout(function() {
                that.hideStreetName();
            }, Math.round(util.getCurrentSoundDuration()) * 1000);
        });
    };

    switch (this.streetName) {
        case 'Av. Brasil':
            util.playSound('res/audios/av_brasil.mp3', 1, onStartVoice);
            break;
        case 'Av. Nove de Abril':
            util.playSound('res/audios/av_nove_abril.mp3', 1, onStartVoice);
            break;
        case 'Av. Pe. Jaime':
            util.playSound('res/audios/av_pe_jaime.mp3', 1, onStartVoice);
            break;
    };
};


Action.prototype.hideStreetName = function() {
    document.getElementById("signsDiv").style.display = 'block';
    document.getElementById("extraInfoDiv").style.display = 'none';
    document.getElementById("streetName").textContent = '';
};


Action.prototype.setStatusToStop = function() {
    document.getElementById("sign").src = "res/images/stop.png";
    document.body.style.background = 'red';

    // If is on dangerous crossing alert, wait the alert finish to alert stop status.
    if (util.getCurrentSoundSource().indexOf('dangerous_crossing.mp3') > -1) {
        util.playSound('res/audios/stop.mp3', 1);
    } else {
        util.playSound('res/audios/stop.mp3', 2);
    }

    navigator.vibrate(1000);
};


Action.prototype.setStatusToGo = function() {
    document.body.style.background = 'green';
    document.getElementById("sign").src = "res/images/go.png";
    util.playSound('res/audios/go.mp3', 2);
    navigator.vibrate([500, 100, 500]); // 500 on; 100 off; 500 on;
};


Action.prototype.setStatusToDangerousCrossing = function() {
    document.body.style.background = 'yellow';
    util.playSound('res/audios/dangerous_crossing.mp3', 2);
    navigator.vibrate(1000);
    document.getElementById("sign").src = "res/images/stop.png";
};


Action.prototype.initObservers = function() {

    var that = this;

    document.addEventListener("semaphoreStatus", function(e) {
        console.log(e);
        var semaphoreStatus = e.detail;

        if (semaphoreStatus === 'stop') {
            that.setStatusToStop();
        } else {
            if (that.semaphore.getTimeLeft() >= 1 && that.semaphore.getTimeLeft() <= 5) {
                that.setStatusToDangerousCrossing();
            } else {
                that.setStatusToGo();
            }
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