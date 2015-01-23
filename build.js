({
   // Nice not to inline/minify things for debugging
   //optimize: "none",

   // Base js directory relative to the build js
   baseUrl: './js/',

   mainConfigFile: "./js/main.js",

   name: "main",

   generateSourceMaps: false,

   preserveLicenseComments: false,

   // File to output compiled js to
   out: 'dist/js/main.js',
 })