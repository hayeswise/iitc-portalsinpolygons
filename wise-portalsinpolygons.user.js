// ==UserScript==
// @id             iitc-plugin-portalsinpolygons@hayeswise
// @name           IITC plugin: Portals-in-Polygons
// @category       Layer
// @version        1.2017.02.04
// @namespace      https://github.com/hayeswise/ingress-intel-total-conversion
// @description    Display a list of portals in, on on the perimeter of, polygons and circles, and on lines.  Use the layer group check boxes to filter the portals.
// @updateURL      https://github.com/hayeswise/iitc-portalsinpolygons/raw/master/wise-portalsinpolygons.user.js
// @downloadURL    https://github.com/hayeswise/iitc-portalsinpolygons/raw/master/wise-portalsinpolygons.user.js
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @author         Hayeswise
// @grant          none
// ==/UserScript==
// MIT License, Copyright (c) 2017 Brian Hayes ("Hayeswise")
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
  * The IITC map object (a Leaflet map).
  * @external "window.map"
  * @see {@link https://iitc.me/ Ingress Intel Total Conversion}
  */
/**
  * The IITC portals object (used as a map) that contains a list of the cached
  * portal information for the portals in the current and surrounding view.
  * @external "window.portals"
  * @see {@link https://iitc.me/ Ingress Intel Total Conversion}
  */
/**
  * The map data render class which handles rendering into Leaflet the JSON data from the servers.  Needed to access
  * `window.Render.prototype.bringPortalsToFront`.
  * @external "window.Render"
  * @see {@link https://iitc.me/ Ingress Intel Total Conversion}
  */
/**
 * The "show list of portals" plugin object, properties, and methods.
 * @external "window.plugin.portalslist"
 * @see {@link http://leafletjs.com/ "show list of portals"} plugin source code for further information.
 */
/**
 * Establish varioius helpers and polyfills.
 * @module {function} helpers
 */
(function(global) {
    "use strict";
    if (typeof global.helpers !== "function") {
        global.helpers = function () {};
    }
    /**
	 * Plugin Helpers namespace.
	 * @namespace
	 */
    var helpers = global.helpers;
    var spacename = "helpers";

    // Polyfill Array.find if not available
    // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
            value: function(predicate) {
                if (this === null) {
                    throw new TypeError('Array.prototype.find called on null or undefined');
                }
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }
                var list = Object(this);
                var length = list.length >>> 0;
                var thisArg = arguments[1];
                var value;

                for (var i = 0; i < length; i++) {
                    value = list[i];
                    if (predicate.call(thisArg, value, i, list)) {
                        return value;
                    }
                }
                return undefined;
            }
        });
    }
    /**
	 * Checks if the pre-requisite plugins are installed.  If one or more requisites are not installed, an alert is
	 * displayed.
	 * @param {Object[]} requiredPlugins An array of objects describing the required plugins.  Each
     * objecthas the properties `object` and `name`.  The `name` value appears in the alert if there are missing
	 * plugins.
     * @param {string} pluginName The name of the plugin for display in case of missing plugins.  Recommend using 
     *    `plugin_info.script.name`.
	 * <p>
	 * For example,
	 * ```
	 * self.requiredPlugins = [{
     *   object: window.plugin.drawTools,
     *   name: "draw tools"
     * }, {
     *   object: window.plugin.myotherplugin,
     *   name: "My Other Plugin"
     * }]
     * ...
     * if (window.helpers.prerequisitePluginsInstalled(self.requiredPlugins, plugin_info.script.name) { 
     *    ...
	 * ```
	 * @returns {boolean}
	 */
    helpers.prerequisitePluginsInstalled = function (requiredPlugins, pluginName) {
        var missing = [],
            msg;
        requiredPlugins.forEach(function(plugin) {
            if (plugin.object === undefined) {
                missing.push('"' + plugin.name + '"');
            }
        });
        if (missing.length > 0) {
            msg = 'IITC plugin "' + pluginName + '" requires IITC plugin' + ((missing.length === 1) ? ' ' : 's ') +
                ((missing.length === 1) ? missing[0] : (missing.slice(0,-1).join(", ") + " and " + missing[missing.length - 1])) + '.';
            console.warn(msg);
            alert(msg);
        }
        return (missing.length === 0);
    };

    /******************************************************************************************************************
     * ToolboxControlSection Class
     *****************************************************************************************************************/
	/**
	 * ToolboxControlSection Class.  Provides a standardized way of adding toolbox controls and grouping controls in
	 * the same "family".
	 * @module {function} ToolboxControlSection
	 */
    /**
	 * Creates a new ToolboxControlSection.
	 *
	 * @class
	 * @param {String|Element|Text|Array|jQuery} content A object suitable for passing to `jQuery.append()`: a
	 * 	DOM element, text node, array of elements and text nodes, HTML string, or jQuery object to insert at the end of
	 *	each element in the set of matched elements.
	 * @param {String} controlSectionClass The class name for a section of controls, typically in a `div` tag.
	 * @param {String} [controlClass] An optional class name of a simple control or collection of controls.
	 */
    helpers.ToolboxControlSection = function (content, controlSectionClass, controlClass) {
        this.controlSectionClass = controlSectionClass;
        this.controlClass = controlClass;
        this.merged = false;
        this.jQueryObj = jQuery('<div>').append(content).addClass(controlSectionClass);
    };

    /**
	 * See jQuery `.attr()` function.
	 *
	 * @returns {String}
	 * @todo Consider removing this.
	 */
    helpers.ToolboxControlSection.prototype.attr = function (attributeNameOrAttributes, valueOrFunction) {
        if (typeof valueOrFunction === 'undefined') {
            return this.jQueryObj.attr(attributeNameOrAttributes);
        } else {
            return this.jQueryObj.attr(attributeNameOrAttributes, valueOrFunction);
        }
    };

    /**
	 * Appends toolbox controls with the same toolbox control section class and toolbox control class.
	 * <p>
	 * Merge
	 * ```
	 * <div class="myControlFamily">
     *    ...this control...
	 * </div>
	 * ```
	 * with
	 * ```
	 * <div class="myControlFamily">
     *    ...other control...
	 * </div>
	 * ```
	 * to get
	 * ```
	 * <div class="myControlFamily">
     *    ...this control...
     *    ...other control...
	 * </div>
	 * ```
	 */
    helpers.ToolboxControlSection.prototype.mergeWithFamily = function () {
        var controlFamily,
            that;
        if (!this.merged) {
            that = this;
            controlFamily = jQuery('.' + this.controlSectionClass);
            if (controlFamily.length > 0) {
                controlFamily.each(function() {
                    var jQobj = jQuery(this);
                    jQobj.css("border-style", "none");
                    that.jQueryObj.append(jQobj.removeClass(that.controlSectionClass).addClass(that.controlSectionClass + "-moved")); // remove oringal section so any subsequent merges have a single control section to deal with
                });
                this.merged = true;
            }
            if (typeof this.controlClass !== 'undefined') {
                controlFamily = jQuery(':not(.' + this.controlSectionClass + ') .' + this.controlClass);
                if (controlFamily.length > 0) {
                    controlFamily.each(function() {
                        that.jQueryObj.append(jQuery(this));
                    });
                    this.merged = true;
                }
            }
        }
        return this.jQueryObj;
    };

    /**
	 * Sets the documents's styling.  Will not add the style if previously used.
	 * @param {String} [styling] CSS styles.
	 */
	helpers.ToolboxControlSection.setStyle = function (styling) {
		styling = (typeof styling === 'undefined') ? styling : "div.wise-toolbox-control-section {color:#00C5FF;text-align:center;width:fit-content;border-top: 1px solid #20A8B1;border-bottom: 1px solid #20A8B1;}";
        if (typeof helpers.ToolboxControlSection.style === 'undefined' || (helpers.ToolboxControlSection.style !== styling)) {
			helpers.ToolboxControlSection.style = styling;
            jQuery("<style>")
				.prop("type", "text/css")
				.html(styling)
				.appendTo("head");
        }
    };

    /**
	 * Override valueOf so that we get the desired behavior of getting the jQuery object when we access an object
	 * directly.  For example,
	 * ```
	 * $("#toolbox").append(new ToolboxControlSection(html, "myfamily-control-section", "myfamily-control").mergeWithFamily();
	 * ```
	 *
	 * @returns {Object} jQuery object.
	 */
    helpers.ToolboxControlSection.prototype.valueOf = function () {
        return this.jQueryObj;
    };
}(window));

