/**
 * Created by imaker on 7/19/2016.
 */
class SectionPickerGizmo {
    public x:[THREE.Mesh[]];
    public y:[THREE.Mesh[]];
    public z:[THREE.Mesh[]];
    public xyz:[THREE.Mesh[]];
    public xy:[THREE.Mesh[]];
    public yz:[THREE.Mesh[]];
    public xz:[THREE.Mesh[]];

    constructor() {
        const pickerMaterial = new SectionGizmoMaterial({visible: false, transparent: false});

        this.x = [
            [new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0, 1, 4, 1, false), pickerMaterial), [0.6, 0, 0], [0, 0, -Math.PI / 2]]
        ];

        this.y = [
            [new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0, 1, 4, 1, false), pickerMaterial), [0, 0.6, 0]]
        ];

        this.z = [
            [new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0, 1, 4, 1, false), pickerMaterial), [0, 0, 0.6], [Math.PI / 2, 0, 0]]
        ];

        this.xyz = [
            [new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), pickerMaterial)]
        ];

        this.xy = [
            [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.4, 0.4), pickerMaterial), [0.2, 0.2, 0]]
        ];

        this.yz = [
            [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.4, 0.4), pickerMaterial), [0, 0.2, 0.2], [0, Math.PI / 2, 0]]
        ];

        this.xz = [
            [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.4, 0.4), pickerMaterial), [0.2, 0, 0.2], [-Math.PI / 2, 0, 0]]
        ];
    }
}
