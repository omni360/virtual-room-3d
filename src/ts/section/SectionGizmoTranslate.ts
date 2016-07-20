/**
 * Created by imaker on 7/19/2016.
 */
class SectionGizmoTranslate extends SectionGizmo {
    public handleGizmos:SectionHandleGizmo;
    public pickerGizmos:SectionPickerGizmo;

    constructor() {
        super();
        this.handleGizmos = new SectionHandleGizmo();
        this.pickerGizmos = new SectionPickerGizmo();
        this.init();
    }

    public setActivePlane(axis:string, eye:THREE.Vector3) {
        let tempMatrix = new THREE.Matrix4();
        eye.applyMatrix4(tempMatrix.getInverse(tempMatrix.extractRotation(this.planes["xy"].matrixWorld)));
        if (axis === "x") {
            this.activePlane = this.planes["xy"];
            if (Math.abs(eye.y) > Math.abs(eye.z)) {
                this.activePlane = this.planes["xz"];
            }
        }
        if (axis === "y") {
            this.activePlane = this.planes["xy"];
            if (Math.abs(eye.x) > Math.abs(eye.z)) {
                this.activePlane = this.planes["yz"]
            }
        }
        if (axis === "z") {
            this.activePlane = this.planes["xz"];
            if (Math.abs(eye.x) > Math.abs(eye.y)) {
                this.activePlane = this.planes["yz"];
            }
        }
        if (axis === "xyz") {
            this.activePlane = this.planes["xyze"];
        }
        if (axis === "xy") {
            this.activePlane = this.planes["xy"];
        }
        if (axis === "yz") {
            this.activePlane = this.planes["yz"];
        }
        if (axis === "xz") {
            this.activePlane = this.planes["xz"];
        }
    }

}