var utilities = require("../../../node_modules/simple-react-utilities/js/utilities.js");
var cardFilter = {};

(function(){

    /**
     * checks if a string exists in another string
     * @param  {string} str1 [string to search]
     * @param  {string} str2 [string to find in str1]
     * @return {boolean}     [whether str2 is found is str1]
     */
    function checkPartialMatch(str1,str2) {
      if (str2) {
        str2 = str2.replace(/_/g, ' ');
      }

      return usePartialMatch && str1.toLowerCase().indexOf(str2.toLowerCase()) > -1;
    }

    /**
     * checks is first character of a string is the given character
     * @param  {string} str  
     * @param  {string} char 
     * @return {boolean}     
     */
    function checkFirstCharMatch(str, char) {
        return (typeof str === "string") && (str.split("")[0].toLowerCase() === char.toLowerCase());
    }

    var Filter = function(dataArray) {
      var filtered = {};
        
      function filter(test, data) {
          var l = data.length;
          var filtered = [];
          var i;

          test = test || function() { return true; };

          for (i = 0; i < l; i++) {
              if (test(data[i])) {
                  filtered.push(data[i]);
              }
          }

          return filtered;
      }

      filtered.by = {

          all : function() {
              return dataArray;
          },

          firstCharacter : function(criteria, data) {
            var test = function(item) {
              var str = item[criteria[0]].split("")[0].toLowerCase();
              var character = criteria[1].toLowerCase();

              return (typeof item[criteria[0]] === "string") && (str === character);
            };

            return filter(test, data);
          },

          match : function(criteria, data) {
            data = data || dataArray;
            var test = function(item) {
              return utilities.contains(item[criteria[0]].toLowerCase(), criteria[1].toLowerCase());
            };

            return filter(test, data);
          },

          search : function(criteria, data) {
            var inputText = criteria[1].toLowerCase();
            var searchDescription = criteria[0];

            var test = function(item) {
              var cardName = item['name'].toLowerCase();
              var cardDescription = item['description'].toLowerCase();
              var isMatch = utilities.contains(cardName, inputText);

              if (searchDescription) {
                isMatch = isMatch || utilities.contains(cardDescription, inputText);
              }

              return isMatch;
            };

            return filter(test, data);
          },     

          value : function(criteria, data) {
            data = data || dataArray;
            var test = function(item) {
              return item[criteria[0]].toLowerCase() === criteria[1].toLowerCase();
            };

            return filter(test, data);
          },   

          subProp : function(parent) {
            var pub = {};

            pub.match = function(criteria, data) {
              data = data || dataArray;
              var test = function(item) {
                return utilities.contains(item[parent][criteria[0]], criteria[1].toLowerCase());
              };

              return filter(test, data);
            };

            pub.value = function(criteria, data) {
              data = data || dataArray;
              var test = function(item) {
                if (item[parent][criteria[0]]) {
                  return item[parent][criteria[0]] === criteria[1].toLowerCase();  
                }
                
              };

              return filter(test, data);
            };

            return pub;
          }
          
      }

      return filtered;
    };

    cardFilter = Filter;

    if (module) {
        module.exports = cardFilter;
    }
}());
