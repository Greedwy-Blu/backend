module.exports = {
    generated: {
      output: {
        mode: 'split',
        target: 'src/api/generated.ts',
        schemas: 'src/api/model',
        client: 'react-query',
      },
      input: {
        target: './swagger.json', // Caminho local para o arquivo Swagger JSON
      },
    },
  };