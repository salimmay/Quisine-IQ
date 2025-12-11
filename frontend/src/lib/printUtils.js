export const printOrderTicket = (order) => {
  // Create a hidden iframe or a new window
  const printWindow = window.open('', '', 'height=600,width=400');
  
  if (!printWindow) {
    alert("Please allow popups to print receipts");
    return;
  }

  const itemsHtml = order.items.map(item => `
    <div class="item">
      <span class="qty">${item.qty || 1}x</span>
      <span class="name">${item.name}</span>
      <span class="price">${(item.price * (item.qty || 1)).toFixed(3)}</span>
    </div>
    ${item.modifiers && item.modifiers.length > 0 ? `
      <div class="modifiers">
        ${item.modifiers.map(m => `<div>+ ${m.name}</div>`).join('')}
      </div>
    ` : ''}
  `).join('');

  const htmlContent = `
    <html>
      <head>
        <title>Order #${order._id.slice(-4)}</title>
        <style>
          body { font-family: 'Courier New', monospace; padding: 10px; margin: 0; max-width: 300px; color: #000; }
          .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
          h2 { margin: 0; font-size: 18px; text-transform: uppercase; }
          .meta { font-size: 12px; margin-top: 5px; }
          .item { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 4px; }
          .qty { min-width: 25px; }
          .name { flex-grow: 1; text-align: left; }
          .modifiers { font-size: 11px; margin-left: 25px; margin-bottom: 8px; font-style: italic; }
          .footer { border-top: 2px dashed #000; margin-top: 10px; padding-top: 10px; text-align: right; }
          .total { font-size: 16px; font-weight: bold; }
          @media print { @page { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Quisine-IQ</h2>
          <div class="meta">Table: ${order.table}</div>
          <div class="meta">Date: ${new Date().toLocaleString('fr-TN')}</div>
          <div class="meta">Order ID: #${order._id.slice(-4).toUpperCase()}</div>
        </div>
        
        <div class="items">
          ${itemsHtml}
        </div>

        <div class="footer">
          <div class="total">Total: ${order.total?.toFixed(3)} DT</div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load then print
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, 250);
};