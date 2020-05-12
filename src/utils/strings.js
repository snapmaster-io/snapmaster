// returns the length of string that will fit in {width} pixels
exports.calculateStringLength = (text, width) => {
  const font = "16pt lato";
  let len = text.length;
  while (getTextWidth(text.slice(0, len), font) >= width) {
    len--;
  }
  return len;
}

exports.providerTitle = (word) => word.length > 3 ? word.charAt(0).toUpperCase() + word.slice(1) : word.toUpperCase();


//export default calculateStringLength;

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 * 
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 * 
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
const getTextWidth = (text, font) => {
  // re-use canvas object for better performance
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}

