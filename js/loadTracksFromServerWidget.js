let selectedFileUrl = '';

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

window.fetchFileList = async function(path = '') {
    console.info("Fetch input path: ", path);
    try {
        if (path === '') {
            path = `/dist`;
        };
        console.info("Current work diretory: ", path);
        const response = await fetch(path);
        const data = await response.text();
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, 'text/html');
        const files = htmlDoc.querySelectorAll('a');
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';

        const goBackButton = document.getElementById('goBackButton');
        if (path !== '/dist') {
            // Show the "Go Back" button if not in the root directory
            goBackButton.style.display = 'block';
            goBackButton.setAttribute('data-path', path);
        } else {
            // Hide the "Go Back" button if in the root directory
            goBackButton.style.display = 'none';
        }
        if (path === "/dist") { // In the ROOT, only shows data directory
            const li = document.createElement('li');
            const filePath = path + '/' + 'data';
            li.innerHTML = `<a href="#" data-url="${filePath}" onclick="selectFile('${filePath}'); return false;">data</a>`;
            fileList.appendChild(li);
        } else {
            files.forEach(file => {
                const li = document.createElement('li');
                const filePath = path + '/' + file.textContent.trim();
                li.innerHTML = `<a href="#" data-url="${filePath}" onclick="selectFile('${filePath}'); return false;">${file.textContent}</a>`;
                fileList.appendChild(li);
        });
        }
    } catch (error) {
        console.error('Error fetching file list:', error);
    }
}

// Function to navigate back to the parent directory
window.goBack = function() {
    const goBackButton = document.getElementById('goBackButton');
    const currentPath = goBackButton.getAttribute('data-path');
    console.info("Current path: ", currentPath);
    const parentPath = currentPath.split('/').slice(0, -1).join('/');
    console.info("Parient path: ", parentPath);
    fetchFileList(parentPath);
}

// Function to check the path is file or directory
async function isFileOrDirPath(filePath) {
    try {
        const response = await fetch(`/isFileOrDirPath?filePath=${encodeURIComponent(filePath)}`);
        const data = await response.json();
        return data.type; // Return the type ('file' or 'dir')
    } catch (error) {
        console.error('Error checking file or directory:', error);
        throw error; // Handle the error as needed
    }
}

window.selectFile = async function(filePath) {
        // TODO: Add multiple tracks support
        selectedFileUrl = ''; // clear filePath 
        try {
            const type = await isFileOrDirPath(filePath);
            if (type === 'dir') {
                // If it's a directory, fetch and display its contents
                fetchFileList(filePath);
            } else if (type === 'file') {
                // If it's a file, set it as the selected file
               selectedFileUrl = filePath;
                // Visually indicate the selected file, e.g., by adding a class
                const fileLinks = document.querySelectorAll('#fileList a');
                fileLinks.forEach(link => {
                    if (link.getAttribute('data-url') === filePath) {
                        link.classList.add('selected'); // Add a class to the selected link
                    } else {
                        link.classList.remove('selected'); // Remove the class from non-selected links
                    }
                });
            } else {
                console.error('Invalid type:', filePath);
                console.error('Invalid type:', type);
            }
        } catch (error) {
            console.error('Error selecting file:', error);
        }
    }

function handleOkClick(trackLoadHandler) {
    return function() {
        console.info('Selected Track file URL:', selectedFileUrl);
        const configurations = [];
        if (selectedFileUrl) {
            configurations.push({"url": selectedFileUrl});
            // Clear the selectedFileUrl and remove 'selected' class
            selectedFileUrl = '';
            const fileLinks = document.querySelectorAll('#fileList a.selected');
            fileLinks.forEach(link => {
                link.classList.remove('selected');
            });
            // Load track file(s)
            if (configurations.length > 0) {
                trackLoadHandler(configurations);
            }
        } else {
            console.log('No files selected.');
        }
    }
}

function loadTracksFromServerWidget(
    $igvMain,
    trackFromServerModalId,
    trackLoadHandler
) {
    const trackFromServerModal = createTrackServerModal(trackFromServerModalId);
    fetchFileList();
    $igvMain.get(0).appendChild(trackFromServerModal);

    const okHandler = handleOkClick(trackLoadHandler);

    const $ok = $('.modal-footer').find('.btn.btn-sm.btn-secondary[data-dismiss="modal"]');
    $ok.on('click', okHandler);
}

export { loadTracksFromServerWidget };
