// Add a new button(s) to load track file(s) from the server /dist/*
import { FileLoadManager, MultipleTrackFileLoad, createGenericSelectModal } from '../node_modules/igv-widgets/dist/igv-widgets.js'

const createTrackServerModal = id => {

    const html =
        `<div id="${ id }" class="modal">

            <div class="modal-dialog modal-lg">
    
                <div class="modal-content">
    
                    <div class="modal-header">
                        <div class="modal-title">Select Track File</div>
    
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
    
                    </div>
    
                    <div class="modal-body">
                    <button id="goBackButton" class="btn btn-sm btn-outline-secondary" onclick="goBack()">Go Back</button>
                    <ul id="fileList"></ul>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-sm btn-outline-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">OK</button>
                    </div>
    
                </div>
    
            </div>

        </div>`;

    const fragment = document.createRange().createContextualFragment(html);

    return fragment.firstChild;

}; 

// Function to fetch the list of files
window.fetchFileList = async function(path = '') {
    fetch(`/dist${path}`)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data, 'text/html');
      const files = htmlDoc.querySelectorAll('a');
      const fileList = document.getElementById('fileList');
      fileList.innerHTML = '';

      const goBackButton = document.getElementById('goBackButton');
      if (path) {
        // Show the "Go Back" button if not in the root directory
        goBackButton.style.display = 'block';
        goBackButton.setAttribute('data-path', path);
      } else {
        // Hide the "Go Back" button if in the root directory
        goBackButton.style.display = 'none';
      }

      files.forEach(file => {
        const li = document.createElement('li');
        const filePath = path + '/' + file.textContent.trim();
        li.innerHTML = `<a href="#" onclick="fetchFileList('${filePath}'); return false;">${file.textContent}</a>`;
        fileList.appendChild(li);
      });
    })
    .catch(error => console.error('Error fetching file list:', error));
}

// Function to navigate back to the parent directory
window.goBack = function() {
    const goBackButton = document.getElementById('goBackButton');
    const currentPath = goBackButton.getAttribute('data-path');
    const parentPath = currentPath.split('/').slice(0, -1).join('/');
    fetchFileList(parentPath);
  }

function loadTracksFromServerWithRegistry (
    $igvMain,
    $dropdownMenu,
    $localFileInput,
    initializeDropbox,
    $dropboxButton,
    googleEnabled,
    $googleDriveButton,
    encodeTrackModalIds,
    trackFromServerModalId,
    selectModalIdOrUndefined,
    GtexUtilsOrUndefined,
    trackRegistryFile,
    trackLoadHandler
) {
    const trackFromServerModal = createTrackServerModal(trackFromServerModalId);
    fetchFileList();
    $igvMain.get(0).appendChild(trackFromServerModal);
    //populateSelect("select-track-file-from-server", "http://localhost:8080/tests/"); 

    /*
    const fileLoadWidgetConfig = {
        widgetParent: urlModal.querySelector('.modal-body'),
        dataTitle: 'Track',
        indexTitle: 'Index',
        mode: 'url',
        fileLoadManager: new FileLoadManager(),
        dataOnly: false,
        doURL: false 
    };

    //TODO: Check and change
    const fileLoadWidget = new FileLoadWidget(fileLoadWidgetConfig);

    configureModal(fileLoadWidget, urlModal, async (fileLoadWidget) => {
        const paths = fileLoadWidget.retrievePaths();
        await multipleTrackFileLoad.loadPaths(paths);
        return true;
    });
    */

    /*
    const multipleTrackFileLoadConfig = {
        $localFileInput,
        initializeDropbox,
        $dropboxButton,
        $googleDriveButton: googleEnabled ? $googleDriveButton : undefined,
        fileLoadHandler: trackLoadHandler,
        multipleFileSelection: true
    };

    const multipleTrackFileLoad = new MultipleTrackFileLoad(multipleTrackFileLoadConfig);
    */

/*    const encodeModalTables = [];
    for (let modalID of encodeTrackModalIds) {
        const encodeModalTableConfig = {
            id: modalID,
            title: 'ENCODE',
            selectionStyle: 'multi',
            pageLength: 100,
            okHandler: trackLoadHandler
        };

        encodeModalTables.push(new ModalTable(encodeModalTableConfig));
    }

    if (selectModalIdOrUndefined) {
        const $genericSelectModal = $(createGenericSelectModal(selectModalIdOrUndefined, `${selectModalIdOrUndefined}-select`));
        $igvMain.append($genericSelectModal);

        const $select = $genericSelectModal.find('select');
        const $dismiss = $genericSelectModal.find('.modal-footer button:nth-child(1)');
        const $ok = $genericSelectModal.find('.modal-footer button:nth-child(2)');

        $dismiss.on('click', () => $genericSelectModal.modal('hide'));

        const okHandler = () => {
            const configurations = [];
            const $selectedOptions = $select.find('option:selected');

            $selectedOptions.each(function () {
                configurations.push($(this).data('track'));
                $(this).removeAttr('selected');
            });

            if (configurations.length > 0) {
                trackLoadHandler(configurations);
            }

            $genericSelectModal.modal('hide');
        };

        $ok.on('click', okHandler);

        $genericSelectModal.get(0).addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                okHandler();
            }
        });
    }
    */
}

export {loadTracksFromServerWithRegistry};