/******************************************************************************
 * wise-leaflet-extensions
 * @author Brian S Hayes (Hayeswise)
 * MIT License, Copyright (c) 2017 Brian Hayes ("Hayeswise")
 *****************************************************************************/
/**
 * The Leaflet LatLng class.
 * @external "L.LatLng"
 * @see {@link http://leafletjs.com/ Leaflet} documentation for further information.
 */
/**
 * The Leaflet Polyline class.
 * @external "L.Polyline"
 * @see {@link http://leafletjs.com/ Leaflet} documentation for further information.
 */
/**
 * The Leaflet Polygon class.
 * L.GeodesicPolygon and L.GeodesicCircle extend L.Polygon.
 * @external "L.Polygon"
 * @see {@link http://leafletjs.com/ Leaflet} documentation for further information.
 */

(function (L) {
    /**
     * Tests if a point is left|on|right of an infinite line.
     * <br><br>
     * This is a JavaScript and Leaflet port of the `isLeft()` C++ function by Dan Sunday.
     * @function external:"L.LatLng"#isLeft
     * @param {LatLng} p1 Point The reference line is defined by `this` LatLng to p1.
     * @param {LatLng} p2 The point in question.
     * @return >0 for p2 left of the line through this point and p1,
     *          =0 for p2 on the line,
     *          <0 for p2 right of the line through this point an p1.
     * @see {@link http://geomalgorithms.com/a03-_inclusion.html Inclusion of a Point in a Polygon} by Dan Sunday.
     */
    L.LatLng.prototype.isLeft = function (p1, p2) {
        //"use strict";
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
     * <br><br>
     * This is a JavaScript and Leaflet port of the `wn_PnPoly()` C++ function by Dan Sunday.
     * Unlike the C++ version, this implementation does include points on the line and vertices.
     *
     * @function external:"L.Polyline"#getWindingNumber
     * @param p {L.LatLng} A point.
     * @retuns {Number} The winding number (=0 only when the point is outside)
     *
     * @see {@link http://geomalgorithms.com/a03-_inclusion.html Inclusion of a Point in a Polygon} by Dan Sunday.
     * @see {@link https://github.com/Fragger/Leaflet.Geodesic Leaflet.Geodesc} for information about Leaflet.Geodesc by Fragger.
     */
    L.Polyline.prototype.getWindingNumber = function (p) { // Note that L.Polygon extends L.Polyline
        //"use strict";
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
     * @returns {Object} An object being used as a map of IITC portals objects in the polygon.
     */
    L.Polyline.prototype.portalsIn = function () {
        //"use strict";
        var fname = "L.Polynline.prototype.portalsIn";
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
        //"use strict";
        var rectangularBounds = this.getBounds();  // It appears that this is O(1): the LatLngBounds is updated as points are added to the polygon when it is created.
        var wn;
        if (rectangularBounds.contains(p)) {
            wn = this.getWindingNumber(p);
            return (wn !== 0);
        } else {
            return false;
        }
    };
})(L); //L is set to Leaflet's L

/**
 * Closure function for Portals-in-Polygon.
 *
 * Standard IITC wrapper pattern used to create the plugin's closure when
 * "installed" using `document.createElement("script".appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));`
 * @param {Object} plugin_info Object containing Greasemonkey/Tampermonkey information about the plugin.
 * @param {string} plugin_info.script Greasemonkey/Tampermonkey information about the plugin.
 * @param {string} plugin_info.script.version GM_info.script.version.
 * @param {string} plugin_info.script.name GM_info.script.name.
 * @param {string} plugin_info.script.description GM_info.script.description.
 */

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'wise';
plugin_info.dateTimeVersion = '20170206.55349';
plugin_info.pluginId = 'wise-portalsinpolygons';
//END PLUGIN AUTHORS NOTE


// PLUGIN START ////////////////////////////////////////////////////////
// Plugin code is enclosed by a wrapper function to be called within a <script> tag.d';

    /**
	 * Portals-in-Polygon IITC plugin.  The plugin and its members can be accessed via
	 * `window.plugin.portalsinpolygons`.  The "public" members are documented as module members while the more
	 * friend and private members are documented as part of the `wrapper` function.
	 * @see {@link wrapper}
	 * @module {function} portalsinpolygon
	 */
    window.plugin.portalsinpolygons = function () {};
    /**
	 * Portals-in-Polygon namespace.  `portalsinpolygon` is set to `window.plugin.portalsinpolygons`.
	 * @namespace
	 */
    var portalsinpolygons = window.plugin.portalsinpolygons;
    var namespace = "portalsinpolygons";
    // Configuration
    portalsinpolygons.title = "Portals-in-Polygon";
    /**
	 * An array of objects describing the required plugins.  Each object has
	 * has the properties `object` and `name`.  The `name` value appears in
	 * messaging if there are missing plugins.
	 */
    portalsinpolygons.requiredPlugins = [{
        object: window.plugin.drawTools,
        name: "draw tools"
    }, {
        object: window.plugin.portalslist,
        name: "show list of portals"
    }];

    /**
	 * Used when calling `window.isLayerGroupDisplayed(<String> name)`. E.g.,
	 * `window.isLayerGroupDisplayed(portalsinpolygons.layerChooserName[portal.options.data.level])`.
	 */
    portalsinpolygons.layerChooserName = {
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
	 * Bring portals to the front of the draw layers so that you can click on
	 * them after drawing a circle or polygon over the portals.
	 * <br>
	 * Thanks to Zaso's "Bring Portals To Front" at
	 * <a href="http://www.giacintogarcea.com/ingress/iitc/bring-portals-to-front-by-zaso.meta.js"> Zaso Items</a>.
	 * @global
	 * @name window.plugin.portalsinpolygons.bringPortalsToFront
	 */
    portalsinpolygons.bringPortalsToFront = function(){
        window.Render.prototype.bringPortalsToFront(); // See IITC code
    };

    /**
	 * A getPortalsCallback function returns returns an associative array of IITC portals (typically a subset
	 * of `window.portals`).
	 *
	 * @callback getPortalsCallback
	 * @returns {Object} An associative array of IITC portals.
	 * @see {@link displayPortals}
	 * @see {@link displayContainedPortals}
     */

    /**
	 * Displays portals.  The portals are filtered based on selections in the layer chooser.
	 * <br>
	 * This function is generalized version of the `window.plugin.portalslist.displayPL` function.
	 * @global
	 * @name window.plugin.portalsinpolygons.displayPortals
	 * @param {getPortalsCallback} [getPortalsFn] Optional. An callback function that returns an associative array of IITC
	 *	portals. If the function is not provided or set to undefined, the portals in the current map bounds will be
	 *	used.
     * @param {String} [title="Portal List"] Optional. A title for the portal list dialog.  The default is
	 * "Portal list".
	 */
    portalsinpolygons.displayPortals = function (getPortalsFn, title) {
        var fname = namespace + ".displayPortals";
        var formattedPortals,
            list,
            msg,
            portals,
            type;
        // Check parameters.
        type = typeof getPortalsFn;
        if (type !== 'function') {
            if (type === 'undefined') {
                getPortalsFn = portalsinpolygons.getPortalsInMapBounds;
            } else {
                msg = "Unexpected parameter type, '" + type + "', for function " + fname + ", parameter getPortalsFn.";
                throw new TypeError (msg, plugin_info.name);
            }
        }
        title = (typeof title === 'undefined' ? "Portal list" : title);

        if (!portalsinpolygons.mapZoomHasPortals()) {
            console.warn("Map is zoomed too far out to get sufficient portal data (e.g., the portal name).");
            list = $('<table class="noPortals"><tr><td>Please zoom to get additional portal data like the portal title.</td></tr></table>');
        } else {
            // plugins (e.g. bookmarks) can insert fields before the standard ones - so we need to search for the 'level' column
            window.plugin.portalslist.sortBy = window.plugin.portalslist.fields.map(function (f) {
                return f.title;
            }).indexOf('Level');
            window.plugin.portalslist.sortOrder = -1;
            window.plugin.portalslist.enlP = 0;
            window.plugin.portalslist.resP = 0;
            window.plugin.portalslist.neuP = 0;
            window.plugin.portalslist.filter = 0;

            // Get portals and format them for display.
            portals = getPortalsFn.call(this);
            formattedPortals = portalsinpolygons.formattedPortalList(portals);
            if (formattedPortals.length > 0) {
                list = window.plugin.portalslist.portalTable(window.plugin.portalslist.sortBy, window.plugin.portalslist.sortOrder, window.plugin.portalslist.filter);
            } else {
                list = $('<table class="noPortals"><tr><td>Nothing to show!</td></tr></table>');
            }
        }
        // Display table of portals.
        if (window.useAndroidPanes()) {
            $('<div id="portalslist" class="mobile">').append(list).appendTo(document.body);
        } else {
            dialog({
                html: $('<div id="portalslist">').append(list),
                dialogClass: 'ui-dialog-portalslist',
                title: title + ': ' + window.plugin.portalslist.listPortals.length + ' ' + (window.plugin.portalslist.listPortals.length == 1 ? 'portal' : 'portals'),
                id: 'portalsinpolygons-list',
                width: 700
                }
            );
        }
    };

    /**
	 * Displays the portals contain in, and on the perimeter, of drawn polygons
	 * and on any lines.
	 * @global
	 * @name window.plugin.portalsinpolygons.displayContainedPortals
	 */
    portalsinpolygons.displayContainedPortals = function () {
        portalsinpolygons.displayPortals(portalsinpolygons.getContainedPortals, "Portals-in-Polygons");
    };

    /**
	 * Gets and formats the portal information that will be used in the portal list display.
	 * <br>
	 * This function is based on a modified version of the
	 * `window.plugin.portalslist.getPortals` function.
	 * @param {Object} portals An associative array of IITC portals.
	 * @returns {Array<{portal:{Object}, values:{Array}, sortValues:{Array}>} Returns an array of
	 *	formatted portals.
	 */
    portalsinpolygons.formattedPortalList = function (portals) {
        //filter : 0 = All, 1 = Neutral, 2 = Res, 3 = Enl, -x = all but x
        var fname = namespace + "formattedPortalList";
        var guids, // {String[]}
		    msg, // {String}
            portalList = [];
        guids = Object.keys(portals);
        console.log ("---");
        console.log(["Index","Title","GUID","Lng(X)","Lat(Y)"].join(","));

        guids.forEach(function (guid, i, array) {
            var portal = portals[guid];
            console.log ([i, '"' + portal.options.data.title + '"', portal.options.guid, portal.options.data.lngE6 / 1E6, portal.options.data.latE6 / 1E6].join(","));
            switch (portal.options.team) {
                case window.TEAM_RES:
                    window.plugin.portalslist.resP++;
                    break;
                case window.TEAM_ENL:
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
            row.className = window.TEAM_TO_CSS[portal.options.team];
            obj.row = row;

            var cell = row.insertCell(-1);
            cell.className = 'alignR';

            window.plugin.portalslist.fields.forEach(function (field, i) {
                cell = row.insertCell(-1);

                var value = field.value(portal);
                if (typeof value === 'undefined') {
                    value = "[unknown]";
                }
                obj.values.push(value);

                obj.sortValues.push(field.sortValue && !!value ? field.sortValue(value, portal) : value);

                if (field.format) {
                    field.format(cell, portal, value);
                } else {
                    cell.textContent = value;
                }
            });

            portalList.push(obj);
        });
        console.log ("---");
        window.plugin.portalslist.listPortals = portalList;
        return portalList;
    };

    /**
	 * Returns an array of IITC portals contained in the polygons and circles
	 * drawn on the map.<br>
	 * Checks for layers of type L.Polygon, which includes L.GeodesicPolygon
	 * and L.GeodesicCircle, and L.Polyline, which in L.GeodesicPolyline.
	 * @global
	 * @name window.plugin.portalsinpolygons.getContainedPortals
	 * @param {(keepPortalCallback|true|false)} [keepPortalFn = window.plugin.portalsinpolygons.isPortalDisplayed] If a
	 * callback function is
	 *  provided, it will be called and passed the IITC portal object. If keepPortalFn is not a function and is set to
	 *  something falsy, the portals will not be filtered.  If keepPortalCallback is not provided, explicitly
	 *	undefined, or something truthy, then the default filtering will be
	 *  performed which is to filter portals based on the layer group selections of "Unclaimed Portals",
	 *	"Level 1 Portals" to "Level 8 Portals", "Enlightened" and "Resistance".
	 * @returns {Object} A collection of IITC portals.
	 */
    portalsinpolygons.getContainedPortals = function(keepPortalFn) {
        var fname = namespace + ".getContainedPortals";
        console.log (fname + ": Start");
        var enclosures,
            enclosureData,
            data = [],
            layers, // Leaflet Layer[]
            type,
            portals;
        // Check parameter
        type = typeof keepPortalFn;
        if (type !== 'function') {
            if (type === 'undefined') {
                keepPortalFn = portalsinpolygons.isPortalDisplayed;
            } else if (!keepPortalFn) {
                keepPortalFn = function (portal) {return true;};
            } else {
                keepPortalFn = portalsinpolygons.isPortalDisplayed;
            }
        }
        // Loop through all map elements looking for polygons and circles (and in the future polylines).
        layers = window.plugin.drawTools.drawnItems.getLayers();
        console.log(fname + ": layers.length=" + layers.length);
        enclosures = layers.filter(function(layer, i, array) {
            return (layer instanceof L.Polygon || layer instanceof L.Polyline);
        });

        portals = enclosures.reduce(function(collectedPortals, layer, currentIndex, array){
            var morePortals;
            var desc = [currentIndex, portalsinpolygons.getLayerClassName(layer)];
            // start debug
            var latLngs = layer.getLatLngs();
            latLngs.forEach(function(latLng, i, array) {
                data.push([].concat(desc).concat([latLng.lng, latLng.lat]));
            });
            // end debug
            morePortals = (typeof layer.portalsIn === 'function') ? layer.portalsIn() : {};
            //return collectedPortals.concat(morePortals);
            return jQuery.extend(collectedPortals, morePortals);
        }, Object.create(null));
        // start debug
        console.log(fname + ": Number of enclosures: " + enclosures.length);
        console.log ("---");
        console.log(["LayerNumber","LayerClassName","Lng(X)","Lat(Y)"].join(","));
        data.forEach(function(elem) {
            console.log (elem.join(","));
        });
        console.log ("---");
        // end debug
        // Filter out unwanted portals
        portals = Object.keys(portals).reduce(function(collectedPortals, guid, currentIndex, array) {
            var portal = portals[guid];
            if (keepPortalFn(portal)) {
                collectedPortals[portal.options.guid] = portal;
            }
            return collectedPortals;
        }, Object.create(null));
        console.log (fname + ": End");
        return portals;
    };

    /**
	 * Returns a string representation of the layer class (e.g., "L.GeodesicPolygon" and "L.Marker").
	 * @param {L.Layer} layer An object whose class extends L.Layer.
	 * @returns {String} A string representation of the layer class.
	 */
    portalsinpolygons.getLayerClassName = function getLayerClassName (layer) {
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
	 * Returns a set of guids belonging to the portals filtered by the layer group selections of
	 * "Unclaimed Portals", "Level 1 Portals" to "Level 8 Portals", "Enlightened" and "Resistance".
	 * @param {Object} portals An associative array of IITC portal objects.
	 * @returns {string[]} An array of portal guids.
	 */
    portalsinpolygons.getPortalGuidsFilteredByLayerGroup = function (portals) {
        var guids;
        guids = Object.keys(portals);
        guids = guids.filter(function (guid, i, array) {
            var keep;
            var portal = portals[guid];
            keep = (window.isLayerGroupDisplayed(portalsinpolygons.layerChooserName[portal.options.data.level]) &&
                    ((portal.options.data.team === "R" && window.isLayerGroupDisplayed(portalsinpolygons.layerChooserName.Resistance)) ||
                     (portal.options.data.team === "E" && window.isLayerGroupDisplayed(portalsinpolygons.layerChooserName.Enlightened)) ||
                     (portal.options.data.team === "N" && window.isLayerGroupDisplayed(portalsinpolygons.layerChooserName.Neutral))));
            return keep;
        });
        return guids;
    };

    /**
	 * A keepPortalCallback function returns true if the the provided portal passes the test implemented by the
	 * callback function.  The callback is used to determine if the portal should be displayed in the list of portals.
	 *
	 * @callback keepPortalCallback
	 * @param {Object} portal An IITC portal object.
	 * @returns {boolean} True if the portal should be kept.  False if the portal should be ignored.
	 * @see {@link getPortalsInMapBounds}
     */

    /**
	 * Returns the portals within the displayed map boundaries.
	 * @global
	 * @name window.plugin.portalsinpolygons.getPortalsInMapBounds
	 * @param {(keepPortalCallback|true|false)} [keepPortalFn = portalsinpolygons.isPortalDisplayed] If a callback function is
	 *  provided, it will be called and passed the IITC portal object. If keepPortalFn is not a function and is set to
	 *  something falsy, the portals will not be filtered.  If keepPortalCallback is not provided, explicitly
	 *	undefined, or something truthy, then the default filtering will be
	 *  performed which is to filter portals based on the layer group selections of "Unclaimed Portals",
	 *	"Level 1 Portals" to "Level 8 Portals", "Enlightened" and "Resistance".
	 * @returns {Object} An associative array of IITC portal objects (a subset of `window.portals`).
	 */
    portalsinpolygons.getPortalsInMapBounds = function (keepPortalFn) {
        var displayBounds,
            type,
            boundedPortals;
        // Check parameter
        type = typeof keepPortalFn;
        if (type !== 'function') {
            if (type === 'undefined') {
                keepPortalFn = portalsinpolygons.isPortalDisplayed;
            } else if (!keepPortalFn) {
                keepPortalFn = function (portal) {return true;};
            } else {
                keepPortalFn = portalsinpolygons.isPortalDisplayed;
            }
        }
        displayBounds = window.map.getBounds(); // the bounds could contain larger than life lat and lngs if zoomed out far.
		displayBounds.getSouthWest().wrap();
        displayBounds.getNorthEast().wrap();

        boundedPortals = Object.keys(window.portals).reduce(function (collectedPortals, guid, currentIndex, array) {
            var portal;
            portal = window.portals[guid];
            //			var exp = {latLng: portal.getLatLng(), contains: displayBounds.contains(portal.getLatLng()), keep:keepPortalFn(portal)};
            //			console.log("exp="+JSON.stringify(exp));
            if (displayBounds.contains(portal.getLatLng()) && keepPortalFn(portal)) {
                collectedPortals[guid] = portal;
            }
            return collectedPortals;
        }, Object.create(null));
        return boundedPortals;
    };

    /**
	 * Returns the DOM elements containing the plugin controls to be appended to the IITC toolbox.
	 * <br>
	 * Controls from other plugins with class "wise-toolbox-control" or "wise-toolbox-control-section" will be grouped
	 * into one subsection (same div tag).
	 * @returns {Object} DOM elements.
	 */
    portalsinpolygons.getToolboxControls = function () {
		var	controlsHtml,
            pluginControl,
            portalsToFrontControl,
            displayPortalsControl,
            listPortalsInPolygonControl;

        portalsToFrontControl = '<span style="white-space:nowrap"><a id="portalsinpolygons-portalsToFront" onclick="window.plugin.portalsinpolygons.bringPortalsToFront();false;" title="Bring portals to the front draw layer so that you can click on them after drawing a circle or polygon over them.">Portals To Front</a></span>';
        listPortalsInPolygonControl = '<span style="white-space:nowrap"><a id="portalsinpolygons-portalsInPolygons" onclick="window.plugin.portalsinpolygons.displayContainedPortals();false;" title="Display a list of portals in polygons, circles, and on lines.  Use the layer group check boxes to filter the portals.">Portals in Polygons</a></span>';
        displayPortalsControl = '<span style="white-space:nowrap"><a id="portalsinpolygons-portalsOnMap" onclick="window.plugin.portalsinpolygons.displayPortals();false;" title="Display a list of portals.">Portals on Map</a></span>';
        controlsHtml = listPortalsInPolygonControl + '&nbsp;&#9679; ' + displayPortalsControl + '&nbsp;&#9679; ' + portalsToFrontControl;

		pluginControl = new window.helpers.ToolboxControlSection(controlsHtml, "wise-toolbox-control-section", "wise-toolbox-control");
		pluginControl.attr("id", namespace + ".controls");
		pluginControl = pluginControl.mergeWithFamily();
        window.helpers.ToolboxControlSection.setStyle();
		return pluginControl;
    };

    /**
	 * Returns the portal if it is displayed based on the the layer group selections of "Unclaimed Portals",
	 * "Level 1 Portals" to "Level 8 Portals", "Enlightened" and "Resistance".  Returns null if it is not
	 * displayed.
	 * @param {Object} portal An IITC portal object.
	 * @returns {(Object|null)} The IITC portal object or null.
	 */
    portalsinpolygons.isPortalDisplayed = function (portal) {
        var keep;
        keep = (window.isLayerGroupDisplayed(portalsinpolygons.layerChooserName[portal.options.level]) &&
                ((portal.options.data.team === "R" && window.isLayerGroupDisplayed(portalsinpolygons.layerChooserName.Resistance)) ||
                 (portal.options.data.team === "E" && window.isLayerGroupDisplayed(portalsinpolygons.layerChooserName.Enlightened)) ||
                 (portal.options.data.team === "N" && window.isLayerGroupDisplayed(portalsinpolygons.layerChooserName.Neutral))));
        return keep;
    };

    /**
	 * Checks if there is sufficient portal data for the current map zoom.  When the zoom is set very far,
     * `window.portals` will only contain placeholder data and may not contain the portal title and other
	 * information.
	 * @todo it might be easier to check if one of the portals has the data your are looking for (e.g., check if portal.options.data.title exists).
	 * @returns {boolean} True if there is sufficient portal data; otherwise, returns false.
	 */
    portalsinpolygons.mapZoomHasPortals = function() {
        var zoom = map.getZoom();
        zoom = getDataZoomForMapZoom(zoom);
        var tileParams = getMapZoomTileParameters(zoom);
        return tileParams.hasPortals;
    };

    /**
     * Setup function called by IITC.
     */
    portalsinpolygons.setup = function init() { // If your setup is named something else, change the assignment in var setup = ... below.
        var fname = namespace + ".setup";
        var controls;
		console.log (fname + ": Start, version " + (!!plugin_info ? plugin_info.script.version : "unknown"));
        if (!window.helpers.prerequisitePluginsInstalled(portalsinpolygons.requiredPlugins, plugin_info.script.name)) {
            return;
        }
		// Standard sytling for "wise" family of toolbox controls
		$("<style>")
			.prop("type", "text/css")
			.html("div.wise-toolbox-control-section {color:#00C5FF;text-align:center;width:fit-content;border-top: 1px solid #20A8B1;border-bottom: 1px solid #20A8B1;}")
        .appendTo("head");
        // Add controls to IITC right hand side toolbox.
        controls = portalsinpolygons.getToolboxControls();
        $("#toolbox").append(controls);

        // Delete setup function so that it is not run again.
        console.log (fname + ": End");
        delete portalsinpolygons.setup;
    };

    /*
     * Set the required setup function that is called or handled by PLUGINEND code provided IITC build script.  
     * The function will be called if IITC is already loaded and, if not, saved for later execution.
     */
    var setup = portalsinpolygons.setup;
//PLUGIN END //////////////////////////////////////////////////////////

setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = {version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
