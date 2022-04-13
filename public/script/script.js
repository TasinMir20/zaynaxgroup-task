const BASE_URL = window.origin;

// Login check STart
const apiUrl = `${BASE_URL}/api/customer`;
fetch(apiUrl, {
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		authorization: `Bearer ${localStorage.getItem("token")}`,
	},
	method: "GET",
}).then((response) => {
	if (response.status != 401) {
		document.querySelector(".header .login-form-show").classList.add("hide");
		document.querySelector(".header .user-icon").classList.remove("hide");
	}
	return response.json();
});

// Login check ENd

let path = window.location.pathname;

path = path.replace(/^\/|\/$/g, ""); // remove first and last slash

if (path !== "home/cart") {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());

	if (params.search) {
		document.querySelector(".search-box").value = params.search;
		searchQuery(params.search);
	}

	const apiUrl = `${BASE_URL}/api/home/products`;
	fetch(apiUrl)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
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
                    <div class="overlay">
                        <button onclick="addToCart('${product._id}')" class="btn-add-to-cart">Add to card</button>
                    </div>
                </div>`;
			}

			document.querySelector(".body-content .default-product .warp").innerHTML = itemsElement;
		});
} else {
	document.querySelector(".body-content").classList.add("hide");
	document.querySelector(".checkout-page").classList.remove("hide");

	// Cart product fetch
	cartProductFetch();
}

// Cart added item count
const currentCartItem = localStorage.getItem("cartItems");
const cartItemElement = document.querySelector(".header .container .add-to-cart .count");
if (currentCartItem) {
	try {
		const cartItems = JSON.parse(currentCartItem);
		cartItemElement.innerText = cartItems.length;
	} catch (e) {
		cartItemElement.innerText = 0;
		console.log(e);
	}
} else {
	cartItemElement.innerText = 0;
}

let interval = null;
document.querySelector(".search-box").addEventListener("keyup", function () {
	const thisValue = this.value;

	if (thisValue) {
		let path = window.location.pathname;
		path = path.replace(/^\/|\/$/g, ""); // remove first and last slash

		if (path !== "home/cart") {
			if (interval != null) {
				clearInterval(interval);
			}

			interval = setTimeout(function () {
				history.pushState({}, null, window.location.pathname + `?search=${thisValue}`);
				const apiUrl = `${BASE_URL}/api/home/products?search=${thisValue}`;
				fetch(apiUrl)
					.then((response) => {
						return response.json();
					})
					.then((data) => {
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
									<div class="overlay">
										<button onclick="addToCart('${product._id}')" class="btn-add-to-cart">Add to card</button>
									</div>
								</div>`;
						}
						document.querySelector(".body-content .default-product").classList.add("hide");
						document.querySelector(".body-content .searched-product").classList.remove("hide");
						document.querySelector(".body-content .searched-product .warp").innerHTML = itemsElement;
					});
			}, 600);
		}
	} else {
		history.pushState({}, null, window.location.pathname);
		document.querySelector(".body-content .searched-product").classList.add("hide");
		document.querySelector(".body-content .default-product").classList.remove("hide");
	}
});

