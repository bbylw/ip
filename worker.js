addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    const url = new URL(request.url)
    const targetUrl = new URL('https://html.zone/ip')
    
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400'
        }
      })
    }
    
    let response = await fetch(targetUrl.toString(), {
      headers: request.headers,
      method: request.method,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null
    }).catch(err => {
      return new Response('代理请求失败', { status: 502 })
    })

    response = new Response(response.body, response)
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', '*')

    const contentType = response.headers.get('Content-Type')
    if (contentType?.includes('text/html')) {
      let html = await response.text()
      html = html.replace(/(https?:)?\/\/html\.zone/g, '')
      
      html = html.replace('</head>', `
        <base href="https://html.zone/">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            background-color: #0a0a0a;
            color: #e5e5e5;
            font-family: 'Roboto', sans-serif;
            line-height: 1.6;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .ph-header {
            background-color: #000000;
            padding: 20px;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
          }

          .ph-nav {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .ph-logo {
            font-size: 32px;
            font-weight: 900;
            color: #ffffff;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .ph-logo span {
            background: #f90;
            padding: 4px 12px;
            border-radius: 4px;
            color: #000;
          }

          .ph-container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 30px;
            background: #1a1a1a;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            flex: 1;
          }

          .ph-title {
            font-size: 32px;
            color: #f90;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #333;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .ph-content {
            background: #242424;
            padding: 30px;
            border-radius: 8px;
            font-size: 16px;
            box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
            color: #e5e5e5;
          }

          .ph-content a,
          .ph-content span,
          .ph-content div,
          .ph-content p {
            color: #e5e5e5 !important;
          }

          .ph-content a:hover {
            color: #f90 !important;
          }

          .ph-content b,
          .ph-content strong,
          .ph-content .ip,
          .ph-content .value {
            color: #f90 !important;
            font-weight: 700;
          }

          .ph-content a {
            text-decoration: none !important;
            transition: color 0.3s ease;
          }

          .ph-content *:focus {
            outline-color: #f90 !important;
          }

          .ph-content table td,
          .ph-content table td * {
            color: #e5e5e5 !important;
          }

          .ph-content table td strong,
          .ph-content table td b,
          .ph-content table td .value {
            color: #f90 !important;
          }

          .ph-content pre,
          .ph-content code {
            background: #1a1a1a !important;
            color: #e5e5e5 !important;
            border: 1px solid #333 !important;
            border-radius: 4px;
            padding: 10px;
          }

          .ph-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: #1a1a1a;
            border-radius: 8px;
            overflow: hidden;
          }

          .ph-content th,
          .ph-content td {
            padding: 15px 20px;
            text-align: left;
            border-bottom: 1px solid #333;
          }

          .ph-content th {
            background: #f90;
            color: #000;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 14px;
            letter-spacing: 1px;
          }

          .ph-content tr:last-child td {
            border-bottom: none;
          }

          .ph-content tr:hover {
            background: #2a2a2a;
          }

          .ph-content td {
            color: #e5e5e5;
          }

          .ph-content td strong {
            color: #f90;
            font-weight: 700;
          }

          .ph-button {
            background: #f90;
            color: #000;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            text-transform: uppercase;
            transition: all 0.3s ease;
            margin-top: 20px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .ph-button:hover {
            background: #ff8500;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255,153,0,0.4);
          }

          .ph-button:active {
            transform: translateY(0);
          }

          .copy-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #f90;
            color: #000;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
            transform: translateY(100px);
            transition: transform 0.3s ease;
            z-index: 1000;
          }

          .copy-notification.show {
            transform: translateY(0);
          }

          /* 自定义滚动条 */
          ::-webkit-scrollbar {
            width: 10px;
          }

          ::-webkit-scrollbar-track {
            background: #1a1a1a;
          }

          ::-webkit-scrollbar-thumb {
            background: #f90;
            border-radius: 5px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #ff8500;
          }

          /* 修改移动端适配样式 */
          @media (max-width: 768px) {
            .ph-container {
              margin: 10px;
              padding: 15px;
              width: 100%;
              box-sizing: border-box;
            }
            
            .ph-logo {
              font-size: 20px;
            }
            
            .ph-logo span {
              padding: 2px 8px;
            }
            
            .ph-title {
              font-size: 20px;
              margin-bottom: 20px;
              padding-bottom: 10px;
            }
            
            .ph-content {
              padding: 15px;
              font-size: 14px;
              overflow-x: auto; /* 添加横向滚动 */
            }
            
            /* 优化表格在移动端的显示 */
            .ph-content table {
              display: block;
              overflow-x: auto;
              white-space: nowrap;
              -webkit-overflow-scrolling: touch;
            }
            
            .ph-content th,
            .ph-content td {
              padding: 8px 12px;
              min-width: 100px; /* 设置最小宽度 */
            }

            /* 优化按钮在移动端的显示 */
            .ph-button {
              padding: 8px 16px;
              font-size: 14px;
              width: 100%;
              justify-content: center;
            }

            /* 优化复制成功提示在移动端的显示 */
            .copy-notification {
              left: 50%;
              right: auto;
              transform: translateX(-50%) translateY(100px);
              width: 90%;
              max-width: 300px;
              text-align: center;
            }

            .copy-notification.show {
              transform: translateX(-50%) translateY(0);
            }
          }

          /* 添加横屏模式的优化 */
          @media (max-height: 500px) and (orientation: landscape) {
            .ph-container {
              margin: 10px;
            }
            
            .ph-header {
              padding: 10px;
            }
            
            .ph-title {
              margin-bottom: 15px;
            }
          }

          /* 添加深色模式支持 */
          @media (prefers-color-scheme: dark) {
            .ph-content {
              background: #1a1a1a;
            }
            
            .ph-container {
              background: #242424;
            }
          }
        </style>
        <script>
          (function() {
            const originalFetch = window.fetch;
            window.fetch = function(url, options) {
              try {
                if (typeof url === 'string' && (url.startsWith('/') || url.startsWith('./') || url.startsWith('../'))) {
                  url = 'https://html.zone' + (url.startsWith('/') ? url : '/' + url);
                }
                return originalFetch.call(this, url, options);
              } catch (err) {
                console.error('Fetch 拦截器错误:', err);
                return originalFetch.call(this, url, options);
              }
            };
          })();

          window.addEventListener('DOMContentLoaded', () => {
            const body = document.body;
            const originalContent = body.innerHTML;
            
            const notification = document.createElement('div');
            notification.className = 'copy-notification';
            notification.textContent = '复制成功！';
            document.body.appendChild(notification);
            
            body.innerHTML = \`
              <header class="ph-header">
                <nav class="ph-nav">
                  <div class="ph-logo">IP<span>CHECKER</span></div>
                </nav>
              </header>
              <main class="ph-container">
                <h1 class="ph-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f90" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  IP 信息查询
                </h1>
                <div class="ph-content">
                  \${originalContent}
                </div>
              </main>
            \`;

            // 为表格添加样式和交互
            document.querySelectorAll('table').forEach(table => {
              table.querySelectorAll('th').forEach(header => {
                header.style.cursor = 'pointer';
                header.addEventListener('click', () => {
                  header.style.transform = 'scale(0.98)';
                  setTimeout(() => header.style.transform = 'scale(1)', 100);
                });
              });
            });

            // 添加复制功能
            const content = document.querySelector('.ph-content');
            const copyButton = document.createElement('button');
            copyButton.className = 'ph-button';
            copyButton.innerHTML = \`
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              复制信息
            \`;
            
            copyButton.onclick = () => {
              const textToCopy = content.textContent.trim();
              navigator.clipboard.writeText(textToCopy).then(() => {
                notification.classList.add('show');
                setTimeout(() => notification.classList.remove('show'), 2000);
              });
            };
            
            content.appendChild(copyButton);
          });
        </script>
      </head>`)

      response = new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      })
      response.headers.set('Content-Type', 'text/html;charset=UTF-8')
    }

    return response
  } catch (err) {
    return new Response('服务器错误', { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain;charset=UTF-8'
      }
    })
  }
} 