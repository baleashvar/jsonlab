import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        formatter: 'tools/formatter/index.html',
        validator: 'tools/validator/index.html',
        minifier: 'tools/minifier/index.html',
        tree: 'tools/tree/index.html',
        yaml: 'tools/yaml-json/index.html',
        xml: 'tools/xml-json/index.html',
        base64: 'tools/base64/index.html',
        url: 'tools/url-encode/index.html',
        uuid: 'tools/uuid/index.html',
        csvjson: 'tools/csv-json/index.html',
        jsoncsv: 'tools/json-csv/index.html',
        jsondiff: 'tools/json-diff/index.html',
        jwt: 'tools/jwt-decoder/index.html',
        hash: 'tools/hash-generator/index.html',
        python: 'tools/python/index.html',
        blog: 'blog/index.html',
        jsonvsyaml: 'blog/json-vs-yaml/index.html',
        pythonjson: 'blog/python-json-parsing/index.html',
        apitesting: 'blog/api-testing-json/index.html',
        aitools: 'ai-tools/index.html',
        tokencalc: 'ai-tools/token-calculator/index.html',
        vectorsim: 'ai-tools/vector-similarity/index.html',
        ragchunking: 'ai-tools/rag-chunking/index.html'
      }
    },
    minify: 'terser',
    cssMinify: true
  }
});
