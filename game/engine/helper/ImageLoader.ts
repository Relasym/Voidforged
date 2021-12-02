class ImageLoader {
    private totalImages: number;
    private loadedImages: number;
    private canStart: boolean;
    private onLoadFinished: Function;
    constructor() {
        this.totalImages = 0;
        this.loadedImages = 0;
        this.canStart = false;
    }
    loadImage(img: HTMLImageElement, url: string) {
        if (this.canStart) {
            console.warn("Image added to Imageloader after start");
        } else {
            this.totalImages++;
            img.src = url;
            img.onload = this.onload;
        }
    }
    loadImages(images: HTMLImageElement[], urls: string[]) {
        if (this.canStart) {
            console.warn("ImageLoader: trying to load image after start");
        } else if (images == null || images.length == 0) {
            this.totalImages += urls.length;
            for (let i = 0; i < urls.length; i++) {
                images.push(new Image());
                images[i].src = urls[i];
                images[i].onload = this.onload;
            }
        } else {
            console.error("ImageLoader: Image array was not passed empty");
        }
    }
    private onload() {
        this.loadedImages++;
        if (this.canStart && this.loadedImages == this.totalImages) {
            this.onLoadFinished();
        }

    }
    launch(callback: Function) {
        this.canStart = true;
        this.onLoadFinished = callback;
        if (this.loadedImages == this.totalImages) {
            callback();
        }
    }
}