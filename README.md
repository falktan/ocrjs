# ocrjs
Optical Character Recognition in Java Script based on Tesseract.js

This project is to evaluate how to pre-process images before running them through tesseract.js.

## Data preperation.
To keep this repo slim, any larger data is not included in this repo and must be downloaded independently.

Labeled Images for OCR can be found here (creating an account is needed to download):

https://rrc.cvc.uab.es/?ch=15&com=downloads

Download the data from there and put them in a folder structure like this:

```
serve  # this folder will be made available on localhost:8080
├───data
│   ├───ground_truth
│   │   ├───tr_img_00001.txt
│   │   ├───tr_img_00002.txt
│   │   └─── ...
│   └───images
│       ├───tr_img_00001.jpg
│       ├───tr_img_00002.jpg
│       └─── ...
└───dist  # this is the application, which will be created by "npm run build"
```

This project uses webpack (for an overview of how to use, see https://webpack.js.org/guides/getting-started/)

Install Node (>=14.x.x).

To install all dependencies run

```npm install```

Then to build the packaged app via webpack run

```npm run build```

This creates a dist folder with all files needed for the app.
To try the app locally run

```npm start```

This starts a local server on ```http://127.0.0.1:8080```.

The actual app is served at ```http://localhost:8080/dist/```.

