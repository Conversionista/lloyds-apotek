(function (window, undefined) {

    'use strict'; 

    // Sidebar
    $('#menu-close').click(function (e) {
        e.preventDefault();
        $('#sidebar-wrapper').toggleClass('active');
    });
    $('.toggle-sidebar').click(function (e) {
        e.preventDefault();
        $('#sidebar-wrapper').toggleClass('active');
    });

    // Frikort Update
    const progressBar = $('#user__view-more-content .progress .progress-bar');

    const updateProgress = (progress) => {
        // Don't let values be greater than 100
        const isFrikortYet = x => x >= 100 ?
            100 :
            progress;
        // Define what will be written inside the Progress Bar
        isFrikortYet(progress);

        const progressText = checkFrikort => isFrikortYet(progress) === 100 ?
            'Frikort!' :
            `${100 - isFrikortYet(progress)}% till frikort`;
        
        $(progressBar).css('width', isFrikortYet(progress) + '%')
            .text(progressText(isFrikortYet(progress)))
            .data('progress', progress)
            .parent('.progress')
            .attr('aria-valuenow', progress);
    };

    // Hjalp Button click

    $('.user__help button').on('click', function (event) {
        event.preventDefault();
        let content = $('.modal-body');
        content.empty();
        let title = $(this).attr('title');
        $('.modal-title').html(title);

        content.html($(this)
            .parent()
            .find('.help-content')
            .html()
        );

        $('.modal-profile').modal({
            show: true
        });
    });


    // Lightbox Accordion
    function lightboxAccordion() {
        $('.accordion > .inner').hide();
        $('.accordion > h4 > a').click(function () {
            $(this).slideDown(250);
            $(this).toggleClass('selected');
            $(this).parent().next().slideToggle();
            return false;
        });
    }

    // Hogkostnad link click
        $(document).on('click', 'a[href="#sa-funkar-hogkostnadsskydd-lightbox"]', function (event) {
            event.preventDefault();
            let content = $('.modal-body');
            content.empty();
            let title = $(this).attr('title');
            $('.modal-title').html(title);

            content.html($(this)
                .parent()
                .find('.hogkostnadsskydd-content')
                .html()
            );

            $('.modal-profile').modal({
                show: true
            });

            setTimeout(() => {
                lightboxAccordion();
            }, 500);
        });

    // Så Funkar Fullmakter click
    $(document).on('click', 'a[href="#sa-funkar-fullmakter-lightbox"]', function(event) {
        console.log('here');
        event.preventDefault();
        let content = $('.modal-body');
        content.empty();
        let title = $(this).attr('title');
        $('.modal-title').html(title);

        content.html($(this)
            .parent()
            .find('.fullmakter-content')
            .html()
        );

        $('.modal-profile').modal({
            show: true
        });

        setTimeout(() => {
            lightboxAccordion();
        }, 500);
    });

    


    // Aktiv recept links click Ajax Request (Green wide buttons)
    function toggleActive() {
        $('.toggle-aktiv a').on('click', function(e) {
            e.preventDefault();
            if ($(this).hasClass('active')) {} else {
                $(this).closest('.panel-body')
                    .find('.toggle-aktiv')
                    .find('a')
                    .removeClass('active');

                $(this).addClass('active');


                $(this).closest('.panel-body')
                    .find('article > section')
                    .toggleClass('inactive');
            }
        });
    }
    toggleActive();

    // View Recceptlist button click event
    function viewReceptList() {
        $('#view-recept-list').click(function () {
            $(this).remove();
            $('#i-agree label').remove();
            $('#i-agree').remove();
            $('#my-recept-list').show();
        });
    }
    viewReceptList();

    // Sticky Main Menu Logic
    $(document).ready(function () {
        if ($(window).width() >= 768) {
            $('.tofixed>div:last-child').sticky({
                topSpacing: 0,
                zIndex: 9999
            });
        }
        else {
            $('#site-header').sticky({
                topSpacing: 0,
                zIndex: 9999
            });
        }
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() > 60) {
            $('#site-header .tofixed h1').addClass('hidden-xs');
            $('.is-sticky #header-menu').addClass('hidden-xs');
            $('.tofixed h1 + nav + .toggle-sidebar').removeClass('hidden-xs');
        } else {
            $('#site-header .tofixed h1').removeClass('hidden-xs');
            $('#header-menu').removeClass('hidden-xs');
            $('.tofixed h1 + nav + .toggle-sidebar').addClass('hidden-xs');
        }
    });

    // add/remove items to cart -> Solution based on: https://reformatcode.com/code/javascript/change-just-one-input-field-with-javascript
    (function () {
        window.inputNumber = function (el) {
            var min = el.attr('min') || false;
            var max = el.attr('max') || false;

            el.each(function () {
                init($(this));
            });

            function init(el) {
                el.prev().on('click', decrement);
                el.next().on('click', increment);

                function decrement() {
                    var value = el[0].value;
                    value--;
                    (value < 1) ? value = 1: '';
                    if (!min || value >= min) {
                        el[0].value = value;
                    }
                }

                function increment() {
                    var value = el[0].value;
                    value++;
                    if (!max || value <= max) {
                        el[0].value = value++;
                    }
                }
            }
        };
    })();
    inputNumber( $('.input-number') );

    // Load in content on Loader section 
    let getSectionId,
        html,
        windowSize = $(window).width();

    // Update window size
    $(window).resize(function () {
        windowSize = $(window).width();
    });



    // Simplified Drug List Class management
    function simplifyDrugList() {
        $(".list-details").change(function () {
            let selectedOption = $(this).find(":selected").text();
            if (selectedOption === 'Förenklad lista') {
                $(this).closest('.panel-group').addClass('simplified');
            }
            else {
                $(this).closest('.panel-group').removeClass('simplified');
            }
        });
    }

    // Copy detatch content from one div to another one, and place back when done.
    function loader() {
        $('#recepts>.panel-default>.panel-heading>h4>a').click(function () {
            
            // Closes the other container
            if (windowSize >= 768) {

                // If we have the section defined, means their HTML is now empty and we must restore it first.
                if (getSectionId) {
                    $(getSectionId).html(html);
                }

                getSectionId = $(this).attr('href');
                html = $(getSectionId).html();
                $('#loader > .panel-group').html(html);
                $(getSectionId).html('');

                toggleActive();
                inputNumber( $('.input-number') );
                viewReceptList();
                simplifyDrugList();
            }
        });
    }

    // Scroll to top animation
    $('.to-top').click(function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 500);
        return false;
    });

    setTimeout(() => {

        inputNumber($('.input-number'));
        loader();

    }, 500);




}(window));