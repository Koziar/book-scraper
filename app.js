var fs = require('fs');
var title;
var author;
var citiesArr = [];

// returns an array of strings (potential cities) from the given book
function getBookStrings(callback) {
    // fs.readFile('/Users/Luke/Desktop/testfile.txt', 'utf8', function(err, book) {
    //     if (err) throw err;
    //     var regex = /[A-Z]+(?:[\s]?)(?:[\.]?[\s]?)?[A-Za-z. ]*/gm;

    //     var data = book.match(regex).join(" ");

    //     callback(data);
    // });

    var readStream = fs.createReadStream('/Users/Luke/Desktop/38946.txt', 'utf8');
    var book = '';

    readStream.on('data', function(chunk) {  
        book += chunk;
    }).on('end', function() {
        var regex = /[A-Z]+(?:[\s]?)(?:[\.]?[\s]?)?[A-Za-z. ]*/gm;
        var data = book.match(regex).join("|");

        title = getTitle(book);
        author = getAuthor(book);

        callback(data);
    });
}

// reuturns an array of city objects;
function getCities(callback) {
    fs.readFile('/Users/Luke/Desktop/MIASTAKURWA.txt', 'utf8', function(err, cities) {
        if (err) throw err;

        var cityJSON = JSON.parse(cities);
        var cityArray = [];


        for (var i = cityJSON.length - 1; i >= 0; i--) {
            cityArray.push(cityJSON[i].name);
        }

        callback(cityArray);
    });
}

function getCitiesFromBook() {
    getBookStrings(bookStrings => {
        getCities(cities => {

            for (var j = cities.length - 1; j >= 0; j--) {
                if (bookStrings.indexOf(cities[j] + " ") !== -1) {
                    citiesArr.push(cities[j]);
                }  
            }

            citiesArr = removeDuplicates(citiesArr);
            // console.log(citiesArr.length, removeDuplicates(citiesArr).length);
            // console.log('ready', removeDuplicates(citiesArr));
            console.log(createData());
            process.exit(0);
        });
    });

    
}

getCitiesFromBook();
// scrapeCities();

// scrapes city name and its geolocation from the given in the exercise file
function scrapeCities() {
    fs.readFile('/Users/Luke/Desktop/cities15000.txt', 'utf8', function(err, cities) {  
        if (err) throw err;

        var arrCities = [];
        var city = [];

        var arrLines = cities.split('\n');

        for (var i = 0; i < arrLines.length; i++) {
            city = arrLines[i].split(/\t/, 2);

            arrCities.push({
                name: city[1],
                geo: city[0]
            });
        }

        saveToFile(arrCities);
    });
}

// saves arr of city objects into a text file
function saveToFile(arr) {
    arr = JSON.stringify(arr);
    var dir = "/Users/Luke/Desktop/";
    var fileName = "MIASTAKURWA.txt";
    fs.writeFile(dir.concat(fileName), arr, function(err) {
        if (err) throw err;

        console.log("The file " + fileName + " was saved in " + dir);
    });
}

// geolocation: arrLines[i].match(/^\d+|\d+\b|\d+/).shift()

function removeDuplicates(arr) {
    var unique = [];
    var current;

    for (var i = arr.length - 1; i >= 0; i--) {
        current = arr[i];
        if (unique.indexOf(current) < 0) unique.push(current);
    }

    return unique;
}

function getTitle(book) {
    return book.match(/Title:\s+((?![\r\n]+\w)[0-9-(.)':a-zA-Z," \r\n\t])+/)[0].substring(7).replace("\n","").replace("\r","");
}

function getAuthor(book) {
    return book.match(/Author:\s+((?![\r\n]+\w)[0-9-(.)':a-zA-Z," \r\n\t])+/)[0].substring(8);
}

function createData() {
    return {
        title: title,
        author: author,
        cities: citiesArr
    };
}
