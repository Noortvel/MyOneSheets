;
class MainSheetModel {
    constructor(id, header, body) {
        this.id = id;
        this.author_id = "None";
        this.header = header;
        this.body = body;
    }
    update(callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'MainSheet/Update', true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        let json = JSON.stringify(this);
        xhr.send(json);
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                console.log(xhr.status + ': ' + xhr.statusText);
            } else {
                console.log('UPDATE OK, 200');
                callback();
            }
        };
    }
    create(callback) {
        let thisObject = this;
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'MainSheet/Create', true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        let json = JSON.stringify(this);
        xhr.send(json);
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                console.log(xhr.status + ': ' + xhr.statusText);
            } else {
                console.log('CREATE OK, 200')
                thisObject.id = parseInt(JSON.parse(xhr.responseText));
                callback();
            }
        };
    }
    delete(callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'MainSheet/Delete', true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        let json = JSON.stringify(this.id);
        xhr.send(json);
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                console.log(xhr.status + ': ' + xhr.statusText);
            } else {
                console.log('DELETE OK, 200')
                callback();
            }
        };
    }
}
class MainSheet {
    constructor(domElement, model) {
        this.domElement = domElement;
        this.model = model;
    }
}