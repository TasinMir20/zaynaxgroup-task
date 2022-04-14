const BASE_URL = window.origin;

let path = window.location.pathname;
path = path.replace(/^\/|\/$/g, ""); // remove first and last slash

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

if (path === "admin/orders" || path === "admin") {
	orderListLoad();
} else if (path === "admin/products") {
	productLoad();
} else if (path === "admin/promo-code") {
	promoCodeLoad();
}

function orderListLoad(status) {
	history.pushState({}, null, window.location.origin + `/admin/orders`);
	let apiUrl = `${BASE_URL}/api/admin/orders`;
	window.orderListAllTab = true;

	console.log(status);
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
			document.querySelector(".product-section").classList.add("hide");
			document.querySelector(".promo-code-section").classList.add("hide");
			document.querySelector(".order-section").classList.remove("hide");

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

function productLoad() {
	history.pushState({}, null, window.location.origin + `/admin/products`);
	document.querySelector(".order-section").classList.add("hide");
	document.querySelector(".promo-code-section").classList.add("hide");
	document.querySelector(".product-section").classList.remove("hide");
	document.querySelector(".product-section .product-add").classList.add("hide");
	document.querySelector(".product-section .products").classList.remove("hide");

	const apiUrl = `${BASE_URL}/api/admin/products`;
	fetch(apiUrl, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			authorization: `Bearer ${localStorage.getItem("adminToken")}`,
		},
		method: "GET",
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			if (data.products) {
				const products = data.products;
				let itemsElement = "";
				for (const product of products) {
					itemsElement += `<div class="item">
							<div class="image-warp">
								<img src="${product.image}" alt="" />
							</div>
							<div class="content">
								<p class="product-name">${product.name}</p>
								<div class="rate-wrap">
									<p class="price">
										<span class="currency">BDT.</span>
										<span class="amount">${product.priceAfterDiscount}</span>
									</p>
									<p class="discount-rate">
										<span class="rate">${product.discountRate}</span>
										<span class="percentage">%</span>
									</p>
								</div>
							</div>
						</div>`;
				}

				document.querySelector(".product-section .products .product-list").innerHTML = itemsElement;
			}
		});
}

document.querySelector(".left-side .product-bar").addEventListener("click", productLoad);

document.querySelector("#add-product").addEventListener("click", function (e) {
	document.querySelector(".product-section .products").classList.add("hide");
	document.querySelector(".product-section .product-add").classList.remove("hide");

	//  Add Product form input box clear
	const img = document.querySelector("#product-image");
	img.value = img.defaultValue;
	document.querySelector("#product-name").value = "";
	document.querySelector("#product-price").value = "";
	document.querySelector("#discount-rate").value = "";
	document.querySelector("#shipping-charge").value = "";
	document.querySelector("#color").value = "";
	document.querySelector("#size").value = "";
	document.querySelector("#active").checked = false;

	// Add Product form error message clear
	document.querySelector("#product-add-form .image span.msg").innerHTML = "";
	document.querySelector("#product-add-form .product-name span.msg").innerHTML = "";
	document.querySelector("#product-add-form .product-price  span.msg").innerHTML = "";
	document.querySelector("#product-add-form .discount-rate  span.msg").innerHTML = "";
	document.querySelector("#product-add-form .shipping-charge  span.msg").innerHTML = "";
	document.querySelector("#product-add-form .color  span.msg").innerHTML = "";
	document.querySelector("#product-add-form .size  span.msg").innerHTML = "";
});

