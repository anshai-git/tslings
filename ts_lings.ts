import * as fs from 'fs';
import * as util from 'node:util';
import * as readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INCOMPLETE_INDICATOR = '// I AM NOT DONE';

const user_input_reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const read_file = util.promisify(fs.readFile);

// Models
class Exercise {
    public path: string;

    constructor(exercise_data: any, section_path: string) {
        console.log(exercise_data);
        this.path = `${__dirname}/${section_path}/${exercise_data?.name}`;
    }
}

class Section {
    public title: string;
    public exercises: Array<Exercise>;

    constructor(
        section_data: any 
    ) {
        this.title = section_data?.title;
        this.exercises = section_data?.exercises.map((e: any) => new Exercise(e, section_data?.path));
    }
}


// Parsing
let parse_exercises_data = () => read_file('./exercises.json');

let parse_sections_json = (): any => parse_exercises_data()
    .then(x => x.toString())
    .then(JSON.parse);

let parse_sections = () => parse_sections_json()
    .then((data: any) => data.sections)
    .then((sections: any) => sections.map((s: any) => new Section(s)));

// Main
parse_sections()
    .then((s: Array<Section>) => {
        s.map(s => {
            console.log(s)
            console.log("-------------------------")
        })
    });

