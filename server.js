var config = require('./config')
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
//const PORT = process.env.PORT || 8080;
const PORT = config.port;
const ROOT = config.default_root;

// Function to serve files or directories
function serveFileOrDirectory(req, res, next) {
  const filePath = path.join(__dirname, ROOT, req.params[0]);

  // Check if the requested path exists
  fs.stat(filePath, (err, stats) => {
    if (err) {
      // Handle error if the file or directory does not exist
      console.error("Error accessing file or directory:", err);
      res.status(404).send('File or directory not found');
      return;
    }

    if (stats.isFile()) {
      // If the requested path is a file, serve it
      res.sendFile(filePath);
    } else if (stats.isDirectory()) {
      // If the requested path is a directory, serve its file listing
      fs.readdir(filePath, (err, files) => {
        if (err) {
          // Handle error if the directory cannot be read
          console.error("Error reading directory:", err);
          res.status(500).send('Internal Server Error');
          return;
        }

        // Extract the directory name from the request URL
        const directoryName = req.params[0] || ROOT; // Use ROOT if no directory name is provided

        // Generate HTML for the file listing with the correct directory name
        let html = `<h1>File Listing of ${directoryName}</h1><ul>`;
        files.forEach(file => {
          const fileUrl = path.join(req.params[0], file);
          html += `<li><a href="/dist/${fileUrl}">${file}</a></li>`;
        });
        html += '</ul>';

        // Send the HTML response with the file listing
        res.send(html);
      });
    } else {
      // If the requested path is neither a file nor a directory, return a 404 error
      res.status(404).send('File or directory not found');
    }
  });
}

// Serve files or directories for all routes under '/dist/*'
app.get('/dist/*', serveFileOrDirectory);

// Serve the files from the ROOT directory
app.use('/dist', express.static(path.join(__dirname, ROOT)));

// Serve static files from the ROOT directory
app.use(express.static(path.join(__dirname, ROOT)));

// Endpoint to check if a path is a file or directory
app.get('/isFileOrDirPath', async (req, res) => {
  const filePath = req.query.filePath;
  const absolutePath = path.join(__dirname, filePath);
  try {
      const stats = await fs.statSync(absolutePath);
      if (stats.isFile()) {
          res.send({ filePath, type: 'file' });
      } else if (stats.isDirectory()) {
          res.send({ filePath, type: 'dir' });
      } else {
          res.status(400).send({ error: `${absolutePath} Not a valid file or directory`});
      }
  } catch (error) {
      res.status(500).send({ error: `Error checking file or directory ${absolutePath}`});
  }
});

// Serve index.html as the default page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
