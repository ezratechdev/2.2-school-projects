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
				.then(result => console.log(result))
				.catch(error => console.log(error));
		});
		// 
		const button3 = document.createElement("button");
		button3.innerHTML = `Update`;
		button3.addEventListener("click" , async event =>{
			sessionStorage.setItem("equipmentID",id);
			window.location.href = './html/update.html';
		})
		// 
		div2.appendChild(button1)
		div2.appendChild(button2)
		div2.appendChild(button3)
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
				const { equipments, error, message } = result;
				if (!error && !equipments) {
					console.log("unable to fetch equipments")
				}
				listHolder.innerHTML = ``;
				equipments.forEach(equipment => {
					const { description, equipmentID, name, requested, state, taken, whohas } = equipment;
					console.log(equipment);
					BoxCreator({
						name,
						description,
						state,
						id: equipment.equipmentID,
						requested: equipment.requested,
						whohas,
						taken,
					});
				})
			})
			.catch(error => console.log(error, "error data"));
	}
	await getAllEquipments();
	// end of get all equipments
	// creating an equipment
	const createEquipment = document.getElementById("createEquipment");
	createEquipment.addEventListener("submit", async event => {
		event.preventDefault();
		const { name, description } = createEquipment;
		await fetch("/admin/create", {
			method: "POST",
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			}),
			body: JSON.stringify({
				name: name.value,
				description: description.value,
			})
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
}