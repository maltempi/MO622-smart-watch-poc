var main = new Main();
var util = new Util();

window.onload = function () {

	main.welcome();

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function (e) {
        if (e.keyName == "back")
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
    });
};

function Main() {}

Main.prototype.tapScreen = function () {

    var that = this;

    util.doubleTapHandler(function (isDoubleTap) {
        if (isDoubleTap) {
            that.connect();
        } else {
            that.instruct();
        }
    });
}

Main.prototype.connect = function () {
    document.location.href = 'action.html';
};

Main.prototype.welcome = function() {
	util.playSound('res/audios/welcome.mp3');
};

Main.prototype.instruct = function () {
    util.playSound('res/audios/instructions.mp3');
};