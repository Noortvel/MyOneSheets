let editor = null;

function loadEditor()
{
    editor = new Jodit("#editor", {
        "minHeight": window.innerHeight * 0.9,
        "useSearch": false,
        "spellcheck": true,
        "direction": "ltr",
        "enter": "DIV",
        "toolbarAdaptive": false,
        "buttons": "|,bold,strikethrough,underline,italic,eraser,|,superscript,subscript,|,ul,ol,|,outdent,indent,|,font,fontsize,brush,paragraph,table,link,|,align,undo,redo,\n,selectall,cut,copy,paste,copyformat"
    });
    editor.value = '';
}
let noRecords = $('#no-records-selector');// document.getElementById('no-records-selector');

let mainSheetManager = new MainSheetManager($('#recordsList').get(0));
let xhr = new XMLHttpRequest();
xhr.open('GET', 'MainSheet/Get', true);
xhr.send();

xhr.onreadystatechange = function () {
    if (xhr.readyState != 4) return;
    if (xhr.status != 200) {
        console.log(xhr.status + ': ' + xhr.statusText);
    } else {
        let records = JSON.parse(xhr.responseText);
        records.forEach((item, i, arr) => {
            mainSheetManager.createMainSheetElement(item);//item.id, item.header, item.body
            //console.log(JSON.stringify(item));
        });
        let loadSpinner = $('#loader-spinner-selector');//document.getElementById('loader-spinner-selector');
        if (mainSheetManager.mainSheetList.length > 0) {
            //loadSpinner.hide();
            loadSpinner.remove();
            loadEditor();
            mainSheetManager.initEditor(editor);
            let node = mainSheetManager.mainSheetList[0];
            mainSheetManager.onActiveElement(node);
            editor.value = node.body;
        }
        else {
            //console.log("HIDE");
            //console.log(loadSpinner);

            loadSpinner.removeClass('d-flex');
            loadSpinner.addClass('d-none');
            noRecords.removeClass('d-none');

        }
    }
};

document.getElementById('addButton').onclick = () => {
    let record = new MainSheetModel(-1, 'Record#' + mainSheetManager.mainSheetList.length, '');
    record.create(() => {
        mainSheetManager.createMainSheetElement(record);

        if (editor == null) {
            noRecords.addClass('d-none');
            loadEditor();
            mainSheetManager.initEditor(editor);
            let node = mainSheetManager.mainSheetList[0];
            mainSheetManager.onActiveElement(node);
            editor.value = node.body;
        } else {
            mainSheetManager.onActiveElement(mainSheetManager.mainSheetList[mainSheetManager.mainSheetList.length - 1]);
            noRecords.addClass('d-none');
            $('.jodit').removeClass('d-none');
        }
    });
};

let removeModalRecordNamesElements = document.getElementsByClassName('removed-record-name-selector');
document.getElementById('removeButton').addEventListener("click", () =>
{
    for (let item of removeModalRecordNamesElements) {
        item.innerHTML = mainSheetManager.activeButton.model.header;
    }
});
//removeButtonForce
document.getElementById('removeButtonForce').addEventListener("click", () => {
    mainSheetManager.deleteMainSheetElement(mainSheetManager.activeButton);
    console.log(mainSheetManager.mainSheetList.length);
    if (mainSheetManager.mainSheetList.length == 0) {
        noRecords.removeClass('d-none');
        $('.jodit').addClass('d-none');
    } else {
        //mainSheetManager.onActiveElement(mainSheetManager.mainSheetList[mainSheetManager.mainSheetList.length - 1]);
        //console.log(mainSheetManager.activeButton);
    }
});