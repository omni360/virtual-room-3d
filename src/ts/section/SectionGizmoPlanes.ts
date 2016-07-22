/**
 * Created by imaker on 7/19/2016.
 */
class SectionGizmoPlanes {
    public xy:THREE.Mesh;
    public yz:THREE.Mesh;
    public xz:THREE.Mesh;
    public xyze:THREE.Mesh;

    constructor() {
        const visible:boolean = false;
        let colorxy = new THREE.Color();
        colorxy.r = Math.random();
        colorxy.g = Math.random();
        colorxy.b = Math.random();
        let coloryz = new THREE.Color();
        coloryz.r = Math.random();
        coloryz.g = Math.random();
        coloryz.b = Math.random();
        let colorxz = new THREE.Color();
        colorxz.r = Math.random();
        colorxz.g = Math.random();
        colorxz.b = Math.random();
        let colorxyze = new THREE.Color();
        colorxyze.r = Math.random();
        colorxyze.g = Math.random();
        colorxyze.b = Math.random();
        const planeGeometry = new THREE.PlaneBufferGeometry(50, 50, 2, 2);
        const planeMaterialxy = new THREE.MeshBasicMaterial({
            color: colorxy.getHex(),
            visible: visible,
            side: THREE.DoubleSide
        });
        const planeMaterialyz = new THREE.MeshBasicMaterial({
            color: coloryz.getHex(),
            visible: visible,
            side: THREE.DoubleSide
        });
        const planeMaterialxz = new THREE.MeshBasicMaterial({
            color: colorxz.getHex(),
            visible: visible,
            side: THREE.DoubleSide
        });
        const planeMaterialxyze = new THREE.MeshBasicMaterial({
            color: colorxyze.getHex(),
            visible: visible,
            side: THREE.DoubleSide
        });
        this.xy = new THREE.Mesh(planeGeometry, planeMaterialxy);
        this.yz = new THREE.Mesh(planeGeometry, planeMaterialyz);
        this.xz = new THREE.Mesh(planeGeometry, planeMaterialxz);
        this.xyze = new THREE.Mesh(planeGeometry, planeMaterialxyze);
    }
}