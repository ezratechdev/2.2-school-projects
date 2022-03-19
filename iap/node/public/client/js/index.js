window.onload = async event => {
	const token = localStorage.getItem("authkey");
	if (!token) {
		window.location.href = "../index.html";
	}

	// nav bar
	const mobileBtn = document.getElementById('mobile-cta')
	nav = document.querySelector('nav')
	mobileBtnExit = document.getElementById('mobile-exit');

	mobileBtn.addEventListener('click', () => {
		nav.classList.add('menu-btn');
	})

	mobileBtnExit.addEventListener('click', () => {
		nav.classList.remove('menu-btn');
	})
	// end of navbar


	// create boxes

	const listHolder = document.getElementsByClassName("list")[0];
	const BoxCreator = ({ name, description, state, id, requested, whohas , taken }) => {
		// listHolder.innerHTML = ``;
		let newBox = document.createElement("div");
		newBox.setAttribute("id",id);
		newBox.classList.add("box");
		const div1 = document.createElement('div');
		// div 1
		const h2 = document.createElement("h2");
		h2.classList.add('box-name');
		h2.innerHTML = name;
		const p = document.createElement("p");
		p.classList.add('box-desc');
		p.innerHTML = description;
		div1.appendChild(h2);
		div1.appendChild(p)
		// div2
		const div2 = document.createElement("div");
		div2.classList.add("box-actions");

		const button1 = document.createElement("button");
		button1.innerHTML = "Request"



		// 
		div2.appendChild(button1)
		// appends
		newBox.appendChild(div1)
		newBox.appendChild(div2)
		// append the box
		listHolder.appendChild(newBox);
	}
	// end of create boxes

    // get available equipments
    const getAvailable = async ()=>{
        await fetch("/client/getavailable",{
            method:"GET",
            headers:new Headers({
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`,
            }),
            body:null,
        })
        .then(data => data.json())
        .then(result => {
            const { error , message , equipments } = result;
            if(error){
                console.log("Unable to get available equipments")
            }
            equipments.forEach(equipment =>{
                const { description , equipmentID , name , requested , state , taken , whohas} = equipment;
                BoxCreator({
                    name,
                    description,
                })
            });
        })
        .catch(error => console.log(error));
    }
    await getAvailable();
    // end of get available equipments


	// start of box animations
	const boxes = document.querySelectorAll('.box');

	window.addEventListener('scroll', checkBoxes);

	checkBoxes();

	function checkBoxes() {
		const triggerBottom = window.innerHeight / 5 * 4;
		boxes.forEach((box, idx) => {
			const boxTop = box.getBoundingClientRect().top;

			if (boxTop < triggerBottom) {
				box.classList.add('show');
			} else {
				box.classList.remove('show');
			}
		});
	}
	// end of box animation
    // logout functionality
	const logOut = document.getElementById("logOut");
	logOut.addEventListener("click" , async event=>{
		localStorage.removeItem("authkey");
		// ../cs
		window.location.href = "../index.html";
	})
}