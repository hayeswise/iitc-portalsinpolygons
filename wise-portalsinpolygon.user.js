// ==UserScript==
// @id             iitc-plugin-portalsinpolygon@hayeswise
// @name           IITC plugin: Portals-in-Polygon (and in circle)
// @category       Layer
// @version        0.2017.01.03
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

/*
 * Thanks to:
 * IITC - Ingress Intel Total Conversion - https://iitc.me/ and https://github.com/iitc-project/ingress-intel-total-conversion
 *   License: https://github.com/iitc-project/ingress-intel-total-conversion/blob/master/LICENSE
 * Leaflet.Geodesic by Kevin Brasier (a.k.a. Fragger)
 *   License: https://github.com/Fragger/Leaflet.Geodesic/blob/master/LICENSE
 *   Leaflet.Geodesc has been extended by the IITC project.  See the IITC distribution of the L.Geodesc.js in GitHub.
 * Dan Sunday's Winding Number and isLeft C++ implementation - http://geomalgorithms.com/.
 *   Copyright and License: http://geomalgorithms.com/a03-_inclusion.html
 */

/**
 * Tests if a point is left|on|right of an infinite line.
 *
 * This is a JavaScript and Leaflet port of the isLeft C++ function by Dan Sunday.
 * @param p1 LatLng
 * @param p2 LatLng
 * @return >0 for p2 left of the line through this point and p1
 *          =0 for p2 on the line
 *          <0 for p2 right of the line through this point an p1
 * @see {@link http://geomalgorithms.com/a03-_inclusion.html Inclusion of a Point in a Polygon} by Dan Sunday.
 */
L.LatLng.prototype.isLeft = function (p1, p2) {
    return ((p1.lng - this.lng) * (p2.lat - this.lat) -
            (p2.lng - this.lng) * (p1.lat - this.lat));
};

/**
 * Test for a point in a polygon or on the bounding lines of the polygon.  The
 * coordinates (L.LatLngs) for a GeodesicPolygon are set to follow the earth's
 * curvature when the GeodesicPolygon object is created.  Since L.Polygon
 * extends L.Polyline we can use the same method for both.  Although, for
 * L.Polyline, we only get points on the line even if a collection of lines
 * appear to make a polygon.
 *
 * This is a JavaScript and Leaflet port of the wn_PnPoly C++ function by Dan Sunday.
 * Unlike the C++ version, this implementation does include points on the line and vertices.
 *
 * @param p LatLng a point
 * @retuns {Number} The winding number (=0 only when the point is outside)
 *
 * @see {@link http://geomalgorithms.com/a03-_inclusion.html Inclusion of a Point in a Polygon} by Dan Sunday.
 * @see {@link https://github.com/Fragger/Leaflet.Geodesic Leaflet.Geodesc} for information about Leaflet.Geodesc by Fragger.
 */
L.Polyline.prototype.getWindingNumber = function (p) { // Note that L.Polygon extends L.Polyline
    var i,
        isLeftTest,
        n,
        vertices,
        wn; // the winding number counter
	vertices = this.getLatLngs().filter(function (v, i, array) {
		if (i > 0 && v.lat === array[i-1].lat && v.lng === array[i-1].lng) { // Intenionally not using L.LatLng.equals since equals() allows for small margin of error.
			return false;
		} else {
			return true;
		}
	});
    n = vertices.length;
    // Note that per the algorithm, the vertices (V) must be "a vertex points of a polygon V[n+1] with V[n]=V[0]"
    if (n > 0 && !vertices[n-1].equals(vertices[0])) {
        vertices.push(vertices[0]);
    }
	n = vertices.length - 1;
    wn = 0;
    for (i=0; i < n; i++) {
        isLeftTest = vertices[i].isLeft(vertices[i+1], p);
        if (isLeftTest === 0) { // If the point is on a line, we are done.
            wn = 1;
            break;
        } else {
            if (isLeftTest !== 0) { // If not a vertex or on line (the C++ version does not check for this)
                if (vertices[i].lat <= p.lat) {
                    if (vertices[i+1].lat > p.lat) { // An upward crossing
                        if (isLeftTest > 0) { // P left of edge
                            wn++; // have a valid up intersect
                        }
                    }
                } else {
                    if (vertices[i+1].lat <= p.lat) {// A downward crossing
                        if (isLeftTest < 0) { // P right of edge
                            wn--; // have a valid down intersect
                        }
                    }
                }
            } else {
                wn++;
            }
        }
    }
    return wn;
};

