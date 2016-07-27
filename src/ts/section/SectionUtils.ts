/**
 * Created by imaker on 7/26/2016.
 */

class SectionUtils {
    /**
     * 获得指定Object3D对象的boundingbox.
     * @param object
     * @returns {Box3}
     */
    public static getBoundingBox(object:THREE.Object3D):THREE.Box3 {
        let box = new THREE.Box3().setFromObject(object);
        return box;
    }

    /**
     * 在场景中添加一个模型界限的立方体
     * @param object {THREE.Object3D}
     * @param container {THREE.Scene}
     */
    public static addVisibleBoundingBox(object:THREE.Object3D, container:THREE.Scene):void {
        let boxhelper = new THREE.BoxHelper(object);
        boxhelper.rotateX(-Math.PI / 2);
        boxhelper.translateZ(-1);
        container.add(boxhelper);

    }

    /**
     * 转换模型坐标系,将左手坐标系转换为右手坐标系.
     * @param object
     * @returns {THREE.Object3D | boolean}
     */
    public static leftToRight(object:THREE.Object3D):THREE.Object3D|boolean {
        if (object instanceof THREE.Object3D) {
            object.rotateX(-Math.PI / 2);
            object.translateZ(-1);
            return object;
        } else {
            console.log(object);
            return false;
        }
    }
}
