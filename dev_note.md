# Dev Note
## New Feature
See ticket `BXMD-191`

## Solution
### Add button
Add new dropdown item `Load from Server` to `Tracks` block of `index.html`.

### Update backend JS
#### igv-widgets
- Version: 
  v1.5.4
- Changes:
Add new button object to the function [createTrackWidgetsWithTrackRegistry](https://github.com/igvteam/igv-widgets/blob/v1.5.4/dist/igv-widgets.js#L11235)

#### jgv-webapp
- app.js
Update input parameters accordingly of the function [createTrackWidgetsWithTrackRegistry]
https://github.com/igvteam/igv-webapp/blob/v2.13.5/js/app.js#L182

