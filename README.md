## azure-functions-decorator

Generate azure function's configuration files (function.config) with typescript decorators.

### How to Install

```bash
$ npm install --save-dev azure-functions-decorator
```

### How to Use

To generate `function.json` configuration files, you need to write resource endpoint as a class, and decorate method with `@HttpFunction` decorator something like below.

```
import 'reflect-metadata';
import { Context, HttpResponse, HttpStatusCode } from 'azure-functions-ts-essentials';
import { HttpFunction } from 'azure-functions-decorator';

class Hello {

  @HttpFunction({ route: 'v1/hello', scriptFile: __filename })
  async run(): Promise<HttpResponse> {
    return {
      status: HttpStatusCode.OK,
      body: 'Hello World'
    };
  }
}
```

Transpile above typescript codes into javascrpt, and then run `azure-functions-docrator` command.

```bash
$ npx azure-functions-decorator --source lib/functions/*.js --out lib/
```

### Notice

This library uses typescript decorator, so you need to enable `experimentalDecorators` and `emitDecoratorMetadata`.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

And you might need to install `reflect-metadata`.
