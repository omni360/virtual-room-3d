/**
 * Created by imaker on 7/19/2016.
 */
class SectionTool{
    private gizmo:string;
    // private sectionHelperManager:SectionHelperManager;
    constructor(){
        this.gizmo = 'section Tool';
        // this.sectionHelperManager = new SectionHelperManager();
    }
    public getGizmo():string{
        return this.gizmo;
    }
    public testSectionHelperManger(){
        SectionHelperManager.instance();

    }
}