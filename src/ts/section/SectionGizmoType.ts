/**
 * Created by imaker on 7/20/2016.
 */
class SectionGizmoType{
    public translate:SectionGizmoTranslate;
    public rotate:SectionGizmoRotate;
    public scale:SectionGizmoScale;
    public transrotate:SectionGizmoTranslateRotate;
    constructor(){
        this.translate = new SectionGizmoTranslate();
        this.rotate = new SectionGizmoRotate();
        this.scale = new SectionGizmoScale();
        this.transrotate = new SectionGizmoTranslateRotate();
    }
}
