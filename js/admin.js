/*
    Admin script: manage products, orders, customers and reports via localStorage.
    Keys: products / orders / customers
*/
const STORE = {
    products: 'tlook_products_v2',
    orders: 'tlook_orders_v1',
    customers: 'tlook_customers_v1'
};

function read(key){
    const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : [];
}
function write(key, data){
    localStorage.setItem(key, JSON.stringify(data));
}

function generateId(prefix='id'){
    return prefix + '_' + Math.random().toString(36).slice(2,9);
}

/* ---------- Products ---------- */
function renderProducts(page=1, pageSize=10){
    const tbody = document.getElementById('productTableBody');
    const products = read(STORE.products) || [];
    const total = products.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    page = Math.min(Math.max(1, page), pages);
    const start = (page - 1) * pageSize;
    const end = Math.min(start + pageSize, total);
    const slice = products.slice(start, end);
    tbody.innerHTML = '';
    slice.forEach((p, idx)=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${start + idx + 1}</td>
            <td><img src="${p.image||'assets/hero-badminton.png'}" alt="" /></td>
            <td>${p.name}</td>
            <td>${Number(p.price).toLocaleString()} đ</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2" data-act="p-edit" data-id="${p.id}">Sửa</button>
                <button class="btn btn-sm btn-outline-danger" data-act="p-del" data-id="${p.id}">Xóa</button>
            </td>`;
        tbody.appendChild(tr);
    });

    // update counts and pagination UI if present
    const fromEl = document.getElementById('productsFrom');
    const toEl = document.getElementById('productsTo');
    const countEl = document.getElementById('productsCount');
    if (fromEl) fromEl.innerText = total ? start+1 : 0;
    if (toEl) toEl.innerText = end;
    if (countEl) countEl.innerText = total;

    const pagEl = document.getElementById('productsPagination');
    if (pagEl){
        pagEl.innerHTML = '';
        // prev
        const prev = document.createElement('li'); prev.className='page-item'; prev.innerHTML = `<button class="page-btn page-link" data-page="${page-1}" ${page<=1? 'disabled': ''}>Prev</button>`; pagEl.appendChild(prev);
        for (let p=1;p<=pages;p++){
            const li = document.createElement('li'); li.className='page-item'+(p===page? ' active':''); li.innerHTML = `<button class="page-btn page-link" data-page="${p}">${p}</button>`; pagEl.appendChild(li);
        }
        const next = document.createElement('li'); next.className='page-item'; next.innerHTML = `<button class="page-btn page-link" data-page="${page+1}" ${page>=pages? 'disabled': ''}>Next</button>`; pagEl.appendChild(next);
    }
}

/* ---------- Orders ---------- */
function renderOrders(page=1, pageSize=10){
    const container = document.getElementById('ordersList');
    const orders = read(STORE.orders) || [];
    const total = orders.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    page = Math.min(Math.max(1, page), pages);
    const start = (page - 1) * pageSize;
    const end = Math.min(start + pageSize, total);
    const slice = orders.slice(start, end);

    if (!container) return;
    container.innerHTML = '';
    const table = document.createElement('table'); table.className = 'table';
    table.innerHTML = `<thead><tr><th>#</th><th>Mã</th><th>Khách</th><th>Tổng</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>`;
    const tb = document.createElement('tbody');
    slice.forEach((o, idx)=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${start + idx + 1}</td>
            <td>${o.code}</td>
            <td>${o.customerName||o.customerId}</td>
            <td>${Number(o.total).toLocaleString()} đ</td>
            <td>${o.status}</td>
            <td>
                <button class="btn btn-sm btn-outline-secondary" data-act="o-view" data-id="${o.id}">Xem</button>
                <button class="btn btn-sm btn-outline-danger" data-act="o-del" data-id="${o.id}">Xóa</button>
            </td>`;
        tb.appendChild(tr);
    });
    table.appendChild(tb);
    container.appendChild(table);

    // pagination for orders
    const pag = document.createElement('ul'); pag.className = 'pagination pagination-custom';
    const wrap = document.createElement('nav'); wrap.className = 'mt-3';
    // prev
    const prev = document.createElement('li'); prev.className='page-item'; prev.innerHTML = `<button class="page-btn page-link" data-page="${page-1}" ${page<=1? 'disabled': ''}>Prev</button>`; pag.appendChild(prev);
    for (let p=1;p<=pages;p++){
        const li = document.createElement('li'); li.className='page-item'+(p===page? ' active':''); li.innerHTML = `<button class="page-btn page-link" data-page="${p}">${p}</button>`; pag.appendChild(li);
    }
    const next = document.createElement('li'); next.className='page-item'; next.innerHTML = `<button class="page-btn page-link" data-page="${page+1}" ${page>=pages? 'disabled': ''}>Next</button>`; pag.appendChild(next);
    wrap.appendChild(pag); container.appendChild(wrap);

    // update count if element exists
    const ordersCount = document.getElementById('ordersCount'); if (ordersCount) ordersCount.innerText = total;
}

/* ---------- Customers ---------- */
function renderCustomers(){
    const tbody = document.getElementById('customersTableBody');
    const list = read(STORE.customers);
    tbody.innerHTML = '';
    list.forEach((c,i)=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i+1}</td>
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.phone||''}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2" data-act="c-edit" data-id="${c.id}">Sửa</button>
                <button class="btn btn-sm btn-outline-danger" data-act="c-del" data-id="${c.id}">Xóa</button>
            </td>`;
        tbody.appendChild(tr);
    });
}

