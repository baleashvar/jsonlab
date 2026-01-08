import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // Tools
        formatter: resolve(__dirname, 'tools/formatter/index.html'),
        validator: resolve(__dirname, 'tools/validator/index.html'),
        minifier: resolve(__dirname, 'tools/minifier/index.html'),
        tree: resolve(__dirname, 'tools/tree/index.html'),
        yamlJson: resolve(__dirname, 'tools/yaml-json/index.html'),
        xmlJson: resolve(__dirname, 'tools/xml-json/index.html'),
        base64: resolve(__dirname, 'tools/base64/index.html'),
        urlEncode: resolve(__dirname, 'tools/url-encode/index.html'),
        uuid: resolve(__dirname, 'tools/uuid/index.html'),
        csvJson: resolve(__dirname, 'tools/csv-json/index.html'),
        jsonCsv: resolve(__dirname, 'tools/json-csv/index.html'),
        jsonDiff: resolve(__dirname, 'tools/json-diff/index.html'),
        jwtDecoder: resolve(__dirname, 'tools/jwt-decoder/index.html'),
        jsonToTypes: resolve(__dirname, 'tools/json-to-types/index.html'),
        xmlFormatter: resolve(__dirname, 'tools/xml-formatter/index.html'),
        golang: resolve(__dirname, 'tools/golang/index.html'),
        // AI Tools
        aiTools: resolve(__dirname, 'ai-tools/index.html'),
        ragChunking: resolve(__dirname, 'ai-tools/rag-chunking/index.html'),
        tokenCalculator: resolve(__dirname, 'ai-tools/token-calculator/index.html'),
        vectorSimilarity: resolve(__dirname, 'ai-tools/vector-similarity/index.html'),
        about: resolve(__dirname, 'about/index.html'),
        blog: resolve(__dirname, 'blog/index.html'),
        jsonVsYaml: resolve(__dirname, 'blog/json-vs-yaml/index.html'),
        pythonJsonParsing: resolve(__dirname, 'blog/python-json-parsing/index.html'),
        apiTestingJson: resolve(__dirname, 'blog/api-testing-json/index.html')
      }
    },
    cssMinify: true
  },
  publicDir: 'public'
});
