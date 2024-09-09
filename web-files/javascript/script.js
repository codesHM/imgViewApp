//Author of this program isn't affiliated politically/religiously to any particular group
//Author of this program doesn't believe in software personification
//Program Author: Hasnain Malik
//Program Code Written on: 08-28-2024
//Most Recent Modification to Program Code: 09-07-2024
//---------------------------------------------------------------------
const html_page_title       = 'Test Specific Software Web Development Technologies';
const html_body_page_title  = 'ImageView Utility';
const placeHolderImg        = 'Rizaulver.jpg';
let imgTransformVal         = 0;
let navBtnInitText          = "شُروع";
let nextNavBtnText          ="بقیہ";
let prevNavBtnText          ="گزشتہ";
let images                  = null;
let name1                   = null;
let name2                   = null;
let imageSelector           = null;
let prevBtn                 = null;
let nextBtn                 = null;
let intrvl                  = setInterval(selfStart, 5000);
let imgRef                  = 0;
let img1DescRef             = 0;
let img2DescRef             = 1;
let imagesName              = [];
let imageDesc               = [];
let viewImgResolveSet       = [];
let imgDescResolveSet       = [];
let actualImagesCheck       = false;
let initializeCall          = true;

//------------------------------------------------------------------

document.body.onload   = function()  {
    whenPageLoadHappens();
}
//------------------------------------------------------------------
async function whenPageLoadHappens() {
    await getImageFilesFromSource();
    initHTMLTexts();
    images        = document.getElementById('images');
    name1         = document.getElementById('name1');
    name2         = document.getElementById('name2');
    document.getElementById('prevBtn').addEventListener('click', prevNavBtnCmd);
    document.getElementById('nextBtn').addEventListener('click', nextNavBtnCmd);
    window.addEventListener('resize', screenSizeChanged);
    initialize();
}
//------------------------------------------------------------------
async function getImageFilesFromSource() {
    let imgFileNames;
    let url = '/file-names';
    let response = await fetch(url);
    if (response.ok) { // if HTTP-status is 200-299
        imgFileNames = await  response.json();
        for (let i=0;i<imgFileNames.length;i++) {
            // imagesName.push((imgFileNames[i].split('.'))[0]);
            imagesName.push(imgFileNames[i]);
            if (i<imgFileNames.length-1) {
                imageDesc.push(((imgFileNames[i].split('.'))[0]).split('/').slice(-1)[0]);
            } else {
                imageDesc.push('');
            }

        }
    } else {
        alert("HTTP-Error: " + response.status);
    }
}
//------------------------------------------------------------------
function initHTMLTexts() {
    htmlHeadText();
    htmlBodyText();
}
//------------------------------------------------------------------
function htmlHeadText() {
    document.head.innerHTML += `
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${html_page_title}</title>
        <link rel="stylesheet" href="css/style.css">
        <link rel="stylesheet" href="css/responsiveBehavior.css">
    `;
}
//------------------------------------------------------------------
function htmlBodyText() {
    document.body.innerHTML = `
     <div class="page-title">
        <h1>${html_body_page_title}</h1>
    </div>

    <div class="image-viewer-implementation" id="image-viewer-implementation">
        <div class="img-names" id="image-names"></div>
        <div class="nav-items" id="nav-item-prev">
            <button class="btn" id="prevBtn">  </button>
        </div>

        <div class="image-viewer" id="image-viewer">
            <div class="images" id="images"> </div>
        </div>

        <div class="name-items" id="name-items">
            <div class="name-item1">
                <a class="name1" id="name1">  </a>
            </div>
            <div class="name-item2">
                <a class="name2" id="name2">  </a>
            </div>
        </div>

        <div class="nav-items" id="nav-item-next">
            <button class="btn" id="nextBtn">  </button>
        </div>
    </div>
    `;
}
//------------------------------------------------------------------
function makeResolveSetEven() {
    let imageSet = [imagesName,imageDesc];
    let resolveSet = [viewImgResolveSet, imgDescResolveSet];

    let arrLength = imageSet[0].length;

    if (arrLength % 2 !== 0) {
        for (let i=0;i<imageSet.length; i++) {
            for (let k=0;k<imageSet[i].length; k++) {
                let RegEx = ((imageSet[i][k]).split('/').slice(-1)[0]);
                if (RegEx !== placeHolderImg) {
                    resolveSet[i].push(imageSet[i][k]);
                }
            }
        }
    } else {
        for (let i=0;i<imageSet.length; i++) {
            for (let k=0;k<imageSet[i].length; k++) {
                resolveSet[i].push(imageSet[i][k]);
                }
            }
        }
}
//------------------------------------------------------------------
function imgPlacementResolve() {
    makeResolveSetEven();
    let resolveSet  = [viewImgResolveSet, imgDescResolveSet];

    for(let ref=0;ref<2;ref++) {
        let arrLength   = resolveSet[ref].length;
        let tempArr     = [];
        for(let a=0;a<(arrLength/2);a++) {
            tempArr.push(resolveSet[ref][2*a+1]);
            tempArr.push(resolveSet[ref][2*a]);
        }
        resolveSet[ref].length=0;
        for(let i=0;i<arrLength;i++) { resolveSet[ref].push(tempArr[i]); }
    }
}