/**
 * Returns a list of portals contained in the geodesic polygon.
 * @external "window.portals"
 * @see {@link https://iitc.me/ Ingress Intel Total Conversion}
 * @returns {Object} An object being used as a map of IITC portals objects in the polygon.
 */
L.Polyline.prototype.portalsIn = function () {
    var fname = "L....prototype.portalsIn";
    var containedPortals,
        keys,
        rectangularBounds,
        point,
        portal,
        wn;
    keys = Object.keys(window.portals);
    rectangularBounds = this.getBounds();
    containedPortals = new Map();
    console.log (fname + ": Start");
    console.log ("---");
    console.log(["Index","Title","GUID","Lng(X)","Lat(Y)","WindingNumber"].join(","));
    for (var i = 0; i < keys.length; i++) {
        portal = window.portals[keys[i]];
        point = L.latLng(portal.options.data.latE6 / 1E6, portal.options.data.lngE6 / 1E6);
        // See if the point is within the rectangular boundary region containing the polygon.
        if (rectangularBounds.contains(point)) {
            wn = this.getWindingNumber(point);
            console.log ([i, '"' + portal.options.data.title + '"', portal.options.guid, portal.options.data.lngE6 / 1E6, portal.options.data.latE6 / 1E6, wn].join(","));
            if (wn !== 0) {
                //containedPortals.push(portal);
				containedPortals[portal.options.guid] = portal;
            }
        }
    }
    console.log ("---");
    console.log (fname + ": End");
    return containedPortals;
};


/**
 * Checks if a single point is contained in a polygon.
 * Note that L.GeodesicPolygons and L.GeodesicCircles are types of L.Polygon
 * @param {L.LatLng} A geographical point with a latitude and longitude.
 * @see {@link https://github.com/Fragger/Leaflet.Geodesic Leaflet.Geodesc} for information about Leaflet.Geodesc by Fragger.
 */
L.Polygon.prototype.contains = function (p) {
    var rectangularBounds = polygon.getBounds();  // It appears that is O(1): the LatLngBounds is updated as points are added to the polygon when it is created.
    var wn;
    if (rectangularBounds.contains(point)) {
        wn = this.getWindingNumber(point);
        return (wn !== 0);
    } else {
        return false;
    }
};

/**
 * Portals-in-Polygon wrapper (closure).
 *
 * Standard IITC wrapper pattern (and JavaScript encapsulation pattern).
 * See last three lines of this file where it is used.
 */
