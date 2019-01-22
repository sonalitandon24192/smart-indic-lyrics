angular.module('todoApp')
    .controller('MainController', ['$scope', 'smiService', 'logService', 'FileSaver', 'Blob', function($scope, smiService, logService, FileSaver, Blob) {
        $scope.languages = ['Hindi', 'Tamil'];

        $scope.favWords = [];
        $scope.meaningsMap = {};
        $scope.username = null;

        //when landing on the page, get all songs and show them
        smiService.get().then(
            function(response) {
                $scope.songs = $scope.preProcessLyrics(response.data);
                logService.success('smiService.get()', response);
            },
            function(response) {
                logService.failed('smiService.get()', response);
            }
        );

        // Set the current song
        $scope.setCurrentSong = function(song) {
            $scope.currentSong = song;
            $scope.currentSong.type = 'native';
            if (Object.keys($scope.meaningsMap).length === 0) {
                smiService.getHindiEnglishMeanings()
                    .then(function(response) {
                        angular.forEach(response.data, function(meaning) {
                            $scope.meaningsMap[meaning.nativeWord] = meaning;
                            $scope.meaningsMap[meaning.nativeWord].expandLearnMore = false;
                            $scope.meaningsMap[meaning.nativeWord].hoveredOver = false;
                        });
                    }, function(response) {
                        logService.failed('smiService.getHindiEnglishMeanings()', response);
                    });

                smiService.getTamilMeanings()
                    .then(function(response) {
                        angular.forEach(response.data, function(meaning) {
                            $scope.meaningsMap[meaning.nativeWord] = meaning;
                            $scope.meaningsMap[meaning.nativeWord].expandLearnMore = false;
                            $scope.meaningsMap[meaning.nativeWord].hoveredOver = false;
                        });
                    }, function(response) {
                        logService.failed('smiService.getTamilMeanings()', response);
                    });
            }
        }

        // Hightlight words in the song
        $scope.setHighlight = function() {
            var scope = $scope,
                wordTimes;

            document.getElementById("song-audio-id").play();

            scope.popcornInstance = Popcorn("#song-audio-id");

            wordTimes = scope.currentSong.songTimingInfo;

            $.each(wordTimes, function(id, time) {
                scope.popcornInstance.footnote({
                    start: time.start,
                    end: time.end,
                    text: '',
                    target: id,
                    effect: "applyclass",
                    applyclass: "selected"
                });
            });

            scope.popcornInstance.play();
        }

        $scope.preProcessLyrics = function(songs) {
            var songsWords = [],
                meanings = null,
                scope = $scope,
                wordsTimes;

            angular.forEach(songs, function(song) {
                // Process the lyrics. Both native and english
                angular.forEach(song.lyrics, function(langLyrics, index) {
                    langLyrics = langLyrics.split(" ");

                    //$scope.getMeaningsOfWords(langLyrics);

                    var count = 0;
                    langLyrics = langLyrics.map(function(word, index) {
                        if (word !== ";") {
                            return {
                                word: word,
                                num: count++
                            };
                        } else {
                            return {
                                word: word,
                                num: null
                            }
                        }
                    });

                    song.lyrics[index] = langLyrics;
                });

                song.selectedLyrics = song.lyrics.native;

                wordsTimes = song.timingInfo.split(" ");

                song.songTimingInfo = {};
                var timingInfo = {};

                angular.forEach(wordsTimes, function(wordTime, index) {
                    if (wordsTimes[index + 1] && !wordTime.includes("<")) {
                        var prev = wordsTimes[index - 1].substring(1, 9),
                            next = wordsTimes[index + 1].substring(1, 9);

                        timingInfo[wordTime + '-' + (index - 1) / 2] = {
                            start: prev,
                            end: next
                        };
                    }
                });

                song.songTimingInfo = timingInfo;
            });


            return songs;
        }

        $scope.setSongLyrics = function(type) {
            if (type === 'native') {
                $scope.currentSong.selectedLyrics = $scope.currentSong.lyrics.native;
                $scope.currentSong.type = 'native';
            } else {
                $scope.currentSong.selectedLyrics = $scope.currentSong.lyrics.english;
                $scope.currentSong.type = 'english';
            }
        }

       $scope.jsonToCsvConvertor =  function(JSONData, ReportTitle, showLabel) {
            let CSV = '',
                headers = [],
                csvData = [];

            if (showLabel) {
                angular.forEach(JSONData[0], (data, key) => {
                    headers.push(key);
                });
            }

            CSV = CSV + ReportTitle + '\r\n\n' + headers.join(',') + '\r\n';

            angular.forEach(JSONData, (data) => {
                csvData = [];
                angular.forEach(data, (val) => {
                    csvData.push(val);
                });

                csvData.join(',');
                CSV = CSV + csvData + '\r\n';
            });

            return CSV;
        }


        $scope.downloadFileFunc = function() {
            var controller = this,
                contentType = 'text/csv',
                fileName = 'learntWords',
                favWords = [$scope.jsonToCsvConvertor($scope.favWords, 'Learnt Words', true)],
                data = new Blob(favWords, {
                    type: 'text/csv;charset=utf-8'
                });

            $scope.trackdownloadFile();
            FileSaver.saveAs(data, fileName);
        }


        $scope.addToFav = function(word) {
            if ($scope.favWords.indexOf(word) === -1) {
                word = $scope.meaningsMap[word];
                $scope.favWords.push({
                    Word: word.nativeWord,
                    Meaning: word.englishMeaning,
                    "Part Of Speech": word.partOfSpeech,
                    Sentences: word.sentences[0].nativeSentence + word.sentences[0].englishSentence 
                });
            }
        }

        $scope.removeFav = function(word) {
            var index = $scope.favWords.indexOf(word);
            $scope.favWords.splice(index, 1);
        };

        $scope.learnMore = function(word) {
            $scope.meaningsMap[word].expandLearnMore = true;
            $scope.trackNumberOfLearnMoreClicked();
        };


        /* Methods to track user action*/

        $scope.numberOfLearnMoreClicked = 0;
        $scope.numberOfLearntWords = $scope.favWords.length;
        $scope.downloadFile = false;
        $scope.englishTab = false;

        $scope.trackHoveredWords = function(word) {
            $scope.numberOfHoveredWords = 0;
            $scope.meaningsMap[word].hoveredOver = true;
            angular.forEach($scope.meaningsMap, function(word) {
                if (word.hoveredOver) {
                    $scope.numberOfHoveredWords++;
                }
            });
        }

        $scope.trackNumberOfLearnMoreClicked = function() {
            $scope.numberOfLearnMoreClicked++;
        }

        $scope.tracknumberOfLearntWords = function() {
            $scope.numberOfLearntWords++;
        }

        $scope.trackdownloadFile = function() {
            $scope.downloadFile = true;
        }

        $scope.trackenglishTab = function() {
            $scope.englishTab = true;
        }

        $scope.postResults = function(){
            smiService.postResults({
                username: $scope.username,
                hoveredWords: $scope.numberOfHoveredWords,
                learntMoreClicked: $scope.numberOfLearnMoreClicked,
                learnMoreWords: $scope.favWords.length,
                downloadFile: $scope.downloadFile,
                englishTab: $scope.englishTab
            });
        };







        /* To get meanings from glosbe and all api's and store.
        Not required now.
        */
        $scope.getMeaningsOfWords = function(lyrics) {
            let wordsOfSong = [];

            $scope.smartWordsDbFormat = [];

            $scope.smartWordsMap = {};

            wordsOfSong = lyrics;

            //get meaning and sentence of words using glosbe api
            angular.forEach(wordsOfSong, (word) => {
                let smartWord = {
                    nativeWord: word,
                    englishMeaning: null,
                    sentences: [],
                    partOfSpeech: null,
                    image: null
                };

                if (!$scope.smartWordsMap[word]) {
                    $scope.smartWordsMap[word] = smartWord;

                    smiService.getMeaningOfWord(word)
                        .then((response) => {
                            angular.forEach(response.tuc, (tucObject) => {
                                if (tucObject.phrase) {
                                    if (!smartWord.englishMeaning) {
                                        smartWord.englishMeaning = tucObject.phrase.text;

                                        smiService.getPartOfSpeech(smartWord.englishMeaning)
                                            .then((response) => {
                                                smartWord.partOfSpeech = response.definitions[0] && response.definitions[0].partOfSpeech;

                                                if (smartWord.partOfSpeech === 'noun') {
                                                    // smiService.getPics(word)
                                                    //     .then((response) => {
                                                    //         smartWord.image = response.images[0].display_sizes[0].uri;
                                                    //         //smiService.postVocabMeanings(smartWord);
                                                    //     });
                                                }
                                                $scope.smartWordsDbFormat.push($scope.smartWordsMap[word]);
                                            });
                                    }
                                }
                            });
                        });

                    smiService.getSentencesForWord(word)
                        .then((response) => {
                            angular.forEach(response.examples, (example) => {
                                if (smartWord.sentences.length < 2) {
                                    smartWord.sentences.push({
                                        nativeSentence: example.first,
                                        englishSentence: example.second
                                    });
                                }
                            });
                        });
                }
            });

            return $scope.smartWordsMap;
        }
    }]);
