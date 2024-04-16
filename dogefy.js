//We use a modified version of https://github.com/qlpqlp/Dogefy to make the magic on Shopify Shibes Stores :P
// we set the fiat array keys

    // Check if 'jQuery' is already defined
    if (typeof jQuery === 'undefined') {
        // Load $ dynamically if it's not already defined
        var $Script = document.createElement('script');
        $Script.src = 'https://code.$.com/$-3.6.0.min.js';
        $Script.onload = runDogefyScript;
        document.head.appendChild($Script);
    }

    // Check if 'Swal' is already defined
    if (typeof Swal === 'undefined') {
        // Load sweetalert2 script only if 'Swal' is not already defined
        var scriptElement = document.createElement('script');
        scriptElement.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
        document.head.appendChild(scriptElement);
    }

    // Check if Local Storage is available
    function isLocalStorageAvailable(){
        var SuchTest = 'SuchTest';
        try {
            localStorage.setItem(SuchTest, SuchTest);
            localStorage.removeItem(SuchTest);
            return true;
        } catch(e) {
            return false;
        }
    }

        // Check Local Storage availability
        if (!isLocalStorageAvailable()) {
            Swal.fire({
                title: 'Much Sad!',
                text: 'Sorry shibe, please enable Local Storage on your browser to store the Dogecoin current value',
                imageUrl: "https://qlpqlp.github.io/DogefyShopify/img/sad_doge.gif",
            });        
        }    
    // Your entire script here
    //jQuery.noConflict();

    const fiatOptions = Object.keys(fiat);

    // wen the website finish loading it will try to convert everything
    $(document).ready(function() {

        // Fetch the current fiat value of Dogecoin for each fiat option from coingecko and store it on Shibe local Browser
        fiatOptions.forEach(function(option) {
            $.getJSON("https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=" + option, function(data){
                localStorage.setItem('dogecoinValue_' + option, data["dogecoin"][option]); // Store the value in local storage
            }).fail(function( dat, textStatus, error ) {
                var err = textStatus + ", " + error;
            });
        });

        // Hide the element with the quantity
        $('.cart-item__quantity-wrapper').hide();

        // Function to hide the element with the attribute [data-testid="Checkout-button"]
        function hideCheckoutButton() {
            $('[data-testid="Checkout-button"]').hide();
        }

        // Call the function to hide the element immediately when the document is ready
        hideCheckoutButton();

        // Set an interval to repeatedly hide the element every 2 seconds
        setInterval(hideCheckoutButton, 2000); // 2000 milliseconds = 2 seconds

        // Find all fiat prices on the webpage for each fiat option to be able to convert into Doge
        fiatOptions.forEach(function(option) {
            var regex = new RegExp('\\' + fiat[option] + '\\d+(,\\d{3})*(\\.\\d+)?', 'g'); // Adjusted regex
            
            // Filter all HTML tags to find fiat values
            $('*').filter(function() { 
                return $(this).children().length;
            }).each(function() {
                var text = $(this).text(); // Get text of element
                var matches = text.match(regex); // Find currency values in text    

                // If we find a currency value, convert it into Dogecoin 
                if (matches) {
                    for (var i = 0; i < matches.length; i++) {
                        const numericValue = matches[i].match(/[\d\.,]+/); // Adjusted regex
                        // Replace the HTML to dogefy the webpage
                        let dogefy = $('body').html().replace(fiat[option] + numericValue, 'Ð' + (numericValue / dogecoinValues[option]).toFixed(2));
                        // Dogefy the website
                        $('body').html(dogefy);             
                    }
                }
            });    
        });

        // We Add an event listener to the checkout button to be able to use fetch.dogecoin.org yo create a Doge QR payment
        $('#checkout').click(function(event) {
            event.preventDefault(); // Prevent form submission

            // Fetch the amount from the totals elements
            var subtotalText = $('.totals__subtotal-value').text();
            var totalText = $('.totals__total-value').text();

            // Extract the amount from the text using regular expression
            var amountMatchsubtotal = subtotalText.match(/(\d+(\.\d+)?)/);
            var amountMatchtotal = totalText.match(/(\d+(\.\d+)?)/);

            // Variable to hold the final dogecoin amount
            var amountMatch;

            // Check if amountMatchtotal exists
            if (amountMatchtotal) {
                amountMatch = amountMatchtotal;
            } else if (amountMatchsubtotal) {
                amountMatch = amountMatchsubtotal;
            }

            // If there is a doge amount to amountMatch and assign it to the variable dogecoin_amount
            if (amountMatch) {
                Swal.fire({
                    title: 'Hello Shibe!',
                    text: 'After payment in Doge you have to click on the Contact Page and send to us the Dogecoin Transaction ID, the link of the product you bought and the Shipping Details to be able to verify the payment and send your order.',
                    icon: 'warning',
                    showCancelButton: false,
                    confirmButtonText: 'Got it!',
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Hide the checkout button
                        $('#checkout').hide();

                        // We remove the Shopify products from cart that are stores on cookies
                        document.cookie = 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

                        // we display block to align the QR code and Doge Address
                        $('.cart__ctas').css('display', 'block');

                        // Convert comma to dot for decimal separator
                        var dogecoin_amount = parseFloat(amountMatch[0].replace(',', '.'));

                        // Create the <a> element with the specified href and target attributes
                        var anchorElement = $('<a></a>');
                        anchorElement.attr({
                            'href': 'dogecoin:' + dogecoin_address + '?amount=' + dogecoin_amount,
                            'target': '_blank'
                        });

                        // Create the <doge-qr> element dynamically with the specified attributes and align center
                        var dogeQR = $('<doge-qr style="margin:auto;"></doge-qr>');
                        dogeQR.attr({
                            'address': dogecoin_address,
                            'amount': dogecoin_amount,
                            'theme': dogecoin_theme
                        });

                        // Append the <doge-qr> element inside the <a> element
                        anchorElement.append(dogeQR);

                        // We add the <a> element with <doge-qr> inside before the checkout button within the .cart__ctas div
                        $('.cart__ctas').prepend(anchorElement);

                        // Create the button to copy dogecoin_address to clipboard
                        var copyButton = $('<button class="button"> ' + dogecoin_address +' </button>');
                        copyButton.click(function() {
                            // Copy the text inside the text field
                            navigator.clipboard.writeText(dogecoin_address);
                            Swal.fire({
                                title: 'Copied!',
                                text: 'Dogecoin address copied to clipboard!',
                                icon: 'success',
                                timer: 2000,
                                timerProgressBar: true,
                            });
                        });

                        // Append the copy button below the doge-qr
                        $('.cart__ctas').append(copyButton);
                    }
                });
            } else {
                // If no value found, show a message for the shibe
                Swal.fire({
                    title: 'Much Sad!',
                    text: 'Can\'t get total to pay in Doge!',
                    imageUrl: "https://qlpqlp.github.io/DogefyShopify/img/sad_doge.gif",
                });
            }
        });
    });
}

