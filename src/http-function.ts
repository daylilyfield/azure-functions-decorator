import * as path from 'path';

export interface HttpFunctionOption {
  disabled?: boolean;
  route: string;
  authLevel?: string;
  scriptFile: string;
}

export interface Binding {
  type: string;
  direction: string;
  name: string;
  route?: string;
  authLevel?: string;
}

export interface FunctionDeclaration {
  disabled: boolean;
  bindings: Binding[];
  entryPoint: string;
  scriptFile: string;
}

export const declarations: FunctionDeclaration[] = [];

export function HttpFunction(option: HttpFunctionOption): MethodDecorator {
  return function(_target: any, name: string | symbol, descriptor: PropertyDescriptor) {
    const scriptFile = path.relative(process.cwd(), option.scriptFile);

    declarations.push({
      disabled: !!option.disabled,
      bindings: [
        {
          type: 'httpTrigger',
          direction: 'in',
          name: 'req',
          route: option.route,
          authLevel: option.authLevel || 'anonymous'
        },
        {
          type: 'http',
          direction: 'out',
          name: '$return'
        }
      ],
      entryPoint: name.toString(),
      scriptFile: scriptFile
    });

    return descriptor;
  };
}
