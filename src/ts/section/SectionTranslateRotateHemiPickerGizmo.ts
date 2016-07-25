/**
 * Created by imaker on 7/21/2016.
 */
class SectionTranslateRotateHemiPickerGizmo {
    public xyz:[(THREE.Mesh | number[]|boolean)[]];

    constructor() {
        this.xyz = [
            [new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), new SectionGizmoMaterial({
                color: 0x0000ff
            })),
                null,
                null,
                false
            ]
        ];
    }
}
