let currentLang = 'ar';
let currentRole = 'worker';

let defaultProducts = [];
let products = JSON.parse(localStorage.getItem('baymed_temu_products')) || defaultProducts;

const translations = {
    ar: {
        loginTitle: 'مرحباً بك في Baymed',
        loginSub: 'اختر طريقة الدخول لتصفح أو إدارة العروض الكبرى',
        txtWorker: 'أعمل في المكتبة',
        txtUser: 'مستخدم شخصي',
        txtSubmitLogin: 'دخول للمتجر',
        workerTitle: 'لوحة التحكم والتصوير الذكي',
        txtCamBtn: 'تصوير بالذكاء الاصطناعي',
        loadText: 'جاري مسح الأداة ضوئياً والتعرف على الاسم والسعر التنافسي...',
        userTitle: 'اكتشف عروضنا اليومية',
        txtNavLogout: 'خروج',
        btnCart: 'أضف للسلة',
        lblTitle: 'اسم المنتج المكتشف',
        lblPrice: 'السعر الحالي (دج)',
        lblOldPrice: 'السعر الأصلي (دج)',
        txtQrCode: 'امسح الكود لزيارة صفحتنا الرسمية على فيسبوك'
    },
    en: {
        loginTitle: 'Welcome to Baymed',
        loginSub: 'Choose entry mode to browse or manage mega offers',
        txtWorker: 'Library Staff',
        txtUser: 'Personal User',
        txtSubmitLogin: 'Enter Store',
        workerTitle: 'Dashboard & Smart Scanning',
        txtCamBtn: 'AI Intelligent Snap',
        loadText: 'Scanning tool, calculating name and competitive price...',
        userTitle: 'Discover Our Daily Deals',
        txtNavLogout: 'Logout',
        btnCart: 'Add to Cart',
        lblTitle: 'Detected Product Title',
        lblPrice: 'Current Price (DA)',
        lblOldPrice: 'Original Price (DA)',
        txtQrCode: 'Scan to visit our official Facebook Page'
    }
};

function setRole(role) {
    currentRole = role;
    document.getElementById('cardWorker').classList.toggle('selected', role === 'worker');
    document.getElementById('cardUser').classList.toggle('selected', role === 'user');
}

function changeLanguage() {
    currentLang = document.getElementById('langSwitcher').value;
    const t = translations[currentLang];
    
    document.getElementById('htmlTag').setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    
    document.getElementById('loginTitle').innerText = t.loginTitle;
    document.getElementById('loginSub').innerText = t.loginSub;
    document.getElementById('txtWorker').innerText = t.txtWorker;
    document.getElementById('txtUser').innerText = t.txtUser;
    document.getElementById('txtSubmitLogin').innerText = t.txtSubmitLogin;
    document.getElementById('workerTitle').innerText = t.workerTitle;
    document.getElementById('txtCamBtn').innerText = t.txtCamBtn;
    document.getElementById('loadText').innerText = t.loadText;
    document.getElementById('userTitle').innerText = t.userTitle;
    document.getElementById('txtNavLogout').innerText = t.txtNavLogout;
    document.getElementById('txtQrCode').innerText = t.txtQrCode;
    
    renderProducts();
}

function handleLogin() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('navLogoutBtn').classList.remove('hidden');
    
    if (currentRole === 'worker') {
        document.getElementById('workerDashboard').classList.remove('hidden');
    } else {
        document.getElementById('userDashboard').classList.remove('hidden');
    }
    renderProducts();
}

function logout() {
    document.getElementById('workerDashboard').classList.add('hidden');
    document.getElementById('userDashboard').classList.add('hidden');
    document.getElementById('navLogoutBtn').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
}

function triggerCamera() {
    document.getElementById('cameraInput').click();
}

function processImage(event) {
    if (event.target.files && event.target.files.length > 0) {
        document.getElementById('loadingStatus').classList.remove('hidden');
        
        setTimeout(() => {
            document.getElementById('loadingStatus').classList.add('hidden');
            
            const randomDemos = [
                { name: 'منظم مكتب خشبي فاخر', price: '950', oldPrice: '1500', icon: 'fa-table' },
                { name: 'قلم حبر جاف أصلي 0.7', price: '90', oldPrice: '150', icon: 'fa-pen-fancy' },
                { name: 'لوحة رسم ألوان مائية سميكة', price: '680', oldPrice: '1100', icon: 'fa-scroll' },
                { name: 'مجموعة دفاتر Baymed المدرسية', price: '450', oldPrice: '600', icon: 'fa-book-open' }
            ];
            
            const chosen = randomDemos[Math.floor(Math.random() * randomDemos.length)];
            
            products.push({
                id: Date.now(),
                name: chosen.name,
                price: chosen.price,
                oldPrice: chosen.oldPrice,
                icon: chosen.icon
            });
            
            saveToStorage();
            renderProducts();
        }, 2500); 
    }
}

function updateProduct(id, field, value) {
    const p = products.find(item => item.id === id);
    if (p) {
        p[field] = value;
        saveToStorage();
    }
}

function saveToStorage() {
    localStorage.setItem('baymed_temu_products', JSON.stringify(products));
}

function renderProducts() {
    const t = translations[currentLang];
    const workerList = document.getElementById('productsList');
    const clientList = document.getElementById('clientProductsList');
    
    workerList.innerHTML = '';
    clientList.innerHTML = '';
    
    products.forEach(p => {
        workerList.innerHTML += `
            <div class="edit-product-card">
                <div class="edit-input-group">
                    <label>${t.lblTitle}</label>
                    <input type="text" value="${p.name}" oninput="updateProduct(${p.id}, 'name', this.value)">
                </div>
                <div style="display: flex; gap: 10px;">
                    <div class="edit-input-group" style="flex:1;">
                        <label>${t.lblPrice}</label>
                        <input type="text" value="${p.price}" oninput="updateProduct(${p.id}, 'price', this.value)">
                    </div>
                    <div class="edit-input-group" style="flex:1;">
                        <label>${t.lblOldPrice}</label>
                        <input type="text" value="${p.oldPrice || ''}" oninput="updateProduct(${p.id}, 'oldPrice', this.value)">
                    </div>
                </div>
            </div>
        `;
        
        clientList.innerHTML += `
            <div class="product-item-card">
                <div class="product-img-placeholder">
                    <i class="fa-solid ${p.icon || 'fa-box-open'}"></i>
                </div>
                <div class="product-info-box">
                    <h4 class="product-title-text">${p.name}</h4>
                    <div class="price-row-temu">
                        <span class="current-price">${p.price} دج</span>
                        <span class="old-price">${p.oldPrice ? p.oldPrice + ' دج' : ''}</span>
                    </div>
                    <button class="btn-add-cart"><i class="fa-solid fa-cart-plus"></i> ${t.btnCart}</button>
                </div>
            </div>
        `;
    });
}

renderProducts();