/* ---------- Reports ---------- */
function renderReports(){
    const orders = read(STORE.orders);
    const products = read(STORE.products);
    const customers = read(STORE.customers);
    const totalSales = orders.reduce((s,o)=>s + (Number(o.total)||0), 0);
    document.getElementById('reportTotalSales').innerText = totalSales.toLocaleString() + ' đ';
    document.getElementById('reportOrdersCount').innerText = orders.length;
    document.getElementById('reportCustomersCount').innerText = customers.length;

    // Top product by orders
    const counts = {};
    orders.forEach(o=> (o.items||[]).forEach(it=> counts[it.productId] = (counts[it.productId]||0) + (it.qty||1)));
    let top = '-';
    if (Object.keys(counts).length){
        const topId = Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0];
        const p = products.find(x=>x.id===topId);
        if (p) top = p.name + ' ('+counts[topId]+' bán)';
    }
    document.getElementById('reportTopProduct').innerText = top;

    // Sales chart (orders per day) - simple grouping by date
    const byDate = {};
    orders.forEach(o=>{
        const d = new Date(o.createdAt||Date.now());
        const key = d.toISOString().slice(0,10);
        byDate[key] = (byDate[key]||0) + Number(o.total||0);
    });
    const labels = Object.keys(byDate).sort();
    const data = labels.map(l=>byDate[l]);
    renderSalesChart(labels, data);
}

let salesChartInstance = null;
function renderSalesChart(labels, data){
    const ctx = document.getElementById('salesChart').getContext('2d');
    if (salesChartInstance) salesChartInstance.destroy();
    salesChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label: 'Doanh thu', data, borderColor: '#4f8cff', backgroundColor: 'rgba(79,140,255,0.08)', fill: true }] },
        options: { responsive:true, maintainAspectRatio:false }
    });
}

