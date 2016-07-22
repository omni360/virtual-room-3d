///<reference path="../../typings/tsd.d.ts"/>

const sceneRotationSpeed = 0.1;

/**
 * Entry point.
 */
class EntryPoint {

    renderer:THREE.WebGLRenderer;
    controls:THREE.OrbitControls;
    sectionControls:SectionControls;
    // transformControls:TransformContrls;
    clock = new THREE.Clock(true);

    scene:THREE.Scene;
    camera:THREE.PerspectiveCamera;
    root:THREE.Object3D;

    viewFactory:ViewFactory = new DefaultViewFactory();
    virtualDeviceManager:VirtualDeviceManager = new VirtualDeviceManager();

    backend:MockRemoteService = new MockRemoteService();

    /**
     * Starts the app.
     * @param parent DOM element where the scene will be rendered
     */
    constructor(private parent:JQuery) {
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(parent.width(), parent.height());
        this.renderer.setClearColor(0x80aaff);


        this.scene = new THREE.Scene();
        this.root = new THREE.Object3D();
        this.scene.add(this.root);
        this.scene.add(new THREE.AmbientLight(0x202020));

        this.camera = new THREE.PerspectiveCamera(45, parent.width() / parent.height(), 0.1, 1000);
        this.camera.position.set(15, 10, 16);
        this.camera.lookAt(this.scene.position);
        this.scene.add(this.camera);

        // init section tools
        this.sectionControls = new SectionControls(this.camera, this.renderer.domElement);
        this.scene.add(this.sectionControls);
        // this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

    }

    /**
     * Performs the app initialization.
     * @param model the scene
     */
    private init(model:THREE.Object3D) {

        var dashboard = $(".dashboard");
        this.initLight("Main Light (slow)", model.getObjectByName("Light1"), dashboard);
        this.initLight("Small Blue Light (slow)", model.getObjectByName("Light2"), dashboard);
        this.initMainDoor(model, dashboard);
        this.initBlinds(model, dashboard);
        this.initFan(model, dashboard);
        this.initSectionControls(model,dashboard);
        this.test();

        model.rotateX(-Math.PI / 2);
        model.translateZ(-1);
        this.root.add(model);

        this.parent.html("").append(this.renderer.domElement).resize(() => {
            this.camera.aspect = this.parent.width() / this.parent.height();
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.parent.width(), this.parent.height());
        });
    }

    private initLight(label:string, target:THREE.Object3D, dashboard:JQuery) {
        var brightness = new ValueParameter(1);
        this.viewFactory.makeOnOff(label, brightness, dashboard);
        var totalBrightness = new CombinedParameter(brightness, this.backend.getMaxBrightness());
        var light = new VirtualLight(target, totalBrightness);
        this.virtualDeviceManager.addDevice(light);
    }

    private initMainDoor(model:THREE.Object3D, dashboard:JQuery) {
        var position = new ValueParameter(0);
        this.viewFactory.makeOnOff("Main Door", position, dashboard);
        var door = model.getObjectByName("Door");
        var j1 = new RevoluteJoint(door,
            new THREE.Vector3(6.0746, -6.52308, 0),
            new THREE.Vector3(0, 0, 1),
            0, -Math.PI / 3, position);
        this.virtualDeviceManager.addDevice(j1);
    }

    private initSectionControls(model:THREE.Object3D, dashboard:JQuery) {
        let door = model.getObjectByName("Fan");
        this.sectionControls.attach(door);
        this.sectionControls.setMode("translate");
    }

    private initBlinds(model:THREE.Object3D, dashboard:JQuery) {
        var position = new ValueParameter(0);
        this.viewFactory.makeOnOff("Blinds", position, dashboard);
        var blind1 = model.getObjectByName("Blind1");
        var j1 = new PrismaticJoint(blind1,
            blind1.position.clone(),
            blind1.position.clone().add(new THREE.Vector3(0.9, 0, 0)),
            position);
        this.virtualDeviceManager.addDevice(j1);
        var blind2 = model.getObjectByName("Blind2");
        var j2 = new PrismaticJoint(blind2,
            blind2.position.clone(),
            blind2.position.clone().add(new THREE.Vector3(-0.9, 0, 0)),
            position);
        this.virtualDeviceManager.addDevice(j2);
    }

    private initFan(model:THREE.Object3D, dashboard:JQuery) {
        var power = new ValueParameter(0);
        this.viewFactory.makeOnOff("Fan", power, dashboard);
        var fan = model.getObjectByName("Fan");
        var motor = new RotationalMotor(fan, new THREE.Vector3(0, 0, 1), 10, power);
        this.virtualDeviceManager.addDevice(motor);
    }

    private test() {
        var secGizmo = new SectionGizmo();
    }

    private initSectionTool() {
        const sectionTool = new SectionTool();
        const gizmo = sectionTool.getGizmo();
        console.log(gizmo);
    }

    private render() {
        requestAnimationFrame(() => this.render());
        var delta = this.clock.getDelta();
        // this.root.rotation.y += delta * sceneRotationSpeed;
        // this.controls.update();
        this.sectionControls.update();
        this.virtualDeviceManager.update(delta);
        this.renderer.render(this.scene, this.camera);
    }

    /** Starts the app. */
    start() {
        SceneUtils.loadScene("./models/room.dae").done((model) => {
            this.init(model);
            this.render();
        });
    }
}

$(document).ready(function () {
    console.log(purl().param("shadows"));
    new EntryPoint($(".scene")).start();
});
