/**
 * Created by imaker on 7/19/2016.
 */
type Events = {
    type:string;
    target?:any;
    mode?:any;
}
class SectionControls extends THREE.Object3D {
    public object:THREE.Mesh | THREE.Object3D;
    public visible:boolean;
    public translationSnap:THREE.Vector3;
    public rotationSnap:THREE.Vector3;
    public space:string;
    public size:number;
    public axis:string;
    private _mode:string;
    private _dragging:boolean;
    private plane:string;
    private _gizmo:SectionGizmoType;

    private domElement:Element;
    private camera:THREE.PerspectiveCamera| THREE.OrthographicCamera;

    private changeEvent:Events;
    private mouseDownEvent:Events;
    private mouseUpEvent:Events;
    private objectChangeEvent:Events;
    private ray:THREE.Raycaster;
    private pointerVector:THREE.Vector2;

    private point:THREE.Vector3;
    private offset:THREE.Vector3;
    private _rotation:THREE.Vector3;
    private offsetRotation:THREE.Vector3;
    private _scale:number;
    private lookAtMatrix:THREE.Matrix4;
    private eye:THREE.Vector3;

    private tempMatrix:THREE.Matrix4;
    private tempVector:THREE.Vector3;
    private tempQuaternion:THREE.Quaternion;
    private unitX:THREE.Vector3;
    private unitY:THREE.Vector3;
    private unitZ:THREE.Vector3;

    private quaternionXYZ:THREE.Quaternion;
    private quaternionX:THREE.Quaternion;
    private quaternionY:THREE.Quaternion;
    private quaternionZ:THREE.Quaternion;
    private quaternionE:THREE.Quaternion;

    private oldPosition:THREE.Vector3;
    private oldScale:THREE.Vector3;
    private oldRotationMatrix:THREE.Matrix4;

    private parentRotationMatrix:THREE.Matrix4;
    private parentScale:THREE.Vector3;

    private worldPosition:THREE.Vector3;
    private worldRotation:THREE.Euler;
    private worldRotationMatrix:THREE.Matrix4;

    private camPosition:THREE.Vector3;
    private camRotation:THREE.Euler;

    constructor(camera:THREE.PerspectiveCamera | THREE.OrthographicCamera, domElement?:Element) {
        super();
        this.camera = camera;
        this.domElement = (domElement !== undefined) ? domElement : <Element>document;
        this.object = undefined;
        this.visible = false;
        this.translationSnap = null;
        this.rotationSnap = null;
        this.space = "world";
        this.size = 1;
        this.axis = null;
        this._mode = "translate";
        this._dragging = false;
        this.plane = "xy";
        this._gizmo = new SectionGizmoType();
        for (let type in this._gizmo) {
            let gizmoObj = this._gizmo[type];
            gizmoObj.visible = (type === this._mode);
            this.add(gizmoObj);
        }
        this.changeEvent = {type: "change"};
        this.mouseDownEvent = {type: "mouseDown"};
        this.mouseUpEvent = {type: "mouseUp", mode: this._mode};
        this.objectChangeEvent = {type: "objectChange"};
        this.ray = new THREE.Raycaster();
        this.pointerVector = new THREE.Vector2();

        this.point = new THREE.Vector3();
        this.offset = new THREE.Vector3();
        this._rotation = new THREE.Vector3();
        this.offsetRotation = new THREE.Vector3();
        this._scale = 1;
        this.lookAtMatrix = new THREE.Matrix4();
        this.eye = new THREE.Vector3();

        this.tempMatrix = new THREE.Matrix4();
        this.tempVector = new THREE.Vector3();
        this.tempQuaternion = new THREE.Quaternion();
        this.unitX = new THREE.Vector3();
        this.unitY = new THREE.Vector3();
        this.unitZ = new THREE.Vector3();

        this.quaternionXYZ = new THREE.Quaternion();
        this.quaternionX = new THREE.Quaternion();
        this.quaternionY = new THREE.Quaternion();
        this.quaternionZ = new THREE.Quaternion();
        this.quaternionE = new THREE.Quaternion();

        // 保存上一次位置,比例,旋转矩阵
        this.oldPosition = new THREE.Vector3();
        this.oldScale = new THREE.Vector3();
        this.oldRotationMatrix = new THREE.Matrix4();

        this.parentRotationMatrix = new THREE.Matrix4();
        this.parentScale = new THREE.Vector3();

        this.worldPosition = new THREE.Vector3();
        this.worldRotation = new THREE.Euler();
        this.worldRotationMatrix = new THREE.Matrix4();
        this.camPosition = new THREE.Vector3();
        this.camRotation = new THREE.Euler();

        //noinspection TypeScriptValidateTypes
        this.domElement.addEventListener("mousedown", this.onPointerDown, false);
        this.domElement.addEventListener("touchstart", this.onPointerDown, false);

        this.domElement.addEventListener("mousemove", this.onPointerHover, false);
        this.domElement.addEventListener("touchmove", this.onPointerHover, false);

        this.domElement.addEventListener("mousemove", this.onPointerMove, false);
        this.domElement.addEventListener("touchmove", this.onPointerMove, false);

        this.domElement.addEventListener("mouseup", this.onPointerUp, false);
        this.domElement.addEventListener("mouseout", this.onPointerUp, false);
        this.domElement.addEventListener("touchend", this.onPointerUp, false);
        this.domElement.addEventListener("touchcancel", this.onPointerUp, false);
        this.domElement.addEventListener("touchleave", this.onPointerUp, false);
    }

