import * as fs from 'fs';
import * as util from 'node:util';
import * as readline from 'readline';
import { fileURLToPath } from 'url';
import { z as Z, ZodSchema } from 'zod';
import * as O from 'fp-ts/lib/Option';
import path from 'path';

const INCOMPLETE_INDICATOR = '// I AM NOT DONE';

const user_input_reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const read_file = util.promisify(fs.readFile);

// Zod schemas
const exercise_validator = Z.object({
    name: Z.string(),
    hint: Z.string()
});

const section_validator = Z.object({
    title: Z.string(),
    path: Z.string()
})

const parse = <T extends BaseModel>(validator: ZodSchema, data: any, result_type: new (config: any) => T): O.Option<T> => {
    const result = validator.parse(data);
    return result.success ? O.some(new result_type(result)) : O.none;
}

// Models
abstract class BaseModel {
    protected constructor(config: any) { }
}

class Exercise implements BaseModel {
    public path: string;

    constructor(config: { exercise_data: any, section_path: string }) {
        console.log(config.exercise_data);
        this.path = `${path.resolve(__dirname)}/${config.section_path}/${config.exercise_data?.name}`;
    }
}

class Section {
    public title: string;
    public exercises: Array<Exercise>;

    constructor(
        section_data: any
    ) {
        this.title = section_data?.title;
        this.exercises = section_data?.exercises.map((e: any) => new Exercise({ exercise_data: e, section_path: section_data?.path }));
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

