var util = new Util();

function Util() {}

Util.prototype.doubleTapHandler = function(callback) {
    if (this.doubleTapTimer == null) {

        var that = this;

        this.doubleTapTimer = setTimeout(function() {
            that.doubleTapTimer = null;
            return callback(false);
        }, 500);
    } else {
        clearTimeout(this.doubleTapTimer);
        this.doubleTapTimer = null;
        return callback(true);
    }
}

/**
 * Play a sound
 * @audioResource - audio file
 * @priority { noPriority: 0; lowPriority: 1; 2: high priority}
 */
Util.prototype.playSound = function(audioResource, priority) {
    var audio = document.getElementById("audio");

    if (priority == 0) {
        if (!audio.paused) {
            return;
        }
    } else if (priority == 1) {

        if (!audio.paused) {

            var audioTimeLeft = audio.duration - audio.currentTime;

            audioTimeLeft = Math.round(audioTimeLeft);

            setTimeout(function() {
                this.resource = audioResource;
                audio.pause();
                audio.src = audioResource;
                audio.play();
            }, audioTimeLeft * 1400);

            return;
        }

    }

    clearTimeout();
    audio.src = audioResource;
    audio.play();
};

Util.prototype.getCurrentSoundSource = function() {
    var audio = document.getElementById("audio");
    return audio.src;
}

Util.prototype.isSoundPlaying = function() {
    var audio = document.getElementById("audio");
    return !audio.paused;
}

Util.prototype.stopSound = function(audioResource) {
    var audio = document.getElementById("audio");
    audio.pause();
}