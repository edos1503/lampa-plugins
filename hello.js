(function () {
    'use strict';

    var started = false;

    function start() {
        if (started) return;
        started = true;

        Lampa.Noty.show('Мой плагин работает!');
    }

    if (window.appready) {
        start();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                start();
            }
        });
    }
})();
