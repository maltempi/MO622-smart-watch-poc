var util = new Util();

function Util() {
}

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

Util.prototype.playSound = function(audioResource) {
    var audio = document.getElementById("audio");
    audio.src = audioResource;
    audio.play();
}