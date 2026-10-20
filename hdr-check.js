(function () {
    'use strict';
    if (window.lampaHdrCheckLoaded) return;
    window.lampaHdrCheckLoaded = true;

    function inspect(scope) {
        var cards = scope.find('.lumio-prestige');
        var counts = { hdr: 0, dv: 0, uhd: 0 };
        cards.each(function () {
            var text = $(this).text();
            if (/\bHDR(?:10\+?)?\b/i.test(text)) counts.hdr++;
            if (/Dolby\s*Vision|\bDV\b|\bDoVi\b/i.test(text)) counts.dv++;
            if (/\b4K\b|\bUHD\b|2160p?/i.test(text)) counts.uhd++;
        });
        Lampa.Select.show({
            title: 'Проверка отметок HDR',
            items: [
                { title: 'Карточек на экране: ' + cards.length },
                { title: 'С отметкой HDR: ' + counts.hdr },
                { title: 'С отметкой Dolby Vision: ' + counts.dv },
                { title: 'С отметкой 4K: ' + counts.uhd },
                { title: 'Это проверка подписей, а не самого видео' },
                { title: 'Нет отметки — формат неизвестен, это не означает SDR' }
            ],
            onSelect: function () { Lampa.Controller.toggle('content'); },
            onBack: function () { Lampa.Controller.toggle('content'); }
        });
    }

    function attach() {
        try {
            var active = Lampa.Activity.active();
            if (!active || active.component !== 'nexusonline') return;
            if (!active.activity || !active.activity.render) return;
            var scope = $(active.activity.render());
            var holder = scope.find('.torrent-filter').first();
            if (!holder.length || holder.find('.hdr-check-button').length) return;
            var button = $('<div class="simple-button selector hdr-check-button"><span>Проверить HDR</span></div>');
            button.on('hover:enter', function () { inspect(scope); });
            holder.append(button);
        } catch (error) {
            // The next check retries after Lampa has finished rendering.
        }
    }

    function start() {
        if (window.lampaHdrCheckStarted) return;
        window.lampaHdrCheckStarted = true;
        Lampa.Noty.show('Проверка HDR подключена. Откройте источники Lumio.');
        attach();
        window.setInterval(attach, 1500);
    }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready') start();
    });
})();
