# Descanso Examples

## Running an example
```bash
$ cd readme-example
# Compile with Typescript
$ tsc -p ./tsconfig.json
# Start the server
$ node .
```

## Adding examples
Please place each example in it's own folder with the following file structure:
```
examples
|-- my-example
  |-- index.ts
  |-- tsconfig.json
```
Here is a template ```tsconfig.json```:
```json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "commonjs",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "moduleResolution": "node"
  },
  "include": [
    "./**/*.ts"
  ]
}
```