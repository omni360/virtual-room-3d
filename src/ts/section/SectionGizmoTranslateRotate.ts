/**
 * Created by imaker on 7/20/2016.
 */
class SectionGizmoTranslateRotate extends SectionGizmo {
    public activeMode:string;
    public handleGizmos:SectionTranslateRotateHandleGizmo;
    public pickerGizmos:SectionTranslateRotatePickerGizmo;
    public subPickerGizmos:SectionTranslateRotateSubPickerGizmo;
    public highlightGizmos:SectionTranslateRotationHighlightGizmo;
    public hemiPickerGizmos:SectionTranslateRotateHemiPickerGizmo;

    constructor() {
        super();
        this.handleGizmos = new SectionTranslateRotateHandleGizmo();
        this.pickerGizmos = new SectionTranslateRotatePickerGizmo();
        this.subPickerGizmos = new SectionTranslateRotateSubPickerGizmo();
        this.highlightGizmos = new SectionTranslateRotationHighlightGizmo();
        this.hemiPickerGizmos = new SectionTranslateRotateHemiPickerGizmo();
        this.init();
    }

    public setActivePlane(axis:string, eye:THREE.Vector3) {
        if ("translate" == this.activeMode) {
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
                    this.activePlane = this.planes["yz"];
                }
            }
            if (axis === "z") {
                this.activePlane = this.planes["xz"];
                if (Math.abs(eye.x) > Math.abs(eye.y)) {
                    this.activePlane = this.planes["yz"];
                }
            }
        } else if (this.activeMode = "rotate") {
            if (axis === "rx") {
                this.activePlane = this.planes["yz"];
            }
            if (axis === "ry") {
                this.activePlane = this.planes["xz"];
            }
            if (axis === "rz") {
                this.activePlane = this.planes["xy"];
            }
        }
        // this.hide();
        this.show();
    }

    public update(rotation:THREE.Euler, eye2:THREE.Vector3) {
        if (this.activeMode === "translate") {
            super.update(rotation, eye2);
        } else if (this.activeMode === "rotate") {
            super.update(rotation, eye2);
            let tempMatrix = new THREE.Matrix4();
            let worldRotation = new THREE.Euler(0, 0, 1);
            let tempQuaternion = new THREE.Quaternion();
            let unitX = new THREE.Vector3(1, 0, 0);
            let unitY = new THREE.Vector3(0, 1, 0);
            let unitZ = new THREE.Vector3(0, 0, 1);
            let quaternionX = new THREE.Quaternion();
            let quaternionY = new THREE.Quaternion();
            let quaternionZ = new THREE.Quaternion();
            let eye = eye2.clone();

            worldRotation.copy(this.planes["xy"].rotation);
            tempQuaternion.setFromEuler(worldRotation);
            tempMatrix.makeRotationFromQuaternion(tempQuaternion).getInverse(tempMatrix);
            eye.applyMatrix4(tempMatrix);
            this.traverse((child:any)=> {
                tempQuaternion.setFromEuler(worldRotation);
                if (child.name === "rx") {
                    quaternionX.setFromAxisAngle(unitX, Math.atan2(-eye.y, eye.z));
                    tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionX);
                    child.quaternion.copy(tempQuaternion);
                }
                if (child.name === "ry") {
                    quaternionY.setFromAxisAngle(unitY, Math.atan2(eye.x, eye.z));
                    tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionY);
                    child.quaternion.copy(tempQuaternion);
                }
                if (child.name === "rz") {
                    quaternionZ.setFromAxisAngle(unitZ, Math.atan2(eye.y, eye.x));
                    tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionZ);
                    child.quaternion.copy(tempQuaternion);
                }
            });
        }


    }

    public show() {
        this.traverse((child:any)=> {
            if (this.parent === null || (this.parent as any).useAllPickers || child.parent !== this.handles) {
                child.visible = true;
            }
            if (child.material) {
                child.material.opacity = child.material.oldOpacity;
            }
            if (child.parent === this.pickers || child.parent === this.hemiPickers || child.parent === this.subPickers) {
                child.visible = false;
            }
            if (child.parent === this.planes || child.parent === this.highlights) {
                child.visible = false;
            }
        });
        this.activePlane.visible = false;
    }

    public highlight(axis:string) {
        this.traverse((child:any)=> {
            if (child.material && child.material.highlight) {
                if (child.name === axis) {
                    if (child.parent === this.highlights || child.parent === this.handles) {
                        child.visible = true;
                        child.material.highlight(true);
                    }
                } else {
                    child.material.highlight(false);
                    child.material.opacity = 0.1
                }
            }
        })
    }
}
