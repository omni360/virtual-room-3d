class SceneUtils {

  static shadowsEnabled = purl().param("shadows") == "true" ? true : false;

  //noinspection TypeScriptUnresolvedFunction
  static colladaLoader = new (THREE as any).ColladaLoader();

  static loadScene(path: string): JQueryDeferred<THREE.Object3D> {
    var promise: JQueryDeferred<THREE.Object3D> = jQuery.Deferred<THREE.Object3D>();
    this.colladaLoader.load(path, (collada) => {
      if (SceneUtils.shadowsEnabled) {
        collada.scene.traverse(function(object) {
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
