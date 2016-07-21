/**
 * Created by imaker on 7/21/2016.
 */
class SectionArrowGeometry extends THREE.CylinderGeometry {
    public radiusTop:number;
    public radiusBottom:number;
    public height:number;
    public radiusSegments:number;
    public heightSegments:number;
    public openEnded:boolean;

    constructor() {
        super();
        this.radiusTop = 0;
        this.radiusBottom = 0.05;
        this.height = 0.2;
        this.radiusSegments = 12;
        this.heightSegments = 1;
        this.openEnded = false;
    }

    public static getArrowGeomety():THREE.Geometry {
        let arrowGeometry = new THREE.Geometry();
        let mesh = new THREE.Mesh(new SectionArrowGeometry());
        mesh.position.y = 0.5;
        mesh.updateMatrix();
        arrowGeometry.merge(mesh.geometry, mesh.matrix);
        return arrowGeometry;
    }

}
