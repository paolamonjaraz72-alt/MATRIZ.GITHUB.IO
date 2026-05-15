function mcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);

    while (b) {
        let t = b;
        b = a % b;
        a = t;
    }

    return a;
}

function decimalAFraccion(decimal, tolerancia = 0.000001) {
    if (Math.abs(decimal) < tolerancia) return "0";
    if (Number.isInteger(decimal)) return decimal.toString();

    let signo = decimal < 0 ? "-" : "";
    decimal = Math.abs(decimal);

    for (let den = 1; den <= 1000; den++) {
        let num = Math.round(decimal * den);

        if (Math.abs(decimal - num / den) < tolerancia) {
            let divisor = mcd(num, den);

            num = num / divisor;
            den = den / divisor;

            if (den === 1) return signo + num;

            return `${signo}
            <div class="fraction">
                <span class="top">${num}</span>
                <span>${den}</span>
            </div>`;
        }
    }

    return signo + decimal.toFixed(4).replace(/\.?0+$/, "");
}

function mostrarMatriz(matriz, titulo) {
    let html = `
    <div class="paso">
        <h3>${titulo}</h3>
        <div class="matrix-display">
    `;

    for (let i = 0; i < 3; i++) {
        html += '<div class="matrix-row">';

        for (let j = 0; j < 4; j++) {
            html += `
            <div class="matrix-cell">
                ${decimalAFraccion(matriz[i][j])}
            </div>`;
        }

        html += '</div>';
    }

    html += '</div></div>';

    return html;
}

function resolver() {

    const m = [
        [
            parseFloat(document.getElementById('a11').value) || 0,
            parseFloat(document.getElementById('a12').value) || 0,
            parseFloat(document.getElementById('a13').value) || 0,
            parseFloat(document.getElementById('b1').value) || 0
        ],
        [
            parseFloat(document.getElementById('a21').value) || 0,
            parseFloat(document.getElementById('a22').value) || 0,
            parseFloat(document.getElementById('a23').value) || 0,
            parseFloat(document.getElementById('b2').value) || 0
        ],
        [
            parseFloat(document.getElementById('a31').value) || 0,
            parseFloat(document.getElementById('a32').value) || 0,
            parseFloat(document.getElementById('a33').value) || 0,
            parseFloat(document.getElementById('b3').value) || 0
        ]
    ];

    let resultado = document.getElementById('resultado');

    resultado.innerHTML = mostrarMatriz(m, 'Matriz Inicial');

    let matriz = m.map(row => [...row]);

    let pasos = 1;

    try {

        for (let i = 0; i < 3; i++) {

            if (Math.abs(matriz[i][i]) < 0.000001) {

                let intercambio = false;

                for (let k = i + 1; k < 3; k++) {

                    if (Math.abs(matriz[k][i]) > 0.000001) {

                        [matriz[i], matriz[k]] = [matriz[k], matriz[i]];

                        resultado.innerHTML += `
                        <div class="operacion">
                            Intercambiar R${i + 1} ↔️ R${k + 1}
                        </div>`;

                        resultado.innerHTML += mostrarMatriz(
                            matriz,
                            `Paso ${pasos++}: Intercambio`
                        );

                        intercambio = true;

                        break;
                    }
                }

                if (!intercambio) {

                    if (Math.abs(matriz[i][3]) > 0.000001) {

                        throw new Error(
                            "Sistema inconsistente. No tiene solución."
                        );

                    } else {

                        throw new Error(
                            "Sistema con infinitas soluciones."
                        );
                    }
                }
            }

            if (Math.abs(matriz[i][i] - 1) > 0.000001) {

                let factor = matriz[i][i];

                for (let j = 0; j < 4; j++) {
                    matriz[i][j] /= factor;
                }

                resultado.innerHTML += `
                <div class="operacion">
                    R${i + 1} → R${i + 1} / ${decimalAFraccion(factor)}
                </div>`;

                resultado.innerHTML += mostrarMatriz(
                    matriz,
                    `Paso ${pasos++}: Pivote`
                );
            }

            for (let k = 0; k < 3; k++) {

                if (k !== i && Math.abs(matriz[k][i]) > 0.000001) {

                    let factor = matriz[k][i];

                    for (let j = 0; j < 4; j++) {
                        matriz[k][j] -= factor * matriz[i][j];
                    }

                    resultado.innerHTML += `
                    <div class="operacion">
                        R${k + 1} → R${k + 1} - (${decimalAFraccion(factor)})R${i + 1}
                    </div>`;
                }
            }

            resultado.innerHTML += mostrarMatriz(
                matriz,
                `Paso ${pasos++}: Ceros`
            );
        }

        let solHtml = `
        <div class="solucion">
            <h3>Solución del Sistema</h3>

            <div class="solucion-item">
                a = ${decimalAFraccion(matriz[0][3])}
            </div>

            <div class="solucion-item">
                b = ${decimalAFraccion(matriz[1][3])}
            </div>

            <div class="solucion-item">
                c = ${decimalAFraccion(matriz[2][3])}
            </div>
        </div>
        `;

        resultado.innerHTML += solHtml;

    } catch (error) {

        resultado.innerHTML += `
        <div class="error">
            <strong>Error:</strong> ${error.message}
        </div>`;
    }

    resultado.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function limpiar() {

    document.querySelectorAll('input').forEach(input => {
        input.value = '';
    });

    document.getElementById('resultado').innerHTML = '';
}

window.onload = () => {

    document.getElementById('a11').value = 2;
    document.getElementById('a12').value = 1;
    document.getElementById('a13').value = -1;
    document.getElementById('b1').value = 8;

    document.getElementById('a21').value = -3;
    document.getElementById('a22').value = -1;
    document.getElementById('a23').value = 2;
    document.getElementById('b2').value = -11;

    document.getElementById('a31').value = -2;
    document.getElementById('a32').value = 1;
    document.getElementById('a33').value = 2;
    document.getElementById('b3').value = -3;
};