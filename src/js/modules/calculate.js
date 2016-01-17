var $ = require('jquery');

module.exports = {
    price: function(volume){
        var price = 1;
        console.log(volume * price);
        $('.price-tag h2').html(35 + Math.round(volume * price) + '€');
    }
};
