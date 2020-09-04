/************ 
 * Cart Function for Comfort.to 
 *
 *
 *************/



/* Variables */


const config = {
    apiKey: client_key,
    authDomain: 'https://comfortgroup.myshopify.com/',
    cartUrl: 'https://comfortgroup.myshopify.com/cart.json',
    apiPass: client_key,
    orderAuth: client_key,
};

/*======================
Function that:

1. update cart,
2. run through all items in cart to find item SKU starting with “DATETIME:”

- If none found in cart then message (“Please select delivery date”) & link to Select delivery collection
- If more than 1 item with sku starting with datetime: is found, remove all items with sku starting with datetime: from cart, message (“Please select delivery date”) & link to Select delivery collection
- If found but quantity for that sku = 0 then remove that item from cart, message (“Please select delivery date”) & link to Select delivery collection
- If found only 1 item with that sku and qty added in cart  >1 then, set qty added in cart to 1 then proceed
- If found only 1 item with that sku and qty added in cart = 1, proceed 

=============*/


$(function() {
    $(".no_update_possible input").hide();

    var dev_mode = 'false',
        cart_datetime_count = '';

    // If customer goes back to the delivery date page and selects the same date we need only one in cart. 
    /*
    $(document).on('cart.requestComplete', function(event, cart) {

    });
*/

    function runZero() {
        $.getJSON('/cart.js', function(cart) {
            // now have access to Shopify cart object
            var cart_items = cart.items;
            for (let i = 0; i < cart_items.length; ++i) {
                var item_sku = cart.items[i].sku;
                if (item_sku.includes('DATETIME')) {
                    if (dev_mode === 'true') { console.log(cart.items[i].variant_id) }
                    var variant_id = cart.items[i].variant_id;
                    window.removeItemById(variant_id);
                    setTimeout(function() {
                        $(window).attr('href', config.authDomain + '/collections/testing-new-calendar')
                    }, 800);
                }
            }
        });
    } // end function



    function createOrder() {

        var jsonItems = [];

        $.getJSON('/cart.js', function(cart) {
            jsonItems.push(cart.items);

        }).done(function(json) {

            function substituteFunc() {
                $('input#line_item_sub').each(function(index) {
                    var id = $(this).attr('data-line');

                    if ($(this).is(':checked')) {

                        $.each(jsonItems[0], function(index, value) {
                            var itemKey = jsonItems[0][index].key;
                            if (id === itemKey) {
                                jsonItems[0][index].properties.name = 'Subsititute';
                                jsonItems[0][index].properties.value = 'No';
                            }

                        });

                    } else {
                        $.each(jsonItems[0], function(index, value) {
                            var itemKey = jsonItems[0][index].key;
                            if (id === itemKey) {
                                jsonItems[0][index].properties.name = '';
                                jsonItems[0][index].properties.value = ''; // No value if not checked
                            }
                        });

                    }
                });
            }

            function darftOrder(lineJSON) {
                var settings = {
                    "url": "https://macromade-cors-anywhere.herokuapp.com/https://comfortgroup.myshopify.com/admin/api/2020-07/draft_orders.json",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "X-Shopify-Access-Token": config.apiPass,
                        "Content-Type": "application/json",
                        "Authorization": "Basic " + config.orderAuth + "",

                    },
                    "data": JSON.stringify({ "draft_order": { "line_items": lineJSON } }),
                };

                $.ajax(settings).done(function(response) {
                    window.location.href = response.draft_order.invoice_url;
                });
            }

            substituteFunc() // Update cart object values based on selected

            $.when(substituteFunc()).then(function(x) {



                var lineObj = [],
                    count = jsonItems[0].length,
                    lineJSON;

                $.each(jsonItems[0], function(index, i) {
                    var lineItem = jsonItems[0][index],
                        variant_id = lineItem.variant_id,
                        quantity = lineItem.quantity,
                        propertiesName = lineItem.properties.name,
                        propertiesVal = lineItem.properties.value,
                        dateProp = lineItem.sku;

                    var item = {}
                    item["variant_id"] = variant_id;
                    item["quantity"] = quantity;



                    if (propertiesVal) {
                        item["properties"] = [{
                            "name": "" + propertiesName + "?",
                            "value": propertiesVal
                        }]
                    }

                    if (dateProp.indexOf('DATETIME') !== -1) {
                        item["_Date Item"] = 'Cart'
                    }


                    lineObj.push(item);
                    lineJSON = lineObj;

                    if (!--count) darftOrder(lineJSON) // Create draft order

                });
                // Updated Cart items
            });
        });
    }

    $.getJSON('/cart.js', function(cart) {
        // now have access to Shopify cart object
        var cart_items = cart.items;
        if (dev_mode === 'true') { console.log(cart.items) }

        for (let i = 0; i < cart_items.length; ++i) {
            var item_sku = cart.items[i].sku;
            if (item_sku.includes('DATETIME')) {
                if (dev_mode === 'true') { console.log(cart.items[i].sku) }
                var cart_checker_date = 'true';
                cart_datetime_count += '1';
            }
        }

        if (cart_checker_date === 'true') {
            // if DATETIME SKU exists in cart we hide the message popup
            if (dev_mode === 'true') { console.log('DATETIME SKU exists in cart we hide the message popup') }
            if (cart_datetime_count === '1') {
                // if DATETIME SKU is 1
                if (dev_mode === 'true') { console.log('DATETIME SKU is 1') }
                $('.modal-region--1').removeClass('display_modal');

            } else {
                // if DATETIME SKU is greater than 1
                if (dev_mode === 'true') { console.log('DATETIME SKU is greater than 1') }
                $('.modal-region--1').addClass('display_modal');
                $('.delivery_instrunctions').text('Please select only one  delivery date') // change the text then custom function to change all to zero

                $(document).on("click", '.custom_link_changable', function(event) {
                    event.preventDefault(); // default function cancelled
                    runZero();
                });

            }

        } else {
            // If DATETIME SKU is NOT in cart we display the message popup.
            if (dev_mode === 'true') { console.log('DATETIME SKU is NOT in cart we display the message popup') }
            $('.modal-region--1').addClass('display_modal');
        }
    });


    /// Repeat date checker on the checkout button click so we can check the cart item quantity.

    function productRead(dateProductID, dateVariantID, dateQuantity) {

        var settings = {
            "url": "https://macromade-cors-anywhere.herokuapp.com/https://comfortgroup.myshopify.com/admin/api/2020-04/products/" + dateProductID + ".json",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": "Basic ODc5M2MwYzc0MTc3Njk1MWQxMWExMTA4YjY5OTM2MDI6c2hwcGFfOTBlMmY4MWI3ZmFjMWQwZDNiMDAxYzY3ZTQxZmU3Yzk=",

            },
        };

        $.ajax(settings).done(function(response) {
            var dateProduct = response.product;
            if (dev_mode === 'true') { console.log(dateProduct); };
            var prodTitle = dateProduct.title;
            for (let i = 0; i < dateProduct.variants.length; ++i) {
                var item_variant = dateProduct.variants[i].id;

                if (item_variant === dateVariantID) {
                    if (dev_mode === 'true') { console.log('Got this ' + dateProduct.variants[i].inventory_quantity) }
                    var item_quantity = dateProduct.variants[i].inventory_quantity;

                    if (item_quantity >= dateQuantity) {
                        createOrder()
                    } else {
                        $('.modal-region--1').addClass('display_modal');
                        var varTitle = dateProduct.variants[i].title;
                        window.removeItemById(dateProduct.variants[i].id);
                        $('.delivery_instrunctions').text('Please select another date below.').prepend('<p style="color:#ff5000 ">Uh-oh! We no longer have any delivery dates for ' + prodTitle + ' ' + varTitle + '.</p>')
                    }
                }

                window.clearAttributes(); // clear before we set

                window.setAttributes({
                    "Delivery date": "" + prodTitle + " " + dateProduct.variants[i].title + ""
                });

            }
        });

    }


    $(window).on("click", ".cs_checkout_button ", function(event) {
        event.preventDefault();
        $(this).text('Preparing Cart...');
        $(this).attr('disbaled', 'disabled');


        $.getJSON('/cart.js', function(cart) {
            // now have access to Shopify cart object
            var cart_items = cart.items;
            if (dev_mode === 'true') { console.log(cart.items) }

            for (let i = 0; i < cart_items.length; ++i) {
                var item_sku = cart.items[i].sku;
                if (item_sku.includes('DATETIME')) {

                    var dateProductID = cart.items[i].product_id,
                        dateVariantID = cart.items[i].variant_id,
                        dateQuantity = 1; // assume this is 1 since cart is to only have 1.  

                    if (dev_mode === 'true') {
                        console.log(dateProductID);
                        console.log(dateVariantID);
                        console.log(dateQuantity);
                    }

                    productRead(dateProductID, dateVariantID, dateQuantity)
                }
            }

        });



        //  alert("click bound to document listening for #test-element");
    });

})