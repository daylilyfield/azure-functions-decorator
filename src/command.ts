#!/usr/bin/env node

import * as fs from 'fs';
import { Command } from 'commander';
import glob = require('glob');
import * as path from 'path';

import { declarations, FunctionDeclaration } from './http-function';

const program = new Command();

program
  .version('0.1.1')
  .option('-S, --source [path]', 'glob decorated source files')
  .option('-O, --out [path]', 'output directory')
  .parse(process.argv);

const source = program.source;
const out = program.out;

const files = glob.sync(source);

const trimExt = (file: string): string => file.replace(path.extname(file), '');

const imports = (file: string): Promise<void> => import(path.resolve(trimExt(file)));

const extractJsBase = (file: string): string => path.basename(file, '.js');

const writeConfig = (declaration: FunctionDeclaration) => {
  const base = extractJsBase(declaration.scriptFile);
  const root = `${path.resolve(out, base)}`
  mkdir(root);
  writeFile(`${root}/function.json`, JSON.stringify(declaration));
  console.info(`write ${path.relative(process.cwd(), root)}/function.json.`);
}

const mkdir = (root: string): void => {
  try {
    fs.mkdirSync(root);
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
}

const writeFile = (root: string, declaration: string): void => {
  fs.writeFileSync(root, declaration);
}

Promise
  .all(files.map(imports))
  .then(() => declarations.forEach(writeConfig));
