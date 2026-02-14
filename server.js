const express = require('express');
const cors = require('cors');
const path = require('path');
const scraper = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '真实数据比价服务运行中',
    timestamp: new Date().toISOString()
  });
});

// 搜索API - 真实数据
app.get('/api/search', async (req, res) => {
  try {
    const { q, platform = 'bing' } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: '缺少搜索关键词' });
    }

    console.log(`[${new Date().toLocaleString()}] 搜索: "${q}"`);
    
    let results = [];
    
    if (platform === 'bing' || platform === 'all') {
      const bingResults = await scraper.searchBingShopping(q);
      results = [...results, ...bingResults];
    }

    // 按价格排序
    results.sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
      return priceA - priceB;
    });

    res.json({
      success: true,
      query: q,
      count: results.length,
      timestamp: new Date().toISOString(),
      results: results
    });

  } catch (error) {
    console.error('搜索错误:', error);
    res.status(500).json({ 
      error: '获取数据失败', 
      message: error.message 
    });
  }
});

// 获取单个商品详情
app.get('/api/product', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: '缺少商品链接' });
    }

    const details = await scraper.getProductDetails(url);
    res.json({
      success: true,
      data: details
    });

  } catch (error) {
    console.error('获取详情错误:', error);
    res.status(500).json({ error: '获取商品详情失败' });
  }
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 比价服务运行在端口 ${PORT}`);
  console.log(`📊 数据获取方式: Bing Shopping实时爬取`);
  console.log(`🌐 完全透明，所有代码可见`);
});
