/**
 * Created by imaker on 7/19/2016.
 */
class SectionTranslateHandleGizmo {
    public x:[(THREE.Mesh | number[])[],THREE.Line[]];
    public y:[(THREE.Mesh | number[])[],THREE.Line[]];
    public z:[(THREE.Mesh | number[])[],THREE.Line[]];
    public xyz:[(THREE.Mesh|number[])[]];
    public xy:[(THREE.Mesh|number[])[]];
    public yz:[(THREE.Mesh|number[])[]];
    public xz:[(THREE.Mesh|number[])[]];

    constructor() {
        let arrowGeometry = new THREE.Geometry();
        let mesh = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.05, 0.2, 12, 1, false));
        mesh.position.y = 0.5;
        mesh.updateMatrix();
        arrowGeometry.merge(mesh.geometry, mesh.matrix);
        let lineXGeometry = new THREE.BufferGeometry();
        lineXGeometry.addAttribute('position', new THREE.Float32Attribute([0, 0, 0, 1, 0, 0], 3));
        let lineYGeometry = new THREE.BufferGeometry();
        lineYGeometry.addAttribute('position', new THREE.Float32Attribute([0, 0, 0, 0, 1, 0], 3));
        let lineZGeometry = new THREE.BufferGeometry();
        lineZGeometry.addAttribute('position', new THREE.Float32Attribute([0, 0, 0, 0, 0, 1], 3));
        this.x = [
            [new THREE.Mesh(arrowGeometry, new SectionGizmoMaterial({color: 0xff0000})), [0.5, 0, 0], [0, 0, -Math.PI / 2]],
            [new THREE.Line(lineXGeometry, new SectionGizmoLineMaterial({color: 0xff0000}))]
        ];
        this.y = [
            [new THREE.Mesh(arrowGeometry, new SectionGizmoMaterial({color: 0x00ff00})), [0, 0.5, 0]],
            [new THREE.Line(lineYGeometry, new SectionGizmoLineMaterial({color: 0x00ff00}))]
        ];

        this.z = [
            [new THREE.Mesh(arrowGeometry, new SectionGizmoMaterial({color: 0x0000ff})), [0, 0, 0.5], [Math.PI / 2, 0, 0]],
            [new THREE.Line(lineZGeometry, new SectionGizmoLineMaterial({color: 0x0000ff}))]
        ];

        this.xyz = [
            [new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), new SectionGizmoMaterial({
                color: 0xffffff,
                opacity: 0.25
            })), [0, 0, 0],
                [0, 0, 0]
            ]
        ];

        this.xy = [
            [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.29, 0.29), new SectionGizmoMaterial({
                color: 0xffff00,
                opacity: 0.25
            })),
                [0.15, 0.15, 0]
            ]
        ];

        this.yz = [
            [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.29, 0.29), new SectionGizmoMaterial({
                color: 0x00ffff,
                opacity: 0.25
            })),
                [0, 0.15, 0.15],
                [0, Math.PI / 2, 0]
            ]
        ];

        this.xz = [
            [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.29, 0.29), new SectionGizmoMaterial({
                color: 0xff00ff,
                opacity: 0.25
            })),
                [0.15, 0, 0.15],
                [-Math.PI / 2, 0, 0]]
        ];

    }
}
