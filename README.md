# iitc-portalsinpolygons
IITC plugin for displaying a list of portals in polygons and circles, and their perimeter, and on lines.
The Portals-in-Polygon is a plugin for the [Ingress Intel Total Conversion](https://iitc.me/) web application and is used to 
display a list of portals in, and on the edges of, polygons and circles.  It wil also display the list of portals on lines.

The plugin also provides the ability to bring portals to the front draw layer so that you can click on them after drawing a 
circle or polygon over them.

![Portals-in-Polygon controls](https://github.com/hayeswise/iitc-portalsinpolygon/raw/master/docs/portals-in-polygons-ui.png)

See the [Wiki](https://github.com/hayeswise/iitc-portalsinpolygon/wiki) for the API and a user guide on creating your own customizations.

# Prerequistites
* IITC ([https://IITC.me](https://iitc.me/))
* IITC plugin: draw tools
* IITC plugin: show list of portals

# Installation
Currently, access to this plugin is for Ingress Resistance agents on an invite-only basis.  Contact me, Hayeswise, with your GitHub account.

I recommend you install Tampermonkey if you are using Chrome or Greasemonkey if you are using Firefox.

Download the latest version [**here**](https://github.com/hayeswise/iitc-portalsinpolygons/raw/master/wise-portalsinpolygons.user.js).  Tampermonkey or Greasemonkey will provide the install/reinstall page.  Click the install/reinstall button.

## Updating
If the plugin is already installed, it's easy to update in most cases.  Either click on the download link, above, or follow the these instructions from the IITC website:

### Chrome and Tampermonkey

_Open the Tampermonkey menu and choose "Check for userscript updates". If you have a lot of plugins, or other scripts installed, this can be a little slow. Wait 30 seconds, then try clicking the Tampermonkey icon again; if the menu opens, it's finished updating. Once complete, reload the Ingress intel map to use the new version._

### Firefox and Greasemonkey

_Open the Greasemonkey menu and choose "Manage user scripts". Now click the cog icon and choose "Check for updates". However, sometimes Greasemonkey fails to update all scripts. Check the date+time listed at the start of the description (e.g. "[jonatkins-2013-08-23-042102]") and if any have failed to update then manually download from the list below. Once updated, reload the Intel map and the new version will be active._

# Related IITC Plugins
Portals-in-Polygons is a psuedo extension of the "show list of portals" (a.k.a. portal-list) IITC plugin.  I've created generalized
versions of some of 
the "show list of portals" functions that I hope to incorporate into that code base, time permitting.  As of this writing, McBen 
provided a fix [Portals-list fix #1169](https://github.com/iitc-project/ingress-intel-total-conversion/compare/master...McBen:portals_list_fix) and some refactoring/generalization to the portal-list plugin.  It appears that
we may have been developing our solutions in parallel.

# Acknowledgements
The solutions uses the following:

* Dan Sunday's [Winding Number and isLeft C++](http://geomalgorithms.com/a03-_inclusion.html) implementation. [Copyright and License]( http://geomalgorithms.com/a03-_inclusion.html).
* [IITC - Ingress Intel Total Conversion](https://iitc.me/) and on [GitHub](https://github.com/iitc-project/ingress-intel-total-conversion).  [License](https://github.com/iitc-project/ingress-intel-total-conversion/blob/master/LICENSE)
* [Leaflet.Geodesic](https://github.com/Fragger/Leaflet.Geodesic) by Kevin Brasier (a.k.a. Fragger). [License](https://github.com/Fragger/Leaflet.Geodesic/blob/master/LICENSE).  Note that IITC uses a customized version of Leaflet.Geodesic that inlcudes additional classes.  See the IITC distribution of the L.Geodesc.js in GitHub.
* [Leaflet](http://leafletjs.com/) - "an open-source JavaScript library for mobile-friendly interactive maps."
* "show list of portals" (a.k.a. portal-list) IITC plugin by [teo96](https://github.com/teo96), et al.

Also, thanks to
* [billplaysonline](https://github.com/billplaysonline) for posting issue [portals-list #1161](https://github.com/iitc-project/ingress-intel-total-conversion/issues/1161) and providing sample code
* [McBen] for function `mapZoomHasPortals` in [Portals-list fix #1169](https://github.com/iitc-project/ingress-intel-total-conversion/compare/master...McBen:portals_list_fix).
