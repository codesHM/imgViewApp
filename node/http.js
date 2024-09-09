const DISCLAIMER="The author of this program doesn't believe in software personification";
import { readProjectFile        } from './diskRW.js';
import { readProjectImageFile   } from './diskRW.js';
import { getFileNames           } from './diskRW.js';

import http     from    'http';
import fsMain   from    'fs';
const PORT          =   9704;

const txtSrcFile    =   {
    'baseHTML'      :     `main.html`,
    'javascript1'   :     `javascript/script.js`,
    'css1'          :     `css/style.css`,
    'css2'          :     `css/responsiveBehavior.css`
};

const txtFileBase   =   '../web-files'
const txtSrcFileAtDiskLocation =   [
    `${txtFileBase}/${txtSrcFile.baseHTML}`,
    `${txtFileBase}/${txtSrcFile.javascript1}`,
    `${txtFileBase}/${txtSrcFile.css1}`,
    `${txtFileBase}/${txtSrcFile.css2}`
];

const webRouteBase  =   '/';

const txtSrcFileAtWebPath   =   [
    `${webRouteBase}${txtSrcFile.baseHTML}`,
    `${webRouteBase}${txtSrcFile.javascript1}`,
    `${webRouteBase}${txtSrcFile.css1}`,
    `${webRouteBase}${txtSrcFile.css2}`
];

const imgFileBase   =  [`../web-files`,`/u01/Images`];
const imgSrcFileLocations    = [
    {0 : {base:imgFileBase[1], dir:'imageViewApp-SampleImages'}},
    {1 : {base:imgFileBase[0], dir:'img-src'}}
];

let imgSrcFileAtDiskLocation = [];
let imgSrcFileAtWebLocation  = [];
const imgSrcWebBaseName      = 'img-src';
for (let i=0;i<imgSrcFileLocations.length; i++) {
    let imagesAtLocation = `${imgSrcFileLocations[i][i].base}/${imgSrcFileLocations[i][i].dir}`;
    let imgFileNames =  await getFileNames(imagesAtLocation);
    for (let k=0;k<imgFileNames.length;k++) {
        imgSrcFileAtDiskLocation.push(`${imgSrcFileLocations[i][i].base}/${imgSrcFileLocations[i][i].dir}/${imgFileNames[k]}`);
        imgSrcFileAtWebLocation.push(`/${imgSrcWebBaseName}/${imgSrcFileLocations[i][i].dir}/${imgFileNames[k]}`);
    }
}
const baseHTMLFile  =   await readProjectFile(txtSrcFileAtDiskLocation[0]);
const jsFile        =   await readProjectFile(txtSrcFileAtDiskLocation[1]);
const cssFile       =   await readProjectFile(txtSrcFileAtDiskLocation[2]);
const respCssFile   =   await readProjectFile(txtSrcFileAtDiskLocation[3]);

const imgSrcFileWebPath     =   `${webRouteBase}${imgSrcWebBaseName}`;
const imgCriteria           =   `\/${imgSrcWebBaseName}\/[A-z|1-9][A-z|0-9|\\-|_]*\/[A-z|1-9][A-z|0-9|\\-|%|_]*[.](jpg|png|bmp)`;
const imgRtRegExp           =   new RegExp(imgCriteria,'g');

const webReadyImgFileNames  = JSON.stringify(imgSrcFileAtWebLocation);

let tmpImgArr=[];
for (let i=0;i<imgSrcFileAtDiskLocation.length; i++) {
    let tmp = await readProjectImageFile(imgSrcFileAtDiskLocation[i]);
    tmpImgArr.push(tmp);
}
const imgFiles = tmpImgArr;

http.createServer(function(request, response) {
    if(request.url === '/') {
        response.writeHead(200, {"Content-Type": "text/HTML"});
        response.write(baseHTMLFile);
    } else if(request.url === `/${txtSrcFile.javascript1}`) {
        response.writeHead(200, {"Content-Type": "text/javascript"});
        response.write(jsFile);
    } else if (request.url === `/${txtSrcFile.css1}`) {
        response.writeHead(200, {"Content-Type": "text/css"});
        response.write(cssFile);
    } else if (request.url === `/${txtSrcFile.css2}`) {
        response.writeHead(200, {"Content-Type": "text/css"});
        response.write(respCssFile);
    } else if (request.url === `/file-names`) {
        response.write(webReadyImgFileNames);
    }
    else {
        response.writeHead(200, {"Content-Type": "image/jpg"});
        for (let i = 0; i < imgSrcFileAtWebLocation.length; i++) {
            if (imgSrcFileAtWebLocation[i].replace(/\s/g,'%20') === request.url) {
                // console.log(`imgSrcFileAtWebLocation[i]: ${imgSrcFileAtWebLocation[i]} `);
                response.write(imgFiles[i]);
            }
        }
    }
    response.end();
}).listen(PORT);
