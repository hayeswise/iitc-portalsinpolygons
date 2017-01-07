## Modules

<dl>
<dt><a href="#module_portalsinpolygon">portalsinpolygon</a> : <code>function</code></dt>
<dd><p>Portals-in-Polygon IITC plugin.  The plugin and its members can be accessed via
<code>window.plugin.portalsinpolygons</code>.  The &quot;public&quot; members are documented as module members while the more
friend and private members are documented as part of the <code>wrapper</code> function.</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#bringPortalsToFront">bringPortalsToFront</a></dt>
<dd><p>Bring portals to the front of the draw layers so that you can click on
them after drawing a circle or polygon over the portals.
<br>
Thanks to Zaso&#39;s &quot;Bring Portals To Front&quot; at
<a href="http://www.giacintogarcea.com/ingress/iitc/bring-portals-to-front-by-zaso.meta.js"> Zaso Items</a>.</p>
</dd>
<dt><a href="#displayPortals">displayPortals</a></dt>
<dd><p>Displays portals.  The portals are filtered based on selections in the layer chooser.
<br>
This function is generalized version of the <code>window.plugin.portalslist.displayPL</code> function.</p>
</dd>
<dt><a href="#displayContainedPortals">displayContainedPortals</a></dt>
<dd><p>Displays the portals contain in, and on the perimeter, of drawn polygons
and on any lines.</p>
</dd>
<dt><a href="#getContainedPortals">getContainedPortals</a> ⇒ <code>Object</code></dt>
<dd><p>Returns an array of IITC portals contained in the polygons and circles
drawn on the map.<br>
Checks for layers of type L.Polygon, which includes L.GeodesicPolygon
and L.GeodesicCircle, and L.Polyline, which in L.GeodesicPolyline.</p>
</dd>
<dt><a href="#getPortalsInMapBounds">getPortalsInMapBounds</a> ⇒ <code>Object</code></dt>
<dd><p>Returns the portals within the displayed map boundaries.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#wrapper">wrapper(plugin_info)</a></dt>
<dd><p>Closure function for Portals-in-Polygon.</p>
<p>Standard IITC wrapper pattern used to create the plugin&#39;s closure when
&quot;installed&quot; using <code>document.createElement(&quot;script&quot;.appendChild(document.createTextNode(&#39;(&#39;+ wrapper +&#39;)(&#39;+JSON.stringify(info)+&#39;);&#39;));</code></p>
</dd>
</dl>

## External

<dl>
<dt><a href="#external_window.map">window.map</a></dt>
<dd><p>The IITC map object (a Leaflet map).</p>
</dd>
<dt><a href="#external_window.portals">window.portals</a></dt>
<dd><p>The IITC portals object (used as a map) that contains a list of the cached
portal information for the portals in the current and surrounding view.</p>
</dd>
<dt><a href="#external_window.Render">window.Render</a></dt>
<dd><p>The map data render class which handles rendering into Leaflet the JSON data from the servers.  Needed to access
<code>window.Render.prototype.bringPortalsToFront</code>.</p>
</dd>
<dt><a href="#external_window.plugin.portalslist">window.plugin.portalslist</a></dt>
<dd><p>The &quot;show list of portals&quot; plugin object, properties, and methods.</p>
</dd>
<dt><a href="#external_L.LatLng">L.LatLng</a></dt>
<dd><p>The Leaflet LatLng class.</p>
</dd>
<dt><a href="#external_L.Polyline">L.Polyline</a></dt>
<dd><p>The Leaflet Polyline class.</p>
</dd>
<dt><a href="#external_L.Polygon">L.Polygon</a></dt>
<dd><p>The Leaflet Polygon class.
L.GeodesicPolygon and L.GeodesicCircle extend L.Polygon.</p>
</dd>
</dl>

<a name="module_portalsinpolygon"></a>

## portalsinpolygon : <code>function</code>
Portals-in-Polygon IITC plugin.  The plugin and its members can be accessed via`window.plugin.portalsinpolygons`.  The "public" members are documented as module members while the morefriend and private members are documented as part of the `wrapper` function.

**See**: [wrapper](#wrapper)  

* [portalsinpolygon](#module_portalsinpolygon) : <code>function</code>
    * [~getPortalsCallback](#module_portalsinpolygon..getPortalsCallback) ⇒ <code>Object</code>
    * [~keepPortalCallback](#module_portalsinpolygon..keepPortalCallback) ⇒ <code>boolean</code>
    * [~GM_info](#external_GM_info)

<a name="module_portalsinpolygon..getPortalsCallback"></a>

### portalsinpolygon~getPortalsCallback ⇒ <code>Object</code>
A getPortalsCallback function returns returns an associative array of IITC portals (typically a subsetof `window.portals`).

**Kind**: inner typedef of <code>[portalsinpolygon](#module_portalsinpolygon)</code>  
**Returns**: <code>Object</code> - An associative array of IITC portals.  
**See**

- [displayPortals](#displayPortals)
- [displayContainedPortals](#displayContainedPortals)

<a name="module_portalsinpolygon..keepPortalCallback"></a>

### portalsinpolygon~keepPortalCallback ⇒ <code>boolean</code>
A keepPortalCallback function returns true if the the provided portal passes the test implemented by thecallback function.  The callback is used to determine if the portal should be displayed in the list of portals.

**Kind**: inner typedef of <code>[portalsinpolygon](#module_portalsinpolygon)</code>  
**Returns**: <code>boolean</code> - True if the portal should be kept.  False if the portal should be ignored.  
**See**: [getPortalsInMapBounds](#getPortalsInMapBounds)  

| Param | Type | Description |
| --- | --- | --- |
| portal | <code>Object</code> | An IITC portal object. |

<a name="external_GM_info"></a>

### portalsinpolygon~GM_info
Greasemonkey object containing information about the script.

**Kind**: inner external of <code>[portalsinpolygon](#module_portalsinpolygon)</code>  
**See**: [Greasemonkey](http://www.greasespot.net/)  
<a name="bringPortalsToFront"></a>

## bringPortalsToFront
Bring portals to the front of the draw layers so that you can click onthem after drawing a circle or polygon over the portals.<br>Thanks to Zaso's "Bring Portals To Front" at<a href="http://www.giacintogarcea.com/ingress/iitc/bring-portals-to-front-by-zaso.meta.js"> Zaso Items</a>.

**Kind**: global variable  
<a name="displayPortals"></a>

## displayPortals
Displays portals.  The portals are filtered based on selections in the layer chooser.<br>This function is generalized version of the `window.plugin.portalslist.displayPL` function.

**Kind**: global variable  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [getPortalsFn] | <code>getPortalsCallback</code> |  | Optional. An callback function that returns an associative array of IITC 	portals. If the function is not provided or set to undefined, the portals in the current map bounds will be 	used. |
| [title] | <code>String</code> | <code>&quot;Portal List&quot;</code> | Optional. A title for the portal list dialog.  The default is "Portal list". |

<a name="displayContainedPortals"></a>

## displayContainedPortals
Displays the portals contain in, and on the perimeter, of drawn polygonsand on any lines.

**Kind**: global variable  
<a name="getContainedPortals"></a>

## getContainedPortals ⇒ <code>Object</code>
Returns an array of IITC portals contained in the polygons and circlesdrawn on the map.<br>Checks for layers of type L.Polygon, which includes L.GeodesicPolygonand L.GeodesicCircle, and L.Polyline, which in L.GeodesicPolyline.

**Kind**: global variable  
**Returns**: <code>Object</code> - A collection of IITC portals.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [keepPortalFn] | <code>keepPortalCallback</code> &#124; <code>true</code> &#124; <code>false</code> | <code>window.plugin.portalsinpolygons.isPortalDisplayed</code> | If a callback function is  provided, it will be called and passed the IITC portal object. If keepPortalFn is not a function and is set to  something falsy, the portals will not be filtered.  If keepPortalCallback is not provided, explicitly 	undefined, or something truthy, then the default filtering will be  performed which is to filter portals based on the layer group selections of "Unclaimed Portals", 	"Level 1 Portals" to "Level 8 Portals", "Enlightened" and "Resistance". |

<a name="getPortalsInMapBounds"></a>

## getPortalsInMapBounds ⇒ <code>Object</code>
Returns the portals within the displayed map boundaries.

**Kind**: global variable  
**Returns**: <code>Object</code> - An associative array of IITC portal objects (a subset of `window.portals`).  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [keepPortalFn] | <code>keepPortalCallback</code> &#124; <code>true</code> &#124; <code>false</code> | <code>portalsinpolygons.isPortalDisplayed</code> | If a callback function is  provided, it will be called and passed the IITC portal object. If keepPortalFn is not a function and is set to  something falsy, the portals will not be filtered.  If keepPortalCallback is not provided, explicitly 	undefined, or something truthy, then the default filtering will be  performed which is to filter portals based on the layer group selections of "Unclaimed Portals", 	"Level 1 Portals" to "Level 8 Portals", "Enlightened" and "Resistance". |

<a name="wrapper"></a>

## wrapper(plugin_info)
Closure function for Portals-in-Polygon.Standard IITC wrapper pattern used to create the plugin's closure when"installed" using `document.createElement("script".appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));`

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| plugin_info | <code>Object</code> | Object containing Greasemonkey/Tampermonkey information about the plugin. |
| plugin_info.script | <code>string</code> | Greasemonkey/Tampermonkey information about the plugin. |
| plugin_info.script.version | <code>string</code> | GM_info.script.version. |
| plugin_info.script.name | <code>string</code> | GM_info.script.name. |
| plugin_info.script.description | <code>string</code> | GM_info.script.description. |


* [wrapper(plugin_info)](#wrapper)
    * [~portalsinpolygons](#wrapper..portalsinpolygons) : <code>object</code>
        * [.requiredPlugins](#wrapper..portalsinpolygons.requiredPlugins) : <code>Array</code>
        * [.layerChooserName](#wrapper..portalsinpolygons.layerChooserName)
        * [.formattedPortalList(portals)](#wrapper..portalsinpolygons.formattedPortalList) ⇒
        * [.getLayerClassName(layer)](#wrapper..portalsinpolygons.getLayerClassName) ⇒ <code>String</code>
        * [.getPortalGuidsFilteredByLayerGroup(portals)](#wrapper..portalsinpolygons.getPortalGuidsFilteredByLayerGroup) ⇒ <code>Array.&lt;string&gt;</code>
        * [.normalizeDisplayBounds(bounds)](#wrapper..portalsinpolygons.normalizeDisplayBounds)
        * [.getToolboxControls()](#wrapper..portalsinpolygons.getToolboxControls) ⇒ <code>Object</code>
        * [.isPortalDisplayed(portal)](#wrapper..portalsinpolygons.isPortalDisplayed) ⇒ <code>Object</code> &#124; <code>null</code>
        * [.listContainedPortals()](#wrapper..portalsinpolygons.listContainedPortals)
        * [.prerequisitePluginsInstalled()](#wrapper..portalsinpolygons.prerequisitePluginsInstalled) ⇒ <code>boolean</code>
        * [.setup()](#wrapper..portalsinpolygons.setup)

<a name="wrapper..portalsinpolygons"></a>

### wrapper~portalsinpolygons : <code>object</code>
Portals-in-Polygon namespace.  `portalsinpolygon` is set to `window.plugin.portalsinpolygons`.

**Kind**: inner namespace of <code>[wrapper](#wrapper)</code>  

* [~portalsinpolygons](#wrapper..portalsinpolygons) : <code>object</code>
    * [.requiredPlugins](#wrapper..portalsinpolygons.requiredPlugins) : <code>Array</code>
    * [.layerChooserName](#wrapper..portalsinpolygons.layerChooserName)
    * [.formattedPortalList(portals)](#wrapper..portalsinpolygons.formattedPortalList) ⇒
    * [.getLayerClassName(layer)](#wrapper..portalsinpolygons.getLayerClassName) ⇒ <code>String</code>
    * [.getPortalGuidsFilteredByLayerGroup(portals)](#wrapper..portalsinpolygons.getPortalGuidsFilteredByLayerGroup) ⇒ <code>Array.&lt;string&gt;</code>
    * [.normalizeDisplayBounds(bounds)](#wrapper..portalsinpolygons.normalizeDisplayBounds)
    * [.getToolboxControls()](#wrapper..portalsinpolygons.getToolboxControls) ⇒ <code>Object</code>
    * [.isPortalDisplayed(portal)](#wrapper..portalsinpolygons.isPortalDisplayed) ⇒ <code>Object</code> &#124; <code>null</code>
    * [.listContainedPortals()](#wrapper..portalsinpolygons.listContainedPortals)
    * [.prerequisitePluginsInstalled()](#wrapper..portalsinpolygons.prerequisitePluginsInstalled) ⇒ <code>boolean</code>
    * [.setup()](#wrapper..portalsinpolygons.setup)

<a name="wrapper..portalsinpolygons.requiredPlugins"></a>

#### portalsinpolygons.requiredPlugins : <code>Array</code>
An array of objects describing the required plugins.  Each object hashas the properties `object` and `name`.  The `name` value appears inmessaging if there are missing plugins.

**Kind**: static property of <code>[portalsinpolygons](#wrapper..portalsinpolygons)</code>  
<a name="wrapper..portalsinpolygons.layerChooserName"></a>

#### portalsinpolygons.layerChooserName
Used when calling `window.isLayerGroupDisplayed(<String> name)`. E.g.,`window.isLayerGroupDisplayed(portalsinpolygons.layerChooserName[portal.options.data.level])`.

**Kind**: static property of <code>[portalsinpolygons](#wrapper..portalsinpolygons)</code>  
<a name="wrapper..portalsinpolygons.formattedPortalList"></a>

#### portalsinpolygons.formattedPortalList(portals) ⇒
Gets and formats the portal information that will be used in the portal list display.<br>This function is based on a modified version of the`window.plugin.portalslist.getPortals` function.

**Kind**: static method of <code>[portalsinpolygons](#wrapper..portalsinpolygons)</code>  
**Returns**: {Array<{portal:{Object}, values:{Array}, sortValues:{Array}>} Returns an array of	formatted portals.  

| Param | Type | Description |
| --- | --- | --- |
| portals | <code>Object</code> | An associative array of IITC portals. |

<a name="wrapper..portalsinpolygons.getLayerClassName"></a>

#### portalsinpolygons.getLayerClassName(layer) ⇒ <code>String</code>
Returns a string representation of the layer class (e.g., "L.GeodesicPolygon" and "L.Marker").

**Kind**: static method of <code>[portalsinpolygons](#wrapper..portalsinpolygons)</code>  
**Returns**: <code>String</code> - A string representation of the layer class.  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>L.Layer</code> | An object whose class extends L.Layer. |

<a name="wrapper..portalsinpolygons.getPortalGuidsFilteredByLayerGroup"></a>

#### portalsinpolygons.getPortalGuidsFilteredByLayerGroup(portals) ⇒ <code>Array.&lt;string&gt;</code>
Returns a set of guids belonging to the portals filtered by the layer group selections of"Unclaimed Portals", "Level 1 Portals" to "Level 8 Portals", "Enlightened" and "Resistance".

**Kind**: static method of <code>[portalsinpolygons](#wrapper..portalsinpolygons)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - An array of portal guids.  

| Param | Type | Description |
| --- | --- | --- |
| portals | <code>Object</code> | An associative array of IITC portal objects. |

<a name="wrapper..portalsinpolygons.normalizeDisplayBounds"></a>

#### portalsinpolygons.normalizeDisplayBounds(bounds)
**Kind**: static method of <code>[portalsinpolygons](#wrapper..portalsinpolygons)</code>  

| Param | Type |
| --- | --- |
| bounds | <code>L.LatLngBounds</code> | 

<a name="wrapper..portalsinpolygons.getToolboxControls"></a>

#### portalsinpolygons.getToolboxControls() ⇒ <code>Object</code>
Returns the DOM elements containing the plugin controls to be appended to the IITC toolbox.<br>Intentioinally public to allow friendly plugins the ability to group and hide controls.

**Kind**: static method of <code>[portalsinpolygons](#wrapper..portalsinpolygons)</code>  
**Returns**: <code>Object</code> - DOM elements.  
<a name="wrapper..portalsinpolygons.isPortalDisplayed"></a>

#### portalsinpolygons.isPortalDisplayed(portal) ⇒ <code>Object</code> &#124; <code>null</code>
Returns the portal if it is displayed based on the the layer group selections of "Unclaimed Portals","Level 1 Portals" to "Level 8 Portals", "Enlightened" and "Resistance".  Returns null if it is notdisplayed.

**Kind**: static method of <code>[portalsinpolygons](#wrapper..portalsinpolygons)</code>  
**Returns**: <code>Object</code> &#124; <code>null</code> - The IITC portal object or null.  

| Param | Type | Description |
| --- | --- | --- |
| portal | <code>Object</code> | An IITC portal object. |

<a name="wrapper..portalsinpolygons.listContainedPortals"></a>

#### portalsinpolygons.listContainedPortals()
Lists out portals in polygons and circles.

**Kind**: static method of <code>[portalsinpolygons](#wrapper..portalsinpolygons)</code>  
<a name="wrapper..portalsinpolygons.prerequisitePluginsInstalled"></a>

#### portalsinpolygons.prerequisitePluginsInstalled() ⇒ <code>boolean</code>
Checks if the pre-requisite plugins are installed.  If not, displays an alert.

**Kind**: static method of <code>[portalsinpolygons](#wrapper..portalsinpolygons)</code>  
<a name="wrapper..portalsinpolygons.setup"></a>

#### portalsinpolygons.setup()
Setup function called by IITC.

**Kind**: static method of <code>[portalsinpolygons](#wrapper..portalsinpolygons)</code>  
<a name="external_window.map"></a>

## window.map
The IITC map object (a Leaflet map).

**Kind**: global external  
**See**: [Ingress Intel Total Conversion](https://iitc.me/)  
<a name="external_window.portals"></a>

## window.portals
The IITC portals object (used as a map) that contains a list of the cachedportal information for the portals in the current and surrounding view.

**Kind**: global external  
**See**: [Ingress Intel Total Conversion](https://iitc.me/)  
<a name="external_window.Render"></a>

## window.Render
The map data render class which handles rendering into Leaflet the JSON data from the servers.  Needed to access`window.Render.prototype.bringPortalsToFront`.

**Kind**: global external  
**See**: [Ingress Intel Total Conversion](https://iitc.me/)  
<a name="external_window.plugin.portalslist"></a>

## window.plugin.portalslist
The "show list of portals" plugin object, properties, and methods.

**Kind**: global external  
**See**: ["show list of portals"](http://leafletjs.com/) plugin source code for further information.  
<a name="external_L.LatLng"></a>

## L.LatLng
The Leaflet LatLng class.

**Kind**: global external  
**See**: [Leaflet](http://leafletjs.com/) documentation for further information.  
<a name="external_L.LatLng+isLeft"></a>

### l.LatLng.isLeft(p1, p2) ⇒
Tests if a point is left|on|right of an infinite line.<br><br>This is a JavaScript and Leaflet port of the `isLeft()` C++ function by Dan Sunday.

**Kind**: instance method of <code>[L.LatLng](#external_L.LatLng)</code>  
**Returns**: >0 for p2 left of the line through this point and p1,         =0 for p2 on the line,         <0 for p2 right of the line through this point an p1.  
**See**: [Inclusion of a Point in a Polygon](http://geomalgorithms.com/a03-_inclusion.html) by Dan Sunday.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | <code>LatLng</code> | Point The reference line is defined by `this` LatLng to p1. |
| p2 | <code>LatLng</code> | The point in question. |

<a name="external_L.Polyline"></a>

## L.Polyline
The Leaflet Polyline class.

**Kind**: global external  
**See**: [Leaflet](http://leafletjs.com/) documentation for further information.  
<a name="external_L.Polyline+getWindingNumber"></a>

### l.Polyline.getWindingNumber(p)
Test for a point in a polygon or on the bounding lines of the polygon.  Thecoordinates (L.LatLngs) for a GeodesicPolygon are set to follow the earth'scurvature when the GeodesicPolygon object is created.  Since L.Polygonextends L.Polyline we can use the same method for both.  Although, forL.Polyline, we only get points on the line even if a collection of linesappear to make a polygon.<br><br>This is a JavaScript and Leaflet port of the `wn_PnPoly()` C++ function by Dan Sunday.Unlike the C++ version, this implementation does include points on the line and vertices.

**Kind**: instance method of <code>[L.Polyline](#external_L.Polyline)</code>  
**Retuns**: <code>Number</code> The winding number (=0 only when the point is outside)  
**See**

- [Inclusion of a Point in a Polygon](http://geomalgorithms.com/a03-_inclusion.html) by Dan Sunday.
- [Leaflet.Geodesc](https://github.com/Fragger/Leaflet.Geodesic) for information about Leaflet.Geodesc by Fragger.


| Param | Type | Description |
| --- | --- | --- |
| p | <code>L.LatLng</code> | A point. |

<a name="external_L.Polygon"></a>

## L.Polygon
The Leaflet Polygon class.L.GeodesicPolygon and L.GeodesicCircle extend L.Polygon.

**Kind**: global external  
**See**: [Leaflet](http://leafletjs.com/) documentation for further information.  
