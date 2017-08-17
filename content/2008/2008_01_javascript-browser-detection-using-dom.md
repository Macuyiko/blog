Title: Javascript Browser Detection using DOM Capabilities
Date: 2008-01-20
Author: Seppe "Macuyiko" vanden Broucke

Just found this, pretty handy!

    // browser detection
    var isIE = document.all;
    var isIE7 = isIE && window.XMLHttpRequest && window.ActiveXObject;
    var isIE6 = isIE && document.implementation;
    var isgteIE6 = isIE7 isIE6;
    var isIE5 = isIE && window.print && !isgteIE6;
    var isIEDOM2 = isIE5 isgteIE6;
    var isIE4 = isIE && !isIEDOM2 && navigator.cookieEnabled;
    var isIE3 = isIE && !isIE4 && !isIEDOM2;
    var isNS = navigator.mimeTypes && !isIE;
    var isNS3 = isNS && !navigator.language;
    var isNS4 = document.layers;
    var isNS6 = document.getElementById && !isIE;
    var isNS7 = isNS6;
    var isNS71 = document.designMode;
    var isNSDOM2 = isNS6;
    var isDOM2 = isIEDOM2 isNSDOM2;

