// Polyfill for canvas.toBlob from MDN.
if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function(callback, type, quality) {
      var canvas = this;
      setTimeout(function() {
        var binStr = atob(canvas.toDataURL(type, quality).split(',')[1]),
          len = binStr.length,
          arr = new Uint8Array(len);

        for (var i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i);
        }

        callback(new Blob([arr], { type: type || 'image/png' }));
      });
    }
  });
}

function ImageCanvasOps({ canvas, thumbnailCanvas }) {
  var ctx = canvas.getContext('2d');
  var thumbCtx;
  if (thumbnailCanvas) {
    thumbCtx = thumbnailCanvas.getContext('2d');
  }
  var img;
  var rotations = 0;

  var loadedImageMIMEType;
  var imageIsLoaded = false;

  function loadFileToCanvas({ mimeType, maxSideLength, file }, done) {
    img = new Image();
    img.addEventListener('load', drawToCanvas);
    img.src = URL.createObjectURL(file);

    function drawToCanvas() {
      rotations = 0;
      var originalWidth = img.width;
      var originalHeight = img.height;

      var newWidth;
      var newHeight;
      if (originalWidth > originalHeight) {
        newWidth = maxSideLength;
        newHeight = (originalHeight * newWidth) / originalWidth;
      } else {
        newHeight = maxSideLength;
        newWidth = (originalWidth * newHeight) / originalHeight;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;
      drawImageToCanvases(img, newWidth, newHeight);

      loadedImageMIMEType = mimeType;
      imageIsLoaded = true;

      if (done) {
        setTimeout(done, 0);
      }
    }
  }

  function getImageFromCanvas(done) {
    try {
      canvas.toBlob(passBlob, loadedImageMIMEType, 0.7);
    } catch (error) {
      done(error);
    }

    function passBlob(blob) {
      done(null, blob);
    }
  }

  function canvasHasImage() {
    return imageIsLoaded;
  }

  function rotateImage() {
    if (!canvasHasImage()) {
      return;
    }
    rotations += 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var oldWidth = canvas.width;
    var oldHeight = canvas.height;
    canvas.width = oldHeight;
    canvas.height = oldWidth;
    var angle = (rotations * Math.PI) / 2;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);

    // Sadly, I'm not entirely sure why this works.
    if (rotations % 2 === 1) {
      ctx.translate(-oldWidth / 2, -oldHeight / 2);
      drawImageToCanvases(img, canvas.height, canvas.width);
    } else {
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      drawImageToCanvases(img, canvas.width, canvas.height);
    }
  }

  function drawImageToCanvases(img, width, height) {
    ctx.drawImage(img, 0, 0, width, height);
    // Copy stuff to the thumbnail canvas.
    // TODO: Scale thumbnail appropriately.
    if (thumbCtx && thumbnailCanvas) {
      thumbnailCanvas.width = 300;
      thumbnailCanvas.height = 200;
      thumbCtx.drawImage(
        canvas,
        0,
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        300,
        200
      );
    }
  }

  function clearCanvases() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    thumbCtx.clearRect(0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
  }

  return {
    loadFileToCanvas,
    getImageFromCanvas,
    canvasHasImage,
    rotateImage,
    clearCanvases
  };
}

module.exports = ImageCanvasOps;
