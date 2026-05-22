// ========================================
// BULLROOK POWER - APLICACIÓN DE MINERÍA
// ========================================

// Configuración oficial de dYdX Chain (Mainnet)
const CONFIG = {
    chainId: 'dydx-mainnet-1',
    rpcEndpoint: 'https://rpc.dydx.nodex.one:443',
    nativeDenom: 'adydx',
    usdcDenom: 'ibc/295548A78785A1007F232DE28618A398739CAF7B575197147E340777DF38AE3B',
    gasPrice: '12.5',
    gasLimit: 300000
};

// Variables globales
let client = null;
let userAddress = "";
let activeValidatorsWithRewards = [];
let balanceHistory = [];
let rewardsHistory = [];
let balanceChart = null;
let rewardsChart = null;

// ========================================
// VALIDACIONES Y UTILIDADES
// ========================================

function isValidAddress(address) {
    return /^dydx1[a-z0-9]{58}$/.test(address);
}

function isValidAmount(amount) {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= 1000000000;
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

function clearError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = '';
        element.style.display = 'none';
    }
}

function updateStatus(elementId, message, type = 'info') {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        element.className = `status ${type}`;
    }
}

// ========================================
// TEMA CLARO/OSCURO
// ========================================

document.getElementById('themeToggle').addEventListener('click', () => {
    const body = document.body;
    const btn = document.getElementById('themeToggle');
    
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
        btn.textContent = '🌙 Modo Oscuro';
    } else {
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        btn.textContent = '☀️ Modo Claro';
    }
});

// Cargar tema guardado
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        document.getElementById('themeToggle').textContent = '☀️ Modo Claro';
    }
});

// ========================================
// GRÁFICAS
// ========================================

