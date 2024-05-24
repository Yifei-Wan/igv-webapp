# Dev Note

## Original version
igv-webapp v2.13.5

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
1.Add new modal for `load from Server` to the function [createTrackWidgetsWithTrackRegistry](https://github.com/igvteam/igv-widgets/blob/v1.5.4/dist/igv-widgets.js#L11235)
  Create a local `createTrackWidgetWithRegistry` for `Load from Server` only. Don't override the imported one. -> Done 
2. Get the track file list from the URL. -> Done
3. Create New input container for selected track file.