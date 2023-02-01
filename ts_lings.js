import * as fs from 'fs';
import * as util from 'node:util';
import * as readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { z as Z } from 'zod';
import { none, some } from 'fp-ts/es6/Option';
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var INCOMPLETE_INDICATOR = '// I AM NOT DONE';
var user_input_reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var read_file = util.promisify(fs.readFile);
// Zod schemas
var exercise_validator = Z.object({
    name: Z.string(),
    hint: Z.string()
});
var section_validator = Z.object({
    title: Z.string(),
    path: Z.string()
});
var parse = function (validator, data, result_type) {
    var result = validator.parse(data);
    return result.success ? some(new result_type(result)) : none;
};
// Models
var BaseModel = /** @class */ (function () {
    function BaseModel(config) {
    }
    return BaseModel;
}());
var Exercise = /** @class */ (function () {
    function Exercise(config) {
        var _a;
        console.log(config.exercise_data);
        this.path = "".concat(__dirname, "/").concat(config.section_path, "/").concat((_a = config.exercise_data) === null || _a === void 0 ? void 0 : _a.name);
    }
    return Exercise;
}());
var Section = /** @class */ (function () {
    function Section(section_data) {
        this.title = section_data === null || section_data === void 0 ? void 0 : section_data.title;
        this.exercises = section_data === null || section_data === void 0 ? void 0 : section_data.exercises.map(function (e) { return new Exercise({ exercise_data: e, section_path: section_data === null || section_data === void 0 ? void 0 : section_data.path }); });
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
