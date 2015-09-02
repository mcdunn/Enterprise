(function () {
    /**
     * Initialize tooltips
     */
    $('body').popover({
        selector: '[data-toggle="popover"]',
        trigger: 'hover',
        html: true
    });


//    // TODO: if popovers not closing become a problem, uncomment this

    $('body').on("mouseenter", '[data-trigger="hover"]', function(e) {
        var that = $(this);
        setTimeout(
            function () {
                that.popover('destroy');
            }, 10000);
    });

    $('body').on("click", '[data-trigger="hover"]', function(e) {
        var that = $(this);
        setTimeout(
            function () {
                that.popover('destroy');
            }, 10000);
    });

    $('body').on("mouseleave", '[data-trigger="hover"]', function() {
        $(this).popover('destroy');
    });

    /**
     * Toggle callouts
     */
// Is this actually used by anything?
    $(document).on('click', '[data-callout]', function () {
        var ids = $(this).data('elem').split('|');
        var actions = $(this).data('action').split('|');
        var calloutSelectors = [];
        var $callout, selector;

        for (var i = 0; i < ids.length; i++) {
            selector = '[data-callout-id="' + ids[i] + '"]';

            if (actions.length > 1) {
                $(selector).filter('[data-callout-action="' + actions[i] + '"]').removeClass('hidden');
                $(selector).not('[data-callout-action="' + actions[i] + '"]').addClass('hidden');
            } else {
                calloutSelectors.push(selector);
            }
        }

        if (calloutSelectors.length < 1) {
            return;
        }

        $callout = $(calloutSelectors.join());

        $callout.filter('[data-callout-action="' + actions[0] + '"]').removeClass('hidden');
        $callout.not('[data-callout-action="' + actions[0] + '"]').addClass('hidden');
    });
})(jQuery);