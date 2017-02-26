## Modules

<dl>
<dt><a href="#module_window.helper.requiredPlugins">window.helper.requiredPlugins</a> : <code>function</code></dt>
<dd><p>Required Plugins helper.</p>
</dd>
<dt><a href="#module_window.helper.ToolboxControlSection">window.helper.ToolboxControlSection</a> : <code>function</code></dt>
<dd><p>Toolbox Control Section helper.</p>
</dd>
<dt><a href="#module_window.plugin.portalsinpolygons">window.plugin.portalsinpolygons</a> : <code>function</code></dt>
<dd><p>Portals-in-Polygon IITC plugin.  The plugin and its members can be accessed via
<code>window.plugin.portalsinpolygons</code>.</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#window.helper.requiredPlugins(2)">window.helper.requiredPlugins</a></dt>
<dd><p>Required Plugins namespace.</p>
</dd>
<dt><a href="#window.plugin.portalsinpolygons(2)">window.plugin.portalsinpolygons</a></dt>
<dd><p>Portals-in-Polygon namespace.  <code>self</code> is set to <code>window.plugin.portalsinpolygons</code>.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ScriptInfo">ScriptInfo</a> : <code>Object</code></dt>
<dd><p>Greasemonkey/Tampermonkey information about the plugin.</p>
</dd>
<dt><a href="#PluginInfo">PluginInfo</a> : <code>Object</code></dt>
<dd><p>Plugin information which includes the Greasemonkey/Tampermonkey information about the plugin.</p>
</dd>
</dl>

## External

<dl>
<dt><a href="#external_window.map">window.map</a></dt>
<dd><p>The IITC map object (a Leaflet map).</p>
</dd>
<dt><a href="#external_window.portals">window.portals</a> : <code>Object.&lt;string, Object&gt;</code></dt>
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
</dl>

<a name="module_window.helper.requiredPlugins"></a>

## window.helper.requiredPlugins : <code>function</code>
Required Plugins helper.

<a name="module_window.helper.requiredPlugins..PluginMetaData"></a>

### window.helper.requiredPlugins~PluginMetaData : <code>Object</code>
Information about a plugin.  The `pluginKey` is the property name of theplugin in the `window.plugin` associative array.  The `name` value is usedin messaging about the plugins (e.g., if it is missing).

