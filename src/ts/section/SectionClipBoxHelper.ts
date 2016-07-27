/**
 * Created by imaker on 7/25/2016.
 */
class SectionClipBoxHelper extends THREE.Object3D {
    private container:THREE.Object3D;
    private boxHelper:THREE.BoxHelper;
    public planes:THREE.Plane[];
    private sectionMeshs:SectionMesh[];
    private planeNormals:THREE.Vector3[];
    private planeConstant:number[];
    private planeSizes:number[][];

    constructor(container:THREE.Object3D) {
        super();
        this.container = container;
        this.planeNormals = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(0, -1, 0),
            new THREE.Vector3(0, 0, -1)
        ];
        this.planeConstant = [
            1, 1, 1, 1, 1, 1
        ];
        this.planeSizes = [
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1]
        ];
        this.planes = new Array<THREE.Plane>();

        this.sectionMeshs = new Array<SectionMesh>();
        let box = this.getInitBox(this.container);
        this.boxHelper = new THREE.BoxHelper();
        this.boxHelper.update(box as any);

    }

    public getPlanes():THREE.Plane[] {
        return this.planes;
    }

    public getBoxHelper():THREE.BoxHelper {
        return this.boxHelper;

    }

    public getInitPlanes():SectionMesh[] {
        const visibleBox = this.getInitBox(this.container);
        const visibleBoxCenter = visibleBox.center();
        const halfVisibleBox = new THREE.Box3(visibleBox.min, visibleBoxCenter);
        const Ilength = this.planeNormals.length;
        const planeMaterial = new THREE.MeshBasicMaterial({
            opacity: 0.5,
            color: new THREE.Color().setHSL(Math.random() * 1.0, 1, 0.5).getHex(),
            side: THREE.DoubleSide,
            depthTest: false,
            depthWrite: false,
            transparent: true
        });
        for (let i = 0; i < Ilength; i++) {
            let plane = new THREE.Plane(this.planeNormals[i], 3);
            this.planes.push(plane);

            let planegeo:THREE.PlaneBufferGeometry;
            if (this.planeNormals[i].y === 0 && this.planeNormals[i].z === 0) {
                planegeo = new THREE.PlaneBufferGeometry(this.getdepth(), this.getheight());
                planegeo.lookAt(this.planeNormals[i]);
                if (this.planeNormals[i].x === 1) {
                    planegeo.translate(this.getwidth() / 2, 0, this.getdepth() / 2)// visibleBox.max.z / 2);
                } else {
                    planegeo.translate(-1 * this.getwidth() / 2, 0, this.getdepth() / 2);
                }
            }
            if (this.planeNormals[i].x === 0 && this.planeNormals[i].z === 0) {
                planegeo = new THREE.PlaneBufferGeometry(this.getwidth(), this.getdepth());
                planegeo.lookAt(this.planeNormals[i]);
                if (this.planeNormals[i].y === 1) {
                    planegeo.translate(0, this.getheight() / 2, this.getdepth() / 2);
                } else {
                    planegeo.translate(0, -1 * this.getheight() / 2, this.getdepth() / 2);
                }
            }

            if (this.planeNormals[i].x === 0 && this.planeNormals[i].y === 0) {
                planegeo = new THREE.PlaneBufferGeometry(this.getwidth(), this.getheight());
                planegeo.lookAt(this.planeNormals[i]);
                if (this.planeNormals[i].z === 1) {
                    planegeo.translate(0, 0, 0);
                } else {
                    planegeo.translate(0, 0, this.getdepth());
                }

            }
            let sectionmesh = new SectionMesh(planegeo, planeMaterial, plane);
            this.sectionMeshs.push(sectionmesh);
        }
        console.log(this.sectionMeshs);
        return this.sectionMeshs;

    }

    private getdistance(index:number) {
        const visibleBox = this.getInitBox(this.container);
        const visibleBoxCenter = visibleBox.center();
        const halfVisibleBox = new THREE.Box3(visibleBox.min, visibleBoxCenter);
        const Ilength = this.planeNormals.length;

        let constant = -1 * visibleBoxCenter.dot(this.planeNormals[index]);
        let plane = new THREE.Plane(this.planeNormals[index], constant);
        let orthoPointMax:THREE.Vector3;
        let orthoPointMin:THREE.Vector3;
        let distance:number;
        orthoPointMax = plane.orthoPoint(visibleBox.max);
        orthoPointMin = plane.orthoPoint(visibleBox.min);
        distance = new THREE.Vector3().subVectors(orthoPointMax, orthoPointMin).length();
        return distance;

    }

    private getwidth() {
        return this.getdistance(0);

    }

    private getheight() {
        return this.getdistance(1);
    }

    private getdepth() {
        return this.getdistance(2);
    }

    private getDirection(index:number):string {
        return "123";
    }

    private getInitBox(container:THREE.Object3D):THREE.Box3 {
        let box = SectionUtils.getBoundingBox(container);
        return box;
    }
}
