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
	const BoxCreator = ({ name, description, state, id, requested, whohas , taken , image }) => {
		// listHolder.innerHTML = ``;
		let newBox = document.createElement("div");
		newBox.setAttribute("id",id);
		newBox.classList.add("box");
		const div1 = document.createElement('div');
		// div 1
		const h2 = document.createElement("h2");
		h2.classList.add('box-name');
		h2.innerHTML = name;
		// 
		const img = document.createElement("img");
		img.classList.add("img-display")
		img.setAttribute("src",image);
		// 
		const p = document.createElement("p");
		p.classList.add('box-desc');
		p.innerHTML = description;
		div1.appendChild(h2);
		div1.appendChild(p)
		div1.appendChild(img);
		// div2
		const div2 = document.createElement("div");
		div2.classList.add("box-actions");

		const button1 = document.createElement("button");
		button1.innerHTML = `${(requested == "true" && whohas.length > 0) ? (taken == "false") ? "Lease out" : "Approve Return" : "No return Action"}`;

		button1.addEventListener("click", async () => {
			console.log("hi",requested,whohas.length);
			if ((requested == "true" && whohas.length > 0 && taken == "false")) {
				console.log("am running",id);
				await fetch(`/admin/approve/${id}`, {
					method: "GET",
					headers: new Headers({
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`,
					}),
					body: null,
				})
					.then(data => data.json())
					.then(results => {
						// change the inner html
						console.log(results,"from approve point")
						window.location.href = window.location.href;
					})
					.catch(error => console.log(error));
			} else {
				await fetch(`/admin/return/${id}`, {
					method: "GET",
					headers: new Headers({
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`,
					}),
					body: null,
				})
					.then(data => data.json())
					.then(results => {
						// change the inner html
						console.log(results,"from return point")
						window.location.href = window.location.href;
					})
					.catch(error => console.log(error))
			}
		});

		// 
		const button2 = document.createElement("button");
		button2.innerHTML = `${(state == "present") ? "Delete" : "Restore"}`;
		button2.addEventListener("click", async () => {
			console.log(id);
			await fetch(`/admin/delete/${id}`, {
				method: "GET",
				headers: new Headers({
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				}),
				boy: null,
			})
				.then(data => data.json())
				.then(result => {
					console.log(result)
					let { href }= window.location;
					window.location.href = href;
				})
				.catch(error => console.log(error));
		});
		// 
		const button3 = document.createElement("button");
		button3.innerHTML = `Update`;
		button3.addEventListener("click" , async event =>{
			sessionStorage.setItem("equipmentID",id);
			window.location.href = './html/update.html';
		});

		// 
		const button4 = document.createElement("button");
		button4.innerHTML = `Remove`;
		button4.addEventListener("click" , async event =>{
			await fetch("/admin/permanentdelete" , {
				method:"DELETE",
				headers: new Headers({
					'Content-Type':'application/json',
					'Authorization':`Bearer ${token}`
				}),
				body:JSON.stringify({
					equipmentID:id,
				}),
			})
			.then(data => data.json())
			.then(result =>{
				window.location.href = window.location.href;
				alert(result.message);
			})
			.catch(error => {
				alert(error.message);
			})
		});
		// 
		div2.appendChild(button1)
		div2.appendChild(button2)
		div2.appendChild(button3)
		div2.appendChild(button4)
		// appends
		newBox.appendChild(div1)
		newBox.appendChild(div2)
		// append the box
		listHolder.appendChild(newBox);
	}
	// end of create boxes

	// get all equipments
	const getAllEquipments = async () => {
		await fetch("/admin/getall", {
			method: "GET",
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			}),
			body: null,
		})
			.then(data => data.json())
			.then(result => {
				console.log(result);
				const { equipments, error, message } = result;
				if (!error && !equipments) {
					console.log("unable to fetch equipments")
				}
				listHolder.innerHTML = ``;
				equipments.forEach(equipment => {
					const { description, equipmentID, name, requested, state, taken, whohas , image } = equipment;
					BoxCreator({
						name,
						description,
						state,
						id: equipment.equipmentID,
						requested: equipment.requested,
						whohas,
						taken,
						image,
					});
				})
			})
			.catch(error => console.log(error, "error data"));
	}
	await getAllEquipments();
	// generate random name for file name
	const randomName = (type)=>{
		const fileType = type.split(".")[1];
		return `${Math.floor(150 * Math.random())}--i${Math.floor(150 * Math.random())}-ma-${Math.floor(150 * Math.random())}--ge-${Math.floor(150 * Math.random())}.${fileType}`;
	}
	// end of get all equipments
	// creating an equipment
	const createEquipment = document.getElementById("createEquipment");
	createEquipment.addEventListener("submit", async event => {
		event.preventDefault();
		const { name, description , image } = createEquipment;
		image.files[0].name = `${randomName(image.files[0].name)}`;
		console.log(image.files[0].name);
		const formData = new FormData();
		formData.append("name",name.value);
		formData.append("description",description.value);
		formData.append("image",image.files[0]);
		await fetch("/admin/create", {
			method: "POST",
			headers: new Headers({
				// 'Content-Type': 'multipart/form-data', // from application/json
				'Authorization': `Bearer ${token}`,
			}),
			body:formData,
			// body: JSON.stringify({
			// 	name: name.value,
			// 	description: description.value,
			// })
		})
			.then(data => data.json())
			.then(result => {
				const { id, error, message } = result;
				if (id && !error) {
					console.log(message, "equipments created", error, id);
				} else {
					console.log(message, "equipment not created", error, id);
				}
				// console.log(message, "equipments obtained", error, id);
				createEquipment.reset();
				let { href }= window.location;
				window.location.href = href;
			})
			.catch(error => {
				console.log(error);
			})
	});
	// end of equipment creation

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

	const logOut = document.getElementById("logOut");
	logOut.addEventListener("click" , async event=>{
		localStorage.removeItem("authkey");
		// ../cs
		window.location.href = "../index.html";
	})

	// modal 
	// Get modal Elements
const modal = document.querySelector('#my-modal');
const modalBtn = document.querySelector('#modal-btn');
const closeBtn = document.querySelector('.close');

// Events
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

// Open
function openModal() {
  modal.style.display = 'block';
}

// Close
function closeModal() {
  modal.style.display = 'none';
}

// Close If Outside Click
function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
}

}