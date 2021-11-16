/*collision functions */

//TODO these should check for collisions between shapes, not objects

//calls appropriate collision function for given object types/shapes
function areObjectsColliding(object1: GameObjectInterface, object2: GameObjectInterface): boolean {

    //no collision if objects are too far apart
    if(!collisionCircleCircle(object1,object2)) {
        return false;
    }

    let type1 = object1.type;
    let type2 = object2.type;
    //if both objects are circles we don't need any other checks
    if(type1==collisionType.Circle && type2==collisionType.Circle) {
        return true;
    }

    //possible collision, check according to object type
    if(type1==collisionType.Circle || type2==collisionType.Circle) {
        return collisionRectangleCircle(object1,object2)
    } else {
        return collisionRectangleRectangle(object1,object2)
    }
}

function collisionRectangleRectangle(rectangle1: GameObjectInterface, rectangle2: GameObjectInterface): boolean {
    return (rectangle1.shape.x < rectangle2.shape.x + rectangle2.shape.width &&
        rectangle1.shape.x + rectangle1.shape.width > rectangle2.shape.x &&
        rectangle1.shape.y < rectangle2.shape.y + rectangle2.shape.height &&
        rectangle1.shape.y + rectangle1.shape.height > rectangle2.shape.y)
}
function collisionRectangleCircle(rectangle: GameObjectInterface, circle: GameObjectInterface): boolean {
    if (rectangle.type == collisionType.Circle) {
        let swap = rectangle;
        rectangle = circle;
        circle = swap;
    }
    let xborder = circle.shape.x
    let yborder = circle.shape.y
    if (circle.shape.x < rectangle.shape.x) xborder = rectangle.shape.x
    else if (circle.shape.x > (rectangle.shape.x + rectangle.shape.width)) xborder = rectangle.shape.x + rectangle.shape.width
    if (circle.shape.y < rectangle.shape.y) yborder = rectangle.shape.y
    else if (circle.shape.y > (rectangle.shape.y + rectangle.shape.height)) yborder = rectangle.shape.y + rectangle.shape.height
    let dist = Math.sqrt((circle.shape.x - xborder) ** 2 + (circle.shape.y - yborder) ** 2)
    return (dist <= circle.shape.radius)
}

//TODO this doesn't work for rectangles of different sizes since it assumes the coordinates are the center
function collisionCircleCircle(circle1: GameObjectInterface, circle2: GameObjectInterface): boolean {
    return (new Vector(circle1.shape.x - circle2.shape.x,circle1.shape.y - circle2.shape.y).length() <= (circle1.shape.radius + circle2.shape.radius))
}