    public dispose() {
        this.domElement.removeEventListener("mousedown", this.onPointerDown);
        this.domElement.removeEventListener("touchstart", this.onPointerDown);

        this.domElement.removeEventListener("mousemove", this.onPointerHover);
        this.domElement.removeEventListener("touchmove", this.onPointerHover);

        this.domElement.addEventListener("mousemove", this.onPointerMove);
        this.domElement.addEventListener("touchmove", this.onPointerMove);

        this.domElement.removeEventListener("mouseup", this.onPointerUp);
        this.domElement.removeEventListener("mouseout", this.onPointerUp);
        this.domElement.removeEventListener("touchend", this.onPointerUp);
        this.domElement.removeEventListener("touchcancel", this.onPointerUp);
        this.domElement.removeEventListener("touchleave", this.onPointerUp);

    }

    public attach(object:THREE.Mesh|THREE.Object3D) {
        this.object = object;
        this.visible = true;
        this.update();
    }

    public detach() {
        this.object = undefined;
        this.visible = false;
        this.axis = null;
    }

    public getMode():string {
        return this._mode;
    }

    public setMode(mode:string) {
        this._mode = mode ? mode : this._mode;
        if (this._mode === "scale") {
            this.space = "local";
        }
        for (let type in this._gizmo) {
            this._gizmo[type].visible = (type === this._mode);
        }
        this.update();
        this.dispatchEvent(this.changeEvent);
    }

    public setTranslationSnap(translationSnap:THREE.Vector3) {
        this.translationSnap = translationSnap;
    }

    public setRotationSnap(rotationSnap:THREE.Vector3) {
        this.rotationSnap = rotationSnap
    }

    public setSize(size:number) {
        this.size = size;
        this.update();
        this.dispatchEvent(this.changeEvent);
    }

    public setSpace(space:string) {
        this.space = space;
        this.update();
        this.dispatchEvent(this.changeEvent);
    }

    public update() {
        if (this.object === undefined) {
            return;
        }
        this.object.updateMatrixWorld();
        this.worldPosition.setFromMatrixPosition(this.object.matrixWorld);
        this.worldRotation.setFromRotationMatrix(this.tempMatrix.extractRotation(this.object.matrix));

        this.camera.updateMatrixWorld();
        this.camPosition.setFromMatrixPosition(this.camera.matrixWorld);
        this.camRotation.setFromRotationMatrix(this.tempMatrix.extractRotation(this.camera.matrixWorld));

        this._scale = this.worldPosition.distanceTo(this.camPosition) / 6 * this.size;
        this.position.copy(this.worldPosition);
        this.scale.set(this._scale, this._scale, this._scale);
        this.eye.copy(this.camPosition)

        if (this.space === "lcoal") {
            this._gizmo[this._mode].update(this.worldRotation, this.eye);
        } else if (this.space === "world") {
            this._gizmo[this._mode].update(new THREE.Euler(), this.eye);
        }
        this._gizmo[this._mode].highlight(this.axis);

    }

    private onPointerHover(event) {
        if (this.object === undefined || this._dragging === true || (event.button !== undefined && event.button !== 0)) {
            return;
        }
        let pointer = event.changedTouches ? event.changedTouches[0] : event;
        let intersect = this.intersectObjects(pointer, this._gizmo[this._mode].pickers.children);
        let axis = null;
        if (intersect) {
            axis = (intersect as any).object.name;
            event.preventDefault();
        }
        if (this.axis !== axis) {
            this.axis = axis;
            this.update();
            this.dispatchEvent(this.changeEvent);
        }
    }

