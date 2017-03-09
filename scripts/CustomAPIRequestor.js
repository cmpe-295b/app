import RNFetchBlob from 'react-native-fetch-blob';

module.exports = {
    urlBase: "http://10.0.0.5:8000/api",
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
        // .then((res) => {
        //     return res.json();
        // })
        // .then((json) => {
        //     return json;
        // })
        // .catch(function(error){
        //     console.log(error);
        // });
    }
}
