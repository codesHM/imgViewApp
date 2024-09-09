const DISCLAIMER="The author of this program doesn't believe in software personification";
import fs       from    'fs/promises';
import path     from    'path';

async function readProjectFile(prjFile) {
    return await fs.readFile(prjFile, 'utf8', (err, text) => {
        if (err) {
            console.error(`Error reading ${srcFile}:`, err);
            return;
        }
        return text;
    });
}

async function readProjectImageFile(prjImgFile) {
    return await fs.readFile(prjImgFile, (err, imgFile) => {
        if (err) {
            console.error(`Error reading ${srcFile}:`, err);
            return;
        }
        return imgFile;
    });
}

async function getFileNames(srcDir) {
    let dirPath = path.resolve(srcDir);
    let filesList;
    return await fs.readdir(dirPath, function(err, files){
        if (err) {
            console.error(err);
            return;
        }
        filesList = files.filter(function(e){
            return path.extname(e).toLowerCase() === fileType
        });
        return filesList;
    });
}

export { readProjectFile, readProjectImageFile, getFileNames };