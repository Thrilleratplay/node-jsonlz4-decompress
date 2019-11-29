#!/usr/bin/env node

(function(){
  'use strict';

  // Modules
  var program = require('commander');
  var lz4= require('lz4');
  var fs = require('fs');
  var path = require('path');

  var packageJson = require('./package.json');

  /**
   * Decompress jsonlz4 file buffer
   *
   * @param {buffer} inputBuffer File buffer
   *
   * @returns {JSON}
   */
  var decompress = function(inputBuffer) {
    var outputBuffer;

    // Verify inputBuffer is a buffer
    if (!Buffer.isBuffer(inputBuffer)) {
      throw new Error('Input is not of type Buffer');
      return false;
    }

    // Verifiy custom Mozilla LZ4 header / Magic number
    if (inputBuffer.slice(0,8).toString() !== "mozLz40\0") {
      throw new Error('Input does not seem to be jsonlz4 format');
      return false;
    }

    outputBuffer = Buffer.alloc(inputBuffer.readUInt32LE(8));

    lz4.decodeBlock(inputBuffer, outputBuffer, 12);

    return JSON.parse(outputBuffer.toString());
  };

  // Export node module
  module.exports = decompress;

  // http://stackoverflow.com/questions/6398196/node-js-detect-if-called-through-require-or-directly-by-command-line/6398335#6398335
  if (require.main === module) {
    // Set up commandline parameter
    program.usage('[options] <file>')
           .version(packageJson.version)
           .arguments('<file>')
           .description('Decompress a Firefox bookmark backup jsonlz4 file format into JSON')
           .option('-p, --pretty', 'Pretty print JSON')
           .action(function(file) {
             if (program.pretty) {
               console.log(JSON.stringify(decompress(fs.readFileSync(file)), null, 2));
             } else {
               console.log(JSON.stringify(decompress(fs.readFileSync(file))));
             }
           })
           .parse(process.argv);

    // If file argument is missing, print help menu
    if (!program.args.length) {
      program.outputHelp();
    }
  }
})();
