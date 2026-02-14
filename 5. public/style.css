// API基础URL（自动检测环境）
const API_BASE = window.location.origin;

// 搜索功能
async function search() {
    const keyword = document.getElementById('searchInput').value.trim();
    if (!keyword) {
        alert('请输入搜索关键词');
        return;
    }

    const btn = document.getElementById('searchBtn');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const status = document.getElementById('status');

    // UI状态更新
    btn.disabled = true;
    btn.textContent = '搜索中...';
    loading.style.display = 'block';
    results.innerHTML = '';
    status.textContent = '正在抓取Bing Shopping...';

    try {
        const response = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(keyword)}`);
        const data = await response.json();

        if (data.success) {
            displayResults(data.results);
            status.textContent = `找到 ${data.count} 个结果 | 数据来源: Bing Shopping`;
        } else {
            throw new Error(data.error || '搜索失败');
        }
    } catch (error) {
        console.error('搜索错误:', error);
        results.innerHTML = `
            <div class="empty-state">
                <h2>⚠️ 获取数据失败</h2>
                <p>${error.message}</p>
                <p style="margin-top: 10px; font-size: 0.9em; opacity: 0.8;">
                    提示：由于Bing Shopping有反爬机制，偶尔可能会失败，请稍后重试
                </p>
            </div>
        `;
        status.textContent = '获取失败';
    } finally {
        btn.disabled = false;
        btn.textContent = '全网比价';
        loading.style.display = 'none';
    }
}

// 显示结果
function displayResults(products) {
    const container = document.getElementById('results');
    const realOnly = document.getElementById('realOnly').checked;
    
    // 过滤模拟数据（如果勾选）
    const filtered = realOnly ? products.filter(p => !p.isMock) : products;
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>😕 暂无结果</h2>
                <p>尝试更换关键词或取消"仅显示真实数据"筛选</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(product => `
        <div class="product-card ${product.isMock ? 'mock-data' : ''}">
            <img src="${product.image || 'https://via.placeholder.com/100?text=No+Image'}" 
                 alt="${product.title}" 
                 class="product-image"
                 onerror="this.src='https://via.placeholder.com/100?text=No+Image'">
            
            <div class="product-info">
                <h3>${escapeHtml(product.title)}</h3>
                <div class="merchant">🏪 ${escapeHtml(product.merchant)}</div>
                <span class="platform">${escapeHtml(product.platform)}</span>
                ${product.isMock ? '<span style="color: #ff6b6b; font-size: 0.8em; margin-left: 10px;">⚠️ 演示数据</span>' : ''}
            </div>
            
            <div class="product-price">
                <div class="price">${product.price}</div>
                <a href="${product.link}" target="_blank" class="buy-btn">查看详情</a>
                <div style="font-size: 0.7em; color: #999; margin-top: 5px;">
                    ${new Date(product.updatedAt).toLocaleString()}
                </div>
            </div>
        </div>
    `).join('');
}

// HTML转义防止XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 回车搜索
document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') search();
});

// 筛选变化时重新渲染
document.getElementById('realOnly')?.addEventListener('change', () => {
    const keyword = document.getElementById('searchInput').value.trim();
    if (keyword) search();
});

// 页面加载完成提示
console.log('🚀 真实数据比价网站已加载');
console.log('📊 数据来源：Bing Shopping实时爬取');
console.log('🔍 完全透明，所有代码可见');
