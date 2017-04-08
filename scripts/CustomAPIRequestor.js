import RNFetchBlob from 'react-native-fetch-blob';

module.exports = {
    //urlBase: "http://10.0.0.5:8000/api",
    urlBase: "http://10.0.0.5:3000/api",
    createUser: function(name, id){
        let options = {
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify({
              'name': name,
              'faceApiId': id
            })
        };

        return fetch(this.urlBase + "/users", options);
    },

    getPromotions: function(user_id){
      let options = {
          'method': 'GET',
          'headers': {'Content-Type': 'application/json'}
      };
      return fetch(this.urlBase + "/promotions/" + user_id, options);
    },

    getProductByBarcodeId: function(barcode_id){
      let options = {
          'method': 'GET',
          'headers': {'Content-Type': 'application/json'}
      };
      return fetch(this.urlBase + "/products/barcode/" + barcode_id, options);
    }
}