/* ---------- Boot / handlers ---------- */
function initAdmin(){
    // seed demo data if empty
    if (!read(STORE.products).length){
        write(STORE.products, [
            { id: generateId('p'), name: 'Vợt Victor Ryuga', price:2450000, image:'https://cdn.shopvnb.com/img/300x300/uploads/san_pham/vot-cau-long-vnb-v88-xanh-chinh-hang-1.webp' },
            { id: generateId('p'), name: 'Vợt Yonex Astrox', price:6500000, image:'https://cdn.shopvnb.com/img/300x300/uploads/san_pham/vot-cau-long-vnb-v88-xanh-chinh-hang-1.webp' }
        ]);
    }
    if (!read(STORE.customers).length){
        write(STORE.customers, [ { id: generateId('c'), name:'Nguyen Van A', email:'a@gmail.com', phone:'0394996777' } ]);
    }
    if (!read(STORE.orders).length){
        write(STORE.orders, [ { id: generateId('o'), code:'ORD'+Date.now(), customerId: read(STORE.customers)[0].id, customerName: read(STORE.customers)[0].name, total:2450000, status:'paid', items:[{ productId: read(STORE.products)[0].id, qty:1 }], createdAt: Date.now() } ]);
    }

    renderProducts(); renderOrders(); renderCustomers(); renderReports();

    // product form submit
    const pf = document.getElementById('productForm');
    pf && pf.addEventListener('submit', function(e){
        e.preventDefault();
        const id = document.getElementById('productId').value;
        const name = document.getElementById('productName').value.trim();
        const price = Number(document.getElementById('productPrice').value) || 0;
        const image = document.getElementById('productImage').dataset.base64 || document.getElementById('productImage').value.trim();
        const desc = document.getElementById('productDesc').value.trim();
        const list = read(STORE.products);
        if (id){
            const idx = list.findIndex(x=>x.id===id); if (idx>-1) list[idx] = { ...list[idx], name, price, image, desc };
        } else list.push({ id: generateId('p'), name, price, image, desc });
        write(STORE.products, list); renderProducts(); renderReports();
        bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide(); pf.reset();
    });

    // product image file input handling (convert to base64 preview)
    const prodImageInput = document.getElementById('productImageFile');
    const prodImageField = document.getElementById('productImage');
    const prodImagePreview = document.getElementById('productImagePreview');
    if (prodImageInput && prodImageField){
        prodImageInput.addEventListener('change', function(){
            const file = this.files && this.files[0];
            if (!file) { delete prodImageField.dataset.base64; prodImageField.value = ''; if(prodImagePreview){ prodImagePreview.style.display='none'; prodImagePreview.src=''; } return; }
            const reader = new FileReader();
            reader.onload = function(ev){
                prodImageField.dataset.base64 = ev.target.result;
                prodImageField.value = file.name;
                if (prodImagePreview){ prodImagePreview.src = ev.target.result; prodImagePreview.style.display = 'block'; }
            };
            reader.readAsDataURL(file);
        });
    }

    // customer form
    const cf = document.getElementById('customerForm');
    cf && cf.addEventListener('submit', function(e){
        e.preventDefault();
        const id = document.getElementById('customerId').value;
        const name = document.getElementById('customerName').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const list = read(STORE.customers);
        if (id){ const idx = list.findIndex(x=>x.id===id); if (idx>-1) list[idx] = { ...list[idx], name, email, phone }; }
        else list.push({ id: generateId('c'), name, email, phone });
        write(STORE.customers, list); renderCustomers(); renderReports();
        bootstrap.Modal.getInstance(document.getElementById('addCustomerModal')).hide(); cf.reset();
    });

    // delegation for buttons
    document.addEventListener('click', function(e){
        const btn = e.target.closest && e.target.closest('button[data-act]');
        if (btn){
            const act = btn.getAttribute('data-act');
            const id = btn.getAttribute('data-id');
            if (act === 'p-del'){ const list = read(STORE.products).filter(p=>p.id!==id); write(STORE.products, list); renderProducts(); renderReports(); }
            if (act === 'p-edit'){ const p = read(STORE.products).find(x=>x.id===id); if (!p) return; document.getElementById('productId').value=p.id; document.getElementById('productName').value=p.name; document.getElementById('productPrice').value=p.price; document.getElementById('productImage').value=p.image||''; document.getElementById('productDesc').value=p.desc||''; // set preview
                if (prodImagePreview){ if (p.image){ prodImagePreview.src = p.image; prodImagePreview.style.display = 'block'; } else { prodImagePreview.style.display='none'; prodImagePreview.src=''; } }
                // clear any file input selection
                if (prodImageInput) prodImageInput.value = '';
                // ensure dataset base64 is not incorrectly set
                if (document.getElementById('productImage').dataset) delete document.getElementById('productImage').dataset.base64;
                new bootstrap.Modal(document.getElementById('addProductModal')).show(); }
            if (act === 'o-del'){ const list = read(STORE.orders).filter(o=>o.id!==id); write(STORE.orders, list); renderOrders(); renderReports(); }
            if (act === 'o-view'){ alert('Order details:\n' + JSON.stringify(read(STORE.orders).find(o=>o.id===id), null, 2)); }
            if (act === 'c-del'){ const list = read(STORE.customers).filter(c=>c.id!==id); write(STORE.customers, list); renderCustomers(); renderReports(); }
            if (act === 'c-edit'){ const c = read(STORE.customers).find(x=>x.id===id); if (!c) return; document.getElementById('customerId').value=c.id; document.getElementById('customerName').value=c.name; document.getElementById('customerEmail').value=c.email; document.getElementById('customerPhone').value=c.phone||''; new bootstrap.Modal(document.getElementById('addCustomerModal')).show(); }
        }
    });

    // sidebar active link highlight
    (function highlightSidebar(){
        try{
            const path = window.location.pathname.split('/').pop();
            document.querySelectorAll('.admin-sidebar .nav-link').forEach(a=>{ a.classList.remove('active'); const href = (a.getAttribute('href')||'').split('/').pop(); if (href === path) a.classList.add('active'); });
        }catch(e){/* ignore */}
    })();

    // sidebar toggle for small screens: add button to navbar if missing
    (function sidebarToggle(){
        const nav = document.querySelector('.navbar');
        if (!nav) return;
        if (!document.getElementById('sidebarToggleBtn')){
            const btn = document.createElement('button'); btn.id='sidebarToggleBtn'; btn.className='btn btn-light d-md-none me-2'; btn.innerHTML='☰';
            btn.addEventListener('click', ()=>{
                document.querySelectorAll('.admin-sidebar').forEach(s=> s.classList.toggle('d-none'));
            });
            const container = nav.querySelector('.container-fluid') || nav;
            container.insertBefore(btn, container.firstChild);
        }
    })();

    // pagination clicks (delegated)
    document.addEventListener('click', function(e){
        const btn = e.target.closest && e.target.closest('.page-btn');
        if (!btn) return;
        const page = Number(btn.getAttribute('data-page')) || 1;
        // determine which pagination: products or orders
        const up = btn.closest('#productsPagination');
        if (up) { renderProducts(page); return; }
        const ord = btn.closest('#ordersList');
        if (ord || btn.closest('.pagination-custom')) { renderOrders(page); return; }
    });

    // exports
    document.getElementById('exportProducts') && document.getElementById('exportProducts').addEventListener('click', function(){
        const json = JSON.stringify(read(STORE.products), null, 2); downloadFile('products.json', json);
    });
    document.getElementById('exportOrders') && document.getElementById('exportOrders').addEventListener('click', function(){
        const json = JSON.stringify(read(STORE.orders), null, 2); downloadFile('orders.json', json);
    });
}

function downloadFile(name, content){
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
}

window.addEventListener('DOMContentLoaded', initAdmin);
