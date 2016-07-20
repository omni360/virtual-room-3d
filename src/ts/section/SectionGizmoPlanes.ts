/**
 * Created by imaker on 7/19/2016.
 */
class SectionGizmoPlanes {
    public xy:THREE.Mesh;
    public yz:THREE.Mesh;
    public xz:THREE.Mesh;
    public xyze:THREE.Mesh;

    constructor() {
        const planeGeometry = new THREE.PlaneBufferGeometry(50, 50, 2, 2);
        const planeMaterial = new THREE.MeshBasicMaterial({visible: false, side: THREE.DoubleSide});
        this.xy = new THREE.Mesh(planeGeometry, planeMaterial);
        this.yz = new THREE.Mesh(planeGeometry, planeMaterial);
        this.xz = new THREE.Mesh(planeGeometry, planeMaterial);
        this.xyze = new THREE.Mesh(planeGeometry, planeMaterial);
    }
}