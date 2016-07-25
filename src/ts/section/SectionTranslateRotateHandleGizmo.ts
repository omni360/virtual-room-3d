/**
 * Created by imaker on 7/21/2016.
 */
class SectionTranslateRotateHandleGizmo {
    public z:[(THREE.Mesh | number[])[]];
    public rx:[(THREE.Mesh|number[])[]];
    public ry:[(THREE.Mesh|number[])[]];

    constructor() {
        let arrowGeometry = new THREE.Geometry();
        let mesh = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.05, 0.2, 12, 1, false));
        mesh.position.y = 0.5;
        mesh.updateMatrix();
        arrowGeometry.merge(mesh.geometry, mesh.matrix);
        this.z = [
            [new THREE.Mesh(arrowGeometry, new SectionGizmoMaterial({color: 0xffffff})),
                [0, 0, 0.25],
                [Math.PI / 2, 0, 0]
            ],
            [new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 4, 1, false), new SectionGizmoMaterial({
                color: 0xffffff
            })),
                [0, 0, 0.5],
                [Math.PI / 2, 0, 0]
            ]
        ];
        this.rx = [
            [new THREE.Mesh(new THREE.TorusGeometry(1, 0.015, 12, 60, 0.3 * Math.PI), new SectionGizmoMaterial({
                color: 0xff0000,
            })),
                [0, 0, 0],
                [0.15 * Math.PI, -Math.PI / 2, 0]
            ],
            [new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.015, 60, 1, false), new SectionGizmoMaterial({
                color:0xff0000,
            })), [0, 0, 1],
                [Math.PI / 2, 0, 0]
            ]
        ];
        this.ry = [
            [new THREE.Mesh(new THREE.TorusGeometry(1, 0.015, 12, 60, 0.3 * Math.PI), new SectionGizmoMaterial({
                color: 0x0000ff
            })),
                [0, 0, 0],
                [Math.PI / 2, 0, 0.35 * Math.PI]
            ],
            [new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.01, 60, 1, false), new SectionGizmoMaterial({
                color: 0x0000ff
            })),
                [0, 0, 1]
            ]
        ];
    }
}