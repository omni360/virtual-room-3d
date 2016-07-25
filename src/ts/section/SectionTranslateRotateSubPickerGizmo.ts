/**
 * Created by imaker on 7/21/2016.
 */
class SectionTranslateRotateSubPickerGizmo {
    public z:[(THREE.Mesh|number[])[]];

    constructor() {
        this.z = [
            [new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.65, 4, 1, false), new SectionGizmoMaterial({
                color: 0xff0000,
                opacity: 0.25
            })), [0, 0, 0.5],
                [Math.PI / 2, 0, 0]
            ]
        ];
    }
}