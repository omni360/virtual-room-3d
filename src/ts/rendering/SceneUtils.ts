class SceneUtils {

    static shadowsEnabled = purl().param("shadows") == "true" ? true : false;
    static cliped = purl().param("cliped") === "true" ? true : false;

    //noinspection TypeScriptUnresolvedFunction
    static colladaLoader = new THREE.ColladaLoader();

    static loadScene(path:string):JQueryDeferred<THREE.Object3D> {
        var promise:JQueryDeferred<THREE.Object3D> = jQuery.Deferred<THREE.Object3D>();
        this.colladaLoader.load(path, (collada) => {
            if (SceneUtils.cliped) {
                let clipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.8);
                collada.scene.traverse((object)=> {
                    if (object instanceof THREE.Mesh) {
                        object.material.clippingPlanes = [clipPlane];
                        object.material.clipShadows = true;
                    }
                });
            }
            if (SceneUtils.shadowsEnabled) {
                collada.scene.traverse(function (object) {
                    if (object instanceof THREE.Mesh) {
                        var mesh = <THREE.Mesh> object;
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                    }
                    if (object instanceof THREE.Light) {
                        var light = <THREE.Light> object;
                        light.castShadow = true;
                        //noinspection TypeScriptUnresolvedVariable
                        (light as any).shadowDarkness = 0.6;
                    }
                });
            }
            promise.resolve(collada.scene);
        });
        return promise;
    }
}
