export const validarCuit = (cuit: string): boolean => {
    if (!cuit || cuit.length !== 11 || !/^\d+$/.test(cuit)) {
      return false;
    }
    
    const factores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
  
    for (let i = 0; i < 10; i++) {
      suma += parseInt(cuit[i], 10) * factores[i];
    }
  
    const resto = suma % 11;
    const digitoVerificador = resto === 0 ? 0 : resto === 1 ? 9 : 11 - resto;
  
    return digitoVerificador === parseInt(cuit[10], 10);
  };