    private onPointerDown(event) {
        if (this.object === undefined || this._dragging === true || (event.button !== undefined && event.button !== 0)) {
            return;
        }
        let pointer = event.changedTouches ? event.changedTouches[0] : event;
        if (pointer.button === 0 || pointer.button === undefined) {
            let intersect = this.intersectObjects(pointer, this._gizmo[this._mode].pickers.children);
            if (intersect) {
                event.preventDefault();
                event.stopPropagation();
                this.dispatchEvent(this.mouseDownEvent);
                this.axis = (intersect as any).object.name;
                this.update();
                this.eye.copy(this.camPosition).sub(this.worldPosition).normalize();
                this._gizmo[this._mode].setActivePlane(this.axis, this.eye);
                let planeIntersect = this.intersectObjects(pointer, [this._gizmo[this._mode].activePlane]);
                if (planeIntersect) {
                    this.oldPosition.copy(this.object.position);
                    this.oldScale.copy((this.object.scale));

                    this.oldRotationMatrix.extractRotation(this.object.matrix);
                    this.worldRotationMatrix.extractRotation(this.object.matrixWorld);

                    this.parentRotationMatrix.extractRotation(this.object.parent.matrixWorld);
                    this.parentScale.setFromMatrixScale(this.tempMatrix.getInverse(this.object.parent.matrixWorld));

                    this.offset.copy((planeIntersect as any).point)

                }
            }
        }
        this._dragging = true;

    }