//------------------------------------------------------------------
function getImagesInMemory() {
    imgPlacementResolve();
    let imageQuerySelector = document.querySelector('.images');

    viewImgResolveSet.forEach((image) => {
        let imgElement = document.createElement('img');
        // imgElement.src = image + imageType;
        imgElement.src = image;
        imageQuerySelector.appendChild(imgElement);
    });

    imageSelector = document.querySelectorAll('.images img');
    if (imageSelector.length > 0) {
        actualImagesCheck = true;
    }
}

//------------------------------------------------------------------
function changeImage(transformFactor){
    if(imgRef === (imageSelector.length)/2) {
        imgRef=0;
        img1DescRef=0;
        img2DescRef=1;
    } else if(imgRef < 0){
        imgRef=viewImgResolveSet.length / 2 - 1;
        img1DescRef=imgDescResolveSet.length - 2;
        img2DescRef=imgDescResolveSet.length - 1;
    }
    name1.innerText = imgDescResolveSet[img1DescRef];
    name2.innerText = imgDescResolveSet[img2DescRef];

    changeImageSize();
}
//------------------------------------------------------------------
function changeImageSize() {
    imgTransformVal = Number(document.documentElement.clientWidth);
    document.getElementById('image-viewer').style.width=imgTransformVal+'px';
    images.style.transform = `translateX(${-imgRef * imgTransformVal}px)`;
    let displayedImages=images.getElementsByTagName('img');
    for (let ref=0;ref<displayedImages.length; ref++)
    { displayedImages[ref].style.width = imgTransformVal/2 + 'px'; }
}
//------------------------------------------------------------------
function selfStart() {
    if(initializeCall === true){
        previousImageSet();
    } else {
        nextImageSet();
    }
}
//------------------------------------------------------------------
function nextImageSet() {
    if ((imageSelector === null)&&(actualImagesCheck === false))
    {
        initialize();
    }
    else if(actualImagesCheck === true){
            imgRef++;
            img1DescRef+=2;
            img2DescRef+=2;
            changeImage();
    }
    reportNewHeightAndWidth();
}
//------------------------------------------------------------------
function previousImageSet() {
    if ((imageSelector !== null)&&(actualImagesCheck === true)) {
        if (initializeCall === true) {
            let imgViewerImplementation = document.getElementById('image-viewer-implementation');
            let imgNameItems=document.getElementById('name-items');
            imgViewerImplementation.style.visibility = 'visible';
            prevBtn=document.getElementById('prevBtn');
            nextBtn=document.getElementById('nextBtn');
            prevBtn.innerText=prevNavBtnText;
            nextBtn.innerText=nextNavBtnText;
            nextBtn.style.visibility = 'visible';
            prevBtn.style.height='auto';
            prevBtn.style.width='100%';
            nextBtn.style.width='100%';
            nextBtn.style.height='auto';
            imgNameItems.style.height='3vh';
            name1.innerText=imgDescResolveSet[0];
            name2.innerText=imgDescResolveSet[1];
            initializeCall=false;
        } else {
            imgRef--;
            img1DescRef -= 2;
            img2DescRef -= 2;
            changeImage();
        }
    }
    reportNewHeightAndWidth();
}
//------------------------------------------------------------------
function resetInterval() {
    clearInterval(intrvl);
    intrvl = setInterval(nextImageSet, 2000);
}

// -------------------------------------------------------------------
function nextNavBtnCmd() {
    if ((viewImgResolveSet.length === 0) || (imgDescResolveSet.length === 0)) {
        initialize();
    }
    else {
        nextImageSet();
        resetInterval();
    }
}
//------------------------------------------------------------------
function prevNavBtnCmd() {
    if (imageSelector !== null ) {
        previousImageSet();
    }
    resetInterval();
}
//------------------------------------------------------------------
function initialize() {

    let navBtn = document.getElementById('prevBtn');

    getImagesInMemory();
    changeImageSize();
    if(actualImagesCheck === true) {
        navBtn.style.visibility='visible';
        navBtn.innerText=navBtnInitText;
        navBtn.style.height='55px';
        navBtn.style.width='25vw';
    }
}
//------------------------------------------------------------------
function screenSizeChanged() {
    changeImageSize();
    reportNewHeightAndWidth();

}
//------------------------------------------------------------------
function reportNewHeightAndWidth() {

    // console.log('logWindowsHeightAndWidth=> Width: ' + document.documentElement.clientWidth+', Height: ' + document.documentElement.clientHeight);
}