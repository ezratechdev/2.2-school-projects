window.onload = async event =>{
    console.log("hi am the admin page")
    const token = localStorage.getItem("authkey");
    if(!token){
        window.location.href = "../app.html";
    }
    // box animation
    const boxes = document.querySelectorAll('.box');

window.addEventListener('scroll', checkBoxes);

checkBoxes();

function checkBoxes() {
	const triggerBottom = window.innerHeight / 5 * 4;
	boxes.forEach((box, idx) => {
		const boxTop = box.getBoundingClientRect().top;
		
		if(boxTop < triggerBottom) {
			box.classList.add('show');
		} else {
			box.classList.remove('show');
		}
	});
}
// end of box animation
    console.log("user has token ... proceed")
}