    private onPointerMove(event) {
        if (this.object === undefined || this._dragging === false || this.axis === null || (event.button !== undefined && event.button !== 0)) {
            return;
        }
        let pointer = event.changedTouches ? event.changedTouches[0] : event;
        let planeIntersect = this.intersectObjects(pointer, [this._gizmo[this._mode].activePlane]);
        if (planeIntersect === false) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        this.point.copy((planeIntersect as any).point);
        if (this._mode === "translate") {
            this.point.sub(this.offset);
            this.point.multiply(this.parentScale);
            if (this.space === "local") {
                this.point.applyMatrix4(this.tempMatrix.getInverse(this.worldRotationMatrix));
                if (this.axis.search("x") === -1) {
                    this.point.x = 0;
                }
                if (this.axis.search("y")) {
                    this.point.y = 0;
                }
                if (this.axis.search("z")) {
                    this.point.z = 0;
                }
                this.point.applyMatrix4(this.tempMatrix.getInverse(this.parentRotationMatrix));
                this.object.position.copy(this.oldPosition);
                this.object.position.add(this.point);
            }
            if (this.space === "world" || this.axis.search("xyz") !== -1) {
                if (this.axis.search("x") === -1) {
                    this.point.x = 0;
                }
                if (this.axis.search("y") === -1) {
                    this.point.y = 0;
                }
                if (this.axis.search("z") === -1) {
                    this.point.z = 0;
                }
                this.point.applyMatrix4(this.tempMatrix.getInverse(this.parentRotationMatrix));
                this.object.position.copy(this.oldPosition);
                this.object.position.add(this.point);
            }
            if (this.translationSnap !== null) {
                if (this.space === "local") {
                    this.object.position.applyMatrix4(this.tempMatrix.getInverse(this.worldRotationMatrix));
                }
                if (this.axis.search("x") !== -1) {
                    this.object.position.x = Math.round(this.object.position.x / this.translationSnap) * this.translationSnap;
                }
                if (this.axis.search("y") !== -1) {
                    this.object.position.y = Math.round(this.object.position.y / this.translationSnap) * this.translationSnap;
                }
                if (this.axis.search("z") !== -1) {
                    this.object.position.z = Math.round(this.object.position.z / this.translationSnap) * this.translationSnap;
                }
                if (this.space === "local") {
                    this.object.position.applyMatrix4(this.worldRotationMatrix);
                }
            }
        } else if (this._mode === "scale") {
            this.point.sub(this.offset);
            this.point.multiply(this.parentScale);
            if (this.space === "local") {
                if (this.axis === "xyz") {
                    this._scale = 1 + ((this.point.y) / Math.max(this.oldScale.x, this.oldScale.y, this.oldScale.z));
                    this.object.scale.x = this.oldScale * this._scale;
                    this.object.scale.y = this.oldScale * this._scale;
                    this.object.scale.z = this.oldScale * this._scale;
                } else {
                    this.point.applyMatrix4(this.tempMatrix.getInverse(this.worldRotationMatrix));
                    if (this.axis === "x") {
                        this.object.scale.x = this.oldScale.x * (1 + this.point.x / this.oldScale.x);
                    }
                    if (this.axis === "y") {
                        this.object.scale.y = this.oldScale.y * (1 + this.point.y / this.oldScale.y);
                    }
                    if (this.axis === "z") {
                        this.object.scale.z = this.oldScale.z * (1 + this.point.z / this.oldScale.z);
                    }
                }
            }

        } else if (this._mode === "rotate") {
            this.point.sub(this.worldPosition);
            this.point.multiply(this.parentScale);
            this.tempVector.copy(this.offset).sub(this.worldPosition);
            this.tempVector.multiply(this.parentScale);
            if (this.axis === "e") {
                this.point.applyMatrix4(this.tempMatrix.getInverse(this.lookAtMatrix));
                this.tempVector.applyMatrix4(this.tempMatrix.getInverse(this.lookAtMatrix));

                this._rotation.set(Math.atan2(this.point.z, this.point.y),
                    Math.atan2(this.point.x, this.point.z),
                    Math.atan2(this.point.y, this.point.x));
                this.offsetRotation.set(Math.atan2(this.tempVector.z, this.tempVector.y),
                    Math.atan2(this.tempVector.x, this.tempVector.z),
                    Math.atan2(this.tempVector.y, this.tempVector.x));

                this.tempQuaternion.setFromRotationMatrix(this.tempMatrix.getInverse(this.parentRotationMatrix));

                this.quaternionE.setFromAxisAngle(this.eye, this._rotation.z - this.offsetRotation.z);
                this.quaternionXYZ.setFromRotationMatrix(this.worldRotationMatrix);

                this.tempQuaternion.multiplyQuaternions(this.tempQuaternion, this.quaternionE);
                this.tempQuaternion.multiplyQuaternions(this.tempQuaternion, this.quaternionXYZ)

                this.object.quaternion.copy(this.tempQuaternion);
            } else if (this.axis === "xyze") {
                const tempEuler = this.point.clone().cross(this.tempVector).normalize();
                this.quaternionE.setFromEuler(new THREE.Euler().setFromVector3(tempEuler));

                this.tempQuaternion.setFromRotationMatrix(this.tempMatrix.getInverse(this.parentRotationMatrix));
                this.quaternionX.setFromAxisAngle(<THREE.Vector3>this.quaternionE, -this.point.clone().angleTo(this.tempVector));
                this.quaternionXYZ.setFromRotationMatrix(this.worldRotationMatrix);

                this.tempQuaternion.multiplyQuaternions(this.tempQuaternion, this.quaternionX);
                this.tempQuaternion.multiplyQuaternions(this.tempQuaternion, this.quaternionXYZ);

                this.object.quaternion.copy(this.tempQuaternion);
            } else if (this.space === "local") {
                this.point.applyMatrix4(this.tempMatrix.getInverse(this.worldRotationMatrix));
                this.tempVector.applyMatrix4(this.tempMatrix.getInverse(this.worldRotationMatrix));

                this._rotation.set(Math.atan2(this.point.z, this.point.y),
                    Math.atan2(this.point.x, this.point.z),
                    Math.atan2(this.point.y, this.point.x));
                this.offsetRotation.set(Math.atan2(this.tempVector.z, this.tempVector.y),
                    Math.atan2(this.tempVector.x, this.tempVector.z),
                    Math.atan2(this.tempVector.y, this.tempVector.x));

                this.quaternionXYZ.setFromRotationMatrix(this.oldRotationMatrix);
                if (this.rotationSnap !== null) {
                    this.quaternionX.setFromAxisAngle(this.unitX, Math.round((this._rotation.x - this.offsetRotation.x) / this.rotationSnap) * this.rotationSnap);
                    this.quaternionY.setFromAxisAngle(this.unitY, Math.round((this._rotation.y - this.offsetRotation.y) / this.rotationSnap) * this.rotationSnap);
                    this.quaternionZ.setFromAxisAngle(this.unitZ, Math.round((this._rotation.z - this.offsetRotation.z) / this.rotationSnap) * this.rotationSnap);
                } else {
                    this.quaternionX.setFromAxisAngle(this.unitX, this._rotation.x - this.offsetRotation.x);
                    this.quaternionY.setFromAxisAngle(this.unitY, this._rotation.y - this.offsetRotation.y);
                    this.quaternionZ.setFromAxisAngle(this.unitZ, this._rotation.z - this.offsetRotation.z);
                }
                if (this.axis === "x") {
                    this.quaternionXYZ.multiplyQuaternions(this.quaternionXYZ, this.quaternionX);
                }
                if (this.axis === "y") {
                    this.quaternionXYZ.multiplyQuaternions(this.quaternionXYZ, this.quaternionY);
                }
                if (this.axis === "z") {
                    this.quaternionXYZ.multiplyQuaternions(this.quaternionXYZ, this.quaternionZ);
                }
                this.object.quaternion.copy(this.quaternionXYZ);
            } else if (this.space === "world") {
                this._rotation.set(Math.atan2(this.point.z, this.point.y),
                    Math.atan2(this.point.x, this.point.z),
                    Math.atan2(this.point.y, this.point.x));
                this.offsetRotation.set(Math.atan2(this.point.z, this.point.y),
                    Math.atan2(this.point.x, this.point.z),
                    Math.atan2(this.point.y, this.point.x));
                this.tempQuaternion.setFromRotationMatrix(this.tempMatrix.getInverse(this.parentRotationMatrix));
                if (this.rotationSnap !== null) {
                    this.quaternionX.setFromAxisAngle(this.unitX, Math.round((this._rotation.x - this.offsetRotation.x) / this.rotationSnap) * this.rotationSnap);
                    this.quaternionY.setFromAxisAngle(this.unitY, Math.round((this._rotation.y - this.offsetRotation.y) / this.rotationSnap) * this.rotationSnap);
                    this.quaternionZ.setFromAxisAngle(this.unitZ, Math.round((this._rotation.z - this.offsetRotation.y) / this.rotationSnap) * this.rotationSnap);
                } else {
                    this.quaternionX.setFromAxisAngle(this.unitX, this._rotation.x - this.offsetRotation.x);
                    this.quaternionY.setFromAxisAngle(this.unitY, this._rotation.y - this.offsetRotation.y);
                    this.quaternionZ.setFromAxisAngle(this.unitZ, this._rotation.z - this.offsetRotation.z);
                }
                this.quaternionXYZ.setFromRotationMatrix(this.worldRotationMatrix);
                if (this.axis === "x") {
                    this.quaternionXYZ.multiplyQuaternions(this.quaternionXYZ, this.quaternionX);
                }
                if (this.axis === "y") {
                    this.quaternionXYZ.multiplyQuaternions(this.quaternionXYZ, this.quaternionY);
                }
                if (this.axis === "z") {
                    this.quaternionXYZ.multiplyQuaternions(this.quaternionXYZ, this.quaternionZ);
                }
                this.tempQuaternion.multiplyQuaternions(this.tempQuaternion, this.quaternionXYZ);
                this.object.quaternion.copy(this.quaternionXYZ);
            }
        }
        this.update();
        this.dispatchEvent(this.changeEvent);
        this.dispatchEvent(this.objectChangeEvent);
    }

    private onPointerUp(event) {
        event.preventDefault();
        if (event.button !== undefined && event.button !== 0) {
            return;
        }
        if (this._dragging && (this.axis !== null)) {
            this.mouseUpEvent.mode = this._mode;
            this.dispatchEvent(this.mouseUpEvent);
        }
        this._dragging = false;
        if (event instanceof TouchEvent) {
            // Force "rollover"
            this.axis = null;
            this.update();
            this.dispatchEvent(this.changeEvent);
        } else {
            this.onPointerHover(event);
        }
    }

    private intersectObjects(pointer:MouseEvent|Touch, objects:THREE.Object3D[]):THREE.Intersection | boolean {
        const rect = this.domElement.getBoundingClientRect();
        const x = (pointer.clientX - rect.left) / rect.width;
        const y = (pointer.clientY - rect.top) / rect.height;
        this.pointerVector.set((x * 2) - 1, -(y * 2) + 1);
        this.ray.setFromCamera(this.pointerVector, this.camera);
        const intersections = this.ray.intersectObjects(objects, true);
        if (intersections[0]) {
            return intersections[0];
        } else {
            return false;
        }
    }
}