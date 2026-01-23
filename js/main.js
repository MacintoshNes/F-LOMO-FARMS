(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        } 
    });
    
    
   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Cart functionality
    $(document).ready(function() {
        updateCartCount();

        $('.add-to-cart').click(function(e) {
            e.preventDefault();
            var $btn = $(this);
            var name = $btn.data('name');
            var price = $btn.data('price');
            var img = $btn.data('img');
            addToCart(name, price, img);
            updateCartCount();
            var originalText = $btn.html();
            $btn.html('<i class="fa fa-check me-2 text-success"></i> Added!');
            setTimeout(function() {
                $btn.html(originalText);
            }, 1000);
        });

        // Load cart items if on cart or checkout page
        if ($('.table tbody').length > 0) {
            loadCartItems();
        }

        function addToCart(name, price, img) {
            var cart = JSON.parse(localStorage.getItem('cart')) || [];
            var item = cart.find(function(item) { return item.name === name; });
            if (item) {
                item.quantity += 1;
            } else {
                cart.push({ name: name, price: price, img: img, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        function updateCartCount() {
            var cart = JSON.parse(localStorage.getItem('cart')) || [];
            var count = cart.reduce(function(total, item) { return total + item.quantity; }, 0);
            $('.fa-shopping-bag').next('span').text(count);
        }

        function loadCartItems() {
            var cart = JSON.parse(localStorage.getItem('cart')) || [];
            var tbody = $('.table tbody');
            tbody.empty();
            cart.forEach(function(item) {
                var row = '<tr>' +
                    '<th scope="row">' +
                        '<div class="d-flex align-items-center">' +
                            '<img src="' + item.img + '" class="img-fluid me-5 rounded-circle" style="width: 80px; height: 80px;" alt="">' +
                        '</div>' +
                    '</th>' +
                    '<td>' +
                        '<p class="mb-0 mt-4">' + item.name + '</p>' +
                    '</td>' +
                    '<td>' +
                        '<p class="mb-0 mt-4">' + item.price + ' GH₵</p>' +
                    '</td>' +
                    '<td>' +
                        '<div class="input-group quantity mt-4" style="width: 100px;">' +
                            '<div class="input-group-btn">' +
                                '<button class="btn btn-sm btn-minus rounded-circle bg-light border" >' +
                                '<i class="fa fa-minus"></i>' +
                                '</button>' +
                            '</div>' +
                            '<input type="text" class="form-control form-control-sm text-center border-0" value="' + item.quantity + '">' +
                            '<div class="input-group-btn">' +
                                '<button class="btn btn-sm btn-plus rounded-circle bg-light border">' +
                                    '<i class="fa fa-plus"></i>' +
                                '</button>' +
                            '</div>' +
                        '</div>' +
                    '</td>' +
                    '<td>' +
                        '<p class="mb-0 mt-4">' + (isNaN(item.price) ? 'Updating GH₵' : (item.price * item.quantity) + ' GH₵') + '</p>' +
                    '</td>' +
                    '<td>' +
                        '<button class="btn btn-md rounded-circle bg-light border mt-4 remove-item" data-name="' + item.name + '">' +
                            '<i class="fa fa-times text-danger"></i>' +
                        '</button>' +
                    '</td>' +
                '</tr>';
                tbody.append(row);
            });
        }

        // Remove item from cart
        $(document).on('click', '.remove-item', function() {
            var name = $(this).data('name');
            var cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(function(item) { return item.name !== name; });
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCartItems();
            updateCartCount();
        });

        // Update quantity
        $(document).on('click', '.btn-plus', function() {
            var row = $(this).closest('tr');
            var name = row.find('p').first().text();
            var cart = JSON.parse(localStorage.getItem('cart')) || [];
            var item = cart.find(function(item) { return item.name === name; });
            if (item) {
                item.quantity += 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                loadCartItems();
            }
        });

        $(document).on('click', '.btn-minus', function() {
            var row = $(this).closest('tr');
            var name = row.find('p').first().text();
            var cart = JSON.parse(localStorage.getItem('cart')) || [];
            var item = cart.find(function(item) { return item.name === name; });
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                loadCartItems();
            }
        });

        // Checkout form submission
        $('#place-order-btn').click(function(e) {
            e.preventDefault();
            var form = $('#checkout-form');
            var formData = form.serializeArray();
            var orderDetails = 'Order Details:\n\n';
            formData.forEach(function(field) {
                orderDetails += field.name + ': ' + field.value + '\n';
            });

            // Get cart items
            var cart = JSON.parse(localStorage.getItem('cart')) || [];
            orderDetails += '\nCart Items:\n';
            cart.forEach(function(item) {
                orderDetails += item.name + ' - Quantity: ' + item.quantity + ' - Price: ' + item.price + '\n';
            });

            // Calculate total (simple)
            var total = cart.reduce(function(sum, item) {
                var price = parseFloat(item.price) || 0;
                return sum + (price * item.quantity);
            }, 0);
            orderDetails += '\nTotal: GH₵ ' + total.toFixed(2);

            // Send email using mailto
            var subject = 'New Order from F-LOMO FARMS';
            var body = encodeURIComponent(orderDetails);
            var mailtoLink = 'mailto:sucessdeartambo@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + body;
            window.location.href = mailtoLink;

            // Clear cart after order
            localStorage.removeItem('cart');
            updateCartCount();
            alert('Order placed! Check your email client to send the order details.');
        });

        // Contact form submission
        $('#contact-submit').click(function(e) {
            e.preventDefault();
            var form = $('#contact-form');
            var formData = form.serializeArray();
            var message = 'Contact Form Submission:\n\n';
            formData.forEach(function(field) {
                message += field.name + ': ' + field.value + '\n';
            });

            // Send email using mailto
            var subject = 'New Contact Message from F-LOMO FARMS';
            var body = encodeURIComponent(message);
            var mailtoLink = 'mailto:sucessdeartambo@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + body;
            window.location.href = mailtoLink;

            alert('Message sent! Check your email client to send the contact details.');
        });
    });

})(jQuery);