document.querySelector("#create-product").addEventListener("click", function (e) {
	e.preventDefault();
	const productImage = document.querySelector("#product-image");
	const productName = document.querySelector("#product-name");
	const productPrice = document.querySelector("#product-price");
	const discountRate = document.querySelector("#discount-rate");
	const shippingCharge = document.querySelector("#shipping-charge");
	const color = document.querySelector("#color");
	const size = document.querySelector("#size");
	const active = document.querySelector("#active");

	const form = document.querySelector("#product-add-form");
	const formData = new FormData(form);
	formData.append("image", productImage);
	formData.append("name", productName.value);
	formData.append("price", productPrice.value);
	formData.append("discountRate", discountRate.value);
	formData.append("shippingCharge", shippingCharge.value);
	formData.append("color", color.value);
	formData.append("size", size.value);
	formData.append("active", active.checked ? "yes" : "no");

	const apiUrl = `${BASE_URL}/api/admin/products-add`;
	fetch(apiUrl, {
		method: "POST",
		headers: {
			authorization: `Bearer ${localStorage.getItem("adminToken")}`,
		},
		body: formData,
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			if (data.addedProduct) {
				productImage.value = productImage.defaultValue;

				overlayMessageShow("Your Product Added Successfully", 3000);
				productLoad();
			} else {
				const issue = data.issue;
				if (issue.image) {
					document.querySelector("#product-add-form .image span.msg").innerHTML = issue.image;
				} else {
					document.querySelector("#product-add-form .image span.msg").innerHTML = "";
				}
				if (issue.name) {
					document.querySelector("#product-add-form .product-name span.msg").innerHTML = issue.name;
				} else {
					document.querySelector("#product-add-form .product-name span.msg").innerHTML = "";
				}

				if (issue.price) {
					document.querySelector("#product-add-form .product-price  span.msg").innerHTML = issue.price;
				} else {
					document.querySelector("#product-add-form .product-price  span.msg").innerHTML = "";
				}

				if (issue.discountRate) {
					document.querySelector("#product-add-form .discount-rate  span.msg").innerHTML = issue.discountRate;
				} else {
					document.querySelector("#product-add-form .discount-rate  span.msg").innerHTML = "";
				}

				if (issue.shippingCharge) {
					document.querySelector("#product-add-form .shipping-charge  span.msg").innerHTML = issue.shippingCharge;
				} else {
					document.querySelector("#product-add-form .shipping-charge  span.msg").innerHTML = "";
				}

				if (issue.color) {
					document.querySelector("#product-add-form .color  span.msg").innerHTML = issue.color;
				} else {
					document.querySelector("#product-add-form .color  span.msg").innerHTML = "";
				}

				if (issue.size) {
					document.querySelector("#product-add-form .size span.msg").innerHTML = issue.size;
				} else {
					document.querySelector("#product-add-form .size  span.msg").innerHTML = "";
				}
			}
		});
});

function promoCodeLoad() {
	history.pushState({}, null, window.location.origin + `/admin/promo-code`);
	document.querySelector(".order-section").classList.add("hide");
	document.querySelector(".product-section").classList.add("hide");
	document.querySelector(".promo-code-section").classList.remove("hide");
	document.querySelector(".promo-code-section .promocode-add").classList.add("hide");
	document.querySelector(".promo-code-section .promocodes").classList.remove("hide");

	const apiUrl = `${BASE_URL}/api/admin/promo-codes`;
	fetch(apiUrl, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			authorization: `Bearer ${localStorage.getItem("adminToken")}`,
		},
		method: "GET",
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			const promoCodes = data.promoCodes;
			if (promoCodes) {
				let itemsElement = "";
				for (const promoCode of promoCodes) {
					let createdTime = promoCode.createdAt;
					let startDate = promoCode.startDate;
					let endDate = promoCode.endDate;
					let activeDeactive = promoCode.active === "yes" ? "active" : "deactive";

					createdTime = toDoLocaleString(createdTime);
					startDate = toDoLocaleString(startDate).split(",")[1];
					endDate = toDoLocaleString(endDate).split(",")[1];

					function toDoLocaleString(timestamp) {
						timestamp = new Date(timestamp);
						let timeLocalString = timestamp.toLocaleString();
						timeLocalString = timeLocalString.split(",");
						timeLocalString = `${timeLocalString[1]}, ${timeLocalString[0]}`;
						return timeLocalString;
					}

					itemsElement += `<div class="item">
						<div class="top">
							<div class="the-promo-code">
								<p>${promoCode.code}</p>
							</div>
							<div class="btns">
								<button class="edit">Edit</button>
								<button onclick="promoCodeActiveDeactive(this, '${promoCode._id}')" class="${activeDeactive === "active" ? "deactive" : "active"}">${activeDeactive === "active" ? "deactive" : "active"}</button>
							</div>
						</div>
						<div class="bottom">
							<div class="">Created at: ${createdTime}</div>
							<div class="usages-time">Usages: ${promoCode.usedTime}</div>
							<div class="use-limit">Usages limit: ${promoCode.useTimeLimit}</div>
							<div class="discount-rate">Discount Rate: ${promoCode.discountRate}%</div>
							<div class="start-date">Start Date: ${startDate}</div>
							<div class="end-date">End Date: ${endDate}</div>
						</div>
					</div>`;
				}

				document.querySelector(".admin-content .right-side .promo-code-section .promocodes-list").innerHTML = itemsElement;
			}
		});
}

document.querySelector(".left-side #promotion").addEventListener("click", promoCodeLoad);
document.querySelector(".left-side #promo-code").addEventListener("click", promoCodeLoad);

function promoCodeActiveDeactive(self, id) {
	const apiUrl = `${BASE_URL}/api/admin/promo-codes/${id}`;
	fetch(apiUrl, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			authorization: `Bearer ${localStorage.getItem("adminToken")}`,
		},
		method: "PUT",
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			if (data.msg) {
				if (data.msg === "activated") {
					self.classList.remove("active");
					self.classList.add("deactive");
					self.innerHTML = "deactive";
				} else if (data.msg === "deactivated") {
					self.classList.remove("deactive");
					self.classList.add("active");
					self.innerHTML = "active";
				}
			}
		});
}

