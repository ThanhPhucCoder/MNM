// Newsletter form submit
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        if (email) {
            alert('Cảm ơn bạn đã đăng ký! Mã giảm giá 15% đã được gửi tới email của bạn.');
            this.reset();
        }
    });
}

// Top search bar behavior for products page
(function(){
    const isProducts = window.location.pathname.endsWith('products.html') || window.location.pathname.endsWith('/products.html');
    const openButtonsSelector = '.bi-search, [data-open-search]';
    function openTopSearch(){
        const bar = document.getElementById('topSearchBar');
        const input = document.getElementById('topSearchInput');
        if (!bar) return;
        bar.classList.remove('d-none');
        bar.classList.remove('hiding');
        bar.classList.add('showing');
        setTimeout(()=> input && input.focus(), 240);
    }
    function closeTopSearch(){
        const bar = document.getElementById('topSearchBar');
        if (!bar) return;
        bar.classList.remove('showing');
        bar.classList.add('hiding');
        setTimeout(()=>{ bar.classList.add('d-none'); bar.classList.remove('hiding'); }, 200);
    }

    document.addEventListener('click', function(e){
        // open search when clicking header icon
        const opener = e.target.closest && e.target.closest(openButtonsSelector);
        if (opener && isProducts) {
            e.preventDefault();
            openTopSearch();
            return;
        }
        // close button
        if (e.target && e.target.id === 'topSearchClose') closeTopSearch();
        if (e.target && e.target.id === 'topSearchSubmit') {
            const input = document.getElementById('topSearchInput');
            if (input) {
                const q = input.value.trim();
                if (q) {
                    const url = new URL(window.location.origin + '/products.html');
                    url.searchParams.set('q', q);
                    window.location.href = url.toString();
                }
            }
        }
    });

    document.addEventListener('keydown', function(e){
        if (!isProducts) return;
        if (e.key === 'Escape') closeTopSearch();
        if (e.key === 'Enter'){
            const bar = document.getElementById('topSearchBar');
            if (!bar || bar.classList.contains('d-none')) return;
            const input = document.getElementById('topSearchInput');
            if (input) {
                const q = input.value.trim();
                if (q) {
                    const url = new URL(window.location.origin + '/products.html');
                    url.searchParams.set('q', q);
                    window.location.href = url.toString();
                }
            }
        }
    });
})();
