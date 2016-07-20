/**
 * Created by imaker on 7/19/2016.
 */
type Events = {
    type:string;
    target?:any;
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
        this.mouseUpEvent = {type: "mouseUp"};
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
    }

    public update() {
        if (this.object === undefined) return;

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