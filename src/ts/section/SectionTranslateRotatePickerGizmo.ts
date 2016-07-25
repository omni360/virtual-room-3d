/**
 * Created by imaker on 7/21/2016.
 */
class SectionTranslateRotatePickerGizmo {
    public z:[(THREE.Mesh|number[])[]];
    public rx:[(THREE.Mesh|number[])[]];
    public ry:[(THREE.Mesh|number[])[]];

    constructor() {
        this.z = [
            [new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.65, 4, 1, false), new SectionGizmoMaterial({
                color: 0x0000ff,
                opacity: 0.25
            })), [0, 0, 0.5],
                [Math.PI / 2, 0, 0]
            ]
        ];
        this.rx = [
            [new THREE.Mesh(new THREE.TorusGeometry(1, 0.12, 4, 12, 2 * Math.PI), new SectionGizmoMaterial({
                color: 0xff0000,
                opacity: 0.25
            })),
                [0, 0, 0],
                [0.15 * Math.PI, -Math.PI / 2, 0]
            ]
        ];
        this.ry = [
            [new THREE.Mesh(new THREE.TorusGeometry(1, 0.12, 4, 12, 2 * Math.PI), new SectionGizmoMaterial({
                color: 0x0000ff,
                opacity: 0.25
            })),
                [0, 0, 0],
                [Math.PI / 2, 0, 0.35 * Math.PI]
            ]
        ];
    }

}
