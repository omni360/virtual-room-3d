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
    private changeEvent:Events;
    private mouseDownEvent:Events;
    private mouseUpEvent:Events;
    private objectChangeEvent:Events;
    private ray:THREE.Raycaster;
    private pointerVector:THREE.Vector2;
    private camera:THREE.PerspectiveCamera| THREE.OrthographicCamera;


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

        let point = new THREE.Vector3();
        let offset = new THREE.Vector3();
        let rotation = new THREE.Vector3();
        let offsetRotation = new THREE.Vector3();
        let scale = 1;
        let lookAtMatrix = new THREE.Matrix4();
        let eye = new THREE.Vector3();

        let tempMatrix = new THREE.Matrix4();
        let tempVector = new THREE.Vector3();
        let tempQuaternion = new THREE.Quaternion();
        let unitX = new THREE.Vector3();
        let unitY = new THREE.Vector3();
        let unitZ = new THREE.Vector3();

        let quaternionXYZ = new THREE.Quaternion();
        let quaternionX = new THREE.Quaternion();
        let quaternionY = new THREE.Quaternion();
        let quaternionZ = new THREE.Quaternion();
        let quaternionE = new THREE.Quaternion();

        // 保存上一次位置,比例,旋转矩阵
        let oldPosition = new THREE.Vector3();
        let oldScale = new THREE.Vector3();
        let oldRotationMatrix = new THREE.Matrix4();

        let parentRotationMatrix = new THREE.Matrix4();
        let parentScale = new THREE.Vector3();

        let worldPosition = new THREE.Vector3();
        let worldRotation = new THREE.Euler();
        let worldRoatationMatrix = new THREE.Matrix4();
        let camPosition = new THREE.Vector3();
        let camRotation = new THREE.Euler();

        //noinspection TypeScriptValidateTypes
        this.domElement.addEventListener("mousedown", this.onPointerDown, false);
    }

    public update(){

    }

    public onPointerDown(event) {
        if (this.object === undefined || this._dragging === true || (event.button !== undefined && event.button !== 0)) {
            return;
        }
        let pointer = event.changedTouches ? event.changedTouches[0] : event;
        if (pointer.button === 0 || pointer.button === undefined) {
            let intersect = this.intersectObjects(pointer, this._gizmo[this._mode].pickers.children);
            if(intersect){
                event.preventDefault();
                event.stopPropagation();
                this.dispatchEvent(this.mouseDownEvent);
                this.axis = (intersect as any).object.name;
                this.update();
                // this.eye.copy(this.camPosition).sub()


            }
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