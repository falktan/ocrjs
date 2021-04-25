import $ from "jquery";
import img from "./resources/img04.jpg";
// This dependency is loaded dynamicall.
// There is a node dependency that provides opencv, but this needs an
// installation of C++-dependencies. In contrast, this source provides a
// package that is already properly running directly in the browser
// using Webassembly.
const openCvUrl = "https://docs.opencv.org/3.4.14/opencv.js";


window.onload = () => {
    async function main() {
        const sourceImage = $("<img/>").attr("src", img);
        const sourceImages = [sourceImage];
        const images = [[]];

        $("body").append(tableOf(images));
    
        console.log("blub1");
        await loadOpenCV();

        console.log("blub2");
        console.log(cv);
        console.log(cv.Mat);
        console.log(new cv.Mat());
    }

    function tableOf(rows) {
        return $("<table/>").append( rows.map( row => {
            return $("<tr/>").append( row.map( element => {
                return $("<td/>").append(element);
            }));
        }));
    }

    async function loadOpenCV() {
        // This will provide the global variable "cv" when the returned promise resolves.
        
        // Note that $.getscript already resolves once the http-request is finished, possibly before
        // the scrip was executed. To work around this (and the point mentioned in the
        // next comment) the setInterval workaround in the next lines is needed.
        // See also
        // https://stackoverflow.com/a/47426349/8195190
        await $.getScript(openCvUrl);  

        return new Promise((accept, reject) => {
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

    main();
};
