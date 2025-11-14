// ==UserScript==
// @name         Copiar info automatico del CRM Comercial al CRM Admin by HenryBM
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  CRM Comercial y Ventas: guardar, vaciar, descargar y pegar datos con Tampermonkey
// @match        http://45.128.8.99/sta2025/*
// @match        https://bussinesssoftwareadhoc.com/Venta_Alta*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    function esperarElemento(selector, callback) {
        const el = document.querySelector(selector);
        if (el) return callback(el);
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function descargarDatosComoTxt(datos, nombreArchivo='datos_guardados.txt') {
        let contenido = '';
        if (datos) {
            for (const key in datos) {
                contenido += `${key}: ${datos[key] || ''}\n`;
            }
        } else {
            contenido = 'No hay datos guardados.';
        }
        const blob = new Blob([contenido], { type: 'text/plain' });
        const enlace = document.createElement('a');
        enlace.href = URL.createObjectURL(blob);
        enlace.download = nombreArchivo;
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
    }

    // --- CRM COMERCIAL ---
    if (location.href.includes('45.128.8.99/sta2025')) {
        esperarElemento('#form_altaventa_cif', (campoCif) => {

            // Botón Guardar Datos
            const botonGuardar = document.createElement('button');
            botonGuardar.textContent = '💾 Guardar Datos';
            Object.assign(botonGuardar.style, {
                position: 'fixed', top: '10px', right: '10px', zIndex: '9999',
                backgroundColor: '#007bff', color: 'white', border: 'none',
                borderRadius: '8px', padding: '8px 14px', fontSize: '14px',
                cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            });

            botonGuardar.addEventListener('click', async (e) => {
                e.preventDefault();
                const datos = {
                    CIF_Cliente: document.querySelector('#form_altaventa_cif')?.value.trim(),
                    RazonSocial_Cliente: document.querySelector('#form_altaventa_razon')?.value.trim(),
                    Direccion_Cliente: document.querySelector('#form_altaventa_domicilio')?.value.trim(),
                    CP_Cliente: document.querySelector('#form_altaventa_codpostal')?.value.trim(),
                    Telefono_Cliente: document.querySelector('#form_altaventa_telfijo')?.value.trim(),
                    Telefono2_Cliente: document.querySelector('#form_altaventa_telmovil')?.value.trim(),
                    Email_Cliente: document.querySelector('#form_altaventa_email')?.value.trim(),
                    NSS_Cliente: document.querySelector('#form_altaventa_ss')?.value.trim(),
                    Representante_Cliente: document.querySelector('#form_altaventa_representante')?.value.trim(),
                    Cargo_Representante_Cliente: document.querySelector('#form_altaventa_cargorepresentante')?.value.trim(),
                    NIF_Representante_Cliente: document.querySelector('#form_altaventa_dnirepresentante')?.value.trim(),
                    Nombre_Alumno: document.querySelector('#form_altaventa_nombrealumno')?.value.trim(),
                    Apellido1_Alumno: document.querySelector('#form_altaventa_apellido1alumno')?.value.trim(),
                    Apellido2_Alumno: document.querySelector('#form_altaventa_apellido2alumno')?.value.trim(),
                    DNI_Alumno: document.querySelector('#form_altaventa_dnialumno')?.value.trim(),
                    NSS_Alumno: document.querySelector('#form_altaventa_ssalumno')?.value.trim(),
                    Area_Funcional_Alumno: "SERVICIOS GENERALES",
                    Email_Alumno: document.querySelector('#form_altaventa_emailalumno')?.value.trim(),
                    Telefono_Alumno: document.querySelector('#form_altaventa_telfijoalumno')?.value.trim(),
                    Movil_Alumno: document.querySelector('#form_altaventa_telmovilalumno')?.value.trim(),
                    RazonSocial_Gestoria: document.querySelector('#form_altaventa_gestoria')?.value.trim(),
                    Contacto_Gestoria: document.querySelector('#form_altaventa_contactogestoria')?.value.trim(),
                    Telefono_Gestoria: document.querySelector('#form_altaventa_tel1gestoria')?.value.trim(),
                    Email_Gestoria: document.querySelector('#form_altaventa_emailgestoria')?.value.trim()
                };
                await GM_setValue('crm_datos', datos);
                console.log('💾 Datos guardados en Tampermonkey:', datos);

                botonGuardar.style.backgroundColor = 'green';
                botonGuardar.textContent = '✅ Datos Guardados';
                setTimeout(() => {
                    botonGuardar.style.backgroundColor = '#007bff';
                    botonGuardar.textContent = '💾 Guardar Datos';
                }, 2000);
            });
            document.body.appendChild(botonGuardar);

            // Botón Vaciar Datos
            const botonVaciar = document.createElement('button');
            botonVaciar.textContent = '🗑️ Vaciar Datos';
            Object.assign(botonVaciar.style, {
                position: 'fixed', top: '50px', right: '10px', zIndex: '9999',
                backgroundColor: '#dc3545', color: 'white', border: 'none',
                borderRadius: '8px', padding: '8px 14px', fontSize: '14px',
                cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            });
            botonVaciar.addEventListener('click', async (e) => {
                e.preventDefault();
                await GM_setValue('crm_datos', null);
                console.log('🗑️ Datos borrados de Tampermonkey.');
                botonVaciar.style.backgroundColor = '#555';
                botonVaciar.textContent = '✅ Datos Vacíos';
                setTimeout(() => {
                    botonVaciar.style.backgroundColor = '#dc3545';
                    botonVaciar.textContent = '🗑️ Vaciar Datos';
                }, 2000);
                alert('🗑️ Todos los datos guardados han sido eliminados.');
            });
            document.body.appendChild(botonVaciar);

            // Botón Descargar Datos
            const botonDescargar = document.createElement('button');
            botonDescargar.textContent = '📥 Descargar Datos';
            Object.assign(botonDescargar.style, {
                position: 'fixed', top: '90px', right: '10px', zIndex: '9999',
                backgroundColor: '#17a2b8', color: 'white', border: 'none',
                borderRadius: '8px', padding: '8px 14px', fontSize: '14px',
                cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            });
            botonDescargar.addEventListener('click', async (e) => {
                e.preventDefault();
                const datos = await GM_getValue('crm_datos');
                descargarDatosComoTxt(datos, 'datos_guardados.txt');

                botonDescargar.style.backgroundColor = 'green';
                botonDescargar.textContent = '✅ Datos Descargados';
                setTimeout(() => {
                    botonDescargar.style.backgroundColor = '#17a2b8';
                    botonDescargar.textContent = '📥 Descargar Datos';
                }, 2000);
            });
            document.body.appendChild(botonDescargar);
        });
    }

    // --- CRM DE VENTAS ---
    if (location.href.includes('bussinesssoftwareadhoc.com/Venta_Alta')) {
        esperarElemento('#Cif_Cliente', async (campoDestino) => {

            const botonPegar = document.createElement('button');
            botonPegar.textContent = '📥 Pegar Datos';
            Object.assign(botonPegar.style, {
                position: 'fixed', top: '10px', right: '10px', zIndex: '9999',
                backgroundColor: '#28a745', color: 'white', border: 'none',
                borderRadius: '8px', padding: '8px 14px', fontSize: '14px',
                cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            });

            botonPegar.addEventListener('click', async (e) => {
                e.preventDefault();
                const datos = await GM_getValue('crm_datos');
                if (!datos) {
                    alert('⚠️ No hay datos guardados. Ve primero al CRM comercial y pulsa "Guardar Datos".');
                    return;
                }

                setTimeout(() => {
                    const mapeo = {
                        '#Cif_Cliente': 'CIF_Cliente',
                        '#RazonSocial_Cliente': 'RazonSocial_Cliente',
                        '#Direccion_Cliente': 'Direccion_Cliente',
                        '#CP_Cliente': 'CP_Cliente',
                        '#Telefono_Cliente': 'Telefono_Cliente',
                        '#Telefono2_Cliente': 'Telefono2_Cliente',
                        '#Email_Cliente': 'Email_Cliente',
                        '#NSS_Cliente': 'NSS_Cliente',
                        '#Representante_Cliente': 'Representante_Cliente',
                        '#Cargo_Representante_Cliente': 'Cargo_Representante_Cliente',
                        '#NIF_Representante_Cliente': 'NIF_Representante_Cliente',
                        '#Nombre_Alumno': 'Nombre_Alumno',
                        '#Apellido1_Alumno': 'Apellido1_Alumno',
                        '#Apellido2_Alumno': 'Apellido2_Alumno',
                        '#DNI_Alumno': 'DNI_Alumno',
                        '#NSS_Alumno': 'NSS_Alumno',
                        '#Area_Funcional_Alumno': 'Area_Funcional_Alumno',
                        '#Email_Alumno': 'Email_Alumno',
                        '#Telefono_Alumno': 'Telefono_Alumno',
                        '#Movil_Alumno': 'Movil_Alumno',
                        '#RazonSocial_Gestoria': 'RazonSocial_Gestoria',
                        '#Contacto_Gestoria': 'Contacto_Gestoria',
                        '#Telefono_Gestoria': 'Telefono_Gestoria',
                        '#Email_Gestoria': 'Email_Gestoria'
                    };

                    for (const selector in mapeo) {
                        const valor = datos[mapeo[selector]];
                        if (valor && valor.length > 0) {
                            const campo = document.querySelector(selector);
                            if (campo) {
                                campo.focus();
                                campo.value = valor;
                                campo.dispatchEvent(new Event('input', { bubbles: true }));
                                campo.dispatchEvent(new Event('change', { bubbles: true }));
                                campo.dispatchEvent(new Event('blur', { bubbles: true }));
                            }
                        }
                    }

                    botonPegar.style.backgroundColor = 'green';
                    botonPegar.textContent = '✅ Datos Pegados';
                    setTimeout(() => {
                        botonPegar.style.backgroundColor = '#28a745';
                        botonPegar.textContent = '📥 Pegar Datos';
                    }, 2000);

                    console.log('📤 Todos los datos (Cliente + Alumno + Gestoria) pegados en CRM de ventas:', datos);
                }, 1000);
            });

            document.body.appendChild(botonPegar);
        });
    }

})();
