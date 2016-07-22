/**
 * Created by imaker on 7/20/2016.
 */
class SectionGizmoTranslateRotate extends SectionGizmo {
    public activeMode:string;
    public handleGizmos:SectionTranslateRotateHandleGizmo;
    public pickerGizmos:SectionTranslateRotatePickerGizmo;
    public subPickerGizmos:SectionTranslateRotateSubPickerGizmo;
    public highlightGizmos:SectionTranslateRotationHighlightGizmo;
    public hemiPickerGizmos:SectionTranslateRotateHemiPickerGizmo;

    constructor() {
        super();
        this.handleGizmos = new SectionTranslateRotateHandleGizmo();
        this.pickerGizmos = new SectionTranslateRotatePickerGizmo();
        this.subPickerGizmos = new SectionTranslateRotateSubPickerGizmo();
        this.highlightGizmos = new SectionTranslateRotationHighlightGizmo();
        this.hemiPickerGizmos = new SectionTranslateRotateHemiPickerGizmo();
    }

    public setActivePlane(axis:string, eye:THREE.Vector3) {
        if ("translate" == this.activeMode) {

        }
    }

}
