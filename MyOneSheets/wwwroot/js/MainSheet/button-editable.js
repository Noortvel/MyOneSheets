;
const onclickColor = 'bg-lightgray';
const defaultColor = 'bg-white';
const onEditColor = 'bg-lightgreenm';

let buttons = $('.button-editable');
let activeButton = buttons[0];

buttons.each((index, element) => {
    element.ondblclick = () => {
        element.removeAttribute("readonly");
        element.classList.remove(onclickColor);
        element.classList.add(onEditColor);
        element.focus();
    };
    element.onblur = (event) => {
        event.target.classList.remove(onEditColor);
        if (event.target == activeButton) {
            event.target.classList.add(onclickColor);
        } else {
            event.target.classList.add(defaultColor);
        }
        event.target.setAttribute("readonly", "true");
    }
    element.onmousedown = (event) => {
        if (activeButton != event.target) {
            console.log("active" + activeButton.value);
            console.log("current" + event.target.value);
            activeButton.classList.remove(onclickColor);
            activeButton.classList.add(defaultColor);
            event.target.classList.add(onclickColor);
            event.target.classList.remove(defaultColor);
            activeButton = event.target;
        }
    };
});