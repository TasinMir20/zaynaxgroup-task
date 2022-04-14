const BASE_URL = window.origin;

function authorizationCheckUserDataLoad() {
	const apiUrl = `${BASE_URL}/api/admin`;
	fetch(apiUrl, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			authorization: `Bearer ${localStorage.getItem("adminToken")}`,
		},
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			if (data.user) {
				console.log(data.user);
				document.querySelector(".admin-content #user-name").innerHTML = data.user.username;
				document.querySelector(".admin-content").classList.remove("hide");
				orderListLoad();
			} else {
				document.querySelector(".admin-login").classList.remove("hide");
			}
		});
}

authorizationCheckUserDataLoad();

// login/SingUp
document.querySelector(".admin-login #sing-up").addEventListener("click", function (e) {
	e.preventDefault();
	const username = document.querySelector(".admin-login #user-id").value;
	const password = document.querySelector(".admin-login #password").value;

	const apiUrl = `${BASE_URL}/api/auth/admin`;
	fetch(apiUrl, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({ username, password }),
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			console.log(data);
			if (!data.issue) {
				localStorage.setItem("adminToken", data.adminJwtToken);

				document.querySelector(".admin-login").classList.add("hide");
				document.querySelector(".admin-content").classList.remove("hide");
				orderListLoad();
				authorizationCheckUserDataLoad();
			} else {
				if (data.issue.username) {
					document.querySelector(".admin-login .user-id-wrap .msg").innerHTML = data.issue.username;
				} else {
					document.querySelector(".admin-login .user-id-wrap .msg").innerHTML = "";
				}

				if (data.issue.password) {
					document.querySelector(".admin-login .password-wrap .msg").innerHTML = data.issue.password;
				} else {
					document.querySelector(".admin-login .password-wrap .msg").innerHTML = "";
				}
			}
		});
});

function orderListLoad(status) {
	let apiUrl = `${BASE_URL}/api/admin/orders`;
	window.orderListAllTab = true;
	if (status) {
		apiUrl = `${BASE_URL}/api/admin/orders?status=${status}`;
		window.orderListAllTab = false;
	}
	fetch(apiUrl, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			authorization: `Bearer ${localStorage.getItem("adminToken")}`,
		},
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			const allLoadBtn = document.querySelector(".admin-content .order-section .all");
			const pendingLoadBtn = document.querySelector(".admin-content .order-section .pending");
			const confirmedLoadBtn = document.querySelector(".admin-content .order-section .confirmed");
			const canceledLoadBtn = document.querySelector(".admin-content .order-section .canceled");
			if (!status) {
				pendingLoadBtn.classList.remove("color");
				confirmedLoadBtn.classList.remove("color");
				canceledLoadBtn.classList.remove("color");
				allLoadBtn.classList.add("color");
			} else if (status == "pending") {
				allLoadBtn.classList.remove("color");
				confirmedLoadBtn.classList.remove("color");
				canceledLoadBtn.classList.remove("color");
				pendingLoadBtn.classList.add("color");
			} else if (status == "confirmed") {
				allLoadBtn.classList.remove("color");
				pendingLoadBtn.classList.remove("color");
				canceledLoadBtn.classList.remove("color");
				confirmedLoadBtn.classList.add("color");
			} else if (status == "canceled") {
				allLoadBtn.classList.remove("color");
				pendingLoadBtn.classList.remove("color");
				confirmedLoadBtn.classList.remove("color");
				canceledLoadBtn.classList.add("color");
			}
			console.log(data);
			if (data.order) {
				let element = "";
				for (const order of data.order) {
					let auction = "";

					if (order.status == "pending") {
						auction = `<button id="do-confirm" onclick="orderAction('${order._id}', 'confirm')">Confirm</button>
					<button id="do-cancel" onclick="orderAction('${order._id}', 'cancel')">Cancel</button>`;
					}

					element += `<div class="list-data ${"cl" + order._id}">
						<div class="quantity">${order.sl}</div>
						<div class="order-no">${order.orderId}</div>
						<div class="item-price">${order.price}</div>
						<div class="action">
							${auction}
						</div>
						<div class="status">${order.status}</div>
					</div>`;
				}

				document.querySelector(".admin-content .order-section #list-wrap").innerHTML = element;
			} else {
				// document.querySelector(".admin-login").classList.remove("hide");
			}
		});
}

function orderAction(id, actionFor) {
	let apiUrl = `${BASE_URL}/api/admin/orders-action/${id}/${actionFor}`;
	fetch(apiUrl, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			authorization: `Bearer ${localStorage.getItem("adminToken")}`,
		},
		method: "PATCH",
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			console.log(data);

			if (data.message) {
				if (!window.orderListAllTab) {
					document.querySelector(`.admin-content .order-section #list-wrap .cl${id}`).remove();
				} else {
					document.querySelector(`.admin-content .order-section #list-wrap .cl${id} .action`).innerHTML = "";

					if (actionFor == "confirm") {
						document.querySelector(`.admin-content .order-section #list-wrap .cl${id} .status`).innerHTML = "Confirmed";
					} else if (actionFor == "cancel") {
						document.querySelector(`.admin-content .order-section #list-wrap .cl${id} .status`).innerHTML = "Canceled";
					}
				}
			}
		});
}
