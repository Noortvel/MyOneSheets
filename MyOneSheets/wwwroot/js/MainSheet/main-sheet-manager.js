
class MainSheetManager {
    parentNode = null;
    mainSheetList = [];
    activeButton = null;
    editor = null;
    updateSet = null;
    debaunceTimerId = null;
    debaunceTime = 2000;//2 sec
    inOperationObjects = [];
    constructor(parentNode) {
        let thisElement = this;
        this.parentNode = parentNode;
        this.updateSet = new Set();
        document.getElementById('editor').addEventListener('change', function () {
            thisElement.onEditorTextChanged(this.value);
        })
    }
    initEditor(editor) {
        this.editor = editor;
    }
    static get onclickColor() { return 'bg-lightgray'; }
    static get defaultColor() { return 'bg-white' };
    static get onEditColor() { return 'bg-lightgreenm' };

    createMainSheetElement(item) {

        let node = window.document.createElement("input");
        let sheet = new MainSheet(node, new MainSheetModel(item.id, item.header, item.body));
        node.value = sheet.model.header;

        node.type = "text";
        node.readOnly = true;
        node.classList.add("list-group-item", "form-control", "button-editable", "bg-white");
        const thisElement = this;
        node.ondblclick = () => {
            thisElement.onStartEditElement(sheet);//node
        };
        node.onmousedown = (event) => {
            thisElement.onActiveElement(sheet);//event.target
        };
        node.onblur = (event) => {
            thisElement.onLooseActiveElement(sheet);//event.target
        };
        node.onchange = () => {
            thisElement.onElChanged(sheet);
        };

        this.mainSheetList.push(sheet);
        this.parentNode.appendChild(node);
    }
    onEditorTextChanged(value) {
        if (this.activeButton.model.body != this.editor.value) {
            if (this.debaunceTimerId != null) {
                clearTimeout(this.debaunceTimerId);
            }
            let sheet = this.activeButton;
            sheet.model.body = value;
            this.updateSet.add(sheet);
            let thisObject = this;
            this.debaunceTimerId = setTimeout(() => { thisObject.updateModelsFromTime(); }, this.debaunceTime);
        }
    }
    onElChanged(sheet) {
        console.log("headerChanged");
        if (this.debaunceTimerId != null) {
            clearTimeout(this.debaunceTimerId);
        }
        sheet.model.header = sheet.domElement.value;
        this.updateSet.add(sheet);
        let thisObject = this;
        this.debaunceTimerId = setTimeout(() => { thisObject.updateModelsFromTime(); }, this.debaunceTime);
    }
    onStartEditElement(sheet) {
        let element = sheet.domElement;
        element.removeAttribute("readonly");
        element.classList.remove(MainSheetManager.onclickColor);
        element.classList.add(MainSheetManager.onEditColor);
        element.focus();
    }
    onActiveElement(sheet) {
        if (this.activeButton != sheet) {
            if (this.activeButton != null) {
                this.activeButton.domElement.classList.remove(MainSheetManager.onclickColor);
                this.activeButton.domElement.classList.add(MainSheetManager.defaultColor);
            }
            sheet.domElement.classList.add(MainSheetManager.onclickColor);
            sheet.domElement.classList.remove(MainSheetManager.defaultColor);
            this.editor.value = sheet.model.body;
            this.activeButton = sheet;
        }
    }
    onLooseActiveElement(sheet) {
        sheet.domElement.classList.remove(MainSheetManager.onEditColor);
        if (sheet == this.activeButton) {
            sheet.domElement.classList.add(MainSheetManager.onclickColor);
        } else {
            sheet.domElement.classList.add(MainSheetManager.defaultColor);
        }
        sheet.domElement.setAttribute("readonly", "true");
    }
    updateModelsFromTime() {
        this.debaunceTimerId = null;
        this.updateAllModels();
    }
    updateModelsDirectly() {
        if (this.debaunceTimerId != null) {
            clearTimeout(this.debaunceTimerId);
            this.debaunceTimerId = null;
        }
        this.updateAllModels();
    }
    updateAllModels() {
        //console.log("Update models " + this.updateSet);
        for (let item of this.updateSet) {
            this.inOperationObjects.push(item);
            item.model.update(() => {
                this.inOperationObjects = this.inOperationObjects.filter(itemO => itemO !== item)
            });
        }
        this.updateSet.clear()
    }
    deleteMainSheetElement(sheet) {
        this.parentNode.removeChild(sheet.domElement)
        this.mainSheetList = this.mainSheetList.filter(item => item !== sheet)
        if (this.mainSheetList.length > 0) {
            this.onActiveElement(this.mainSheetList[this.mainSheetList.length - 1]);
        } else {
            this.activeButton = null;
        }
        this.inOperationObjects.push(sheet);
        sheet.model.delete(() => {
            this.inOperationObjects = this.inOperationObjects.filter(item => item !== sheet)
        });
    }
}