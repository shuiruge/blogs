window.onload = function() {
    showTranslation();
}

function stripTags(text) {
    return text.replace(/(<([^>]+)>)/gi, "");
}

function createFloatWindow(showText, floatText) {
    // Implemented by div tag.
    var div = document.createElement("div");
    div.title = stripTags(floatText);
    div.innerHTML = showText;
    return div;
}

/**
* Convert the node of DOM from
*   <originalTag translation=translationText ...>originalText</originalTag>
* to
*   <originalTag ...>
*     <floatWindow floatText=originalText>translationText</floatWindow>
*   </originalTag>
*/
function handleTranslation(node) {
    var originalText = node.innerHTML;
    var translatedText = node.getAttribute("translation");
    node.innerHTML = null;  // clean up the originalText first.
    node.appendChild(createFloatWindow(translatedText, originalText));
    node.removeAttribute("translation");
}

function showTranslation() {
    // Walk through all nodes in the DOM.
    var nodes = document.body.getElementsByTagName("*");
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.hasAttribute("translation")) {
            handleTranslation(node);
        }
    }
}
