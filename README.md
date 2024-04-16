<h1 align="center">
DogefyShopify
<br><br>
<img src="https://qlpqlp.github.io/DogefyShopify/img/doge_card.png" alt="DogefyShopify - Convert any Shopify Store to show Dogecoin prices using your Fiat Prices" />
<br><br>
</h1>

Convert any Shopify Store to show Dogecoin prices using your Fiat Prices and allows Checkout to pay in Doge

## How to Install 💻

1- Go to your Shopify store admin on **https://admin.shopify.com/store/[your-store]/settings/general**

Click on **-> Store currency (click on the 3 dots ...) -> Change Currency Formating -> (on the field "HTML with currency" remove the sufix)**

Example: **${{amount}} USD**
Change to: **${{amount}}**

Click on **"Save"**

2- Now go to **https://admin.shopify.com/store/[your-store]/themes/**
On your Theme click on the "**3 dots ...**" before the button **"Custumise"** and select **"Edit code"**

Find the file **"theme.liquid"** and add the following code to your website head before the ```</head>``` tag

dont forget to change the Dogecoin Address **"Dxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"** with your Dogecoin Address to recive payments

You can also setup more currencies and change the QR code theme if you want :)

```
  <!-- DogeFyShopify your Shopify store -->  
  <!-- Add this code below before  tag and change the available parameters with your Dogecoin Address -->

  <script type="text/javascript">

  // Set your Dogecoin payment Adress to recive the payments in Dogecoin
  var dogecoin_address = "Dxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

  // Set the fetch theme using on the QR code you can see it here: https://fetch.dogecoin.org/doge-qr/demo/
  var dogecoin_theme = "such-doge";

  // Set your website fiat currency and fiat symbol to be automaticly replaced with the Dogecoin Value and Symbol
  // this is to get the Dogecoin price from coingecko API
  // must be the same used on your website and must match something like Ð793.08 or Ð842.61 etc.
  const fiat = {
    "usd": "$",
    "eur": "€"
  };    
  
  </script>
  
  <!-- we load the magic files :P -->
  <script type="text/javascript" src="//qlpqlp.github.io/DogefyShopify/dogefy.js" crossorigin="anonymous"></script>
  <script type="module" src="//fetch.dogecoin.org/doge-qr.js" crossorigin="anonymous"></script>
  
  <!-- End of DogeFyShopify your Shopify store -->
```
