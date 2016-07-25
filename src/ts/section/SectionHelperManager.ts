/**
 * Created by imaker on 7/25/2016.
 */
class SectionHelperManager {
    private static _instance:SectionHelperManager;

    constructor() {
        console.log("SectionHelperManager is inited");
    }

    public static instance():SectionHelperManager {
        if (this._instance === null || this._instance === undefined) {
            this._instance = new SectionHelperManager();
        }
        return this._instance;
    }
}