**Kind**: inner typedef of <code>[window.helper.requiredPlugins](#module_window.helper.requiredPlugins)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| pluginKey | <code>String</code> | The property name of the plugin in  `window.plugin`. |
| name | <code>String</code> | A title or short name of the plugin. |

**Example**  
```js
{  pluginKey: "drawTools",  name: "draw tools"}
```
<a name="module_window.helper.ToolboxControlSection"></a>

## window.helper.ToolboxControlSection : <code>function</code>
Toolbox Control Section helper.

<a name="module_window.plugin.portalsinpolygons"></a>

## window.plugin.portalsinpolygons : <code>function</code>
Portals-in-Polygon IITC plugin.  The plugin and its members can be accessed via`window.plugin.portalsinpolygons`.


* [window.plugin.portalsinpolygons](#module_window.plugin.portalsinpolygons) : <code>function</code>
    * [~getPortalsCallback](#module_window.plugin.portalsinpolygons..getPortalsCallback) ⇒ <code>Object.&lt;string, Object&gt;</code>
    * [~keepPortalCallback](#module_window.plugin.portalsinpolygons..keepPortalCallback) ⇒ <code>boolean</code>

<a name="module_window.plugin.portalsinpolygons..getPortalsCallback"></a>

### window.plugin.portalsinpolygons~getPortalsCallback ⇒ <code>Object.&lt;string, Object&gt;</code>
A getPortalsCallback function returns returns an associative array of IITC portals (typically a subsetof `window.portals`).

**Kind**: inner typedef of <code>[window.plugin.portalsinpolygons](#module_window.plugin.portalsinpolygons)</code>  
**Returns**: <code>Object.&lt;string, Object&gt;</code> - An associative array of IITC portals.  
**See**

- [displayPortals](displayPortals)
- [displayContainedPortals](displayContainedPortals)

<a name="module_window.plugin.portalsinpolygons..keepPortalCallback"></a>

### window.plugin.portalsinpolygons~keepPortalCallback ⇒ <code>boolean</code>
A keepPortalCallback function returns true if the the provided portal passes the test implemented by thecallback function.  The callback is used to determine if the portal should be displayed in the list of portals.

**Kind**: inner typedef of <code>[window.plugin.portalsinpolygons](#module_window.plugin.portalsinpolygons)</code>  
**Returns**: <code>boolean</code> - True if the portal should be kept.  False if the portal should be ignored.  
**See**: [getPortalsInMapBounds](getPortalsInMapBounds)  

| Param | Type | Description |
| --- | --- | --- |
| portal | <code>Object</code> | An IITC portal object. |

<a name="window.helper.requiredPlugins(2)"></a>

## window.helper.requiredPlugins
Required Plugins namespace.

**Kind**: global variable  

* [window.helper.requiredPlugins](#window.helper.requiredPlugins(2))
    * [.areMissing(prerequisites)](#window.helper.requiredPlugins(2).areMissing) ⇒ <code>boolean</code>
    * [.missingPluginNames(requiredPlugins)](#window.helper.requiredPlugins(2).missingPluginNames) ⇒ <code>Array.&lt;PluginMetaData&gt;</code>
    * [.alertIfNotInstalled(requiredPlugins, pluginName)](#window.helper.requiredPlugins(2).alertIfNotInstalled) ⇒ <code>boolean</code>

<a name="window.helper.requiredPlugins(2).areMissing"></a>

### window.helper.requiredPlugins.areMissing(prerequisites) ⇒ <code>boolean</code>
Returns true if all the prerequisite plugins are installed.

**Kind**: static method of <code>[window.helper.requiredPlugins](#window.helper.requiredPlugins(2))</code>  
**Returns**: <code>boolean</code> - Returns `true` if all the prerequisite plugins are installed; otherwise, returns `false`.  

| Param | Type | Description |
| --- | --- | --- |
| prerequisites | <code>Array.&lt;PluginMetaData&gt;</code> | An array of `RequiredPluginMetaData`. |

**Example**  
```js
window.plugin.myPlugin.requiredPlugins = [{  pluginKey: window.plugin.drawTools,  name: "draw tools"}, {  pluginKey: window.plugin.myotherplugin,  name: "My Other Plugin"}]...if (window.helper.requiredPlugins.areMissing(window.plugin.myPlugin.requiredPlugins)) {   return;}
```
<a name="window.helper.requiredPlugins(2).missingPluginNames"></a>

### window.helper.requiredPlugins.missingPluginNames(requiredPlugins) ⇒ <code>Array.&lt;PluginMetaData&gt;</code>
Checks if the prerequisite/required plugins are installed.

**Kind**: static method of <code>[window.helper.requiredPlugins](#window.helper.requiredPlugins(2))</code>  

| Param | Type | Description |
| --- | --- | --- |
| requiredPlugins | <code>Array.&lt;PluginMetaData&gt;</code> | An array of plugin meta-data on the required plugins. |

**Example**  
```js
window.plugin.myPlugin.requiredPlugins = [{  pluginKey: window.plugin.drawTools,  name: "draw tools"}, {  pluginKey: window.plugin.myotherplugin,  name: "My Other Plugin"}]...var missing = window.helper.requiredPlugins.missingPluginNames(window.plugin.myPlugin.requiredPlugins);if (missing.length > 0) {  msg = 'IITC plugin "' + pluginName + '" requires IITC plugin' + ((missing.length === 1) ? ' ' : 's ') +    ((missing.length === 1) ? missing[0] : (missing.slice(0,-1).join(", ") + " and " + missing[missing.length - 1])) + '.';  console.warn(msg);  alert(msg);}
```
<a name="window.helper.requiredPlugins(2).alertIfNotInstalled"></a>

### window.helper.requiredPlugins.alertIfNotInstalled(requiredPlugins, pluginName) ⇒ <code>boolean</code>
Checks if the pre-requisite plugins are installed.  If one or more requisites are not installed, an alert isdisplayed.

**Kind**: static method of <code>[window.helper.requiredPlugins](#window.helper.requiredPlugins(2))</code>  

| Param | Type | Description |
| --- | --- | --- |
| requiredPlugins | <code>Array.&lt;RequiredPluginMetaData&gt;</code> | An array of plugin meta-data on the required plugins. |
| pluginName | <code>string</code> | The name of the plugin requiring the required plugins.  Recommend using    `plugin_info.script.name`. |

**Example**  
```js
window.plugin.myPlugin.requiredPlugins = [{  pluginKey: window.plugin.drawTools,  name: "draw tools"}, {  pluginKey: window.plugin.myotherplugin,  name: "My Other Plugin"}]...if (!window.helper.requiredPlugins.alertIfNotInstalled(window.plugin.myPlugin.requiredPlugins, plugin_info.script.name) {   return;}
```
<a name="window.plugin.portalsinpolygons(2)"></a>

## window.plugin.portalsinpolygons
Portals-in-Polygon namespace.  `self` is set to `window.plugin.portalsinpolygons`.

**Kind**: global variable  

* [window.plugin.portalsinpolygons](#window.plugin.portalsinpolygons(2))
    * [.requiredPlugins](#window.plugin.portalsinpolygons(2).requiredPlugins) : <code>Array.&lt;RequiredPluginMetaData&gt;</code>
    * [.layerChooserName](#window.plugin.portalsinpolygons(2).layerChooserName) : <code>Object.&lt;string, string&gt;</code>
    * [.bringPortalsToFront()](#window.plugin.portalsinpolygons(2).bringPortalsToFront)
    * [.displayPortals([getPortalsFn], [title])](#window.plugin.portalsinpolygons(2).displayPortals)
    * [.displayContainedPortals()](#window.plugin.portalsinpolygons(2).displayContainedPortals)
    * [.formattedPortalList(portals)](#window.plugin.portalsinpolygons(2).formattedPortalList) ⇒
    * [.getContainedPortals([keepPortalFn])](#window.plugin.portalsinpolygons(2).getContainedPortals) ⇒ <code>Object</code>
    * [.getLayerClassName(layer)](#window.plugin.portalsinpolygons(2).getLayerClassName) ⇒ <code>String</code>
    * [.getPortalGuidsFilteredByLayerGroup(portals)](#window.plugin.portalsinpolygons(2).getPortalGuidsFilteredByLayerGroup) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getPortalsInMapBounds([keepPortalFn])](#window.plugin.portalsinpolygons(2).getPortalsInMapBounds) ⇒ <code>Object</code>
    * [.getToolboxControls()](#window.plugin.portalsinpolygons(2).getToolboxControls) ⇒ <code>Object</code>
    * [.isPortalDisplayed(portal)](#window.plugin.portalsinpolygons(2).isPortalDisplayed) ⇒ <code>Object</code> &#124; <code>null</code>
    * [.mapZoomHasPortals()](#window.plugin.portalsinpolygons(2).mapZoomHasPortals) ⇒ <code>boolean</code>
    * [.setup()](#window.plugin.portalsinpolygons(2).setup)

<a name="window.plugin.portalsinpolygons(2).requiredPlugins"></a>

### window.plugin.portalsinpolygons.requiredPlugins : <code>Array.&lt;RequiredPluginMetaData&gt;</code>
An array of objects describing the required plugins.

**Kind**: static property of <code>[window.plugin.portalsinpolygons](#window.plugin.portalsinpolygons(2))</code>  
<a name="window.plugin.portalsinpolygons(2).layerChooserName"></a>

### window.plugin.portalsinpolygons.layerChooserName : <code>Object.&lt;string, string&gt;</code>
A assoicative array of layer chooser names.Used when calling `window.isLayerGroupDisplayed(<String> name)`.

**Kind**: static property of <code>[window.plugin.portalsinpolygons](#window.plugin.portalsinpolygons(2))</code>  
**Example**  
```js
window.isLayerGroupDisplayed(self.layerChooserName[portal.options.data.level])
```
<a name="window.plugin.portalsinpolygons(2).bringPortalsToFront"></a>

### window.plugin.portalsinpolygons.bringPortalsToFront()
Bring portals to the front of the draw layers so that you can click onthem after drawing a circle or polygon over the portals.<br>Thanks to Zaso's "Bring Portals To Front" at<a href="http://www.giacintogarcea.com/ingress/iitc/bring-portals-to-front-by-zaso.meta.js"> Zaso Items</a>.

**Kind**: static method of <code>[window.plugin.portalsinpolygons](#window.plugin.portalsinpolygons(2))</code>  
<a name="window.plugin.portalsinpolygons(2).displayPortals"></a>

### window.plugin.portalsinpolygons.displayPortals([getPortalsFn], [title])
Displays portals.  The portals are filtered based on selections in the layer chooser.<br>This function is generalized version of the `window.plugin.portalslist.displayPL` function.

**Kind**: static method of <code>[window.plugin.portalsinpolygons](#window.plugin.portalsinpolygons(2))</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [getPortalsFn] | <code>getPortalsCallback</code> |  | Optional. An callback function that returns an associative array of IITC 	portals. If the function is not provided or set to undefined, the portals in the current map bounds will be 	used. |
| [title] | <code>String</code> | <code>&quot;Portal List&quot;</code> | Optional. A title for the portal list dialog.  The default is "Portal list". |

<a name="window.plugin.portalsinpolygons(2).displayContainedPortals"></a>

### window.plugin.portalsinpolygons.displayContainedPortals()
Displays the portals contain in, and on the perimeter, of drawn polygonsand on any lines.

**Kind**: static method of <code>[window.plugin.portalsinpolygons](#window.plugin.portalsinpolygons(2))</code>  
<a name="window.plugin.portalsinpolygons(2).formattedPortalList"></a>

### window.plugin.portalsinpolygons.formattedPortalList(portals) ⇒
Gets and formats the portal information that will be used in the portal list display.<br>This function is based on a modified version of the`window.plugin.portalslist.getPortals` function.

**Kind**: static method of <code>[window.plugin.portalsinpolygons](#window.plugin.portalsinpolygons(2))</code>  
**Returns**: {Array<{portal:{Object}, values:{Array}, sortValues:{Array}>} Returns an array of	formatted portals.  

| Param | Type | Description |
| --- | --- | --- |
| portals | <code>Object</code> | An associative array of IITC portals. |

<a name="window.plugin.portalsinpolygons(2).getContainedPortals"></a>

### window.plugin.portalsinpolygons.getContainedPortals([keepPortalFn]) ⇒ <code>Object</code>
Returns an array of IITC portals contained in the polygons and circlesdrawn on the map.<br>Checks for layers of type L.Polygon, which includes L.GeodesicPolygonand L.GeodesicCircle, and L.Polyline, which in L.GeodesicPolyline.

**Kind**: static method of <code>[window.plugin.portalsinpolygons](#window.plugin.portalsinpolygons(2))</code>  
**Returns**: <code>Object</code> - A collection of IITC portals.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [keepPortalFn] | <code>keepPortalCallback</code> &#124; <code>true</code> &#124; <code>false</code> | <code>window.plugin.portalsinpolygons.isPortalDisplayed</code> | If a callback function is  provided, it will be called and passed the IITC portal object. If keepPortalFn is not a function and is set to  something falsy, the portals will not be filtered.  If keepPortalCallback is not provided, explicitly 	undefined, or something truthy, then the default filtering will be  performed which is to filter portals based on the layer group selections of "Unclaimed Portals", 	"Level 1 Portals" to "Level 8 Portals", "Enlightened" and "Resistance". |

<a name="window.plugin.portalsinpolygons(2).getLayerClassName"></a>

### window.plugin.portalsinpolygons.getLayerClassName(layer) ⇒ <code>String</code>
Returns a string representation of the layer class (e.g., "L.GeodesicPolygon" and "L.Marker").

**Kind**: static method of <code>[window.plugin.portalsinpolygons](#window.plugin.portalsinpolygons(2))</code>  
**Returns**: <code>String</code> - A string representation of the layer class.  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>L.Layer</code> | An object whose class extends L.Layer. |

<a name="window.plugin.portalsinpolygons(2).getPortalGuidsFilteredByLayerGroup"></a>

### window.plugin.portalsinpolygons.getPortalGuidsFilteredByLayerGroup(portals) ⇒ <code>Array.&lt;string&gt;</code>
Returns a set of guids belonging to the portals filtered by the layer group selections of"Unclaimed Portals", "Level 1 Portals" to "Level 8 Portals", "Enlightened" and "Resistance".

**Kind**: static method of <code>[window.plugin.portalsinpolygons](#window.plugin.portalsinpolygons(2))</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - An array of portal guids.  

| Param | Type | Description |
| --- | --- | --- |
| portals | <code>Object</code> | An associative array of IITC portal objects. |

<a name="window.plugin.portalsinpolygons(2).getPortalsInMapBounds"></a>

### window.plugin.portalsinpolygons.getPortalsInMapBounds([keepPortalFn]) ⇒ <code>Object</code>
Returns the portals within the displayed map boundaries.

**Kind**: static method of <code>[window.plugin.portalsinpolygons](#window.plugin.portalsinpolygons(2))</code>  
**Returns**: <code>Object</code> - An associative array of IITC portal objects (a subset of `window.portals`).  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [keepPortalFn] | <code>keepPortalCallback</code> &#124; <code>true</code> &#124; <code>false</code> | <code>self.isPortalDisplayed</code> | If a callback function is  provided, it will be called and passed the IITC portal object. If keepPortalFn is not a function and is set to  something falsy, the portals will not be filtered.  If keepPortalCallback is not provided, explicitly 	undefined, or something truthy, then the default filtering will be  performed which is to filter portals based on the layer group selections of "Unclaimed Portals", 	"Level 1 Portals" to "Level 8 Portals", "Enlightened" and "Resistance". |

<a name="window.plugin.portalsinpolygons(2).getToolboxControls"></a>

### window.plugin.portalsinpolygons.getToolboxControls() ⇒ <code>Object</code>
Returns the DOM elements containing the plugin controls to be appended to the IITC toolbox.<br>Controls from other plugins with class "wise-toolbox-control" or "wise-toolbox-control-section" will be groupedinto one subsection (same div tag).

**Kind**: static method of <code>[window.plugin.portalsinpolygons](#window.plugin.portalsinpolygons(2))</code>  
**Returns**: <code>Object</code> - DOM elements.  
<a name="window.plugin.portalsinpolygons(2).isPortalDisplayed"></a>

### window.plugin.portalsinpolygons.isPortalDisplayed(portal) ⇒ <code>Object</code> &#124; <code>null</code>
Returns the portal if it is displayed based on the the layer group selections of "Unclaimed Portals","Level 1 Portals" to "Level 8 Portals", "Enlightened" and "Resistance".  Returns null if it is notdisplayed.

**Kind**: static method of <code>[window.plugin.portalsinpolygons](#window.plugin.portalsinpolygons(2))</code>  
**Returns**: <code>Object</code> &#124; <code>null</code> - The IITC portal object or null.  

| Param | Type | Description |
| --- | --- | --- |
| portal | <code>Object</code> | An IITC portal object. |

<a name="window.plugin.portalsinpolygons(2).mapZoomHasPortals"></a>

### window.plugin.portalsinpolygons.mapZoomHasPortals() ⇒ <code>boolean</code>
Checks if there is sufficient portal data for the current map zoom.  When the zoom is set very far,`window.portals` will only contain placeholder data and may not contain the portal title and otherinformation.

**Kind**: static method of <code>[window.plugin.portalsinpolygons](#window.plugin.portalsinpolygons(2))</code>  
**Returns**: <code>boolean</code> - True if there is sufficient portal data; otherwise, returns false.  
**Todo**

- [ ] it might be easier to check if one of the portals has the data your are looking for (e.g., check if portal.options.data.title exists).

<a name="window.plugin.portalsinpolygons(2).setup"></a>

### window.plugin.portalsinpolygons.setup()
Setup function called by IITC.

**Kind**: static method of <code>[window.plugin.portalsinpolygons](#window.plugin.portalsinpolygons(2))</code>  
<a name="ScriptInfo"></a>

## ScriptInfo : <code>Object</code>
Greasemonkey/Tampermonkey information about the plugin.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| version | <code>String</code> | This is set to GM_info.script.version. |
| name | <code>String</code> | This is set to GM_info.script.name. |
| description | <code>String</code> | This is set to GM_info.script.description. |

<a name="PluginInfo"></a>

## PluginInfo : <code>Object</code>
Plugin information which includes the Greasemonkey/Tampermonkey information about the plugin.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| script | <code>[ScriptInfo](#ScriptInfo)</code> | Greasemonkey/Tampermonkey information about the plugin. |

<a name="external_window.map"></a>

## window.map
The IITC map object (a Leaflet map).

**Kind**: global external  
**See**: [Ingress Intel Total Conversion](https://iitc.me/)  
<a name="external_window.portals"></a>

## window.portals : <code>Object.&lt;string, Object&gt;</code>
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
