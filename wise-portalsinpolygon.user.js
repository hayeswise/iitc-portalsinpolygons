// ==UserScript==
// @id             iitc-plugin-portalsinpolygon@hayeswise
// @name           IITC plugin: Portals-in-Polygon (and in circle)
// @category       Layer
// @version        0.2017.01.01
// @namespace      https://github.com/hayeswise/iitc-wise-portalsinpolygon
// @description    Automatically marks and un-marks portals of interest.  Also includes a Add Marker and Remove Marker control to the toolbox.
// @updateURL      https://raw.githubusercontent.com/hayeswise/iitc-wise-portalsinpolygon/master/wise-portalsinpolygon.user.js
// @downloadURL	   https://raw.githubusercontent.com/hayeswise/iitc-wise-portalsinpolygon/master/wise-portalsinpolygon.user.js
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @author         Hayeswise
// @grant          none
// ==/UserScript==
// MIT License, Copyright (c) 2016 Brian Hayes ("Hayeswise")
// For more information, visit https://github.com/hayeswise/iitc-wise-portalsinpolygon

// The following code is a JavaScript and Leaflet port of the Winding Number 
// (wn) C++ implementation by Dan Sunday. http://geomalgorithms.com/.  The 
// algorithm determines if a point is included in a two dimensional (2D) 
// planar polygon.  The explaination of the Winding Number algorithm, 
// comparison to the Crossing Number method, and the C++ implementation can be
// found at "Inclusion of a Point in a Polygon" 
// (http://geomalgorithms.com/a03-_inclusion.html).
//
// Winding Number and isLeft copyright notice:
//    Copyright 2000 softSurfer, 2012 Dan Sunday
//    This code may be freely used and modified for any purpose
//    providing that this copyright notice is included with it.
//    SoftSurfer makes no warranty for this code, and cannot be held
//    liable for any real or imagined damage resulting from its use.
//    Users of this code must verify correctness for their application.

//
// isLeft tests if a point is left|on|right of an infinite line.
// @param p1 LatLng
// @param p2 LatLng
// @return >0 for p2 left of the line through this point and p1
//          =0 for p2 on the line
//          <0 for p2 right of the line through this point an p1
// 
LatLng.prototype.isLeft = function (p1, p2) {
  return ((p1.lng - this.lng) * (p2.lat - this.lat)
          - (p2.lng - this.lng) * (p1.lat - this.lat));
};

//
// getWindingNumber tests for a point in a polygon.
// @param p LatLng a point
// @retun Number The winding number (=0 only when the point is outside)
Polygon.prototype.getWindingNumber = function (p) {
   var i,
       V,
       wn;
   V = this.etLatLngs();
   wn = 0;
   for (i=0; i<v.length; i++) {
      if (V[i].lat <= p.lat){
         if (V[i+1].lat > p.lat) {
            if (V[i].isLeft(V[i+1], p) > 0) {
               wn++;
            }
         }
      } else {
        if (V[i+1].lat <= p.lat) {
           if (V[i].isLeft(V[i+1], p) < 0) {
              wn--;
           }
        }
      }
   }
   return wn;
};



//
polygon.prototype.contains = function (p) {
   var rectangularBounds = polygon.getBounds();
   var wn;
   if (rectangularBounds.contains(point)) {
      wn = this.getWindingNumber(point);
      return (wn !== 0);
   } else {
      return false;
   }
};

//
function portalsInPolygon() {
   // TODO: get the polygon or circle
   var rectangularBounds = polygon.getBounds();
   var keys = portals.getKeys();
   var wn;
   var portalsInPolygon = [];
   for (var i=0; i< keys.length; i++) {
       var portal = portals[keys[i]];
       var point = L.latLng (portal.options.latE6 / 1E6, portal.options.lngE6 / 1E6);
       // See if the point is within the rectangular boundary region containing the polygon.
       if (rectangularBounds.contains(point)) {
          wn = polygon.getWindingNumber(point);
          if (wn !== 0) {
              portalsInPolygon.push(portal);
          }
       }
   }
   return portalsInPolygon;
}


// Bring portals to the front.
// Original source: http://www.giacintogarcea.com/ingress/iitc/bring-portals-to-front-by-zaso.meta.js

    window.plugin.bringPortalsToFront.bringTop = function(){
        window.Render.prototype.bringPortalsToFront();
    }

//
// Standard IITC wrapper pattern (and JavaScript encapsulation pattern).
// See last three lines of this file where it is used.
//
function wrapper(plugin_info) {
    // Define the base plugin object if IITC is not already loaded.
    if (typeof window.plugin !== "function") {
        window.plugin = function () {};
    }

	// You will see the following PLUGIN AUTHORS lines in plugins built using the IITC build environemnt.
	// They are not needed to get your plugin to be listed in the 'About IITC' dialog.
	//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
	//(leaving them in place might break the 'About IITC' page or break update checks)
	//plugin_info.buildName = 'iitc';
	//plugin_info.dateTimeVersion = '20161003.4740';
	//plugin_info.pluginId = 'someid';
	//END PLUGIN AUTHORS NOTE

    // Base context for plugin (required).
    window.plugin.myplugin = function () {};
    var self = window.plugin.portalsinpolygon;
    var namespace = "plugin.portalsinpolygon"; 	
	
	
    //Sample plugin property/attribute.
    window.plugin.myplugin.message = "Hello!";
    //
    // Sample plugin method.  This one opens an IITC dialog.
    //
    window.plugin.myplugin.helloDialog = function () {
        var html;
        html = '<div>' + window.plugin.myplugin.message + '</div>';
        dialog({
            html: html,
            id: 'myplugin-hello',
            dialogClass: 'ui-dialog-aboutIITC',
            title: 'My Plugin'
        });
    };
    //
    // Setup function called by IITC.
    //
    window.plugin.myplugin.setup = function init() { // If your setup is named something else, change the assignment in var setup = ... below.
		// So our sample plugin does something, add HTML for Hello link/control in the IITC right hand side toolbox.
		var controlsHTML = '<a id="myPluginOpenHello" onclick="window.plugin.myplugin.helloDialog();false;" title="Click to for Hello.">My Plugin</a>';
        $("#toolbox").append(controlsHTML);

		// Delete setup function so that it is not run again.
        delete self.setup;
    };

	// Set a setup.info property. The data will be used in the About IITC dialog in the section listing the
	// installed plugins.  The plugin_info comes from the Tampermonkey/Greasemonkey comments at the top of
	// this file and is passed into the wrapper function when the script is added to the web page, below.
    var setup = window.plugin.myplugin.setup; // Set setup the plugin's setup/init method.
	setup.info = plugin_info;

    // IITC plugin setup.
    if (window.iitcLoaded && typeof setup === "function") {
        setup();
    } else if (window.bootPlugins) {
        window.bootPlugins.push(setup);
    } else {
        window.bootPlugins = [setup];
    }
}

//
// Add script to the web page.  This is boilerplate and is typically not changed.
//
// 1.  Get info from Tampermonkey/Greasemonkey related headers.
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script={version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description};
// 2.  Add new script elemement to page.
var script = document.createElement("script");
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);