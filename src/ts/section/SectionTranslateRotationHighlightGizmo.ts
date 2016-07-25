/**
 * Created by imaker on 7/21/2016.
 */
class SectionTranslateRotationHighlightGizmo {
    public z:any[];
    public rx:[(THREE.Mesh|number[]|boolean)[]];
    public ry:[(THREE.Mesh|number[]|boolean)[]];

    constructor() {
        this.z = [];
        this.rx = [
            [new THREE.Mesh(new THREE.TorusGeometry(1, 0.02, 12, 60, 2 * Math.PI), new SectionGizmoMaterial({
                color: 0xfffff,
                opacity: 1
            })),
                [0, 0, 0],
                [0, -Math.PI / 2, -Math.PI / 2],
                false]
        ];
        this.ry = [
            [new THREE.Mesh(new THREE.TorusGeometry(1, 0.02, 12, 60, 2 * Math.PI), new SectionGizmoMaterial({
                color: 0x0000ff,
                opacity: 1
            })),
                [0, 0, 0],
                [Math.PI / 2, 0, 0],
                false
            ]
        ];
    }

}
