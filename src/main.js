import $ from "jquery";
import tesseract from "tesseract.js";
// This dependency is loaded dynamicall.
// There is a node dependency that provides opencv, but this needs an
// installation of C++-dependencies. In contrast, this source provides a
// package that is already properly running directly in the browser
// using Webassembly.
const openCvUrl = "https://docs.opencv.org/3.4.14/opencv.js";


window.onload = () => {
    async function main() {
        await loadOpenCV();
        const ocrWorker = await loadTesseractWorker();
        
        const examples = [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014];
        for (const n of examples) {
            const nWithTrailingZeros = n.toLocaleString('en-US', {minimumIntegerDigits: 5, useGrouping:false});
            const imgPath = `/data/images/tr_img_${nWithTrailingZeros}.jpg`;
            const groundTruthPath = `/data/ground_truth/tr_img_${nWithTrailingZeros}.txt`;

            await processImg(imgPath, groundTruthPath, ocrWorker, cv);
        }
    }

    async function processImg(imgPath, groundTruthPath, ocrWorker, cv) {
        const imgWidth = 800;  // Images sizes vary a lot. So we use some fixed reasonable size
        const sourceImage = $("<img/>");
        sourceImage.attr("src", imgPath);
        sourceImage.attr("width", `${imgWidth}px`);
        sourceImage.appendTo("body");
        await sleep(500); // wait for sourceImage to be loaded and rendered
        const canvasInput = $("<canvas/>");
        canvasInput.attr("id", "canvasInput")
        const canvasOutput = $("<canvas/>");
        canvasOutput.attr("id", "canvasOutput").appendTo($("body"));

        canvasInput.get(0).width = sourceImage.get(0).width;
        canvasInput.get(0).height = sourceImage.get(0).height;
        canvasInput.get(0).getContext("2d").drawImage(
            sourceImage.get(0), 0, 0, 
            imgWidth, imgWidth*sourceImage.get(0).height/sourceImage.get(0).width
        );

        canvasOutput.get(0).width = sourceImage.get(0).width;
        canvasOutput.get(0).height = sourceImage.get(0).height;

        let src = cv.imread(canvasInput.get(0));
        let dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        cv.adaptiveThreshold(src, dst, 200, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 51, 11);
        cv.imshow(canvasOutput.get(0), dst);
        src.delete();
        dst.delete();

        const {data: ocrResult} = await ocrWorker.recognize(canvasInput.get(0));
        const {data: ocrResultAfterPreprocessing} = await ocrWorker.recognize(canvasOutput.get(0));

        $("<br/>").appendTo("body");

        console.log("results without preprocessing");
        console.log(ocrResult);
        console.log("results after preprocessing");
        console.log(ocrResultAfterPreprocessing);
    }

    async function loadTesseractWorker() {
        const worker = tesseract.createWorker({});
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
    
        return worker;
    }
    
    async function loadOpenCV() {
        // This will provide the global variable "cv" when the returned promise resolves.

        // Note that $.getscript already resolves once the http-request is finished, possibly before
        // the scrip was executed. To work around this (and the point mentioned in the
        // next comment) the setInterval workaround in the next lines is needed.
        // See also
        // https://stackoverflow.com/a/47426349/8195190
        await $.getScript(openCvUrl);  

        return new Promise((accept) => {
            const setIntervalID = setInterval( () => {
                // For whatever reason cv.Mat is not neccessarily initialized even
                // after cv is already available. Apparently opencv.js does provide
                // cv.Mat only asynchroniously and later than cv.
                if (cv && cv.Mat) {
                    clearInterval(setIntervalID);
                    accept();
                }
            }, 500);
        });        
    }

    function sleep(ms) {
        return new Promise( accept => setTimeout(accept, ms));
    }

    main();
};