function initBalanceChart() {
    const ctx = document.getElementById('balanceChart').getContext('2d');
    
    if (balanceChart) balanceChart.destroy();
    
    balanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: balanceHistory.map((_, i) => `${i}h`),
            datasets: [
                {
                    label: 'DYDX Balance',
                    data: balanceHistory.map(b => b.dydx),
                    borderColor: '#ff9900',
                    backgroundColor: 'rgba(255, 153, 0, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    labels: { color: '#e0e0e0' }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#aaa' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#aaa' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

function initRewardsChart() {
    const ctx = document.getElementById('rewardsChart').getContext('2d');
    
    if (rewardsChart) rewardsChart.destroy();
    
    rewardsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: rewardsHistory.map((_, i) => `Día ${i + 1}`),
            datasets: [
                {
                    label: 'Recompensas Diarias',
                    data: rewardsHistory,
                    backgroundColor: 'rgba(76, 175, 80, 0.7)',
                    borderColor: '#4caf50',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    labels: { color: '#e0e0e0' }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#aaa' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#aaa' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

// ========================================
// CONECTAR CARTERA (KEPLR)
// ========================================

document.getElementById('connectWalletBtn').addEventListener('click', async () => {
    const status = document.getElementById('walletStatus');
    try {
        if (!window.keplr) {
            throw new Error("Instala la extensión de Keplr Wallet en tu navegador");
        }
        
        await window.keplr.enable(CONFIG.chainId);
        const signer = window.keplr.getOfflineSigner(CONFIG.chainId);
        const accounts = await signer.getAccounts();
        
        if (!accounts || accounts.length === 0) {
            throw new Error("No se encontraron cuentas en Keplr");
        }
        
        userAddress = accounts[0].address;
        
        if (!isValidAddress(userAddress)) {
            throw new Error("Dirección de cartera no válida");
        }
        
        client = await window.CosmjsStargate.SigningStargateClient.connectWithSigner(
            CONFIG.rpcEndpoint, 
            signer
        );
        
        updateStatus('walletStatus', `✅ CONECTADO: ${userAddress.substring(0, 20)}...`, 'success');
        
        // Inicializar datos
        await getBalances();
        await getRewards();
        await getDelegations();
        initBalanceChart();
        initRewardsChart();
        
    } catch (err) {
        updateStatus('walletStatus', `❌ ERROR: ${err.message}`, 'error');
    }
});

// ========================================
// OBTENER BALANCES REALES
// ========================================

async function getBalances() {
    const disp = document.getElementById('balanceDisplay');
    if (!userAddress) return;
    
    try {
        const res = await fetch(`${CONFIG.rpcEndpoint}/cosmos/bank/v1beta1/balances/${userAddress}`);
        const data = await res.json();
        
        let dydx = 0, usdc = 0;
        
        if (data.balances && Array.isArray(data.balances)) {
            data.balances.forEach(coin => {
                if (coin.denom === CONFIG.nativeDenom) {
                    dydx = (parseFloat(coin.amount) / 1e18).toFixed(4);
                }
                if (coin.denom === CONFIG.usdcDenom) {
                    usdc = (parseFloat(coin.amount) / 1e6).toFixed(2);
                }
            });
        }
        
        document.getElementById('dydxBalance').textContent = dydx;
        document.getElementById('usdcBalance').textContent = usdc;
        disp.innerHTML = `✅ Balances actualizados correctamente`;
        updateStatus('balanceDisplay', `💎 DYDX: ${dydx} | 💵 USDC: ${usdc}`, 'success');
        
        // Agregar al historial
        balanceHistory.push({ dydx: parseFloat(dydx) });
        if (balanceHistory.length > 24) balanceHistory.shift();
        
    } catch (e) {
        updateStatus('balanceDisplay', "❌ Error al leer balances de la red", 'error');
    }
}

// ========================================
// OBTENER DELEGACIONES
// ========================================

async function getDelegations() {
    if (!userAddress) return;
    
    try {
        const res = await fetch(`${CONFIG.rpcEndpoint}/cosmos/staking/v1beta1/delegations/${userAddress}`);
        const data = await res.json();
        
        let totalDelegated = 0;
        if (data.delegation_responses && Array.isArray(data.delegation_responses)) {
            data.delegation_responses.forEach(del => {
                totalDelegated += parseFloat(del.balance.amount);
            });
        }
        
        const delegatedDisplay = (totalDelegated / 1e18).toFixed(4);
        document.getElementById('delegatedDisplay').textContent = delegatedDisplay;
        
    } catch (e) {
        console.error("Error al obtener delegaciones:", e);
    }
}

// ========================================
// OBTENER RECOMPENSAS DINÁMICAS
// ========================================

async function getRewards() {
    if (!userAddress) return;
    try {
        const res = await fetch(`${CONFIG.rpcEndpoint}/cosmos/distribution/v1beta1/delegators/${userAddress}/rewards`);
        const data = await res.json();
        
        let total = 0;
        activeValidatorsWithRewards = [];
        
        if (data && data.rewards && Array.isArray(data.rewards)) {
            data.rewards.forEach(r => {
                activeValidatorsWithRewards.push(r.validator_address);
            });
        }
        
        if (data && data.total && Array.isArray(data.total)) {
            const rew = data.total.find(r => r.denom === CONFIG.nativeDenom);
            total = rew ? (parseFloat(rew.amount) / 1e18).toFixed(6) : "0.000000";
        }
        
        document.getElementById('rewards').textContent = total + " DYDX";
        document.getElementById('rewardsDisplay').textContent = total;
        
        // Agregar al historial
        rewardsHistory.push(parseFloat(total));
        if (rewardsHistory.length > 7) rewardsHistory.shift();
        
    } catch (e) {
        console.error("Error al obtener recompensas:", e);
        document.getElementById('rewards').textContent = "0.000000 DYDX";
    }
}

// ========================================
// EJECUTAR STAKING REAL
// ========================================

document.getElementById('stakeBtn').addEventListener('click', async () => {
    const status = document.getElementById('stakeStatus');
    clearError('stakeError');
    
    if (!client || !userAddress) {
        updateStatus('stakeStatus', "❌ Conecta tu cartera Keplr primero", 'error');
        return;
    }
    
    try {
        const amountInput = document.getElementById('stakeAmount').value;
        
        if (!amountInput || !isValidAmount(amountInput)) {
            showError('stakeError', 'Ingresa un monto válido (máx 1B)');
            return;
        }
        
        const baseAmount = Math.floor(parseFloat(amountInput) * 1000000);
        const amountInAtto = (BigInt(baseAmount) * BigInt(10**12)).toString();
        const targetValidator = document.getElementById('validatorList').value;
        
        if (!targetValidator) {
            showError('stakeError', 'Selecciona un validador');
            return;
        }
        
        updateStatus('stakeStatus', "⏳ Esperando aprobación en Keplr...", 'warning');
        
        const msg = {
            typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
            value: {
                delegatorAddress: userAddress,
                validatorAddress: targetValidator,
                amount: { denom: CONFIG.nativeDenom, amount: amountInAtto }
            }
        };
        
        const fee = {
            amount: [{ denom: CONFIG.nativeDenom, amount: "3000000000000000" }],
            gas: CONFIG.gasLimit.toString()
        };
        
        const result = await client.signAndBroadcast(userAddress, [msg], fee, "Staking BullRook");
        
        if (result.code === 0) {
            updateStatus('stakeStatus', "🏆 ¡TRANSMISIÓN EXITOSA! Capital minando con poder de Toro", 'success');
            document.getElementById('stakeAmount').value = '';
            setTimeout(async () => {
                await getBalances();
                await getRewards();
                await getDelegations();
                initBalanceChart();
            }, 2500);
        } else {
            throw new Error(result.rawLog || "La red rechazó la operación");
        }
    } catch (err) {
        updateStatus('stakeStatus', `❌ Transacción fallida: ${err.message}`, 'error');
    }
});

// ========================================
// RETIRAR RECOMPENSAS
// ========================================

document.getElementById('claimBtn').addEventListener('click', async () => {
    const status = document.getElementById('claimStatus');
    
    if (!client || !userAddress) {
        updateStatus('claimStatus', "❌ Conecta tu cartera Keplr primero", 'error');
        return;
    }
    
    try {
        await getRewards();
        
        if (activeValidatorsWithRewards.length === 0) {
            throw new Error("No posees recompensas acumuladas o delegaciones activas");
        }
        
        updateStatus('claimStatus', "⏳ Firmando retiro de dividendos...", 'warning');
        
        const messages = activeValidatorsWithRewards.map(valAddr => ({
            typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
            value: {
                delegatorAddress: userAddress,
                validatorAddress: valAddr
            }
        }));
        
        const estimatedGas = (200000 * messages.length).toString();
        const fee = {
            amount: [{ denom: CONFIG.nativeDenom, amount: (1000000000000000 * messages.length).toString() }],
            gas: estimatedGas
        };
        
        const result = await client.signAndBroadcast(userAddress, messages, fee, "Retiro Dividendos BullRook");
        
        if (result.code === 0) {
            updateStatus('claimStatus', "💰 ¡RECOMPENSAS EN BILLETERA! Fondos recolectados", 'success');
            setTimeout(async () => {
                await getBalances();
                await getRewards();
                initBalanceChart();
            }, 2500);
        } else {
            throw new Error(result.rawLog || "Error en smart-contract");
        }
    } catch (err) {
        updateStatus('claimStatus', `❌ Error: ${err.message}`, 'error');
    }
});

// ========================================
// ACTUALIZACIÓN PERIÓDICA
// ========================================

setInterval(() => {
    if (userAddress && client) {
        getBalances().catch(console.error);
        getRewards().catch(console.error);
    }
}, 30000); // Cada 30 segundos
