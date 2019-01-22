angular.module('todoApp')
    // each function returns a promise object 
    .factory('smiService', ['$http', '$q', function($http, $q) {
        return {
            get: function() {
                return $http.get('/api/songs');
            },
            postResults: function(data){
              console.log(data);
              
              return $http.post('/api/results', data)
                .then(function(success){
                  console.log(success);
                }, function(error){
                  console.log(error)
                });
            },
            getHindiEnglishMeanings: function(){
              return $http.get('/api/hindiEnglishDictionary');
            },
            getTamilMeanings: function(){
              return $http.get('/api/tamilEnglishDictionary');
            },
            getMeaningOfWord: function(word) {
            let url = 'https://glosbe.com/gapi/translate?from=tam&dest=eng&format=json&callback=JSON_CALLBACK&pretty=true&phrase=' + word,
              deferred = $q.defer();

            $http({
              method: 'JSONP',
              url: url
            }).then((response) => {
              deferred.resolve(response.data);
            }, (response) => {
              deferred.reject(response);
            });

            return deferred.promise;
          },
          getSentencesForWord: function(word) {
            let url = 'https://glosbe.com/gapi/tm?from=tam&dest=eng&format=json&callback=JSON_CALLBACK&pretty=true&phrase=' + word,
              deferred = $q.defer();

            $http({
              method: 'JSONP',
              url:url
            }).then((response) => {
              deferred.resolve(response.data);
            }, (response) => {
              deferred.reject(response);
            });

            return deferred.promise;
          },
          getPartOfSpeech: function(word) {
          	let url = "https://wordsapiv1.p.mashape.com/words/" + word + "/definitions",
          		deferred = $q.defer();

          		$http({
          			method: 'GET',
          			url: url,
          			headers: {
          				"X-Mashape-Key": "PPLk6LEo16mshYetmbVnt26VLCA3p1hEu8XjsnS0lnOMpPUK2B",
          				"accept": "application/json"
          			}
          		}).then((response) => {
          			deferred.resolve(response.data);
          		}, (response) => {
          			console.log('error' + response);
          			deferred.reject(response);
          		});

          		return deferred.promise;
          	},
            getPics: function(word){
              let url = "https://api.gettyimages.com/v3/search/images?phrase=word&graphical_styles=illustration",
                deferred = $q.defer();

              $http({
                method: 'GET',
                url: url,
                headers: {
                  "Api-Key": "78ptzjfhdu5pzyteyww5k6xu"
                }
              })
              .then((response)=>{
                deferred.resolve(response.data);
              }, (response) =>{
                console.log('error' + response);
                deferred.reject(response);
              });

              return deferred.promise;
            }
        }
    }]);
