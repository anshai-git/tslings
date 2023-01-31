"use strict";
exports.__esModule = true;
var fs = require("fs");
var util = require("node:util");
var readline = require("readline");
var url_1 = require("url");
var path_1 = require("path");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = (0, path_1.dirname)(__filename);
var INCOMPLETE_INDICATOR = '// I AM NOT DONE';
var user_input_reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var read_file = util.promisify(fs.readFile);
// Models
var Exercise = /** @class */ (function () {
    function Exercise(exercise_data, section_path) {
        console.log(exercise_data);
        this.path = "".concat(__dirname, "/").concat(section_path, "/").concat(exercise_data === null || exercise_data === void 0 ? void 0 : exercise_data.name);
    }
    return Exercise;
}());
var Section = /** @class */ (function () {
    function Section(section_data) {
        this.title = section_data === null || section_data === void 0 ? void 0 : section_data.title;
        this.exercises = section_data === null || section_data === void 0 ? void 0 : section_data.exercises.map(function (e) { return new Exercise(e, section_data === null || section_data === void 0 ? void 0 : section_data.path); });
    }
    return Section;
}());
// Parsing
var parse_exercises_data = function () { return read_file('./exercises.json'); };
var parse_sections_json = function () { return parse_exercises_data()
    .then(function (x) { return x.toString(); })
    .then(JSON.parse); };
var parse_sections = function () { return parse_sections_json()
    .then(function (data) { return data.sections; })
    .then(function (sections) { return sections.map(function (s) { return new Section(s); }); }); };
// Main
parse_sections()
    .then(function (s) {
    s.map(function (s) {
        console.log(s);
        console.log("-------------------------");
    });
});
