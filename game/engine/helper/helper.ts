class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let length = this.length();
        this.x /= length;
        this.y /= length;
    }

    differenceTo(vector:Vector) {
        let result = new Vector(0,0);
        result.x=vector.x-this.x;
        result.y=vector.y-this.y;
        return result;
    }

}