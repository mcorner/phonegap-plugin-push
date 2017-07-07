// https://davidwalsh.name/javascript-functions
function ploadjs(url) {
  // This promise will be used by Promise.all to determine success or failure
  return new Promise(function(resolve, reject) {
    const element = document.createElement('script');
    const parent = 'body';
    const attr = 'src';

    // Important success and error for the promise
    element.onload = function() {
      resolve(url);
    };
    element.onerror = function() {
      reject(url);
    };
    element.async = true;

    // Inject into document to kick off loading
    element[attr] = url;
    document[parent].appendChild(element);
  });
}
module.exports = {ploadjs: ploadjs};
