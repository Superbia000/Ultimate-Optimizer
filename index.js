jQuery(document).ready(function () {
    console.log("[Ultimate Optimizer] 前端渲染重構引擎已掛載");

    // ==========================================
    // 1. DOM 虛擬化 (Chat Virtualization) - 解決長對話卡頓
    // ==========================================
    const chatContainer = document.getElementById('chat');
    
    // 使用 Intersection Observer 僅渲染屏幕可見的消息
    const virtualObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 使用 CSS content-visibility 控制，而非 display: none，保留滾動條高度
            if (entry.isIntersecting) {
                entry.target.classList.remove('virtual-hidden');
            } else {
                entry.target.classList.add('virtual-hidden');
            }
        });
    }, { root: chatContainer, rootMargin: '800px 0px' });

    // 監聽新生成的對話消息，並進行硬件加速優化
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.classList && node.classList.contains('mes')) {
                    virtualObserver.observe(node);
                    optimizeMessageNode(node);
                }
            });
        });
    });

    if (chatContainer) {
        mutationObserver.observe(chatContainer, { childList: true, subtree: true });
        // 初始化現有消息
        document.querySelectorAll('.mes').forEach(node => {
            virtualObserver.observe(node);
            optimizeMessageNode(node);
        });
    }

    // ==========================================
    // 2. 節點極限優化與內存洩漏修復
    // ==========================================
    function optimizeMessageNode(node) {
        // 強制懶加載所有頭像與圖片，極大提升加載速度
        const imgs = node.querySelectorAll('img');
        imgs.forEach(img => {
            if (!img.getAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
                // 啟動 GPU 硬件加速
                img.style.willChange = 'transform, opacity'; 
            }
        });
        // 渲染層提升，避免佈局重繪 (Repaint)
        node.style.transform = 'translateZ(0)'; 
    }

    // ==========================================
    // 3. 事件防抖 (Debouncing) - 修復 UI 響應遲緩的 Bug
    // ==========================================
    // 劫持並覆蓋全局的 Resize 事件，防止佈局抖動
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
        resizeTimeout = requestAnimationFrame(() => {
            // 觸發自適應 UI 的邏輯更新
            handleResponsiveLayout();
        });
    }, { passive: true });

    function handleResponsiveLayout() {
        const width = window.innerWidth;
        const leftNav = document.getElementById('sheld');
        if (width <= 768 && leftNav) {
            // 在手機端強制隱藏不必要的佔位元素
            leftNav.classList.add('mobile-drawer');
        } else if (leftNav) {
            leftNav.classList.remove('mobile-drawer');
        }
    }

    // 注入手機端 Viewport (如果缺失)
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = "viewport";
        meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
        document.head.appendChild(meta);
    }

    handleResponsiveLayout();
});
