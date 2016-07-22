/**
 * Created by imaker on 7/19/2016.
 */
class SectionGizmo extends THREE.Object3D {
    public handles:THREE.Object3D;
    public pickers:THREE.Object3D;
    public planes:THREE.Object3D;
    public highlights:THREE.Object3D;
    public hemiPickers:THREE.Object3D;
    public subPickers:THREE.Object3D;
    public activePlane:THREE.Mesh;
    // TODO: init handle and pickers
    public handleGizmos:{[key:string]:any};
    public pickerGizmos:{[key:string]:any};

    /**
     * 构造函数
     */
    constructor() {
        super();
    }

    public init() {
        this.handles = new THREE.Object3D();
        this.pickers = new THREE.Object3D();
        this.planes = new THREE.Object3D();
        this.highlights = new THREE.Object3D();
        this.hemiPickers = new THREE.Object3D();
        this.subPickers = new THREE.Object3D();
        this.add(this.handles);
        this.add(this.pickers);
        this.add(this.planes);
        this.add(this.highlights);
        this.add(this.hemiPickers);
        this.add(this.subPickers);
        let planes = new SectionGizmoPlanes();
        this.activePlane = planes.xyze;
        planes.yz.rotation.set(0, Math.PI / 2, 0);
        planes.xz.rotation.set(-Math.PI / 2, 0, 0);
        for (let plane in planes) {
            planes[plane].name = plane.toString();
            this.planes.add(planes[plane]);
            this.planes[plane] = planes[plane];
        }
        this.setupGizmos(this.handleGizmos, this.handles);
        this.setupGizmos(this.pickerGizmos, this.pickers);
        this.traverse((child)=> {
            if (child instanceof THREE.Mesh) {
                child.updateMatrix();
                let tempGeometry = child.geometry.clone();
                tempGeometry.applyMatrix(child.matrix);
                child.geometry = tempGeometry;
                child.position.set(0, 0, 0);
                child.rotation.set(0, 0, 0);
                child.scale.set(1, 1, 1);
            }
        });
    }

    public setupGizmos<TGizmo,TParent>(gizmoMap:{[key:string]:any}, parent:THREE.Object3D):void {
        for (let name in gizmoMap) {
            const length = gizmoMap[name].length;
            for (let i = 0; i < length; i++) {
                let object = gizmoMap[name][i][0];
                let position = gizmoMap[name][i][1];
                let rotation = gizmoMap[name][i][2];
                object.name = name;
                if (position) {
                    object.position.set(position[0], position[1], position[2]);
                }
                if (rotation) {
                    object.rotation.set(rotation[0], rotation[1], rotation[2]);
                }
                parent.add(object);
            }
        }
    }

    public highlight(axis:string) {
        if (axis) {
            this.traverse((child:any)=> {
                if (child.material && child.material.highlight) {
                    if (child.name === axis) {
                        child.material.highlight(true);
                    } else {
                        child.material.highlight(false);
                    }

                }
            })
        }
    }

    public update(rotation:THREE.Euler, eye:THREE.Vector3) {
        let vec1 = new THREE.Vector3(0, 0, 0);
        let vec2 = new THREE.Vector3(0, 1, 0);
        let lookAtMatrix = new THREE.Matrix4();
        this.traverse((child:any)=> {
            if (child.name.search("e") !== -1) {
                child.quaternion.setFromRotationMatrix(lookAtMatrix.lookAt(eye, vec1, vec2));
            } else if (child.name.search("x") !== -1 ||
                    child.name.search("y") !== -1 ||
                    child.name.search("z") !== -1) {
                child.quaternion.setFromEuler(rotation);
            }
        })

    }

}