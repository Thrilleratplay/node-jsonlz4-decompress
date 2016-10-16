JSON lz4 Decompress
=========================

A Node.js module and CLI application for decompressing a Firefox bookmark backup jsonlz4 file format into JSON.

## Node module

#### Installation
To install as a local module and include as a dependency:
```bash
npm install --save jsonlz4-decompress
```

#### Usage
```javascript
var jsonlz4 = require('jsonlz4-decompress');
var fs = require('fs');

// Open file into buffer
fs.readFile('/path/to/bookmarkbackups/back-up-date.jsonlz4', function(err, fileBuffer) {
  // decompress file buffer to JSON
  decompressedJson = jsonlz4(fileBuffer);

  // do something with the JSON
  console.log(decompressedJson);
});
```


## Commandline

#### Installation
To install as a command line application:
```bash
npm install jsonlz4-decompress -g
```
You may need to prefix the command with sudo.

#### Usage
```none
  Usage: index [options] <file>

  Decompress a Firefox bookmark backup jsonlz4 file format into JSON.

  Options:

    -h, --help    output usage information
    -p, --pretty  Pretty print JSON

```

Output is sent to `stdout`


## Technical stuff
Based on a [description snippet found here](https://www.reddit.com/r/firefox/comments/3offju/jsonlz4_file/)

`bytes 0-7`: Magic number when converted to a string `mozLz40` followed by a null charater.  
`bytes 8-11`: Uncompressed file size.  Little endian unsigned 32bit integer.  
`bytes 12-EOL`: LZ4 compressed blocked.
