/**
 * Created by imaker on 7/19/2016.
 */
class SectionGizmoLineMaterial extends THREE.LineBasicMaterial {
    public depthTest:boolean;
    public depthWrite:boolean;
    public transparent:boolean;
    public lineWidth:number;
    public oldColor:THREE.Color;
    public oldOpacity:number;

    constructor(parameters?:THREE.LineBasicMaterialParameters) {
        super();
        this.depthTest = false;
        this.depthWrite = false;
        this.transparent = true;
        this.lineWidth = 1;
        this.setValues(parameters);
        this.oldColor = this.color.clone();
        this.oldOpacity = this.opacity;
    }

    /**
     * 设置视图裁切工具的gizmo的材质高亮.
     * @param highlighted
     */
    public highlight(highlighted) {
        if (highlighted) {
            this.color.setRGB(1, 1, 0);
            this.opacity = 1;
        } else {
            this.color.copy(this.oldColor);
            this.opacity = this.oldOpacity;
        }
    }

}