function promoCodeAddPageShow() {
	history.pushState({}, null, window.location.origin + `/admin/promo-code`);
	document.querySelector(".order-section").classList.add("hide");
	document.querySelector(".product-section").classList.add("hide");
	document.querySelector(".promo-code-section").classList.remove("hide");
	document.querySelector(".promo-code-section .promocodes").classList.add("hide");
	document.querySelector(".promo-code-section .promocode-add").classList.remove("hide");

	// Add Promo code form input box clear
	document.querySelector("#promo-code-in").value = "";
	document.querySelector("#discount-rate-in").value = "";
	document.querySelector("#use-time-in").value = "";
	document.querySelector("#p-active").checked = false;

	// Add Promo code form error message clear
	document.querySelector("#promo-code-add-form .promo-code span.msg").innerHTML = "";
	document.querySelector("#promo-code-add-form .start-date span.msg").innerHTML = "";
	document.querySelector("#promo-code-add-form .end-date span.msg").innerHTML = "";
	document.querySelector("#promo-code-add-form .discount-rate span.msg").innerHTML = "";
	document.querySelector("#promo-code-add-form .use-time span.msg").innerHTML = "";
	document.querySelector("#promo-code-add-form .active span.msg").innerHTML = "";
}

document.querySelector("#add-promo-code").addEventListener("click", promoCodeAddPageShow);
document.querySelector("#add-promocode-btn").addEventListener("click", promoCodeAddPageShow);

function addPromoCode(e) {
	e.preventDefault();

	const thePromoCode = document.querySelector("#promo-code-in");
	const startDate = document.querySelector("#start-date-picker span");
	const endDate = document.querySelector("#end-date-picker span");
	const discountRate = document.querySelector("#discount-rate-in");
	const useTime = document.querySelector("#use-time-in");
	const active = document.querySelector("#p-active");

	const apiUrl = `${BASE_URL}/api/admin/promo-codes`;
	fetch(apiUrl, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			authorization: `Bearer ${localStorage.getItem("adminToken")}`,
		},
		method: "POST",
		body: JSON.stringify({
			theCode: thePromoCode.value,
			startDate: startDate.innerText,
			endDate: endDate.innerText,
			discountRate: discountRate.value,
			useTimeLimit: useTime.value,
			active: active.checked ? "yes" : "no",
		}),
	})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			if (data.addedPromoCode) {
				overlayMessageShow("Your Promo Code Added Successfully", 3000);
				promoCodeLoad();
				console.log(data.addedPromoCode);
			} else {
				const issue = data.issue;
				if (issue.theCode) {
					document.querySelector("#promo-code-add-form .promo-code span.msg").innerHTML = issue.theCode;
				} else {
					document.querySelector("#promo-code-add-form .promo-code span.msg").innerHTML = "";
				}
				if (issue.startDate) {
					document.querySelector("#promo-code-add-form .start-date span.msg").innerHTML = issue.startDate;
				} else {
					document.querySelector("#promo-code-add-form .start-date span.msg").innerHTML = "";
				}
				if (issue.endDate) {
					document.querySelector("#promo-code-add-form .end-date span.msg").innerHTML = issue.endDate;
				} else {
					document.querySelector("#promo-code-add-form .end-date span.msg").innerHTML = "";
				}
				if (issue.discountRate) {
					document.querySelector("#promo-code-add-form .discount-rate span.msg").innerHTML = issue.discountRate;
				} else {
					document.querySelector("#promo-code-add-form .discount-rate span.msg").innerHTML = "";
				}
				if (issue.useTimeLimit) {
					document.querySelector("#promo-code-add-form .use-time span.msg").innerHTML = issue.useTimeLimit;
				} else {
					document.querySelector("#promo-code-add-form .use-time span.msg").innerHTML = "";
				}

				if (issue.active) {
					document.querySelector("#promo-code-add-form .active span.msg").innerHTML = issue.active;
				} else {
					document.querySelector("#promo-code-add-form .active span.msg").innerHTML = "";
				}
			}
		});
}

document.querySelector("#create-promo-code").addEventListener("click", addPromoCode);

function overlayMessageShow(message, duration) {
	document.querySelector(".form-submit-overlay-message .wrap .msg").innerHTML = message;
	document.querySelector(".form-submit-overlay-message").classList.remove("hide");
	setTimeout(() => {
		document.querySelector(".form-submit-overlay-message").classList.add("hide");
	}, duration);
}