function searchQuery(searchKeyWord) {
	const apiUrl = `${BASE_URL}/api/home/products?search=${searchKeyWord}`;
	fetch(apiUrl)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
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
                        <div class="overlay">
                            <button onclick="addToCart('${product._id}')" class="btn-add-to-cart">Add to card</button>
                        </div>
                    </div>`;
			}
			document.querySelector(".body-content .default-product").classList.add("hide");
			document.querySelector(".body-content .searched-product").classList.remove("hide");
			document.querySelector(".body-content .searched-product .warp").innerHTML = itemsElement;
		});
}

function addToCart(productId) {
	let currentCartItem = localStorage.getItem("cartItems");

	if (currentCartItem) {
		try {
			const cartItems = JSON.parse(currentCartItem);

			if (!cartItems.includes(productId)) {
				cartItems.push(productId);
				localStorage.setItem("cartItems", JSON.stringify(cartItems));
			}
		} catch (e) {
			localStorage.setItem("cartItems", JSON.stringify([productId]));
			console.log(e);
		}
	} else {
		localStorage.setItem("cartItems", JSON.stringify([productId]));
	}

	let cartItems = JSON.parse(localStorage.getItem("cartItems"));
	document.querySelector(".header .container .add-to-cart .count").innerText = cartItems.length;
}

function removeToCart(productId, productPrice, shippingCharge) {
	productPrice = parseInt(productPrice, 10) || 0;
	shippingCharge = parseInt(shippingCharge, 10) || 0;
	const item = document.querySelector(`.cl${productId}`);
	const currentTotalPrice = document.querySelector(`.cl${productId} .total-price`);
	const currentQuantity = document.querySelector(`.cl${productId} .inc-element`);
	item.remove();

	let currentCartItem = localStorage.getItem("cartItems");
	if (currentCartItem) {
		try {
			const cartItems = JSON.parse(currentCartItem);
			if (cartItems.includes(productId)) {
				const cartItemsExceptRemovedItems = cartItems.filter(function (item) {
					return productId != item;
				});
				localStorage.setItem("cartItems", JSON.stringify(cartItemsExceptRemovedItems));
				document.querySelector(".header .container .add-to-cart .count").innerText = cartItemsExceptRemovedItems.length;
				document.querySelector(".checkout-page .checkout-body .order-details .subtotal .item-count").innerHTML = cartItemsExceptRemovedItems.length;

				const subtotal = document.querySelector(".checkout-page .checkout-body .order-details .subtotal .value");
				subtotal.innerHTML = Number(subtotal.innerHTML) - productPrice * Number(currentQuantity.innerHTML);
				const totalShippingCharge = document.querySelector(".checkout-page .checkout-body .order-details .shipping-charge .value");
				totalShippingCharge.innerHTML = Number(totalShippingCharge.innerHTML) - shippingCharge;
				const totalPayable = document.querySelector(".checkout-page .checkout-body .order-details .total-payable .value");
				const cal = window.totalPayableWithoutPromoCodeApply - Number(currentTotalPrice.innerHTML); // Ok
				totalPayable.innerHTML = cal;
				window.totalPayableWithoutPromoCodeApply = cal;
			}
		} catch (e) {
			console.log(e);
		}
	}
}

function productQualityIncrement(productId, productPrice, shippingCharge) {
	productPrice = parseInt(productPrice, 10) || 0;
	shippingCharge = parseInt(shippingCharge, 10) || 0;

	const currentQuantity = document.querySelector(`.cl${productId} .quantity .inc-element`);
	currentQuantity.innerHTML = Number(currentQuantity.innerHTML) + 1;

	const totalPrice = document.querySelector(`.cl${productId} .total-price`);
	totalPrice.innerHTML = Number(totalPrice.innerHTML) + productPrice;

	const currentSubtotal = document.querySelector(".checkout-page .checkout-body .order-details .subtotal .value");
	currentSubtotal.innerHTML = Number(currentSubtotal.innerHTML) + productPrice;
	const currentPayable = document.querySelector(".checkout-page .checkout-body .order-details .total-payable .value");
	const cal = window.totalPayableWithoutPromoCodeApply + productPrice; // Ok
	currentPayable.innerHTML = cal;
	window.totalPayableWithoutPromoCodeApply = cal;
}

function productQualityDecrement(productId, productPrice, shippingCharge) {
	productPrice = parseInt(productPrice, 10) || 0;
	shippingCharge = parseInt(shippingCharge, 10) || 0;

	const currentQuantity = document.querySelector(`.cl${productId} .quantity .inc-element`);
	if (Number(currentQuantity.innerHTML) > 1) {
		currentQuantity.innerHTML = Number(currentQuantity.innerHTML) - 1;

		const totalPrice = document.querySelector(`.cl${productId} .total-price`);
		totalPrice.innerHTML = Number(totalPrice.innerHTML) - productPrice;

		const currentSubtotal = document.querySelector(".checkout-page .checkout-body .order-details .subtotal .value");

		currentSubtotal.innerHTML = Number(currentSubtotal.innerHTML) - productPrice;
		const currentPayable = document.querySelector(".checkout-page .checkout-body .order-details .total-payable .value");
		const cal = window.totalPayableWithoutPromoCodeApply - productPrice; // Ok
		currentPayable.innerHTML = cal;
		window.totalPayableWithoutPromoCodeApply = cal;
	}
}

// check out page show
document.querySelector(".header .bar .add-to-cart").addEventListener("click", function () {
	document.querySelector(".body-content").classList.add("hide");
	document.querySelector(".checkout-page").classList.remove("hide");
	history.pushState({}, null, window.location.origin + `/home/cart`);

	// Cart product fetch
	cartProductFetch();
});

function cartProductFetch() {
	let cartItems = [];
	try {
		let currentCartItem = localStorage.getItem("cartItems");
		cartItems = JSON.parse(currentCartItem);
	} catch (e) {
		console.log(e);
	}

	const apiUrl = `${BASE_URL}/api/home/cart-list?productIds=` + cartItems;
	fetch(apiUrl)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			const products = data.products;
			let itemsElement = "";
			let subtotal = 0;
			let shippingCharge = 0;
			for (const product of products) {
				subtotal += product.priceAfterDiscount;
				shippingCharge += product.shippingCharge;
				itemsElement += `<div class="item cl${product._id}">
					<div class="inner-part part1">
						<div class="img">
							<img src="${product.image}" alt="" />
						</div>
						<div class="product-data">
							<div class="product-name value">${product.name}</div>
							<div class="other-data">
								<div class="color-size-wrap">
									<div class="color">
										<span>Color:</span>
										<span class="value">${product.color}</span>
									</div>
									<div class="size">
										<span>Size:</span>
										<span class="value">${product.size}</span>
									</div>
								</div>
								<div class="price">
									<span>Product Price: BDT.</span>
									<span class="value">${product.priceAfterDiscount}</span>
								</div>
							</div>
						</div>
					</div>
					<div class="inner-part part">
						<div class="part-inner">
							<div class="one">Shopping Method: EMS</div>
							<div class="two">Shopping Charge: BDT. 
								<span class="value">${product.shippingCharge}</span>
							</div>
						</div>
					</div>
					<div class="inner-part part">
						<div class="part-inner">
							<div class="quantity">
								<p>Quantity:</p>
								<div class="inc">
									<div class="increment inc-dec" onclick="productQualityDecrement('${product._id}', '${product.priceAfterDiscount}', '${product.shippingCharge}')">-</div>
									<div class="inc-element">1</div>
									<div class="decrement inc-dec" onclick="productQualityIncrement('${product._id}', '${product.priceAfterDiscount}', '${product.shippingCharge}')">+</div>
								</div>
							</div>
							<div>Total Price: BDT. 
								<span class="value total-price">${product.priceAfterDiscount + product.shippingCharge}</span>
							</div>
						</div>
					</div>
					<i onclick="removeToCart('${product._id}', '${product.priceAfterDiscount}', '${product.shippingCharge}')" class="remove fa-regular fa-trash-can"></i>
				</div>`;
			}

			document.querySelector(".checkout-page .checkout-body .product-details-wrap").innerHTML = itemsElement; // cart products
			document.querySelector(".checkout-page .checkout-body .order-details .subtotal .value").innerHTML = subtotal;
			document.querySelector(".checkout-page .checkout-body .order-details .subtotal .item-count").innerHTML = products.length;
			document.querySelector(".checkout-page .checkout-body .order-details .shipping-charge .value").innerHTML = shippingCharge;
			const cal = subtotal + shippingCharge;
			document.querySelector(".checkout-page .checkout-body .order-details .total-payable .value").innerHTML = cal;
			window.totalPayableWithoutPromoCodeApply = cal;
		});
}

// login Form Show
document.querySelector(".header .user .login-form-show button").addEventListener("click", function () {
	let path = window.location.pathname;
	path = path.replace(/^\/|\/$/g, ""); // remove first and last slash

	if (path !== "home/cart") {
		document.querySelector(".header").classList.add("hide");
		document.querySelector(".body-content").classList.add("hide");
		document.querySelector(".login-page").classList.remove("hide");
	} else {
		document.querySelector(".header").classList.add("hide");
		document.querySelector(".checkout-page").classList.add("hide");
		document.querySelector(".login-page").classList.remove("hide");
	}
});

// login Form Hide
document.querySelector(".login-page .login-form-warp .cross").addEventListener("click", function () {
	let path = window.location.pathname;
	path = path.replace(/^\/|\/$/g, ""); // remove first and last slash

	if (path !== "home/cart") {
		document.querySelector(".login-page").classList.add("hide");
		document.querySelector(".header").classList.remove("hide");
		document.querySelector(".body-content").classList.remove("hide");
	} else {
		document.querySelector(".login-page").classList.add("hide");
		document.querySelector(".header").classList.remove("hide");
		document.querySelector(".checkout-page").classList.remove("hide");
	}
});

// login/SingUp
document.querySelector(".login-page .login-form-warp #login").addEventListener("click", function (e) {
	e.preventDefault();
	const phone = document.querySelector(".login-page .login-form-warp #phone").value;
	const password = document.querySelector(".login-page .login-form-warp #password").value;

	const apiUrl = `${BASE_URL}/api/auth`;
	fetch(apiUrl, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({ phone, password }),
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			if (!data.issue) {
				localStorage.setItem("token", data.jwtToken);

				document.querySelector(".login-page .login-form-warp #phone").value = "";
				document.querySelector(".login-page .login-form-warp #password").value = "";
				document.querySelector(".login-page .login-form-warp .phone-wrap .msg").innerHTML = "";
				document.querySelector(".login-page .login-form-warp .password-wrap .msg").innerHTML = "";

				document.querySelector(".header .login-form-show").classList.add("hide");
				document.querySelector(".header .user-icon").classList.remove("hide");

				let path = window.location.pathname;
				path = path.replace(/^\/|\/$/g, ""); // remove first and last slash
				if (path !== "home/cart") {
					document.querySelector(".login-page").classList.add("hide");
					document.querySelector(".header").classList.remove("hide");
					document.querySelector(".body-content").classList.remove("hide");
				} else {
					document.querySelector(".login-page").classList.add("hide");
					document.querySelector(".header").classList.remove("hide");
					document.querySelector(".checkout-page").classList.remove("hide");
				}
			} else {
				if (data.issue.phone) {
					document.querySelector(".login-page .login-form-warp .phone-wrap .msg").innerHTML = data.issue.phone;
				} else {
					document.querySelector(".login-page .login-form-warp .phone-wrap .msg").innerHTML = "";
				}

				if (data.issue.password) {
					document.querySelector(".login-page .login-form-warp .password-wrap .msg").innerHTML = data.issue.password;
				} else {
					document.querySelector(".login-page .login-form-warp .password-wrap .msg").innerHTML = "";
				}
			}
		});
});

// Apply Promo code
document.querySelector(".checkout-page #apply-promo-code").addEventListener("click", function (e) {
	const token = localStorage.getItem("token");
	if (token) {
		const promoCode = document.querySelector(".checkout-page #promo-code").value;

		const apiUrl = `${BASE_URL}/api/customer/apply-promo-code`;
		fetch(apiUrl, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			method: "POST",
			body: JSON.stringify({ thePromoCode: promoCode }),
		})
			.then((res) => {
				if (res.status == 401) {
					document.querySelector(".header").classList.add("hide");
					document.querySelector(".checkout-page").classList.add("hide");
					document.querySelector(".login-page").classList.remove("hide");
				}
				return res.json();
			})
			.then((data) => {
				if (!data.issue) {
					console.log(data);
					const msgShow = document.querySelector(".checkout-page .order-details .promo-code .msg-show");
					msgShow.classList.remove("msg");
					msgShow.classList.add("msg-green");
					msgShow.innerHTML = `Congratulations! You have got a ${data.discountRate}% discount.`;

					const subtotal = document.querySelector(".checkout-page .checkout-body .order-details .subtotal .value");
					const currentDiscount = document.querySelector(".checkout-page .order-details .discount .value");
					const discountAmount = Math.floor((data.discountRate / 100) * Number(subtotal.innerHTML));
					currentDiscount.innerHTML = discountAmount;

					const currentTotalPayable = document.querySelector(".checkout-page .checkout-body .order-details .total-payable .value");
					currentTotalPayable.innerHTML = Number(window.totalPayableWithoutPromoCodeApply) - discountAmount;
				} else {
					console.log(data.issue);
					if (data.issue.message) {
						const msgShow = document.querySelector(".checkout-page .order-details .promo-code .msg-show");
						msgShow.classList.remove("msg-green");
						msgShow.classList.add("msg");
						msgShow.innerHTML = data.issue.message;
					}
				}
			});
	} else {
		document.querySelector(".header").classList.add("hide");
		document.querySelector(".checkout-page").classList.add("hide");
		document.querySelector(".login-page").classList.remove("hide");
	}
});

// Login popup if not logged in when try to enter promo code
document.querySelector(".checkout-page #promo-code").addEventListener("keyup", function (e) {
	const token = localStorage.getItem("token");
	if (!(token && token.length > 10)) {
		document.querySelector(".header").classList.add("hide");
		document.querySelector(".checkout-page").classList.add("hide");
		document.querySelector(".login-page").classList.remove("hide");
	}
});

// Order pace - Check out
document.querySelector("#checkout-button").addEventListener("click", function () {
	const select = document.querySelector(".checkout-page .terms-contions #select").checked;
	const productData = [];
	if (select) {
		let currentCartItem = localStorage.getItem("cartItems");
		if (currentCartItem) {
			const enteredPromoCode = document.querySelector(".checkout-page #promo-code").value;

			try {
				cartItems = JSON.parse(currentCartItem);

				for (const cartItem of cartItems) {
					const getCartItemQuantity = document.querySelector(`.cl${cartItem} .quantity .inc-element`);
					if (getCartItemQuantity) {
						const quantity = Number(getCartItemQuantity.innerHTML);
						const itemObj = {
							id: cartItem,
							quantity,
						};
						productData.push(itemObj);
					}
				}
			} catch (e) {
				console.log(e);
			}

			const obj = {
				products: productData,
				promoCode: enteredPromoCode,
			};

			const apiUrl = `${BASE_URL}/api/customer/checkout`;
			let statusCode;
			fetch(apiUrl, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				method: "POST",
				body: JSON.stringify(obj),
			})
				.then((response) => {
					statusCode = response.status;
					return response.json();
				})
				.then(function (data) {
					console.log(data);
					if (!data.issue && statusCode == 201) {
						localStorage.removeItem("cartItems");

						document.querySelector(".header").classList.add("hide");
						document.querySelector(".checkout-page").classList.add("hide");
						document.querySelector(".order-place-msg").classList.remove("hide");
					}

					if (statusCode == 401) {
						document.querySelector(".header").classList.add("hide");
						document.querySelector(".checkout-page").classList.add("hide");
						document.querySelector(".login-page").classList.remove("hide");
					}
				});
		}
	}
});
