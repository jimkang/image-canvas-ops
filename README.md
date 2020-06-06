# image-canvas-ops

Resizes and rotates an image via a canvas element.

## Installation

    npm install image-canvas-ops

## Usage

You need to provide to the constructor:

- `canvas`: A `<canvas>` element (that can be hidden) for the image operations to use.
- `thumbnailCanvas`: A `<canvas>` element that will be used to mirror whats in the main canvas. This is optional. One reason you may want to provide this is if you want to show a (probably small) preview image to the user that indicates what's going on in the main canvas.

Then, you'll get an object with the following methods:

- `loadFileToCanvas`: Loads a file into the canvas. Takes these opts in an object:
    - `mimeType`: e.g. 'image/jpeg' or 'image/png'
    - `maxSideLength`: A pixel size. The method will resize the image to fit within a square with with sizes of this length — without stretching the image.
    - `file`: A [File object](https://developer.mozilla.org/en-US/docs/Web/API/File) like the kind you get from an `<input type="file">` file picker element.
- `getImageFromCanvas`: Copies the image out from the canvas and passes it to the callback you provide it. Use this to get the resized image from an image you loaded to the canvas or to get the rotate image after using `rotateImage`. The first param of the callback is an error, if there was an error while getting the image. The second parameter is a Blob representing the image.
- `canvasHasImage`: Tells you if an image is loaded into the canvas.
- `rotateImage`: Rotates the image in the canvas by 90 degrees clockwise.
- `clearCanvases`: Removes images from the main and thumbnail canvases.

        var ImageCanvasOps = require('image-canvas-ops');

        var imageCanvasOps = ImageCanvasOps({
          canvas: document.getElementById('main-manipulation-canvas'),
          thumbnailCanvas: document.getElementById('thumbnail-cnvas')
        });

        imageCanvasOps.loadFileToCanvas({
          mimeType: 'image/jpeg',
          maxSideLength: 1024,
          file: fileFromInput
        });
        // Flip 180 degrees.
        for (var i = 0; i < 2; ++i) {
          imageCanvasOps.rotateImage();
        }

        imageCanvasOps.getImageFromCanvas(useModifiedImage);

        function useModifiedImage(error, resizedAndRotatedImageBlob) {
          if (error) {
            console.error(error, error.stack);
          } else {
            postImageToAPI(resizedAndRotatedImageBlob);
          }
        }

## License

The MIT License (MIT)

Copyright (c) 2020 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
