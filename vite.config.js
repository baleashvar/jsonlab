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
        python: 'tools/python/index.html'
      }
    },
    minify: 'terser',
    cssMinify: true
  }
});
