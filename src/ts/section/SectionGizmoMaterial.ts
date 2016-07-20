/**
 * Created by imaker on 7/19/2016.
 */
class SectionGizmoMaterial extends THREE.MeshBasicMaterial {
    public depthTest:boolean;
    public depthWrite:boolean;
    public side:THREE.Side;
    public transparent:boolean;
    public oldColor:THREE.Color;
    public oldOpacity:number;

    constructor(parameters?:THREE.MeshBasicMaterialParameters) {
        super();
        this.depthTest = false;
        this.depthWrite = false;
        this.side = THREE.FrontSide;
        this.transparent = true;
        this.setValues(parameters);
        this.oldColor = this.color.clone()
        this.oldOpacity = this.opacity;
    }

    /**
     * 设置裁切视图工具的gizmos材质高亮.
     * @param highlighted
     */
    public highlight(highlighted:boolean) {
        if (highlighted) {
            this.color.setRGB(1, 1, 0);
            this.opacity = 1;
        } else {
            this.color.copy(this.oldColor);
            this.opacity = this.oldOpacity;
        }
    }
}