function wrapper(plugin_info) {
    // Define the base plugin object if IITC is not already loaded.
    if (typeof window.plugin !== "function") {
        window.plugin = function () {};
    }

    //PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
    //(leaving them in place might break the 'About IITC' page or break update checks)
    //plugin_info.buildName = 'iitc';
    //plugin_info.dateTimeVersion = '20161003.4740';
    //plugin_info.pluginId = 'someid';
    //END PLUGIN AUTHORS NOTE

    /**
	 * Base context for plugin (required).
	 * @namespace
	 */
    window.plugin.portalsinpolygon = function () {};
    var self = window.plugin.portalsinpolygon;
    var namespace = "plugin.portalsinpolygon";
    // Configuration
    self.title = "Portals-in-Polygon";
    self.requiredPlugins = [{
        object: window.plugin.drawTools,
        name: "draw tools"
    }, {
        object: window.plugin.portalslist,
        name: "show list of portals"
    }];
	/**
	 * Used to call window.isLayerGroupDisplayed(<String> name)
	 */
	self.layerChooserName = {
		0: "Unclaimed Portals",
		1: "Level 1 Portals",
		2: "Level 2 Portals",
		3: "Level 3 Portals",
		4: "Level 4 Portals",
		5: "Level 5 Portals",
		6: "Level 6 Portals",
		7: "Level 7 Portals",
		8: "Level 8 Portals",
		Resistance: "Resistance",
		Enlightened: "Enlightened",
		Neutral: "Unclaimed Portals"
	};

    /**
	 * Bring portals to the front.
	 * Original source: http://www.giacintogarcea.com/ingress/iitc/bring-portals-to-front-by-zaso.meta.js
	 */
    self.bringPortalsToFront = function(){
        window.Render.prototype.bringPortalsToFront(); // See IITC code
    };

    /**
	 * Returns a string representation of the layer class (e.g., "L.GeodesicPolygon" and "L.Marker").
	 * @param {L.Layer} An object whose class extends L.Layer.
	 * @returns {String} A string representation of the layer class.
	 */
    self.getLayerClassName = function(layer) {
        if (layer instanceof L.GeodesicCircle) {
            return "L.GeodesicCircle";
        } else if (layer instanceof L.GeodesicPolygon) {
            return "L.GeodesicPolygon";
        } else if (layer instanceof L.GeodesicPolyline) {
            return "L.GeodesicPolyline";
        } else if (layer instanceof L.Circle) {
            return "L.Circle";
        } else if (layer instanceof L.Marker) {
            return "L.Marker";
        } else if (layer instanceof L.Polygon) {
            return "L.Polygon";
        } else if (layer instanceof L.Polyline) {
            return "L.Polyline";
        } else {
            return "New or Unknown Layer Type";
        }
    };

    /**
	 * Returns an array of IITC portals contained in the polygons and circles
	 * drawn on the map.
	 * Checks for layers of type L.Polygon, which includes L.GeodesicPolygon
	 * and L.GeodesicCircle, and L.Polyline, which in L.GeodesicPolyline.
	 * @returns {Array} An array of IITC portals.
	 */
    self.getContainedPortals = function() {
        var fname = namespace + ".getContainedPortals";
        console.log (fname + ": Start");
        var enclosures,
            enclosureData,
            data = [],
            layers, // Leaflet Layer[]
            portals;
        // Loop through all map elements looking for polygons and circles (and in the future polylines).
        layers = window.plugin.drawTools.drawnItems.getLayers();
        console.log(fname + ": layers.length=" + layers.length);
        enclosures = layers.filter(function(layer, i, array) {
			return (layer instanceof L.Polygon || layer instanceof L.Polyline);
        });

        portals = enclosures.reduce(function(collectedPortals, layer, currentIndex, array){
            var morePortals;
            var desc = [currentIndex, self.getLayerClassName(layer)];
            // start debug
            var latLngs = layer.getLatLngs();
            latLngs.forEach(function(latLng, i, array) {
                data.push([].concat(desc).concat([latLng.lng, latLng.lat]));
            });
            // end debug
            morePortals = (typeof layer.portalsIn === 'function') ? layer.portalsIn() : [];
            //return collectedPortals.concat(morePortals);
			return jQuery.extend(collectedPortals, morePortals);
        }, {});
        // start debug
        console.log(fname + ": Number of enclosures: " + enclosures.length);
        console.log ("---");
        console.log(["LayerNumber","LayerClassName","Lng(X)","Lat(Y)"].join(","));
        data.forEach(function(elem) {
            console.log (elem.join(","));
        });
        console.log ("---");
        // end debug
        console.log (fname + ": End");
        return portals;
    };

    /**
	 * Lists out portals in polygons and circles.
	 */
    self.listContainedPortals = function () {
        var fname = namespace + ".listContainedPortals";
        console.log (fname + ": Start");
        var containedPortals;

        containedPortals = self.getContainedPortals();

        console.log(fname + ": Number of contained portals: " + containedPortals.length);
        console.log ("---");
        console.log(["Index","Title","GUID","Lng(X)","Lat(Y)"].join(","));
        containedPortals.forEach(function(portal, i, array) {
            console.log ([i, '"' + portal.options.data.title + '"', portal.options.guid, portal.options.data.lngE6 / 1E6, portal.options.data.latE6 / 1E6].join(","));
        });
        console.log ("---");
        localStorage['plugin-portalsinpolygon-portals'] = JSON.stringify(containedPortals.map(function(portal, i, array) {
            return {guid: portal.options.guid,
                    title: portal.options.data.title};
        })); // hope this works!
        //var csvHeader = "name,type,lat,lng\n";
        //localStorage['plugin-portalsinpolygon-debug-csv'] = csvHeader + ""
        console.log (fname + ": End");
        return containedPortals.length > 0;
    };

    /**
	 * This function is based on a modified version of the
	 * window.plugin.portalslist.getPortals function.
	 *
	 * @returns {true|false} Returns true if there are one or more portals;
	 * 	otherwise, returns false.
	 * @external window.plugin.portalslist
	 * @see {@link https://github.com/iitc-project/ingress-intel-total-conversion/ "show list of portals"} plugin source code for further information.
	 */
    self.getPortals = function () {
        //filter : 0 = All, 1 = Neutral, 2 = Res, 3 = Enl, -x = all but x
        var retval = false;
		var keys;

        var containedPortals;
        containedPortals = self.getContainedPortals();
		keys = Object.keys(containedPortals);
        window.plugin.portalslist.listPortals = [];
		console.log ("---");
        console.log(["Index","Title","GUID","Lng(X)","Lat(Y)"].join(","));
		keys = keys.filter(function(key, i, array) {
			var keep;
			var portal = containedPortals[key];
			keep = (window.isLayerGroupDisplayed(self.layerChooserName[portal.options.data.level]) &&
				((portal.options.data.team === "R" && window.isLayerGroupDisplayed(self.layerChooserName.Resistance)) ||
				 (portal.options.data.team === "E" && window.isLayerGroupDisplayed(self.layerChooserName.Enlightened)) ||
				 (portal.options.data.team === "N" && window.isLayerGroupDisplayed(self.layerChooserName.Neutral))));
			return keep;
		});
        keys.forEach(function (key, i, array) {
			var portal = containedPortals[key];
			console.log ([i, '"' + portal.options.data.title + '"', portal.options.guid, portal.options.data.lngE6 / 1E6, portal.options.data.latE6 / 1E6].join(","));
            switch (portal.options.team) {
                case TEAM_RES:
                    window.plugin.portalslist.resP++;
                    break;
                case TEAM_ENL:
                    window.plugin.portalslist.enlP++;
                    break;
                default:
                    window.plugin.portalslist.neuP++;
            }

            // cache values and DOM nodes
            var obj = {
                portal: portal,
                values: [],
                sortValues: []
            };

            var row = document.createElement('tr');
            row.className = TEAM_TO_CSS[portal.options.team];
            obj.row = row;

            var cell = row.insertCell(-1);
            cell.className = 'alignR';

            window.plugin.portalslist.fields.forEach(function (field, i) {
                cell = row.insertCell(-1);

                var value = field.value(portal);
                obj.values.push(value);

                obj.sortValues.push(field.sortValue ? field.sortValue(value, portal) : value);

                if (field.format) {
                    field.format(cell, portal, value);
                } else {
                    cell.textContent = value;
                }
            });

            window.plugin.portalslist.listPortals.push(obj);
        });
		console.log ("---");
        return (window.plugin.portalslist.listPortals.length > 0);
    };

    /**
	 * Displays contained portals.
	 *
	 * This function is based on a modified version of the 
	 * window.plugin.portalslist.displayPL function.
	 * @external window.plugin.portalslist
	 * @see {@link https://github.com/iitc-project/ingress-intel-total-conversion/ "show list of portals"} plugin source code for further information.
	 */
    self.displayContainedPortals = function () {
        var list;
        // plugins (e.g. bookmarks) can insert fields before the standard ones - so we need to search for the 'level' column
        window.plugin.portalslist.sortBy = window.plugin.portalslist.fields.map(function (f) {
            return f.title;
        }).indexOf('Level');
        window.plugin.portalslist.sortOrder = -1;
        window.plugin.portalslist.enlP = 0;
        window.plugin.portalslist.resP = 0;
        window.plugin.portalslist.neuP = 0;
        window.plugin.portalslist.filter = 0;

        if (self.getPortals()) {
            list = window.plugin.portalslist.portalTable(window.plugin.portalslist.sortBy, window.plugin.portalslist.sortOrder, window.plugin.portalslist.filter);
        } else {
            list = $('<table class="noPortals"><tr><td>Nothing to show!</td></tr></table>');
        }

        if (window.useAndroidPanes()) {
            $('<div id="portalslist" class="mobile">').append(list).appendTo(document.body);
        } else {
            dialog({
                html: $('<div id="portalslist">').append(list),
                dialogClass: 'ui-dialog-portalslist',
                title: 'Portals-in-Polygons: ' + window.plugin.portalslist.listPortals.length + ' ' + (window.plugin.portalslist.listPortals.length == 1 ? 'portal' : 'portals'),
                id: 'portalsinpolygons-list',
                width: 700
            });
        }
    };

    /**
	 * Checks if the pre-requisite plugins are installed.  If not, displays an alert.
	 * @returns {true|false}
	 */
    self.prerequisitePluginsInstalled = function () {
		var fname = namespace + ".prerequisitePluginsInstalled";
        var missing = [];
        var msg;
		console.log (fname + ": Start");
        self.requiredPlugins.forEach(function(plugin) {
            if (plugin.object === undefined) {
                missing.push('"' + plugin.name + '"');
			}
        });
        if (missing.length > 0) {
            msg = 'IITC plugin "Portals-in-Polygon" requires IITC plugin' + ((missing.length === 1) ? ' ' : 's ') +
                ((missing.length === 1) ? missing[0] : (missing.slice(0,-1).join(", ") + " and " + missing[missing.length - 1])) + '.';
            console.warn(msg);
            alert(msg);
        }
		console.log (fname + ": End");
        return (missing.length === 0);
    };

    /**
     * Setup function called by IITC.
     */
    self.setup = function init() { // If your setup is named something else, change the assignment in var setup = ... below.
        var fname = namespace + ".setup";
        console.log (fname + ": Start");
        if (!self.prerequisitePluginsInstalled()) {
            return;
        }
        // Add controls to IITC right hand side toolbox.
        var controls,
		    portalsToFrontControl,
            listPortalsInPolygonControl;
        portalsToFrontControl = '<a id="portalsinpolygonPortalsToFront" onclick="window.plugin.portalsinpolygon.bringPortalsToFront();false;" title="Bring portals to the front draw layer so that you can click on them after drawing a circle or polygon over them.">Portals To Front</a>';
        listPortalsInPolygonControl = '<a id="portalsinpolygonListPortals" onclick="window.plugin.portalsinpolygon.displayContainedPortals();false;" title="Display a list of portals in polygons, circles, and on lines.  Use the layer group check boxes to filter the portals.">Portals in Polygons</a>';
		controls = '<div style="color:#00C5FF;text-align:center;width:fit-content\;border-top: 1px solid #20A8B1;border-bottom: 1px solid #20A8B1;">' +
			listPortalsInPolygonControl + '&nbsp;&nbsp;' + portalsToFrontControl +
			'</div>';
        $("#toolbox").append(controls);

        // Delete setup function so that it is not run again.
        console.log (fname + ": End");
        delete self.setup;
    };

    // Set a setup.info property. The data will be used in the About IITC dialog in the section listing the
    // installed plugins.  The plugin_info comes from the Tampermonkey/Greasemonkey comments at the top of
    // this file and is passed into the wrapper function when the script is added to the web page, below.
    var setup = self.setup; // Set setup the plugin's setup/init method.
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