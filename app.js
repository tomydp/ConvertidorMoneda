const coins = [
  { code: 'USD', label: 'USD (Dólar USA)' },
  { code: 'ARS', label: 'ARS (Peso Argentino)' },
  { code: 'EUR', label: 'EUR (Euro)' },
  { code: 'BRL', label: 'BRL (Real Brasileño)' },
  { code: 'CLP', label: 'CLP (Peso Chileno)' },
  { code: 'COP', label: 'COP (Peso Colombiano)' },
  { code: 'PEN', label: 'PEN (Sol Peruano)' },
  { code: 'UYU', label: 'UYU (Peso Uruguayo)' },
  { code: 'PYG', label: 'PYG (Guaraní Paraguayo)' },
  { code: 'BOB', label: 'BOB (Boliviano)' },
  { code: 'VES', label: 'VES (Bolívar Venezolano)' },
  { code: 'TES', label: 'Prueba Validacion' },
];

const amountInput = document.getElementById('amount');
const baseSelect = document.getElementById('base');
const targetSelect = document.getElementById('target');
const convertBtn = document.getElementById('convert');
const resultDiv = document.getElementById('result');

function loadSelects() {
  coins.forEach(c => {
    const optionBase = document.createElement('option');
    optionBase.value = c.code;
    optionBase.textContent = c.label;
    baseSelect.append(optionBase);
  });
  coins.forEach(c => {
    const optionTarget = document.createElement('option');
    optionTarget.value = c.code;
    optionTarget.textContent = c.label;
    targetSelect.append(optionTarget);
  });

  baseSelect.selectedIndex = 0;
  targetSelect.selectedIndex = 1;
}


baseSelect.addEventListener('change', () => {
  if (baseSelect.value === targetSelect.value) {
    targetSelect.selectedIndex = (targetSelect.selectedIndex + 1) % coins.length;
  }
});

convertBtn.addEventListener('click', () => {
  const amount = parseFloat(amountInput.value);
  const base = baseSelect.value;
  const target = targetSelect.value;

  if (!amount || amount <= 0) {
    Swal.fire('Cantidad inválida', 'Ingresá una cantidad mayor a 0.', 'warning');
    return;
  }
  
  if (base === target) {
    Swal.fire('Monedas iguales', 'Elegí monedas diferentes.', 'warning');
    return;
  }

  fetch(`https://open.er-api.com/v6/latest/${base}`)
    .then(response => response.json())
    .then(data => {
      if (data.result !== 'success' || !data.rates[target]) {
        Swal.fire('Error', 'No se pudo obtener la tasa de cambio.', 'error');
        resultDiv.textContent = "";
        return;
      }
      const rate = data.rates[target];
      const converted = (amount * rate).toFixed(2);
      resultDiv.textContent = `${amount} ${base} = ${converted} ${target}`;
    })
    .catch(() => {
      Swal.fire('Error', 'No se pudo conectar a la API.', 'error');
      resultDiv.textContent = "";
    });
});

loadSelects();
