// We use a modified version of https://github.com/qlpqlp/Dogefy to enhance Shopify Shibes Stores :P
// Set the fiat array keys
(function($) {
    // Function to check if Local Storage is available
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

    // Function to hide the element with the attribute [data-testid="Checkout-button"]
    function hideCheckoutButton() {
        $('[data-testid="Checkout-button"]').hide();
    }

    // Function to run Dogefy script
    function runDogefyScript() {
        // Check if Local Storage is available
        if (!isLocalStorageAvailable()) {
            Swal.fire({
                title: 'Much Sad!',
                text: 'Sorry shibe, please enable Local Storage on your browser to store the Dogecoin current value',
                imageUrl: "https://qlpqlp.github.io/DogefyShopify/img/sad_doge.gif",
            });        
        }

        // Fetch the current fiat value of Dogecoin for each fiat option from coingecko and store it on Shibe local Browser
        const fiatOptions = Object.keys(fiat);
        fiatOptions.forEach(function(option) {
            $.getJSON("https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=" + option, function(data){
                localStorage.setItem('dogecoinValue_' + option, data["dogecoin"][option]); // Store the value in local storage
            }).fail(function( dat, textStatus, error ) {
                var err = textStatus + ", " + error;
            });
        });

        // Reload the webpage if the local storage dogecoin value is not available yet
        const dogecoinValues = {};
        fiatOptions.forEach(function(option) {
            dogecoinValues[option] = localStorage.getItem('dogecoinValue_' + option);
            if (dogecoinValues[option] <= 0 ){
                setTimeout(function() {
                    location.reload();
                }, 120);
            }
        });

        // Hide the element with the quantity
        $('.cart-item__quantity-wrapper').hide();

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
                        $(this).html($(this).html().replace(fiat[option] + numericValue, 'Ð' + (numericValue / dogecoinValues[option]).toFixed(2)));
                    }
                }
            });    
        });

        // Add an event listener to the checkout button to create a Doge QR payment
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

                        // Remove the Shopify products from cart that are stored on cookies
                        document.cookie = 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

                        // Display block to align the QR code and Doge Address
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

                        // Add the <a> element with <doge-qr> inside before the checkout button within the .cart__ctas div
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
    }

    // Load jQuery dynamically
    var jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    jqueryScript.onload = runDogefyScript;
    document.head.appendChild(jqueryScript);
})(jQuery);
