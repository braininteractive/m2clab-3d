var $ = require('jquery');

module.exports = {
    price: function(volume){
        var price = 1;
        $('.price-tag').html(35 + Math.round(volume * price));
    }
};
