/**
 * Created by imaker on 7/25/2016.
 */
class SectionMesh extends THREE.Mesh {
    public plane:THREE.Plane;
    public planeVec:THREE.Vector4;
    public connectivity:any[];
    public outlines:THREE.Line[];

    constructor(geometry?:THREE.Geometry|THREE.BufferGeometry, material?:THREE.Material, plane?:THREE.Plane) {
        super((geometry as any), material);
        this.plane = plane;
        this.planeVec = new THREE.Vector4(plane.normal.x, plane.normal.y, plane.normal.z, plane.constant);
        this.connectivity = [];
        this.outlines = new Array<THREE.Line>();
    }

    public update() {
        this.plane.normal.set(0, 0, 1);
        this.plane.normal.applyQuaternion(this.quaternion);
        let planeNormal = this.plane.normal;
        let constant = this.getWorldPosition().dot(planeNormal);
        this.planeVec.set(planeNormal.x, planeNormal.y, planeNormal.z, constant);
        this.plane.constant = constant;
    }
}
