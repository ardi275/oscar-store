const VISITOR_KEY = 'oscar_visitor';
const TRANSACTION_KEY = 'oscar_transactions';
const TESTIMONI_KEY = 'oscar_testimonials';

function initVisitor() {
    let visitorCount = localStorage.getItem(VISITOR_KEY);
    visitorCount = visitorCount ? parseInt(visitorCount) : 0;
    if (!sessionStorage.getItem('visitor_logged')) {
        visitorCount++;
        localStorage.setItem(VISITOR_KEY, visitorCount);
        sessionStorage.setItem('visitor_logged', 'true');
    }
    updateVisitorDisplay(visitorCount);
}

function updateVisitorDisplay(count) {
    document.querySelectorAll('#visitorCount, #profileVisitor').forEach(el => {
        if (el) el.innerText = count;
    });
}

function getTransactions() {
    return JSON.parse(localStorage.getItem(TRANSACTION_KEY)) || [];
}

function saveTransactions(trans) {
    localStorage.setItem(TRANSACTION_KEY, JSON.stringify(trans));
    updateTransactionCount();
    renderHistory();
}

function updateTransactionCount() {
    const count = getTransactions().length;
    document.querySelectorAll('#transactionCount, #profileTransaction').forEach(el => {
        if (el) el.innerText = count;
    });
}

function getTestimonials() {
    return JSON.parse(localStorage.getItem(TESTIMONI_KEY)) || [];
}

function saveTestimonials(tests) {
    localStorage.setItem(TESTIMONI_KEY, JSON.stringify(tests));
    updateTestimoniCount();
}

function updateTestimoniCount() {
    const count = getTestimonials().length;
    document.querySelectorAll('#testimoniCount, #profileTestimoni').forEach(el => {
        if (el) el.innerText = count;
    });
}

function orderProduct(productName, price) {
    const trans = getTransactions();
    const newTrans = {
        id: Date.now(),
        product: productName,
        price: price,
        date: new Date().toLocaleString('id-ID'),
        status: 'Pending'
    };
    trans.push(newTrans);
    saveTransactions(trans);

    const phone = '6281370992806';
    const message = `Halo Oscar Store, saya mau order ${productName} (Rp ${price.toLocaleString()}). Sudah transfer via DANA/OVO/GOPAY? Mohon infonya.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

function copyNumber(number) {
    navigator.clipboard.writeText(number).then(() => {
        alert('Nomor berhasil disalin!');
    }).catch(() => {
        alert('Gagal menyalin, silakan salin manual.');
    });
}

function renderHistory() {
    const historyDiv = document.getElementById('historyList');
    if (!historyDiv) return;
    const trans = getTransactions();
    if (trans.length === 0) {
        historyDiv.innerHTML = '<p style="color:#aaa; text-align:center;">Belum ada transaksi.</p>';
        return;
    }
    let html = '';
    trans.slice().reverse().forEach(t => {
        html += `
            <div class="history-item">
                <div>
                    <strong>${t.product}</strong><br>
                    <small>${t.date}</small>
                </div>
                <div>
                    Rp ${t.price.toLocaleString()}<br>
                    <span class="status ${t.status === 'Completed' ? 'completed' : ''}">${t.status}</span>
                </div>
            </div>
        `;
    });
    historyDiv.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
    initVisitor();
    updateTransactionCount();
    updateTestimoniCount();
    renderHistory();
});